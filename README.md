# DIGIPIN Live

Independent **Address-as-a-Service** for India’s [DIGIPIN](https://github.com/INDIAPOST-gov/digipin) grid: convert WGS84 coordinates ↔ the official 10-character India Post code, with a public converter and a rate-limited REST API.

**This is not an India Post, IIT Hyderabad, NRSC, or Government of India service.** The algorithm is Apache 2.0; we host it.

| | |
| --- | --- |
| Website | [https://digipin.live](https://digipin.live) |
| API | [https://api.digipin.live](https://api.digipin.live) |
| Health | [https://api.digipin.live/health](https://api.digipin.live/health) |
| Docs (operators) | [`doc/`](doc/README.md) |
| OpenAPI | [`doc/openapi.yaml`](doc/openapi.yaml) |
| Algorithm source | [INDIAPOST-gov/digipin](https://github.com/INDIAPOST-gov/digipin) |
| Contact | See [Contact](#contact) |

---

## Contents

1. [What it does](#what-it-does)
2. [Official format](#official-format)
3. [Use the product](#use-the-product)
4. [API in 30 seconds](#api-in-30-seconds)
5. [Repository layout](#repository-layout)
6. [Run locally](#run-locally)
7. [Production](#production)
8. [Indexing & growth — what we can do next](#indexing--growth--what-we-can-do-next)
9. [Analytics & usage](#analytics--usage)
10. [Contact](#contact)
11. [Legal](#legal)

---

## What it does

DIGIPIN partitions a bounding box over India into ~3.8 m cells and names each cell with 10 characters from `23456789CJKLMPFT`. Encode and decode are **pure math**: no people database, no “who lives here”.

| Surface | Purpose |
| --- | --- |
| [Know your DIGIPIN](https://digipin.live/know-your-digipin) | Map + form converter (SSR, indexable) |
| [Dashboard](https://digipin.live/dashboard) | Passwordless email login, API keys (`dp_live_…`) |
| `POST /v1/spatial/encode` | Lat/lon → DIGIPIN |
| `POST /v1/spatial/decode` | DIGIPIN → lat/lon + cell bounds |
| `/v1/auth/*` | Magic link, session cookie, key CRUD |

**Tiers:** free **60 req/min**, commercial **5,000 req/min** (operator sets `api_keys.tier` in Postgres — no billing in v1).

**Bounds:** latitude `2.5–38.5`, longitude `63.5–99.5` (official grid, not global).

---

## Official format

| Role | Example |
| --- | --- |
| Wire / API / databases | `4T396F42L7` (10 characters, continuous) |
| Display | `4T3 96F4 2L7` (3-4-3 spaces) |
| **Invalid** | `4T3-96F4-2L7` (hyphens) |

The API **rejects hyphens** (`400` / `hyphens_not_permitted`). Some third-party sites still print hyphens; that is not the India Post identifier.

Golden tests (also in `packages/engine`):

- Encode `13.11179621, 80.20264269` → `4T396F42L7`
- Decode `4P3JK852C9` → `12.971601, 77.594584`

---

## Use the product

1. Open [digipin.live](https://digipin.live), pan the map or paste coordinates.
2. For a key: [dashboard](https://digipin.live/dashboard) → work email → magic link (15 minutes, single use).
3. Store the plaintext key **once**. Only SHA-256 is kept.
4. Call `https://api.digipin.live` with header `X-API-Key`.

Human-readable contract: [API v1 on the site](https://digipin.live/docs/api-v1-specification) and [`doc/04-api-specification.md`](doc/04-api-specification.md).

---

## API in 30 seconds

```bash
curl -s https://api.digipin.live/health

curl -s -X POST https://api.digipin.live/v1/spatial/encode \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dp_live_…" \
  -d '{"latitude":13.11179621,"longitude":80.20264269}'

curl -s -X POST https://api.digipin.live/v1/spatial/decode \
  -H "Content-Type: application/json" \
  -H "X-API-Key: dp_live_…" \
  -d '{"digipin":"4P3JK852C9"}'
```

Spatial CORS is `*`. Auth CORS is locked to `https://digipin.live`. Rate-limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`.

Errors: `{ "error": "…", "code": "machine_code" }` — see [`doc/04-api-specification.md`](doc/04-api-specification.md).

---

## Repository layout

```
apps/web          Next.js 15 site (SEO pages, playground, dashboard)
apps/api          Hono API (spatial + auth), Postgres, Redis
packages/engine   Official encode/decode + golden tests
doc/              Operator docs + OpenAPI
NOTICE            Attribution (India Post / IIT-H / NRSC)
```

npm workspaces. Web and API Dockerfiles expect **monorepo root** as build context.

---

## Run locally

Needs Node 20+, Docker (Postgres 16 + Redis 7).

```bash
docker compose up -d
cp .env.example .env
npm install
npm run test:engine
npm run dev:api    # :4000
npm run dev:web    # :3000
```

Set `RESEND_API_KEY` in `.env` if you want real magic-link mail locally; otherwise the link is printed in API logs.

---

## Production

Hosted on Railway (web, API, Postgres, Redis). Public DNS is on Cloudflare so the apex `digipin.live` can CNAME-flatten to Railway.

| Host | Service |
| --- | --- |
| `digipin.live` | web, port 3000 |
| `api.digipin.live` | api, port 4000 |

`NEXT_PUBLIC_*` is **inlined at Docker build**. After changing `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, or `NEXT_PUBLIC_GA_MEASUREMENT_ID`, rebuild **web**.

Full runbook: [`doc/10-deployment-railway.md`](doc/10-deployment-railway.md), [`doc/11-runbook.md`](doc/11-runbook.md).

---

## Indexing & growth — what we can do next

Already in place: SSR pages, `robots.txt`, `sitemap.xml`, JSON-LD (Organization, WebSite, FAQ, breadcrumbs), canonical URLs, city landings, FAQ, tools routes.

Highest leverage next:

| Priority | Action | Why |
| --- | --- | --- |
| 1 | [Google Search Console](https://search.google.com/search-console) — add `https://digipin.live`, verify via DNS TXT on Cloudflare, submit `https://digipin.live/sitemap.xml` | Actual index status, queries, coverage errors |
| 1 | Bing Webmaster Tools (same sitemap) | Second index, often copies Google later |
| 2 | Unique **Open Graph image** (`1200×630`) per key pages | Link previews on WhatsApp / X / LinkedIn |
| 2 | Google Business / Knowledge: consistent NAP on About + Contact + GitHub | Entity for “DIGIPIN API” |
| 3 | More city/use-case pages that answer real queries (“DIGIPIN for Bengaluru warehouse”) | Long-tail SEO; we already have the pattern |
| 3 | IndexNow ping on deploy (optional) | Faster Bing/Yandex recrawl |
| 4 | Core Web Vitals in Search Console after GA | Mobile ranking |
| 4 | Hindi (or Hinglish) landing for “अपना DIGIPIN जानें” | Query language mismatch |
| 5 | Programmatic FAQ from support mail | People Also Ask |
| — | Do **not** cloaking, doorway spam, or copy India Post branding | Trust + ToS |

`/dashboard` is `noindex` via robots — keep it that way.

---

## Analytics & usage

### Website (people)

**Google Analytics 4** is wired in the Next.js layout. It is **off** until you set a measurement ID and rebuild web.

1. Create a GA4 property → Data stream → Web → `https://digipin.live`.
2. Copy the ID (`G-XXXXXXXX`).
3. Railway **web** service → variable `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX`.
4. Redeploy **web** (build-time inline).

Reports you will get: users, sessions, country, device, landing pages, plus custom events:

| Event | When |
| --- | --- |
| `encode_digipin` | Converter form submit (encode) |
| `decode_digipin` | Converter form submit (decode) |
| `use_geolocation` | “Use my location” |
| `request_magic_link` | Dashboard email submit |
| `create_api_key` | Key generated |

Privacy copy lives on `/privacy`. IP anonymization is enabled in gtag.

**Also:** Search Console (search demand) ≠ GA (on-site behaviour). Use both.

### API (developers / keys)

| Signal | Where |
| --- | --- |
| Per-key sliding window (60 or 5000/min) | Redis, headers on each spatial response |
| HTTP volume, latency, 4xx/5xx | Railway → API service → Metrics / HTTP logs |
| Who signed up | Postgres `accounts.email` (operator SQL, not a public dashboard yet) |

Not built yet (optional later): daily `api_usage` table, a usage chart in the dashboard, PostHog/Mixpanel, or server-side GA Measurement Protocol on `/v1/spatial/*`.

---

## Contact

| Channel | |
| --- | --- |
| Email | [hello@digipin.live](mailto:hello@digipin.live) |
| Site | [https://digipin.live/contact](https://digipin.live/contact) |

Public pages only show the project inbox. Forward `hello@digipin.live` in Cloudflare Email Routing to your private mailbox (do not put a personal address on the site).

Commercial tier is not self-serve: email the project inbox and the operator sets `api_keys.tier = 'commercial'`.

---

## Legal

- Algorithm: Department of Posts + IIT Hyderabad + NRSC/ISRO, Apache 2.0. See [`NOTICE`](NOTICE) and [`LICENSE`](LICENSE).
- Do not use India Post logos or imply official status.
- A DIGIPIN is not a legal address, land title, or delivery SLA.

---

## License

Hosted product code in this repository: see [`LICENSE`](LICENSE). DIGIPIN math: Apache 2.0 as upstream.
