import { Hono } from "hono";
import { cors } from "hono/cors";
import { deleteCookie, setCookie } from "hono/cookie";
import { z } from "zod";
import { env } from "../env.js";
import { newApiKey, randomToken, sha256, signSession } from "../crypto.js";
import { query, type Account, type ApiKeyRow } from "../db.js";
import { sendMagicLink } from "../mail.js";
import { cacheDel } from "../redis.js";
import { requireSession } from "../middleware/session.js";

export const auth = new Hono();

auth.use(
  "*",
  cors({
    origin: (origin) => (origin && env.authOrigins.includes(origin) ? origin : env.authOrigins[0]),
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  }),
);

const emailSchema = z.object({
  email: z.string().email(),
});

const createKeySchema = z.object({
  name: z.string().min(1).max(120).optional(),
});

function applySessionCookie(c: Parameters<typeof setCookie>[0], token: string) {
  setCookie(c, "dp_session", token, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: "Lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    ...(env.cookieDomain ? { domain: env.cookieDomain } : {}),
  });
}

auth.post("/magic-link", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = emailSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Enter a valid email address", code: "invalid_email" }, 400);
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existing = await query<Account>(`SELECT * FROM accounts WHERE email = $1`, [email]);
  let account = existing.rows[0];
  if (!account) {
    const created = await query<Account>(
      `INSERT INTO accounts (email) VALUES ($1) RETURNING *`,
      [email],
    );
    account = created.rows[0];
  }

  const token = randomToken(32);
  const tokenHash = sha256(token);
  await query(
    `INSERT INTO login_tokens (account_id, token_hash, expires_at)
     VALUES ($1, $2, now() + interval '15 minutes')`,
    [account.id, tokenHash],
  );

  const url = `${env.publicApiUrl}/v1/auth/callback?token=${token}`;
  await sendMagicLink(email, url);

  return c.json({ ok: true, message: "Check your email for a sign-in link." });
});

auth.get("/callback", async (c) => {
  const token = c.req.query("token");
  if (!token) {
    return c.redirect(`${env.publicWebUrl}/dashboard?error=missing_token`);
  }

  const tokenHash = sha256(token);
  const found = await query<{
    id: string;
    account_id: string;
    consumed: boolean;
    expires_at: Date;
    email: string;
  }>(
    `SELECT t.id, t.account_id, t.consumed, t.expires_at, a.email
     FROM login_tokens t
     JOIN accounts a ON a.id = t.account_id
     WHERE t.token_hash = $1`,
    [tokenHash],
  );

  const row = found.rows[0];
  if (!row || row.consumed || new Date(row.expires_at).getTime() < Date.now()) {
    return c.redirect(`${env.publicWebUrl}/dashboard?error=invalid_token`);
  }

  await query(`UPDATE login_tokens SET consumed = TRUE WHERE id = $1`, [row.id]);
  const session = signSession({ accountId: row.account_id, email: row.email });
  applySessionCookie(c, session);
  return c.redirect(`${env.publicWebUrl}/dashboard`);
});

auth.post("/logout", requireSession, async (c) => {
  deleteCookie(c, "dp_session", {
    path: "/",
    ...(env.cookieDomain ? { domain: env.cookieDomain } : {}),
  });
  return c.json({ ok: true });
});

auth.get("/me", requireSession, async (c) => {
  const session = c.get("session");
  return c.json({
    id: session.accountId,
    email: session.email,
  });
});

auth.get("/keys", requireSession, async (c) => {
  const session = c.get("session");
  const result = await query<ApiKeyRow>(
    `SELECT id, account_id, key_hash, key_prefix, name, tier, revoked, created_at
     FROM api_keys
     WHERE account_id = $1
     ORDER BY created_at DESC`,
    [session.accountId],
  );

  return c.json({
    keys: result.rows.map((row) => ({
      id: row.id,
      prefix: row.key_prefix,
      name: row.name,
      tier: row.tier,
      revoked: row.revoked,
      createdAt: row.created_at,
    })),
  });
});

auth.post("/keys", requireSession, async (c) => {
  const session = c.get("session");
  const body = await c.req.json().catch(() => ({}));
  const parsed = createKeySchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: "Invalid key name", code: "invalid_request" }, 400);
  }

  const plaintext = newApiKey();
  const keyHash = sha256(plaintext);
  const prefix = plaintext.slice(0, 16);

  const inserted = await query<ApiKeyRow>(
    `INSERT INTO api_keys (account_id, key_hash, key_prefix, name, tier)
     VALUES ($1, $2, $3, $4, 'free')
     RETURNING *`,
    [session.accountId, keyHash, prefix, parsed.data.name ?? "Production"],
  );

  const row = inserted.rows[0];
  return c.json({
    id: row.id,
    key: plaintext,
    prefix: row.key_prefix,
    name: row.name,
    tier: row.tier,
    createdAt: row.created_at,
    warning: "This plaintext key is shown once. Store it now.",
  });
});

auth.delete("/keys/:id", requireSession, async (c) => {
  const session = c.get("session");
  const id = c.req.param("id");
  const existing = await query<ApiKeyRow>(
    `UPDATE api_keys SET revoked = TRUE
     WHERE id = $1 AND account_id = $2
     RETURNING *`,
    [id, session.accountId],
  );

  const row = existing.rows[0];
  if (!row) {
    return c.json({ error: "Key not found", code: "not_found" }, 404);
  }

  await cacheDel(`apikey:${row.key_hash}`);
  return c.json({ ok: true, id: row.id, revoked: true });
});
