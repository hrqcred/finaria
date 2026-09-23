import { getRedis } from './_redis.js';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { order_id } = req.body || {};
  if (!order_id) {
    return res.status(400).json({ error: 'order_id obrigatório' });
  }

  try {
    const kv = getRedis();
    const order = await kv.hgetall(`order:${order_id}`);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    if (order.pix_code) {
      let qrImage = order.pix_qr_image || null;
      if (!qrImage) {
        qrImage = await QRCode.toDataURL(order.pix_code, { width: 300, margin: 2 });
      }
      return res.status(200).json({
        pix_code: order.pix_code,
        pix_qr_image: qrImage,
      });
    }

    const clientId = process.env.SYNCPAY_CLIENT_ID;
    const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;
    const webhookUrl = process.env.SYNCPAY_WEBHOOK_URL || '';

    const tokenRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
    });

    const { access_token } = await tokenRes.json();
    const amountReais = (parseInt(order.amount_cents) || 3990) / 100;

    const pixRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        amount: amountReais,
        description: `Ouro Marroquino - ${order.customer_name}`,
        webhook_url: webhookUrl,
        client: {
          name: order.customer_name,
          cpf: order.customer_cpf,
          email: order.customer_email || 'cliente@finamaria.com',
          phone: order.customer_phone || '00000000000',
        },
      }),
    });

    if (!pixRes.ok) {
      return res.status(502).json({ error: 'Falha ao gerar PIX' });
    }

    const pixData = await pixRes.json();

    let qrDataUrl = null;
    if (pixData.pix_code) {
      qrDataUrl = await QRCode.toDataURL(pixData.pix_code, { width: 300, margin: 2 });
    }

    await kv.hset(`order:${order_id}`, {
      pix_code: pixData.pix_code || '',
      pix_qr_image: qrDataUrl || '',
      updated_at: new Date().toISOString(),
    });

    return res.status(200).json({
      pix_code: pixData.pix_code || '',
      pix_qr_image: qrDataUrl,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
