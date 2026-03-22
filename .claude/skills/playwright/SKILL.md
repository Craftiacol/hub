---
name: playwright
description: >
  Visual verification and E2E testing using Playwright CLI.
  Trigger: When making UI changes, verifying layouts, taking screenshots, or running E2E tests.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
allowed-tools: Bash, Read, Glob, Grep
---

## When to Use

- After any UI change — take a screenshot to VERIFY visually
- Before submitting a PR with visual changes
- When debugging layout or responsive issues
- When user asks to "check", "verify", or "see" the app
- Running E2E test suites
- Accessibility audits

## Critical Patterns

### App URLs (Dev Mode)

| App | URL |
|-----|-----|
| web | `http://localhost:3000` |
| dashboard | `http://localhost:3001` |

### Viewport Sizes

| Device | Size | Flag |
|--------|------|------|
| Mobile | 375x667 | `--viewport-size="375,667"` |
| Tablet | 768x1024 | `--viewport-size="768,1024"` |
| Desktop | 1440x900 | `--viewport-size="1440,900"` |

### Verification Workflow

1. Make UI changes
2. Ensure dev server is running (`pnpm dev --filter @craftia/{app}`)
3. Take screenshot to verify
4. If wrong → fix → screenshot again
5. Run E2E tests before PR

### Test File Conventions

| Convention | Pattern |
|------------|---------|
| Test files | `*.spec.ts` in `tests/` or co-located `__tests__/` |
| Page objects | `tests/pages/{page-name}.page.ts` |
| Fixtures | `tests/fixtures/{name}.fixture.ts` |
| Grouping | Always use `test.describe` blocks |
| Config | `playwright.config.ts` at app root |

## Commands

```bash
# Screenshots
npx playwright screenshot http://localhost:3000 /tmp/verify-home.png
npx playwright screenshot --viewport-size="375,667" http://localhost:3000 /tmp/verify-mobile.png
npx playwright screenshot --viewport-size="768,1024" http://localhost:3000 /tmp/verify-tablet.png
npx playwright screenshot --full-page http://localhost:3000 /tmp/verify-full.png

# Wait for content before screenshot
npx playwright screenshot --wait-for-timeout=3000 http://localhost:3000 /tmp/verify.png

# Open browser for manual inspection
npx playwright open http://localhost:3000

# E2E Tests
npx playwright test                          # Run all tests
npx playwright test {file}                   # Run specific test
npx playwright test --project=chromium       # Chromium only
npx playwright test --grep "{pattern}"       # Filter by test name
npx playwright test --ui                     # Interactive UI mode

# Reports
npx playwright show-report                   # Open HTML report
npx playwright test --reporter=html          # Generate HTML report

# Code generation (record interactions)
npx playwright codegen http://localhost:3000  # Generate test from interactions

# Install/update browsers
npx playwright install chromium              # Install chromium only
npx playwright install                       # Install all browsers
```

## Code Examples

### Basic E2E test

```typescript
import { test, expect } from "@playwright/test";

test.describe("Home Page", () => {
  test("should display hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveTitle(/Craftia/);
  });

  test("should navigate to portfolio", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /portfolio/i }).click();
    await expect(page).toHaveURL(/.*portfolio/);
  });
});
```

### Screenshot verification pattern for agents

```bash
# 1. Start dev server (if not running)
pnpm dev --filter @craftia/web &

# 2. Wait for server to be ready
npx wait-on http://localhost:3000

# 3. Take screenshots at all viewports
npx playwright screenshot http://localhost:3000 /tmp/desktop.png
npx playwright screenshot --viewport-size="375,667" http://localhost:3000 /tmp/mobile.png

# 4. Read the screenshots to verify visually
# (use Read tool on /tmp/desktop.png and /tmp/mobile.png)
```

### Accessibility check with axe

```typescript
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("should pass accessibility checks", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```
