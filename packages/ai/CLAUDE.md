# @craftia/ai — AI Integrations

> Scoped context for `packages/ai`. See root [`../../CLAUDE.md`](../../CLAUDE.md) for global conventions.

## Purpose

Single source of truth for all AI service integrations across Craftia. Wraps provider SDKs with retry logic, rate limiting, cost tracking, and streaming support.

## Stack

- **Anthropic SDK** (`@anthropic-ai/sdk`) — primary provider
- **OpenAI SDK** — secondary provider for embeddings and specific use cases

## Structure

```
src/
├── providers/
│   ├── anthropic.ts   # Claude API client and helpers
│   └── openai.ts      # OpenAI client and helpers
├── services/
│   ├── chat.ts        # Chat completion orchestration
│   ├── content.ts     # Content generation (blog, copy)
│   ├── embeddings.ts  # Vector embeddings
│   └── code.ts        # Code assistance
├── middleware/
│   ├── retry.ts       # Exponential backoff + retry logic
│   ├── rate-limit.ts  # Rate limiting per provider
│   └── cost.ts        # Token usage and cost tracking
├── types/             # Shared AI types and interfaces
└── index.ts           # Barrel export
```

## Key Rules

- **Server-side only** — never import this package in client components
- **API keys via env vars** — never hardcode keys; use `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`
- **All AI calls go through this package** — apps never call provider SDKs directly
- **Streaming supported** — use async iterators for streaming responses
- **Cost tracking** — every call logs token usage for billing awareness
- **Retry with backoff** — transient failures (429, 500, 503) retry automatically
- **Provider abstraction** — services depend on interfaces, not concrete providers
