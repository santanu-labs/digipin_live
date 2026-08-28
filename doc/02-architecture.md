# 02 — Architecture

## Topology

```
Public traffic
├── digipin.live          Next.js (SSR)     Railway service `web`
└── api.digipin.live      Hono / Node       Railway service `api`
                              ├── Postgres  accounts, tokens, keys
                              ├── Redis     key cache + sliding window
                              └── @digipin/engine   in-process math
```

Railway terminates TLS and replaces the Nginx / Kubernetes split in the original PATS. Logical isolation is unchanged: the UI is stateful for sessions; spatial compute is stateless.

## Services

| Service | Code | Role |
|---|---|---|
| web | `apps/web` | Landing, SEO tools, playground, dashboard |
| api | `apps/api` | `/v1/spatial/*`, `/v1/auth/*`, `/health` |
| engine | `packages/engine` | Official IIT-H algorithm port |

The website playground imports the engine in a Next.js server action. Third-party traffic must use the API and a hashed key.

## Request path (spatial)

1. CORS `*` on `/v1/spatial/*`.
2. Read `X-API-Key`, SHA-256, Redis `apikey:{hash}` (miss → Postgres).
3. Sliding-window increment `ratelimit:{hash}` (60 or 5,000 / 60s).
4. Run `encodeDigipin` / `decodeDigipin` in memory.
5. Return JSON. No write on the hot path except Redis ZSET.

## Latency budget

| Step | Budget |
|---|---|
| Hash + Redis GET/ZADD | < 2 ms typical |
| Engine | < 1 ms |
| JSON serialize | negligible |
| Total compute target | < 5 ms excluding client RTT |

## Local topology

`docker-compose.yml` runs Postgres 16 and Redis 7. API defaults to `localhost:4000`, web to `localhost:3000`.
