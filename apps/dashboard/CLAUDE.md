# Craftia Dashboard

> See [root CLAUDE.md](../../CLAUDE.md) for global conventions.

## Purpose

Private internal dashboard for Craftia business operations. Manages clients, projects, invoicing, and AI workspace.

## Deployment

- **URL**: app.craftia.com.mx
- **Platform**: Vercel
- **Auth**: Required — all routes protected via Supabase Auth middleware

## Architecture

Feature-based structure under `src/features/`:

```
src/features/
├── crm/              # Client management, pipeline, contacts
├── projects/         # Project boards, time tracking, milestones
├── invoicing/        # Invoices, payments, proposals
├── ai-workspace/     # AI agent, content generation, code assist
└── settings/         # User settings, integrations, billing
```

## Rules

- Every route requires authentication
- Server Components for data fetching, Client Components for interactivity
- All data access through `@craftia/db` typed client
- AI features through `@craftia/ai` package
- Uses `@craftia/ui` for all UI components
