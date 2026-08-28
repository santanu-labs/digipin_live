"use client";

import { useEffect, useState } from "react";
import { SITE } from "@/lib/site";
import { trackEvent } from "@/lib/analytics";

type KeyRow = {
  id: string;
  prefix: string;
  name: string | null;
  tier: string;
  revoked: boolean;
  createdAt: string;
};

type Me = { id: string; email: string };

async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${SITE.apiUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error((body as { error?: string }).error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export function Dashboard() {
  const [email, setEmail] = useState("");
  const [me, setMe] = useState<Me | null>(null);
  const [keys, setKeys] = useState<KeyRow[]>([]);
  const [freshKey, setFreshKey] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const err = params.get("error");
    if (err) setError(err === "invalid_token" ? "That sign-in link is invalid or expired." : err);

    api<Me>("/v1/auth/me")
      .then((account) => {
        setMe(account);
        return api<{ keys: KeyRow[] }>("/v1/auth/keys");
      })
      .then((payload) => setKeys(payload.keys))
      .catch(() => setMe(null));
  }, []);

  async function requestLink(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api("/v1/auth/magic-link", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      trackEvent("request_magic_link");
      setMessage("Check your email for a 15-minute sign-in link.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send link");
    } finally {
      setBusy(false);
    }
  }

  async function createKey() {
    setBusy(true);
    setError("");
    try {
      const created = await api<{ key: string }>("/v1/auth/keys", {
        method: "POST",
        body: JSON.stringify({ name: "Production" }),
      });
      setFreshKey(created.key);
      trackEvent("create_api_key");
      const list = await api<{ keys: KeyRow[] }>("/v1/auth/keys");
      setKeys(list.keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create key");
    } finally {
      setBusy(false);
    }
  }

  async function revoke(id: string) {
    setBusy(true);
    try {
      await api(`/v1/auth/keys/${id}`, { method: "DELETE" });
      const list = await api<{ keys: KeyRow[] }>("/v1/auth/keys");
      setKeys(list.keys);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to revoke key");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await api("/v1/auth/logout", { method: "POST" });
    setMe(null);
    setKeys([]);
    setFreshKey("");
  }

  if (!me) {
    return (
      <form className="card stack" onSubmit={requestLink} style={{ maxWidth: 480 }}>
        <label htmlFor="email">Work email</label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
        />
        <button className="btn" disabled={busy}>
          {busy ? "Sending…" : "Email me a sign-in link"}
        </button>
        {message ? <p className="ok">{message}</p> : null}
        {error ? <p className="err">{error}</p> : null}
      </form>
    );
  }

  return (
    <div className="stack">
      <div className="card" style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p className="note">Signed in</p>
          <strong>{me.email}</strong>
        </div>
        <button className="btn ghost" type="button" onClick={() => void logout()}>
          Sign out
        </button>
      </div>

      {freshKey ? (
        <div className="key-once">
          Store this key now. It will not be shown again.
          <br />
          {freshKey}
        </div>
      ) : null}

      <div className="actions">
        <button className="btn" type="button" disabled={busy} onClick={() => void createKey()}>
          Generate production key
        </button>
      </div>
      {error ? <p className="err">{error}</p> : null}

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prefix</th>
              <th>Name</th>
              <th>Tier</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 ? (
              <tr>
                <td colSpan={5}>No keys yet.</td>
              </tr>
            ) : (
              keys.map((key) => (
                <tr key={key.id}>
                  <td>
                    <code>{key.prefix}…</code>
                  </td>
                  <td>{key.name ?? "—"}</td>
                  <td>{key.tier}</td>
                  <td>{key.revoked ? "revoked" : "active"}</td>
                  <td>
                    {!key.revoked ? (
                      <button className="btn ghost" type="button" onClick={() => void revoke(key.id)}>
                        Revoke
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
