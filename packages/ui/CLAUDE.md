# @craftia/ui — Design System

> Scoped context for `packages/ui`. See root [`../../CLAUDE.md`](../../CLAUDE.md) for global conventions.

## Purpose

Shared component library for all Craftia apps. Provides accessible, composable, and themeable UI primitives.

## Stack

- **shadcn/ui** as component foundation
- **Radix UI** primitives for accessibility
- **Tailwind CSS** for styling
- **Vitest + Testing Library** for component tests

## Architecture — Atomic Design

```
src/
├── atoms/        # Button, Input, Badge, Typography
├── molecules/    # FormField, Card, SearchBar
├── organisms/    # Navbar, Footer, DataTable, Dialog
├── hooks/        # Shared UI hooks (useMediaQuery, useDebounce)
├── utils/        # cn(), variant helpers
└── index.ts      # Barrel export (allowed here as package root)
```

## Key Rules

- **Barrel export**: `src/index.ts` is the single entry point — all public components exported here
- **Accessibility**: every component must include proper ARIA attributes, keyboard navigation, and focus management
- **Composable over configured**: components accept slots/children, apps add domain-specific styles
- **TDD**: every component gets a co-located `.test.tsx` file
- **No business logic**: UI only — no API calls, no data fetching, no auth checks
- **Variants via CVA**: use `class-variance-authority` for component variants
- **Document props**: every component's props interface must have JSDoc comments
