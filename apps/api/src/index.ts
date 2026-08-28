import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { assertProductionEnv, env } from "./env.js";
import { migrate, pool } from "./db.js";
import { connectRedis } from "./redis.js";
import { auth } from "./routes/auth.js";
import { spatial } from "./routes/spatial.js";

assertProductionEnv();

const app = new Hono();
app.use("*", logger());

app.get("/health", (c) =>
  c.json({
    ok: true,
    service: "digipin-api",
    time: new Date().toISOString(),
  }),
);

app.route("/v1/spatial", spatial);
app.route("/v1/auth", auth);

app.notFound((c) => c.json({ error: "Not found", code: "not_found" }, 404));
app.onError((error, c) => {
  console.error(error);
  return c.json({ error: "Internal server error", code: "internal_error" }, 500);
});

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`DIGIPIN API listening on ${info.port}`);
});

try {
  await migrate();
  await connectRedis();
} catch (error) {
  console.error("Startup dependency failed", error);
}

for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, async () => {
    await pool?.end();
    process.exit(0);
  });
}

export default app;
