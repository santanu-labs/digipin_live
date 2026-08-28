import type { MiddlewareHandler } from "hono";
import { getCookie } from "hono/cookie";
import { verifySession, type SessionPayload } from "../crypto.js";

export const requireSession: MiddlewareHandler = async (c, next) => {
  const token = getCookie(c, "dp_session");
  if (!token) {
    return c.json({ error: "Not authenticated", code: "unauthenticated" }, 401);
  }
  const session = verifySession(token);
  if (!session) {
    return c.json({ error: "Session expired", code: "session_expired" }, 401);
  }
  c.set("session", session);
  await next();
};

declare module "hono" {
  interface ContextVariableMap {
    session: SessionPayload;
    apiKey: {
      accountId: string;
      keyId: string;
      tier: "free" | "commercial";
      keyHash: string;
    };
  }
}
