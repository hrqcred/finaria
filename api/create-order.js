import { getRedis } from './_redis.js';
import QRCode from 'qrcode';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const b = req.body || {};
  const clientId = process.env.SYNCPAY_CLIENT_ID;
  const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;
  const webhookUrl = process.env.SYNCPAY_WEBHOOK_URL || '';

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Credenciais SyncPay não configuradas' });
  }

  if (!b.customer_name || !b.customer_cpf) {
    return res.status(400).json({ error: 'Nome e CPF obrigatórios' });
  }

  try {
    const tokenRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
    });

    if (!tokenRes.ok) {
      return res.status(502).json({ error: 'Falha ao autenticar na SyncPay' });
    }

    const { access_token } = await tokenRes.json();
    const amountReais = (b.amount_cents || 3990) / 100;

    const pixRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        amount: amountReais,
        description: `Ouro Marroquino - ${b.customer_name}`,
        webhook_url: webhookUrl,
        client: {
          name: b.customer_name,
          cpf: (b.customer_cpf || '').replace(/\D/g, ''),
          email: b.customer_email || 'cliente@finamaria.com',
          phone: (b.customer_phone || '00000000000').replace(/\D/g, ''),
        },
      }),
    });

    if (!pixRes.ok) {
      const err = await pixRes.text();
      return res.status(502).json({ error: 'Falha ao gerar PIX', details: err });
    }

    const pixData = await pixRes.json();
    const orderId = pixData.identifier || `ord_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    const accessToken = `tok_${Date.now()}_${Math.random().toString(36).slice(2,12)}`;

    const order = {
      id: orderId,
      status: 'pending',
      amount_cents: b.amount_cents || 3990,
      customer_name: b.customer_name || '',
      customer_email: b.customer_email || '',
      customer_cpf: (b.customer_cpf || '').replace(/\D/g, ''),
      customer_phone: (b.customer_phone || '').replace(/\D/g, ''),
      shipping_method: b.shipping_method || '',
      address_street: b.address_street || '',
      address_number: b.address_number || '',
      address_neighborhood: b.address_neighborhood || '',
      address_city: b.address_city || '',
      address_state: b.address_state || '',
      cep: b.cep || '',
      pix_code: pixData.pix_code || '',
      access_token: accessToken,
      offer_type: b.offer_type || 'solo',
      quantity: b.quantity || 1,
      utm_source: b.utm_source || '',
      utm_medium: b.utm_medium || '',
      utm_campaign: b.utm_campaign || '',
      utm_content: b.utm_content || '',
      utm_term: b.utm_term || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let qrDataUrl = null;
    if (pixData.pix_code) {
      qrDataUrl = await QRCode.toDataURL(pixData.pix_code, { width: 300, margin: 2 });
      order.pix_qr_image = qrDataUrl;
    }

    const kv = getRedis();
    await kv.hset(`order:${orderId}`, order);
    await kv.lpush('orders', orderId);
    await kv.set(`token:${accessToken}`, orderId, 'EX', 86400 * 7);

    return res.status(200).json({
      order_id: orderId,
      access_token: accessToken,
      pix_code: pixData.pix_code || '',
      pix_qr_image: qrDataUrl,
      status: 'pending',
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
