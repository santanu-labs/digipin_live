# 01 — Product overview

## What digipin.live is

digipin.live is an enterprise API gateway and SEO-first developer portal for **Address as a Service** (AaaS). It translates WGS84 coordinates into the official 10-character India Post DIGIPIN, and the reverse, for logistics, emergency, BFSI, and civic integrations.

The spatial transformation is deterministic. There is no address database and no personal data inside a DIGIPIN.

## What it is not

- Not an official Department of Posts, IIT Hyderabad, NRSC, or ISRO service.
- Not a replacement for PIN codes, property IDs, or building-level addressing.
- Not a global geohash. Coverage is the official India bounding box only.
- Not a place to store hyphenated DIGIPINs. Hyphens are forbidden on the wire.

## User journeys

1. **Visitor** opens `https://digipin.live`, uses the playground (in-process engine, no API key).
2. **Developer** submits email, receives a 15-minute magic link, creates a `dp_live_…` key (shown once).
3. **API consumer** sends `X-API-Key` to `https://api.digipin.live/v1/spatial/*`.

## Tiers

| Tier | Rate limit | How assigned |
|---|---|---|
| Free | 60 requests / minute | Default on key create |
| Commercial | 5,000 requests / minute | Operator sets `api_keys.tier` (no billing in v1) |

## Latency mandate

Encode and decode must stay under **5 ms** of compute. The engine does not touch disk, Postgres, or the network. Redis is used only for API-key lookaside and rate counters, before the engine runs.
