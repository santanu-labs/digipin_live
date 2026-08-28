# 07 — Data model

Postgres 16. Migration: `apps/api/src/migrations/001_init.sql`. Applied on API boot.

## accounts

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | `gen_random_uuid()` |
| email | VARCHAR(320) UNIQUE | Lowercased |
| created_at | TIMESTAMPTZ | |

Immutable parent row. No password columns.

## login_tokens

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| account_id | UUID FK | ON DELETE CASCADE |
| token_hash | VARCHAR(64) | SHA-256 hex |
| consumed | BOOLEAN | Replay protection |
| expires_at | TIMESTAMPTZ | now() + 15 minutes |
| created_at | TIMESTAMPTZ | |

Index: `token_hash`, `account_id`.

## api_keys

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| account_id | UUID FK | ON DELETE CASCADE |
| key_hash | VARCHAR(64) UNIQUE | SHA-256 of `dp_live_…` |
| key_prefix | VARCHAR(24) | First 16 chars for UI |
| name | VARCHAR(120) | Optional label |
| tier | VARCHAR(20) | `free` \| `commercial` |
| revoked | BOOLEAN | Soft delete |
| created_at | TIMESTAMPTZ | |

Index: `account_id`, `key_hash`.

## What is never stored

- Plaintext magic-link tokens
- Plaintext API keys
- Coordinates or DIGIPINs from spatial traffic
