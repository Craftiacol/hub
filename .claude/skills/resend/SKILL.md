---
name: resend
description: >
  Manage email sending, React Email templates, and campaigns using Resend SDK.
  Trigger: When implementing email features, notifications, contact forms, or marketing emails.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
---

## When to Use

- Sending transactional emails (contact form, invoices, welcome)
- Creating email templates with React Email
- Setting up email notifications
- Marketing campaigns and newsletters
- Verifying domain for email delivery

## Critical Patterns

### Setup

| Key | Value |
|-----|-------|
| SDK | `resend` (npm package) |
| Free Tier | 100 emails/day, 3000/month |
| Templates | React Email (`@react-email/components`) |
| From Domain | Must be verified in Resend dashboard |

### Environment Variables

| Variable | Where | Usage |
|----------|-------|-------|
| `RESEND_API_KEY` | Server only | API authentication |
| `RESEND_FROM_EMAIL` | Server only | Default sender address |

**NEVER prefix with `NEXT_PUBLIC_`** — email sending is server-side only.

### Architecture in Craftia

```
packages/email/              # Shared email package (if created)
├── src/
│   ├── client.ts           # Resend client factory
│   ├── templates/          # React Email templates
│   │   ├── ContactForm.tsx
│   │   ├── Invoice.tsx
│   │   └── Welcome.tsx
│   └── index.ts

# Or within app features:
apps/web/app/features/landing/emails/
apps/dashboard/src/features/invoicing/emails/
```

## Commands

```bash
# Install
pnpm add resend --filter @craftia/{app}
pnpm add @react-email/components --filter @craftia/{app}
pnpm add react-email -D --filter @craftia/{app}

# Preview templates locally
npx react-email dev --dir apps/web/emails

# Send test email via curl
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"from":"onboarding@resend.dev","to":"test@example.com","subject":"Test","html":"<p>Hello</p>"}'
```

## Code Examples

### Initialize client

```typescript
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
```

### Send from Server Action

```typescript
"use server";

import { Resend } from "resend";
import { ContactFormEmail } from "./emails/ContactFormEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to: ["alvaro@craftia.com.mx"],
    replyTo: email,
    subject: `Contact from ${name}`,
    react: ContactFormEmail({ name, email, message }),
  });

  if (error) return { success: false, error: error.message };
  return { success: true, id: data?.id };
}
```

### React Email template

```typescript
import {
  Html, Head, Body, Container, Text, Button, Hr,
} from "@react-email/components";

interface ContactFormEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactFormEmail({ name, email, message }: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f4f4f5" }}>
        <Container style={{ padding: "20px", maxWidth: "600px" }}>
          <Text style={{ fontSize: "20px", fontWeight: "bold" }}>
            New contact from {name}
          </Text>
          <Text>Email: {email}</Text>
          <Hr />
          <Text>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}
```

### Batch emails

```typescript
const { data, error } = await resend.batch.send([
  { from: "...", to: ["user1@example.com"], subject: "...", react: Template1() },
  { from: "...", to: ["user2@example.com"], subject: "...", react: Template2() },
]);
```

### Domain verification

1. Add domain at https://resend.com/domains
2. Add DNS records (TXT, CNAME) to your domain registrar
3. Verify in dashboard
4. Until verified, use `onboarding@resend.dev` as sender
