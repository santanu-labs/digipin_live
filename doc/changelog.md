# Changelog

## 1.0.0 — 2026-08-28

- Initial production surface: `@digipin/engine`, Hono API, Next.js portal.
- Spatial `POST /v1/spatial/encode` and `/decode` with `X-API-Key`.
- Passwordless magic-link auth and hashed API keys.
- Redis sliding-window limits: free 60/min, commercial 5,000/min.
- Official wire format: continuous 10 characters. Display 3-4-3. Hyphens rejected.
- Coverage: official India bounding box only.
