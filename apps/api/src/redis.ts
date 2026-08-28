import Redis from "ioredis";
import { env } from "./env.js";

let redis: Redis | null = null;

if (env.redisUrl) {
  redis = new Redis(env.redisUrl, {
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    enableOfflineQueue: false,
    retryStrategy: () => null,
  });
  redis.on("error", () => {
    // Fallback paths handle Redis outages.
  });
}

const memory = new Map<string, string>();
const memoryZ = new Map<string, Map<string, number>>();

export async function cacheGet(key: string): Promise<string | null> {
  if (redis?.status === "ready") {
    try {
      return await redis.get(key);
    } catch {
      return memory.get(key) ?? null;
    }
  }
  return memory.get(key) ?? null;
}

export async function cacheSet(key: string, value: string, ttlSeconds: number) {
  memory.set(key, value);
  if (redis?.status === "ready") {
    try {
      await redis.set(key, value, "EX", ttlSeconds);
    } catch {
      // memory fallback already written
    }
  }
}

export async function cacheDel(key: string) {
  memory.delete(key);
  if (redis?.status === "ready") {
    try {
      await redis.del(key);
    } catch {
      // ignore
    }
  }
}

export type WindowResult = {
  count: number;
  allowed: boolean;
};

export async function slidingWindowIncr(
  key: string,
  limit: number,
  windowMs = 60_000,
): Promise<WindowResult> {
  const now = Date.now();
  const member = `${now}:${Math.random().toString(36).slice(2)}`;

  if (redis?.status === "ready") {
    try {
      const pipeline = redis.multi();
      pipeline.zremrangebyscore(key, 0, now - windowMs);
      pipeline.zadd(key, now, member);
      pipeline.zcard(key);
      pipeline.pexpire(key, windowMs * 2);
      const results = await pipeline.exec();
      const count = Number(results?.[2]?.[1] ?? 1);
      return { count, allowed: count <= limit };
    } catch {
      // fall through to memory
    }
  }

  let bucket = memoryZ.get(key);
  if (!bucket) {
    bucket = new Map();
    memoryZ.set(key, bucket);
  }
  for (const [id, ts] of bucket) {
    if (ts < now - windowMs) bucket.delete(id);
  }
  bucket.set(member, now);
  const count = bucket.size;
  return { count, allowed: count <= limit };
}

export async function connectRedis() {
  if (!redis) return;
  try {
    await redis.connect();
  } catch {
    console.warn("Redis unavailable, using in-memory cache and rate limits");
    redis.disconnect();
    redis = null;
  }
}
