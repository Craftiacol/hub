---
name: supabase
description: >
  Manage Supabase projects, databases, migrations, auth, and edge functions using Supabase CLI.
  Trigger: When working with database, auth, storage, migrations, or edge functions.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

## When to Use

- Creating or managing database tables and migrations
- Setting up Row Level Security (RLS) policies
- Managing auth providers and settings
- Working with Supabase Storage buckets
- Creating Edge Functions
- Generating TypeScript types from schema
- Running local Supabase for development

## Critical Patterns

### CLI Access

Supabase CLI runs via npx (not globally installed):

```bash
npx supabase <command>
```

### Project Structure

```
hub/
├── supabase/
│   ├── config.toml           # Supabase project config
│   ├── migrations/           # SQL migration files
│   │   ├── 20260321000000_create_clients.sql
│   │   └── 20260321000001_create_invoices.sql
│   ├── seed.sql              # Seed data for local dev
│   └── functions/            # Edge Functions (Deno)
│       └── hello/
│           └── index.ts
├── packages/db/              # @craftia/db — typed client
```

### Migration Naming

Format: `{timestamp}_{description}.sql`

```
20260321000000_create_clients.sql
20260321000001_create_invoices.sql
20260321000002_add_rls_policies.sql
```

### RLS Policy — ALWAYS ENABLED

Every table MUST have RLS enabled. No exceptions.

```sql
-- Enable RLS
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Policy example: users see only their own data
CREATE POLICY "Users can view own clients"
  ON public.clients FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clients"
  ON public.clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Type Generation

After any schema change, regenerate types:

```bash
npx supabase gen types typescript --project-id <ref> > packages/db/src/database.types.ts
```

Then the typed client in `@craftia/db` uses these types automatically.

### Environment Variables

| Variable | Usage | Where |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Client-side Supabase URL | Public (client) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side anon key | Public (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side admin key | Server only, NEVER public |
| `SUPABASE_DB_URL` | Direct DB connection | Migrations, server only |

## Commands

```bash
# Project Setup
npx supabase init                           # Initialize supabase/ directory
npx supabase login                          # Authenticate with Supabase
npx supabase link --project-ref <ref>       # Link to remote project

# Local Development
npx supabase start                          # Start local Supabase (Docker required)
npx supabase stop                           # Stop local Supabase
npx supabase status                         # Show local service URLs and keys

# Migrations
npx supabase migration new <name>           # Create empty migration file
npx supabase migration list                 # List migrations and their status
npx supabase db push                        # Push migrations to remote
npx supabase db reset                       # Reset local DB and replay migrations
npx supabase db diff --schema public        # Diff local vs migration state

# Type Generation
npx supabase gen types typescript --project-id <ref> > packages/db/src/database.types.ts
npx supabase gen types typescript --local > packages/db/src/database.types.ts

# Edge Functions
npx supabase functions new <name>           # Create new edge function
npx supabase functions serve                # Serve locally for testing
npx supabase functions deploy <name>        # Deploy to production
npx supabase functions deploy               # Deploy all functions

# Database
npx supabase db dump --schema public        # Dump current schema
npx supabase db seed                        # Run seed.sql
npx supabase db lint                        # Lint SQL for issues

# Storage
npx supabase storage ls                     # List buckets
```

## Code Examples

### Create a migration for clients table

```bash
npx supabase migration new create_clients
```

Then edit the generated file:

```sql
CREATE TABLE public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT,
  company TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD own clients"
  ON public.clients FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Generate types after migration

```bash
npx supabase gen types typescript --project-id <ref> > packages/db/src/database.types.ts
```

### Local dev workflow

```bash
npx supabase start
npx supabase migration new add_projects
# Write SQL, then apply
npx supabase db reset
npx supabase gen types typescript --local > packages/db/src/database.types.ts
# When ready, push to remote
npx supabase db push
```

### Edge Function example

```bash
npx supabase functions new process-invoice
```

```typescript
// supabase/functions/process-invoice/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { invoiceId } = await req.json();
  // Process invoice logic here...

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
```
