import { redis } from "@/lib/db/redis";

export async function testRedis() {
  const pong = await redis.ping();
  console.log("Redis PING:", pong);
}
