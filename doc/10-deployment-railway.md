# 10 — Deployment (Railway)

## Resources

Railway project **digipin-live** (`966ad5a8-dd90-40c2-a17a-748d2d2bca54`), workspace HireG Ai, environment `production`.

Dashboard: https://railway.com/project/966ad5a8-dd90-40c2-a17a-748d2d2bca54

| Piece | Service | Notes |
|---|---|---|
| api | `85953aab-9074-4406-ad61-b09e6ede5631` | Health `/health`. Domain `https://api-production-b0a52.up.railway.app` |
| web | `f524ec2b-dba1-4b69-87c4-73e358bb23d4` | Port 3000. Attach `digipin.live` when DNS is ready |
| Postgres | `befac805-7dc1-47e7-bbca-462d6eaa8da3` | Image `postgres:16-alpine` |
| Redis | `6c733514-2e29-4c0e-bd82-5541033fe1c8` | Image `redis:7-alpine` |

Code is not deployed until a GitHub repo is connected or `railway up` is run from this folder (Dockerfiles expect the monorepo root as build context).

## Environment — api

```
NODE_ENV=production
PORT=4000
DATABASE_URL=${{Postgres.DATABASE_URL}}
REDIS_URL=${{Redis.REDIS_URL}}
SESSION_SECRET=<random 32+ bytes>
RESEND_API_KEY=<resend>
MAIL_FROM=DIGIPIN Live <noreply@digipin.live>
PUBLIC_WEB_URL=https://digipin.live
PUBLIC_API_URL=https://api.digipin.live
COOKIE_DOMAIN=.digipin.live
AUTH_ORIGINS=https://digipin.live
```

Generate `SESSION_SECRET` with `openssl rand -hex 32`.

## Environment — web

```
PORT=3000
NEXT_PUBLIC_API_URL=https://api.digipin.live
NEXT_PUBLIC_SITE_URL=https://digipin.live
```

`NEXT_PUBLIC_*` is inlined at **build** time. The web Dockerfile declares matching `ARG`s so Railway can pass them into `next build`. Rebuild web after changing those variables.

## Domains

- `digipin.live` → web
- `api.digipin.live` → api

## Hobby notes

Railway is usage-based. Keep both services on the smallest replica. The engine is CPU-cheap; cost is dominated by idle Postgres/Redis and SSR.

## Local

```bash
docker compose up -d
cp .env.example .env
# load .env into the API process
npm install
npm run test:engine
npm run dev:api
npm run dev:web
```

Migrations run on API boot.
