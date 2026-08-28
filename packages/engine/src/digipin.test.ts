import assert from "node:assert/strict";
import { test } from "node:test";
import {
  BOUNDS,
  DIGIPIN_ALPHABET,
  decodeDigipin,
  encodeDigipin,
  formatDigipinDisplay,
  normalizeDigipin,
} from "./digipin";

test("official README encode fixture (Chennai)", () => {
  const result = encodeDigipin(13.11179621, 80.20264269);
  assert.equal(result.digipin, "4T396F42L7");
  assert.equal(result.digipinDisplay, "4T3 96F4 2L7");
});

test("official README decode fixture", () => {
  const result = decodeDigipin("4P3JK852C9");
  assert.equal(result.latitude, 12.971601);
  assert.equal(result.longitude, 77.594584);
});

test("round-trip: encode then decode lands in the same cell", () => {
  const lat = 28.6139;
  const lon = 77.209;
  const encoded = encodeDigipin(lat, lon);
  const decoded = decodeDigipin(encoded.digipin);
  const again = encodeDigipin(decoded.latitude, decoded.longitude);
  assert.equal(again.digipin, encoded.digipin);
});

test("decode accepts 3-4-3 spaced display form", () => {
  const compact = decodeDigipin("4T396F42L7");
  const spaced = decodeDigipin("4T3 96F4 2L7");
  assert.deepEqual(compact, spaced);
});

test("decode rejects hyphens", () => {
  assert.throws(() => decodeDigipin("4T3-96F4-2L7"), /Hyphens are not permitted/);
});

test("rejects coordinates outside the India bounding box", () => {
  assert.throws(() => encodeDigipin(40, 80), /Latitude out of range/);
  assert.throws(() => encodeDigipin(20, 10), /Longitude out of range/);
  assert.throws(() => encodeDigipin(-90, 0), /Latitude out of range/);
});

test("alphabet excludes look-alikes 0, 1, I, O", () => {
  assert.equal(DIGIPIN_ALPHABET.includes("0"), false);
  assert.equal(DIGIPIN_ALPHABET.includes("1"), false);
  assert.equal(DIGIPIN_ALPHABET.includes("I"), false);
  assert.equal(DIGIPIN_ALPHABET.includes("O"), false);
  assert.equal(DIGIPIN_ALPHABET.length, 16);
});

test("normalize uppercases and strips spaces", () => {
  assert.equal(normalizeDigipin("4t3 96f4 2l7"), "4T396F42L7");
});

test("display grouping is 3-4-3", () => {
  assert.equal(formatDigipinDisplay("C4P8K63M4M"), "C4P 8K63 M4M");
});

test("bounds match the official 36-degree India box", () => {
  assert.equal(BOUNDS.minLat, 2.5);
  assert.equal(BOUNDS.maxLat, 38.5);
  assert.equal(BOUNDS.minLon, 63.5);
  assert.equal(BOUNDS.maxLon, 99.5);
});
