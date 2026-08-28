import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { DigipinError, decodeDigipin, encodeDigipin } from "@digipin/engine";
import { requireApiKey } from "../middleware/apiKey.js";

const encodeSchema = z.object({
  latitude: z.number({ invalid_type_error: "latitude must be a number" }),
  longitude: z.number({ invalid_type_error: "longitude must be a number" }),
});

const decodeSchema = z.object({
  digipin: z.string().min(1),
});

export const spatial = new Hono();

spatial.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-API-Key"],
    exposeHeaders: ["X-RateLimit-Limit", "X-RateLimit-Remaining"],
  }),
);

spatial.use("*", async (c, next) => {
  if (c.req.method === "OPTIONS") {
    return next();
  }
  return requireApiKey(c, next);
});

spatial.post("/encode", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = encodeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request", code: "invalid_request" },
      400,
    );
  }

  try {
    const result = encodeDigipin(parsed.data.latitude, parsed.data.longitude);
    return c.json(result);
  } catch (error) {
    if (error instanceof DigipinError) {
      return c.json({ error: error.message, code: error.code }, 400);
    }
    throw error;
  }
});

spatial.post("/decode", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = decodeSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "digipin is required", code: "invalid_request" }, 400);
  }

  try {
    const result = decodeDigipin(parsed.data.digipin);
    return c.json(result);
  } catch (error) {
    if (error instanceof DigipinError) {
      return c.json({ error: error.message, code: error.code }, 400);
    }
    throw error;
  }
});
