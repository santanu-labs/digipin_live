# 08 — Security

## Trust model

Plaintext secrets are transient. The API verifies SHA-256 hashes from Redis, then Postgres on miss.

## Secrets

| Variable | Purpose |
|---|---|
| `SESSION_SECRET` | HMAC for `dp_session` |
| `DATABASE_URL` | Postgres |
| `REDIS_URL` | Cache / limiter |
| `RESEND_API_KEY` | Outbound mail |
| `COOKIE_DOMAIN` | Production cookie scope |

Rotate `SESSION_SECRET` only if you accept logging everyone out.

## Threat notes

| Threat | Mitigation |
|---|---|
| Replay of magic link | Single-use `consumed` flag + 15-minute expiry |
| Stolen API key | Hash at rest; revoke + Redis `DEL apikey:{hash}` |
| Cross-site dashboard use | Auth CORS allowlist, not `*` |
| Cookie theft | httpOnly, Secure in prod, SameSite=Lax |
| Brute force encode | Rate limit per key |
| Brand impersonation | No official logos; attribution only |

## CORS

Spatial routes are intentionally open so logistics backends can call from any origin. They still require a valid key. Dashboard routes reject unknown origins.

## Engine isolation

`@digipin/engine` has no I/O. A bug in encode/decode cannot read accounts.
