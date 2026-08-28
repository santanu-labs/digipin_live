# 09 — Frontend and SEO

## Routes

| Path | Intent |
|---|---|
| `/` | Corporate + integration docs + playground |
| `/tools/lat-long-to-digipin` | Search: convert latitude to DIGIPIN |
| `/tools/digipin-to-lat-long` | Search: decode DIGIPIN |
| `/docs/api-v1-specification` | Search: DIGIPIN API documentation |
| `/dashboard` | Magic link + key management |
| `/privacy` | Account / email notice |

All landing views are App Router server components. Playground and dashboard hydrate as client islands.

## JSON-LD

`TechArticle` is injected in the root layout. Headline must **not** say “Official”. Publisher is “DIGIPIN Live Engine Network”.

## Playground

- Default / geolocation fallback: New Delhi `28.6139, 77.2090`.
- Encode/decode via Next.js server actions (in-process engine). No API key.
- Map: Leaflet + OSM. Click or drag updates coordinates.
- Real-time field checks: decimals for coordinates; DIGIPIN charset for decode.

## Attribution on every page

Footer states the algorithm origin and that digipin.live is independent.
