import { config } from "dotenv";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), "../../.env") });
config();

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? "",
  redisUrl: process.env.REDIS_URL ?? "",
  sessionSecret: process.env.SESSION_SECRET ?? "dev-session-secret-change-me",
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  mailFrom: process.env.MAIL_FROM ?? "DIGIPIN Live <noreply@digipin.live>",
  publicWebUrl: process.env.PUBLIC_WEB_URL ?? "http://localhost:3000",
  publicApiUrl: process.env.PUBLIC_API_URL ?? "http://localhost:4000",
  cookieDomain: process.env.COOKIE_DOMAIN ?? "",
  authOrigins: (process.env.AUTH_ORIGINS ?? "http://localhost:3000,https://digipin.live")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  get isProd() {
    return this.nodeEnv === "production";
  },
};

export function assertProductionEnv() {
  if (!env.isProd) return;
  required("DATABASE_URL");
  required("REDIS_URL");
  required("SESSION_SECRET");
}
