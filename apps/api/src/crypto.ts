import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "./env.js";

export function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString("hex");
}

export function newApiKey(): string {
  return `dp_live_${randomBytes(24).toString("hex")}`;
}

export type SessionPayload = {
  accountId: string;
  email: string;
  exp: number;
};

export function signSession(payload: Omit<SessionPayload, "exp">, ttlSeconds = 60 * 60 * 24 * 30) {
  const body: SessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };
  const encoded = Buffer.from(JSON.stringify(body)).toString("base64url");
  const sig = createHmac("sha256", env.sessionSecret).update(encoded).digest("base64url");
  return `${encoded}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
  const [encoded, sig] = token.split(".");
  if (!encoded || !sig) return null;
  const expected = createHmac("sha256", env.sessionSecret).update(encoded).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
