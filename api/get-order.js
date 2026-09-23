import { getRedis } from './_redis.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { order_id, access_token } = req.body || {};

  if (!order_id) {
    return res.status(400).json({ error: 'order_id obrigatório' });
  }

  try {
    const kv = getRedis();
    if (access_token) {
      const storedOrderId = await kv.get(`token:${access_token}`);
      if (storedOrderId !== order_id) {
        return res.status(403).json({ error: 'Token inválido' });
      }
    }

    const order = await kv.hgetall(`order:${order_id}`);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    return res.status(200).json({
      id: order.id,
      order_id: order.id,
      status: order.status,
      amount_cents: parseInt(order.amount_cents) || 0,
      customer_name: order.customer_name,
      customer_email: order.customer_email,
      customer_phone: order.customer_phone,
      address_street: order.address_street,
      address_number: order.address_number,
      address_neighborhood: order.address_neighborhood,
      address_city: order.address_city,
      address_state: order.address_state,
      cep: order.cep,
      pix_code: order.pix_code,
      pix_qr_image: order.pix_qr_image || null,
      offer_type: order.offer_type,
      quantity: parseInt(order.quantity) || 1,
      created_at: order.created_at,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
