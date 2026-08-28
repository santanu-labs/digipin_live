import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { env } from "./env.js";

const { Pool } = pg;

export const pool = env.databaseUrl
  ? new Pool({ connectionString: env.databaseUrl, max: 10 })
  : null;

export async function query<T extends pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<pg.QueryResult<T>> {
  if (!pool) {
    throw new Error("DATABASE_URL is not configured");
  }
  return pool.query<T>(text, params);
}

export async function migrate() {
  if (!pool) {
    console.warn("Skipping migrations: DATABASE_URL is not configured");
    return;
  }
  try {
    const dir = dirname(fileURLToPath(import.meta.url));
    const sql = readFileSync(join(dir, "migrations", "001_init.sql"), "utf8");
    await pool.query(sql);
  } catch (error) {
    if (env.isProd) throw error;
    console.warn("Skipping migrations: database unavailable", error);
  }
}

export type Account = {
  id: string;
  email: string;
  created_at: Date;
};

export type ApiKeyRow = {
  id: string;
  account_id: string;
  key_hash: string;
  key_prefix: string;
  name: string | null;
  tier: "free" | "commercial";
  revoked: boolean;
  created_at: Date;
};
