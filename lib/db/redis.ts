import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL!);

type CacheOptions<T> = {
  skipIf?: (value: T) => boolean;
};

// Example: caching a query result
export async function cacheQuery<T = any>(
  key: string,
  fetcher: () => Promise<T>,
  ttl = 3600,
  options?: CacheOptions<T>
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const result = await fetcher();
  if (!options?.skipIf || !options.skipIf(result)) {
    await redis.set(key, JSON.stringify(result), "EX", ttl);
  }
  return result;
}
//const redis = require('ioredis'); const client = new redis("redis://default:oUgHWy94CGcb9bKmO37FYYoIp83Q9ctFYL3D8V8menx06BX5ArtO2wzC44K6r8g5@losgg0c0sws0wgwkgs0cckgs:6379/0");