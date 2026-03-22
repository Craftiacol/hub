# Craftia Hub — Monorepo Orchestrator

## Overview

Craftia Hub is the monorepo for **Craftia** (craftiacol on GitHub), a freelance SaaS and AI consultancy owned by Alvaro Sepulveda. It houses the public website, shared packages, and AI integrations under one Turborepo workspace.

## Monorepo Structure

```
hub/
├── apps/
│   └── web/              # Public website (Next.js 15 App Router) → craftia.com.mx
├── packages/
│   ├── ui/               # Design system (shadcn/ui + Tailwind + Radix)
│   ├── db/               # Supabase client + types
│   ├── ai/               # Claude/OpenAI API integrations
│   ├── auth/             # Supabase Auth shared logic
│   ├── eslint-config/    # Shared linting rules
│   └── typescript-config/ # Shared TS configs
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm workspaces |
| Framework | Next.js 15 App Router |
| Language | TypeScript (strict mode) |
| Database | Supabase (Postgres + Auth + Storage) |
| Styling | Tailwind CSS + shadcn/ui |
| AI | Anthropic SDK (primary), OpenAI |
| Testing | Vitest + Playwright |
| Deploy | Vercel |

## Package Scope

All packages use the `@craftia/` scope:
- `@craftia/ui`, `@craftia/db`, `@craftia/ai`, `@craftia/auth`
- `@craftia/eslint-config`, `@craftia/typescript-config`

## Architecture Conventions

- **Screaming architecture**: folder names reflect business domains, not technical roles
- **Feature-based structure**: group by feature (e.g., `portfolio/`, `blog/`), not by type (`components/`, `hooks/`)
- **Server Components first**: default to RSC, opt into client only when interactivity requires it
- **TDD**: write tests before or alongside implementation
- **No barrel exports** in apps or feature folders — only allowed at package root `src/index.ts`

## Code Standards

- **Language**: all code, comments, variable names, and documentation in English
- **Commits**: conventional commits format (`feat:`, `fix:`, `chore:`, etc.)
- **Imports**: use `@craftia/*` package imports, never relative paths across package boundaries
- **Types**: no `any` — use proper typing or `unknown` with type guards

## Scoped CLAUDE.md Architecture

Each app and package has its own `CLAUDE.md` that provides focused context for that workspace:

| Path | Purpose |
|------|---------|
| `apps/web/CLAUDE.md` | Public website context, SEO, features |
| `packages/ui/CLAUDE.md` | Design system, atomic design, accessibility |
| `packages/db/CLAUDE.md` | Supabase client, types, RLS policies |
| `packages/ai/CLAUDE.md` | AI integrations, streaming, cost tracking |
| `packages/auth/CLAUDE.md` | Auth flows, session management, middleware |

When working in a specific workspace, the scoped CLAUDE.md provides the relevant constraints. This root file provides the global rules and orchestration context.

## Delegation Pattern

- **Root orchestrates**: this file defines global conventions and coordinates cross-cutting work
- **Scoped files provide context**: each workspace's CLAUDE.md defines local rules and architecture
- **Cross-package changes**: when a change touches multiple packages, start from the root context and reference each scoped CLAUDE.md as needed

## Project Skills

Available skills in `.claude/skills/`:
- `github` — GitHub workflows, PR conventions, issue management
- `playwright` — E2E testing patterns and page object models
- `monorepo` — Turborepo pipelines, dependency management, workspace commands
