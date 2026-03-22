---
name: monorepo
description: >
  Craftia Hub monorepo conventions, patterns, and workflows with Turborepo + pnpm.
  Trigger: When creating features, apps, packages, or needing monorepo conventions.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

## When to Use

- Creating a new app or package in the monorepo
- Adding features to existing apps
- Setting up dependencies between packages
- Running monorepo-wide commands
- Understanding project structure and conventions

## Critical Patterns

### Architecture: Screaming + Feature-Based

Feature folders SCREAM what the system does:

```
apps/web/src/features/
├── portfolio/         # NOT "components/"
├── blog/              # NOT "utils/"
├── contact/           # NOT "helpers/"
└── shared/            # Truly shared within this app
```

Each feature is self-contained:

```
features/{name}/
├── components/        # UI components for this feature
├── hooks/             # Custom hooks
├── services/          # API calls, business logic
├── types/             # TypeScript types
├── tests/             # Feature tests
└── index.ts           # Public API of the feature
```

### Monorepo Structure

```
hub/
├── apps/
│   ├── web/              # Public site → craftia.com.mx
│   └── dashboard/        # Private dashboard → app.craftia.com.mx
├── packages/
│   ├── ui/               # Design system (shadcn/ui + Tailwind)
│   ├── db/               # Supabase client + types
│   ├── ai/               # AI integrations (Claude API)
│   ├── auth/             # Supabase Auth
│   ├── eslint-config/    # Shared ESLint
│   └── typescript-config/ # Shared TypeScript
├── supabase/             # Migrations, seeds, edge functions
└── turbo.json
```

### Dependency Rules

| Rule | Detail |
|------|--------|
| Apps → Packages | Allowed |
| Packages → Apps | NEVER |
| Packages → Packages | Allowed (no circular) |
| External deps | Add to consuming package, not root |
| Shared dev deps | Root level (turbo, typescript) |

### Server Components First (Next.js)

| Default | Exception |
|---------|-----------|
| Server Component | Needs state, effects, or browser APIs |
| Server Actions | Form handling |
| Data fetching in server | Pass as props to client components |
| `'use client'` only when required | Interactive UI, event handlers |

### Code Style

| Convention | Rule |
|------------|------|
| Language | English for all code, comments, docs |
| Variables/functions | camelCase |
| Components/types | PascalCase |
| File names | kebab-case (except components: PascalCase) |
| Exports | Named exports (no default, except Next.js pages/layouts) |
| Barrel exports | Only at package root `src/index.ts` |

### Environment Variables

| Variable | Where |
|----------|-------|
| `SUPABASE_URL` | Root `.env.local` |
| `SUPABASE_ANON_KEY` | Root `.env.local` |
| `SUPABASE_SERVICE_ROLE_KEY` | Root `.env.local` (server only) |
| `NEXT_PUBLIC_*` | Client-safe vars only |
| App-specific vars | `apps/{name}/.env.local` |

## Commands

```bash
# Development
pnpm dev                                    # All apps
pnpm dev --filter @craftia/web              # Single app
pnpm dev --filter @craftia/dashboard        # Dashboard only

# Build
pnpm build                                  # All
pnpm build --filter @craftia/web            # Single app

# Lint and Type Check
pnpm lint                                   # All
pnpm type-check                             # All

# Dependencies
pnpm add {pkg} --filter @craftia/{app}      # Add to specific app
pnpm add {pkg} -D --filter @craftia/{pkg}   # Dev dep to package
pnpm add @craftia/{pkg} --workspace --filter @craftia/{app}  # Internal dep

# Turbo
npx turbo build --filter=@craftia/web       # Build with deps
npx turbo build --dry                       # Preview what would run
npx turbo build --graph                     # Visualize dependency graph
```

## Code Examples

### Creating a new app

```bash
mkdir -p apps/{name}
cd apps/{name}
pnpm dlx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
```

Update `package.json`:
```json
{
  "name": "@craftia/{name}",
  "dependencies": {
    "@craftia/ui": "workspace:*",
    "@craftia/db": "workspace:*",
    "@craftia/auth": "workspace:*"
  }
}
```

Then: `pnpm install` from root.

### Creating a new package

```bash
mkdir -p packages/{name}/src
```

Create `packages/{name}/package.json`:
```json
{
  "name": "@craftia/{name}",
  "version": "0.0.0",
  "private": true,
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "devDependencies": {
    "@craftia/typescript-config": "workspace:*",
    "typescript": "catalog:"
  }
}
```

Create `packages/{name}/src/index.ts`:
```typescript
export {};
```

Then: `pnpm install` from root.

### Adding a feature to an app

```bash
mkdir -p apps/web/src/features/{feature-name}/{components,hooks,services,types,tests}
touch apps/web/src/features/{feature-name}/index.ts
```

### Testing

| Type | Tool | File Pattern |
|------|------|-------------|
| Unit | Vitest | `*.test.ts` co-located |
| Component | Testing Library | `*.test.tsx` co-located |
| E2E | Playwright | `tests/*.spec.ts` |
| Visual | Playwright screenshots | See `playwright` skill |
