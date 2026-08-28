# 11 — Runbook

Use this at 3 a.m.

## Health

```bash
curl -sS https://api.digipin.live/health
curl -sSI https://digipin.live
```

API must return `{ "ok": true }`. Web must return 200 on `/`.

## Railway logs

Project → service `api` or `web` → Deployments → latest → Logs.

Magic-link failures show as Resend errors. Spatial 401s are missing/invalid keys, not engine bugs.

## Encode returns 400

1. Confirm coordinates are inside 2.5–38.5 / 63.5–99.5.
2. Confirm body is JSON numbers, not strings.
3. Engine tests: `npm run test:engine`.

## 401 invalid_api_key

1. Key revoked or mistyped (must be full `dp_live_…`).
2. Header name is `X-API-Key`.
3. After revoke, Redis cache is deleted. If you deleted the row by hand, `DEL apikey:{sha256}`.

## 429

Free keys: 60/min. Wait or promote:

```sql
UPDATE api_keys SET tier = 'commercial' WHERE key_prefix = 'dp_live_xxxxxxxx';
```

Then `DEL apikey:{hash}` in Redis or wait 300s.

## Revoke a leaked key

Dashboard → Revoke, or:

```sql
UPDATE api_keys SET revoked = TRUE WHERE id = '<uuid>';
```

```
DEL apikey:<sha256 of plaintext>
```

## Invalid / expired magic link

Tokens live 15 minutes and are single-use. Request a new link. Check Resend dashboard if mail never arrived. Locally, the URL is in API stdout.

## Promote an account’s keys

```sql
UPDATE api_keys SET tier = 'commercial'
WHERE account_id = (SELECT id FROM accounts WHERE email = 'ops@example.com');
```

## Redis flush

`FLUSHDB` on the Railway Redis wipes key cache and rate windows. Safe but causes a brief Postgres burst and resets quotas. Do not flush Postgres.

## Session outage after secret rotate

All dashboards sign out. Users request a new magic link. Keys are unaffected.
