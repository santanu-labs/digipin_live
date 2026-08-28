# 03 — DIGIPIN algorithm

Port of [INDIAPOST-gov/digipin](https://github.com/INDIAPOST-gov/digipin) `src/digipin.js` (Apache 2.0). Implementation: `packages/engine/src/digipin.ts`.

## Grid

Row 0 is north:

```
F C 9 8
J 3 2 7
K 4 5 6
L M P T
```

Alphabet: `2 3 4 5 6 7 8 9 C J K L M P F T` (no `0`, `1`, `I`, `O`).

## Bounding box

| | min | max |
|---|---|---|
| Latitude | 2.5 | 38.5 |
| Longitude | 63.5 | 99.5 |

The box is 36° × 36°. Each of 10 levels divides the current cell into a 4×4, so the final cell is about 4 m × 4 m.

## Encode

1. Reject non-finite numbers and out-of-box coordinates.
2. For levels 1–10: find row/col of the point, append the grid symbol, shrink bounds.
3. Return uppercase continuous string plus 3-4-3 display form.

Official fixture: `13.11179621, 80.20264269` → `4T396F42L7`.

## Decode

1. Reject hyphens.
2. Strip spaces, uppercase, require exactly 10 approved characters.
3. Walk the same 10 subdivisions.
4. Return the **center** of the final cell (not the original input point) and the cell bounds.

Official fixture: `4P3JK852C9` → `12.971601, 77.594584`.

## Formats

| Form | Example | Allowed |
|---|---|---|
| Wire / API / DB | `C4P8K63M4M` | Yes |
| Display | `C4P 8K63 M4M` | Input yes, output as `digipinDisplay` |
| Hyphenated | `C4P-8K63-M4M` | No |

## Tests

`npm run test:engine` — golden README fixtures, round-trip, charset, bounds, hyphen rejection.
