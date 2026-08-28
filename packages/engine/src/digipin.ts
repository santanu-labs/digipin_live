/**
 * DIGIPIN Encoder and Decoder
 *
 * Port of the official algorithm published by the Department of Posts,
 * Government of India, in collaboration with IIT Hyderabad and NRSC, ISRO.
 *
 * Source: https://github.com/INDIAPOST-gov/digipin/blob/main/src/digipin.js
 * License: Apache License 2.0
 *
 * Modifications in this port:
 * - TypeScript types and structured errors
 * - Continuous 10-character wire format (official 2026 standard)
 * - Optional 3-4-3 spaced display grouping
 * - Decode accepts spaced display form; hyphens are rejected
 * - Return value is uppercased
 */

export const DIGIPIN_GRID = [
  ["F", "C", "9", "8"],
  ["J", "3", "2", "7"],
  ["K", "4", "5", "6"],
  ["L", "M", "P", "T"],
] as const;

export const DIGIPIN_ALPHABET = "23456789CJKLMPFT";

export const BOUNDS = {
  minLat: 2.5,
  maxLat: 38.5,
  minLon: 63.5,
  maxLon: 99.5,
} as const;

export type Bounds = typeof BOUNDS;

export class DigipinError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "DigipinError";
    this.code = code;
  }
}

export interface EncodeResult {
  digipin: string;
  digipinDisplay: string;
}

export interface DecodeResult {
  latitude: number;
  longitude: number;
  bounds: {
    minLat: number;
    maxLat: number;
    minLon: number;
    maxLon: number;
  };
}

const CHARSET_RE = /^[23456789CJKLMPFT]{10}$/;

export function formatDigipinDisplay(digipin: string): string {
  const pin = digipin.toUpperCase();
  return `${pin.slice(0, 3)} ${pin.slice(3, 7)} ${pin.slice(7, 10)}`;
}

export function normalizeDigipin(input: string): string {
  if (typeof input !== "string") {
    throw new DigipinError(
      "invalid_type",
      "Invalid DIGIPIN. DIGIPIN must be provided as a string.",
    );
  }

  const raw = input.trim().toUpperCase();

  if (raw.includes("-")) {
    throw new DigipinError(
      "hyphens_not_permitted",
      "Invalid DIGIPIN. Hyphens are not permitted. Use a continuous 10-character identifier or the 3-4-3 spaced display form.",
    );
  }

  const pin = raw.replace(/\s+/g, "");

  if (pin.length !== 10) {
    throw new DigipinError(
      "invalid_length",
      "Invalid DIGIPIN. DIGIPIN must be a continuous 10-character string.",
    );
  }

  if (!CHARSET_RE.test(pin)) {
    throw new DigipinError(
      "invalid_charset",
      "Invalid DIGIPIN. Only approved DIGIPIN characters (2,3,4,5,6,7,8,9,C,J,K,L,M,P,F,T) are permitted.",
    );
  }

  return pin;
}

export function encodeDigipin(lat: number, lon: number): EncodeResult {
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    throw new DigipinError(
      "invalid_coordinates",
      "Latitude and longitude must be finite numbers.",
    );
  }

  if (lat < BOUNDS.minLat || lat > BOUNDS.maxLat) {
    throw new DigipinError(
      "latitude_out_of_range",
      `Latitude out of range. DIGIPIN covers ${BOUNDS.minLat} to ${BOUNDS.maxLat}.`,
    );
  }

  if (lon < BOUNDS.minLon || lon > BOUNDS.maxLon) {
    throw new DigipinError(
      "longitude_out_of_range",
      `Longitude out of range. DIGIPIN covers ${BOUNDS.minLon} to ${BOUNDS.maxLon}.`,
    );
  }

  let minLat: number = BOUNDS.minLat;
  let maxLat: number = BOUNDS.maxLat;
  let minLon: number = BOUNDS.minLon;
  let maxLon: number = BOUNDS.maxLon;
  let digipin = "";

  for (let level = 1; level <= 10; level++) {
    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    let row = 3 - Math.floor((lat - minLat) / latDiv);
    let col = Math.floor((lon - minLon) / lonDiv);

    row = Math.max(0, Math.min(row, 3));
    col = Math.max(0, Math.min(col, 3));

    digipin += DIGIPIN_GRID[row][col];

    maxLat = minLat + latDiv * (4 - row);
    minLat = minLat + latDiv * (3 - row);
    minLon = minLon + lonDiv * col;
    maxLon = minLon + lonDiv;
  }

  const pin = digipin.toUpperCase();
  return {
    digipin: pin,
    digipinDisplay: formatDigipinDisplay(pin),
  };
}

export function decodeDigipin(input: string): DecodeResult {
  const pin = normalizeDigipin(input);

  let minLat: number = BOUNDS.minLat;
  let maxLat: number = BOUNDS.maxLat;
  let minLon: number = BOUNDS.minLon;
  let maxLon: number = BOUNDS.maxLon;

  for (let i = 0; i < 10; i++) {
    const char = pin[i];
    let found = false;
    let ri = -1;
    let ci = -1;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (DIGIPIN_GRID[r][c] === char) {
          ri = r;
          ci = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      throw new DigipinError("invalid_charset", "Invalid character in DIGIPIN");
    }

    const latDiv = (maxLat - minLat) / 4;
    const lonDiv = (maxLon - minLon) / 4;

    const lat1 = maxLat - latDiv * (ri + 1);
    const lat2 = maxLat - latDiv * ri;
    const lon1 = minLon + lonDiv * ci;
    const lon2 = minLon + lonDiv * (ci + 1);

    minLat = lat1;
    maxLat = lat2;
    minLon = lon1;
    maxLon = lon2;
  }

  return {
    latitude: Number(((minLat + maxLat) / 2).toFixed(6)),
    longitude: Number(((minLon + maxLon) / 2).toFixed(6)),
    bounds: { minLat, maxLat, minLon, maxLon },
  };
}
