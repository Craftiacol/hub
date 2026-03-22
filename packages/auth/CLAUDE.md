# @craftia/auth — Authentication

> Scoped context for `packages/auth`. See root [`../../CLAUDE.md`](../../CLAUDE.md) for global conventions.

## Purpose

Shared authentication logic using Supabase Auth. Provides auth client, session management, middleware helpers, and types for all Craftia apps.

## Stack

- **Supabase Auth** (`@supabase/ssr` for server-side auth)
- **Next.js Middleware** integration for protected routes

## Structure

```
src/
├── client.ts       # Auth client factory (server + browser)
├── middleware.ts    # Next.js middleware helpers (session refresh, redirects)
├── session.ts      # Session management utilities
├── providers.ts    # OAuth provider configuration
├── types/          # Auth types, user profiles, roles
└── index.ts        # Barrel export
```

## Supported Auth Methods

- Email + password
- OAuth: Google, GitHub

## Key Rules

- **Server-side session management** — auth state lives in HTTP-only cookies via Next.js middleware
- **Never store tokens in localStorage** — use `@supabase/ssr` cookie-based approach
- **Protected routes defined per-app** — this package provides the middleware helpers, apps define which routes are protected
- **Session refresh in middleware** — automatically refresh expired sessions before they reach route handlers
- **Auth types exported** — user types, session types, and role enums shared across apps
- **Depends on `@craftia/db`** — uses the same Supabase instance for auth operations
