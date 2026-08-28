"use server";

import { DigipinError, decodeDigipin, encodeDigipin } from "@digipin/engine";

export type SpatialOk =
  | { ok: true; kind: "encode"; digipin: string; digipinDisplay: string; warning?: string }
  | {
      ok: true;
      kind: "decode";
      latitude: number;
      longitude: number;
      bounds: { minLat: number; maxLat: number; minLon: number; maxLon: number };
      warning?: string;
    };

export type SpatialResult = SpatialOk | { ok: false; error: string };

export async function encodeAction(latitude: number, longitude: number): Promise<SpatialResult> {
  try {
    const result = encodeDigipin(latitude, longitude);
    return { ok: true, kind: "encode", ...result };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof DigipinError ? error.message : "Unable to encode coordinates.",
    };
  }
}

export async function decodeAction(digipin: string): Promise<SpatialResult> {
  const hadHyphens = digipin.includes("-");
  const cleaned = digipin.replace(/-/g, "");
  try {
    const result = decodeDigipin(cleaned);
    return {
      ok: true,
      kind: "decode",
      ...result,
      warning: hadHyphens
        ? "Hyphens are not part of the official DIGIPIN standard. Showing the continuous 10-character form."
        : undefined,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof DigipinError ? error.message : "Unable to decode DIGIPIN.",
    };
  }
}
