import Redis from 'ioredis';

let redis;

export function getRedis() {
  if (redis && redis.status === 'ready') return redis;

  const url = process.env.finamaria_REDIS_URL
    || process.env.KV_URL
    || process.env.REDIS_URL;

  if (!url) {
    throw new Error('Redis não configurado. Adicione finamaria_REDIS_URL nas env vars.');
  }

  const opts = {
    maxRetriesPerRequest: 2,
    connectTimeout: 5000,
    commandTimeout: 5000,
  };

  if (url.startsWith('rediss://')) {
    opts.tls = { rejectUnauthorized: false };
  }

  redis = new Redis(url, opts);
  return redis;
}
