# Supabase — Database & Backend

> See root [`../CLAUDE.md`](../CLAUDE.md) for global conventions.

## Purpose

Supabase project configuration, SQL migrations, seed data, and Edge Functions for the Craftia platform.

## Structure

```
supabase/
├── config.toml        # Project config (local dev settings)
├── migrations/        # SQL migration files (timestamped)
├── seed.sql           # Seed data for local development
└── functions/         # Deno Edge Functions
```

## Rules

- **RLS always enabled** on every table — no exceptions
- **Migrations are append-only** — never edit existing migration files
- **Migration naming**: `{timestamp}_{description}.sql`
- **Generate types** after every schema change: `npx supabase gen types typescript`
- **Test locally first**: `npx supabase db reset` to replay all migrations
- **Edge Functions** use Deno runtime, not Node.js
