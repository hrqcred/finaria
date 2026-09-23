export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { identifier } = req.body || {};

  if (!identifier) {
    return res.status(400).json({ error: 'identifier é obrigatório' });
  }

  const clientId = process.env.SYNCPAY_CLIENT_ID;
  const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;

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

    const statusRes = await fetch(`https://api.syncpayments.com.br/api/partner/v1/transaction/${identifier}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!statusRes.ok) {
      const err = await statusRes.text();
      return res.status(502).json({ error: 'Falha ao consultar transação', details: err });
    }

    const result = await statusRes.json();
    const data = result.data || result;

    return res.status(200).json({
      status: data.status,
      paid: data.status === 'completed',
      identifier,
    });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
