# 05 — Authentication

Passwordless only. No passwords are stored.

## Magic link

1. Client `POST /v1/auth/magic-link` with email.
2. API lowercases email, upserts `accounts`.
3. Generates 32 random bytes (hex), stores **SHA-256** in `login_tokens`, expiry 15 minutes, `consumed = false`.
4. Emails `{PUBLIC_API_URL}/v1/auth/callback?token={plaintext}`.
5. Callback looks up hash, rejects missing / consumed / expired, flips `consumed`, signs `dp_session`, redirects to `{PUBLIC_WEB_URL}/dashboard`.

Without `RESEND_API_KEY` the link is printed to API logs (local only).

## Session cookie

| Attribute | Value |
|---|---|
| Name | `dp_session` |
| Payload | HMAC-SHA256 over `{ accountId, email, exp }` |
| Secret | `SESSION_SECRET` |
| httpOnly | true |
| sameSite | Lax |
| secure | true in production |
| maxAge | 30 days |
| Domain | `COOKIE_DOMAIN` (`.digipin.live` in production) |

Cookies are not port-specific. Local dashboard on `:3000` can call API on `:4000` with `credentials: "include"`.

## API keys

- Format: `dp_live_` + 48 hex chars.
- Store only `key_hash` (SHA-256 of the full key) and a `key_prefix` for the UI.
- Plaintext is returned once on `POST /v1/auth/keys`.
- Revoke sets `revoked = true` and deletes Redis `apikey:{hash}`.

## CORS

| Surface | Policy |
|---|---|
| `/v1/spatial/*` | `Access-Control-Allow-Origin: *` |
| `/v1/auth/*` | Exact origins in `AUTH_ORIGINS` + credentials |
