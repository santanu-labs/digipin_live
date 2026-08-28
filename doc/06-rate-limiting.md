# 06 — Rate limiting

Redis sliding window, 60 seconds, keyed by API key hash — never by the plaintext key.

## Algorithm

```
ZREMRANGEBYSCORE ratelimit:{hash} 0 now-60000
ZADD ratelimit:{hash} now unique-member
ZCARD ratelimit:{hash}
PEXPIRE ratelimit:{hash} 120000
```

If Redis is down, the API falls back to an in-process map so a single replica still enforces locally. Multi-replica enforcement requires Redis.

## Limits

| Tier | Requests / 60s |
|---|---|
| `free` | 60 |
| `commercial` | 5,000 |

Tier is read from the cached key record (`apikey:{hash}` TTL 300s). After promoting a key in Postgres, delete that cache key or wait five minutes.

## Response

`429` body:

```json
{
  "error": "Rate limit exceeded",
  "code": "rate_limited",
  "limit": 60,
  "windowSeconds": 60
}
```

Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`.
