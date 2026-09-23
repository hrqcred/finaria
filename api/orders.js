import { getRedis } from './_redis.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const adminPass = process.env.ADMIN_PASSWORD;
  const auth = req.headers.authorization;

  if (adminPass && auth !== `Bearer ${adminPass}`) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const kv = getRedis();

    if (req.method === 'GET') {
      const orderIds = await kv.lrange('orders', 0, 499);
      if (!orderIds || orderIds.length === 0) {
        return res.status(200).json({ orders: [], stats: { total: 0, paid: 0, pending: 0, failed: 0, revenue: 0 } });
      }

      const pipeline = kv.pipeline();
      for (const id of orderIds) {
        pipeline.hgetall(`order:${id}`);
      }
      const rawResults = await pipeline.exec();
      const orders = rawResults
        .map(([err, val]) => val)
        .filter(v => v && Object.keys(v).length > 0)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      const stats = {
        total: orders.length,
        paid: orders.filter(o => o.status === 'paid').length,
        pending: orders.filter(o => o.status === 'pending').length,
        failed: orders.filter(o => o.status === 'failed' || o.status === 'refunded').length,
        revenue: orders.filter(o => o.status === 'paid').reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0),
      };

      const utmMap = {};
      orders.forEach(o => {
        const src = o.utm_source || '';
        const camp = o.utm_campaign || '';
        const content = o.utm_content || '';
        const key = src || camp || content ? `${src}|${camp}|${content}` : '';
        if (!key) return;
        if (!utmMap[key]) utmMap[key] = { utm_source: src, utm_campaign: camp, utm_content: content, total: 0, paid: 0, pending: 0, revenue: 0 };
        utmMap[key].total++;
        if (o.status === 'paid') { utmMap[key].paid++; utmMap[key].revenue += parseFloat(o.amount) || 0; }
        else if (o.status === 'pending') utmMap[key].pending++;
      });
      const utm_stats = Object.values(utmMap).sort((a, b) => b.total - a.total);

      return res.status(200).json({ orders, stats, utm_stats });
    }

    if (req.method === 'POST' && req.body?.action === 'check_status') {
      const { identifier } = req.body;
      const clientId = process.env.SYNCPAY_CLIENT_ID;
      const clientSecret = process.env.SYNCPAY_CLIENT_SECRET;

      const tokenRes = await fetch('https://api.syncpayments.com.br/api/partner/v1/auth-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret }),
      });

      const { access_token } = await tokenRes.json();

      const statusRes = await fetch(`https://api.syncpayments.com.br/api/partner/v1/transaction/${identifier}`, {
        headers: { Accept: 'application/json', Authorization: `Bearer ${access_token}` },
      });

      const result = await statusRes.json();
      const data = result.data || result;
      const isPaid = data.status === 'completed';

      if (isPaid) {
        await kv.hset(`order:${identifier}`, { status: 'paid', updated_at: new Date().toISOString() });
      }

      return res.status(200).json({ status: data.status, paid: isPaid });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
