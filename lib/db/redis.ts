import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!, {
  tls: {}, // required for `rediss://`
});

// Example: caching a query result
export async function cacheQuery(key: string, fetcher: () => Promise<any>, ttl = 3600) {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);

  const result = await fetcher();
  await redis.set(key, JSON.stringify(result), "EX", ttl);
  return result;
}
