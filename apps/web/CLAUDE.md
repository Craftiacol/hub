# Craftia Web — Public Website

> Scoped context for `apps/web`. See root [`../../CLAUDE.md`](../../CLAUDE.md) for global conventions.

## Purpose

Public-facing website for Craftia at **craftia.com.mx** — portfolio, blog, landing pages, and contact. This is the company's primary online presence.

## Stack

- **Next.js 15 App Router** with Server Components as default
- **Tailwind CSS** + `@craftia/ui` for components
- **MDX** for blog content
- **Supabase** via `@craftia/db` for dynamic data
- **Deployed on Vercel**

## Architecture

Feature-based structure under `src/features/`:

```
src/
├── app/              # Next.js App Router (routes only, thin layer)
├── features/
│   ├── portfolio/    # Project showcases, case studies
│   ├── blog/         # MDX blog posts, categories, tags
│   ├── contact/      # Contact form, scheduling
│   └── landing/      # Landing pages, hero sections
├── components/       # Shared app-level components (layout, nav, footer)
└── lib/              # App-level utilities
```

- Route files in `app/` should be thin — delegate logic to features
- Each feature owns its components, actions, and types

## Key Rules

- **Server Components first** — only add `"use client"` when interactivity demands it
- **SEO is critical**: every page needs proper `metadata`, OG images, and structured data (JSON-LD)
- **Sitemap**: maintain `app/sitemap.ts` for all public routes
- **Performance**: use `next/image`, lazy loading, and minimal client JS
- **MDX blog**: posts live in a content directory, rendered via MDX with custom components from `@craftia/ui`

## SEO Checklist (every page)

- [ ] `metadata` export with title, description, openGraph, twitter
- [ ] Canonical URL set
- [ ] Structured data (JSON-LD) where applicable
- [ ] Semantic HTML (`<article>`, `<nav>`, `<main>`, headings hierarchy)
