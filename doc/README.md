# DIGIPIN Live documentation

Operator and integrator source of truth for `digipin.live`. The public page at `/docs/api-v1-specification` is a rendered subset of this set. Do not maintain a second spec.

## Audience

| Reader | Start here |
|---|---|
| New engineer | [01-product-overview.md](01-product-overview.md), [02-architecture.md](02-architecture.md) |
| API consumer | [04-api-specification.md](04-api-specification.md), [openapi.yaml](openapi.yaml) |
| Auth / keys | [05-authentication.md](05-authentication.md), [06-rate-limiting.md](06-rate-limiting.md) |
| On-call | [11-runbook.md](11-runbook.md) |
| Legal / attribution | [12-legal-and-attribution.md](12-legal-and-attribution.md) |

## How to read this set

1. Product intent and what this service is not — `01`
2. Runtime topology — `02`
3. Official grid algorithm — `03`
4. HTTP contract — `04` must match `openapi.yaml` and `apps/api`
5. Identity, quotas, schema, threats — `05`–`08`
6. Site and SEO — `09`
7. Railway deploy and incidents — `10`–`11`

## Conventions

- Markdown plus one OpenAPI 3.1 file.
- Wire DIGIPIN is a continuous 10-character string. Display may use 3-4-3 spaces. Hyphens are invalid.
- Never describe this product as the official India Post API.
- Error codes in docs must match handler `code` fields.
