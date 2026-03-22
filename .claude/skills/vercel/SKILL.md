---
name: vercel
description: >
  Manage Vercel deployments, projects, domains, and env vars using Vercel CLI.
  Trigger: When deploying, managing domains, env vars, or checking deployment status.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Bash, Read, Grep, Glob
---

## When to Use

- Deploying apps to Vercel (preview or production)
- Managing environment variables
- Configuring custom domains
- Checking deployment status and logs
- Linking monorepo apps to Vercel projects
- Rolling back deployments

## Critical Patterns

### Project Mapping

| App | Vercel Project | Domain |
|-----|---------------|--------|
| `apps/web` | craftia-web | craftia.com.mx |
| `apps/dashboard` | craftia-dashboard | app.craftia.com.mx |

### Monorepo Deploy Strategy

Each app in the monorepo is a separate Vercel project. Vercel detects changes per-app via Root Directory setting.

| Setting | Value |
|---------|-------|
| Root Directory | `apps/{name}` |
| Build Command | `cd ../.. && npx turbo build --filter=@craftia/{name}` |
| Output Directory | `.next` |
| Install Command | `pnpm install` |
| Node.js Version | 20.x |

### Environment Variables

| Scope | Description |
|-------|-------------|
| Production | Live site vars only |
| Preview | PR/branch deploy vars |
| Development | Local dev (`vercel env pull`) |

Never commit `.env` files. Use `vercel env` to manage.

## Commands

```bash
# Authentication
vercel login                                # Login via browser
vercel whoami                               # Check current user

# Project Setup (run from app directory)
cd apps/web && vercel link                  # Link to existing project
cd apps/web && vercel                       # Deploy (creates project if needed)

# Deployments
vercel                                      # Deploy preview
vercel --prod                               # Deploy to production
vercel deploy --prebuilt                    # Deploy pre-built output

# Deployment Status
vercel ls                                   # List recent deployments
vercel inspect <url>                        # Deployment details
vercel logs <url>                           # Deployment logs
vercel rollback                             # Rollback last production deploy

# Environment Variables
vercel env add <name>                       # Add env var (interactive)
vercel env add <name> production < .env     # Add from file
vercel env ls                               # List all env vars
vercel env pull .env.local                  # Pull env vars to local file
vercel env rm <name>                        # Remove env var

# Domains
vercel domains ls                           # List domains
vercel domains add <domain>                 # Add domain
vercel domains inspect <domain>             # Domain details
vercel alias set <deployment> <domain>      # Alias deployment to domain

# Project Settings
vercel project ls                           # List projects
vercel project rm <name>                    # Remove project
```

## Code Examples

### Initial setup for a monorepo app

```bash
# 1. Navigate to the app
cd apps/web

# 2. Link to Vercel (first time)
vercel link

# 3. Set root directory to the app
# (done via Vercel dashboard or vercel.json)

# 4. Pull env vars for local dev
vercel env pull .env.local

# 5. Deploy preview
vercel

# 6. If everything looks good, deploy to production
vercel --prod
```

### Manage env vars for Supabase

```bash
# Add Supabase vars to production
echo "$SUPABASE_URL" | vercel env add NEXT_PUBLIC_SUPABASE_URL production
echo "$SUPABASE_ANON_KEY" | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
echo "$SUPABASE_SERVICE_ROLE_KEY" | vercel env add SUPABASE_SERVICE_ROLE_KEY production

# Pull to local
vercel env pull .env.local
```

### Check deployment after push

```bash
# List recent deployments
vercel ls --limit 5

# Get logs for latest
vercel logs $(vercel ls --limit 1 2>/dev/null | tail -1 | awk '{print $2}')
```

### vercel.json for monorepo app

```json
{
  "buildCommand": "cd ../.. && npx turbo build --filter=@craftia/web",
  "installCommand": "pnpm install",
  "framework": "nextjs"
}
```
