import type { MiddlewareHandler } from "hono";
import { sha256 } from "../crypto.js";
import { pool, query, type ApiKeyRow } from "../db.js";
import { cacheGet, cacheSet, slidingWindowIncr } from "../redis.js";

export type KeyContext = {
  accountId: string;
  keyId: string;
  tier: "free" | "commercial";
  keyHash: string;
};

const TIER_LIMIT: Record<KeyContext["tier"], number> = {
  free: 60,
  commercial: 5000,
};

export const requireApiKey: MiddlewareHandler = async (c, next) => {
  const raw = c.req.header("x-api-key")?.trim();
  if (!raw) {
    return c.json({ error: "Missing X-API-Key header", code: "missing_api_key" }, 401);
  }
  if (!pool && !cachedWouldHelp()) {
    // checked after cache below
  }

  const keyHash = sha256(raw);
  const cached = await cacheGet(`apikey:${keyHash}`);

  let ctx: KeyContext | null = null;
  if (cached) {
    ctx = JSON.parse(cached) as KeyContext;
  } else {
    if (!pool) {
      return c.json(
        { error: "API key store is unavailable", code: "internal_error" },
        503,
      );
    }
    const result = await query<ApiKeyRow>(
      `SELECT * FROM api_keys WHERE key_hash = $1 AND revoked = FALSE`,
      [keyHash],
    );
    const row = result.rows[0];
    if (!row) {
      return c.json({ error: "Invalid API key", code: "invalid_api_key" }, 401);
    }
    ctx = {
      accountId: row.account_id,
      keyId: row.id,
      tier: row.tier,
      keyHash,
    };
    await cacheSet(`apikey:${keyHash}`, JSON.stringify(ctx), 300);
  }

  const limit = TIER_LIMIT[ctx.tier];
  const window = await slidingWindowIncr(`ratelimit:${ctx.keyHash}`, limit);
  c.header("X-RateLimit-Limit", String(limit));
  c.header("X-RateLimit-Remaining", String(Math.max(0, limit - window.count)));

  if (!window.allowed) {
    return c.json(
      {
        error: "Rate limit exceeded",
        code: "rate_limited",
        limit,
        windowSeconds: 60,
      },
      429,
    );
  }

  c.set("apiKey", ctx);
  await next();
};
