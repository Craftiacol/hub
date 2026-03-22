# @craftia/db — Database Layer

> Scoped context for `packages/db`. See root [`../../CLAUDE.md`](../../CLAUDE.md) for global conventions.

## Purpose

Supabase client, auto-generated types, and database utilities shared across all Craftia apps.

## Stack

- **Supabase JS Client v2** (`@supabase/supabase-js`)
- **Types auto-generated** from Supabase schema via `supabase gen types typescript`

## Structure

```
src/
├── client.ts       # Typed Supabase client factory (server + browser)
├── types/
│   └── database.ts # Auto-generated types (DO NOT edit manually)
├── helpers/        # Query helpers, pagination, filters
└── index.ts        # Barrel export
```

## Key Rules

- **RLS is ALWAYS enabled** — never disable Row Level Security on any table
- **Typed client only** — apps must use the typed client from this package, never raw SQL
- **Auto-generated types** — run `supabase gen types typescript` after any schema change; never hand-edit `database.ts`
- **Migrations** live at monorepo root: `/supabase/migrations/`
- **No direct Supabase imports in apps** — all database access goes through `@craftia/db`
- **Server-side client** for mutations, **browser client** only for real-time subscriptions and reads with RLS
