export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { customer_name, customer_email, customer_cpf, customer_phone, amount } = req.body || {};

  if (!customer_name || !customer_cpf || !amount) {
    return res.status(400).json({ error: 'Campos obrigatórios: customer_name, customer_cpf, amount' });
  }

  const clientId = process.env.SYNCPAY_CLIENT_ID;
  const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;
  const webhookUrl = process.env.SYNCPAY_WEBHOOK_URL || '';

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: 'Credenciais SyncPay não configuradas' });
  }

  try {
    const tokenRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      return res.status(502).json({ error: 'Falha ao autenticar na SyncPay', details: err });
    }

    const { access_token } = await tokenRes.json();

    const pixRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/cash-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        amount: amount,
        description: `Pedido - ${customer_name}`,
        webhook_url: webhookUrl,
        client: {
          name: customer_name,
          cpf: customer_cpf.replace(/\D/g, ''),
          email: customer_email || 'cliente@email.com',
          phone: (customer_phone || '00000000000').replace(/\D/g, ''),
        },
      }),
    });

    if (!pixRes.ok) {
      const err = await pixRes.text();
      return res.status(502).json({ error: 'Falha ao gerar PIX', details: err });
    }

    const pixData = await pixRes.json();

    return res.status(200).json({
      success: true,
      pix_code: pixData.pix_code,
      identifier: pixData.identifier,
      amount,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
