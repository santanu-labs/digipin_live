# 04 — API specification

Base URL: `https://api.digipin.live` (local `http://localhost:4000`).

Machine-readable twin: [openapi.yaml](openapi.yaml). If they diverge, fix the code and both docs in the same change.

## Health

`GET /health` → `{ "ok": true, "service": "digipin-api", "time": "…" }`

No authentication.

## Spatial

CORS: `*`. Methods: `POST`, `OPTIONS`. Header: `X-API-Key`.

### POST /v1/spatial/encode

Request:

```json
{ "latitude": 13.11179621, "longitude": 80.20264269 }
```

Response `200`:

```json
{ "digipin": "4T396F42L7", "digipinDisplay": "4T3 96F4 2L7" }
```

### POST /v1/spatial/decode

Request:

```json
{ "digipin": "4P3JK852C9" }
```

`digipin` may be continuous or 3-4-3 spaced. Hyphens → `400`.

Response `200`:

```json
{
  "latitude": 12.971601,
  "longitude": 77.594584,
  "bounds": {
    "minLat": 12.971573,
    "maxLat": 12.971630,
    "minLon": 77.594555,
    "maxLon": 77.594613
  }
}
```

Bounds values are illustrative; clients should treat them as the cell box, not as a fixed fixture.

## Authentication (browser)

CORS: allowlist `AUTH_ORIGINS` (production: `https://digipin.live`). Credentials required.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/v1/auth/magic-link` | none | Email a 15-minute link |
| GET | `/v1/auth/callback?token=` | none | Consume token, set `dp_session`, redirect |
| GET | `/v1/auth/me` | cookie | Current account |
| POST | `/v1/auth/logout` | cookie | Clear cookie |
| GET | `/v1/auth/keys` | cookie | List keys (prefix only) |
| POST | `/v1/auth/keys` | cookie | Create key (plaintext once) |
| DELETE | `/v1/auth/keys/:id` | cookie | Revoke |

### POST /v1/auth/magic-link

```json
{ "email": "you@company.com" }
```

Always `200` on valid email. Does not disclose whether the account existed.

### POST /v1/auth/keys

```json
{ "name": "Production" }
```

```json
{
  "id": "…",
  "key": "dp_live_…",
  "prefix": "dp_live_abcdef12",
  "name": "Production",
  "tier": "free",
  "warning": "This plaintext key is shown once. Store it now."
}
```

## Error envelope

```json
{ "error": "human message", "code": "machine_code" }
```

| HTTP | code |
|---|---|
| 400 | `invalid_request`, `invalid_email`, `invalid_coordinates`, `latitude_out_of_range`, `longitude_out_of_range`, `invalid_length`, `invalid_charset`, `hyphens_not_permitted`, `invalid_type` |
| 401 | `missing_api_key`, `invalid_api_key`, `unauthenticated`, `session_expired` |
| 404 | `not_found` |
| 429 | `rate_limited` |
| 500 | `internal_error` |

Rate-limit responses include `X-RateLimit-Limit` and `X-RateLimit-Remaining`.
