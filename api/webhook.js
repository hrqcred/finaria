import { getRedis } from './_redis.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const identifier = body.identifier || body.reference_id || body.id;
  const status = body.status;

  if (!identifier) {
    return res.status(400).json({ error: 'identifier ausente' });
  }

  try {
    const kv = getRedis();
    const existing = await kv.hgetall(`order:${identifier}`);

    if (existing) {
      const statusMap = {
        pending: 'pending',
        completed: 'paid',
        COMPLETED: 'paid',
        PAID: 'paid',
        paid: 'paid',
        failed: 'failed',
        FAILED: 'failed',
        refunded: 'refunded',
        REFUNDED: 'refunded',
      };

      await kv.hset(`order:${identifier}`, {
        status: (statusMap[status] || status || existing.status),
        updated_at: new Date().toISOString(),
        webhook_raw: JSON.stringify(body),
      });
    } else {
      await kv.hset(`order:${identifier}`, {
        id: identifier,
        status: status === 'completed' || status === 'COMPLETED' ? 'paid' : (status || 'unknown'),
        amount: body.amount || 0,
        customer_name: body.client?.name || body.payer?.name || '',
        customer_cpf: body.client?.cpf || body.payer?.document || '',
        customer_email: body.client?.email || body.payer?.email || '',
        created_at: body.transaction_date || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        webhook_raw: JSON.stringify(body),
      });
      await kv.lpush('orders', identifier);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno', details: err.message });
  }
}
