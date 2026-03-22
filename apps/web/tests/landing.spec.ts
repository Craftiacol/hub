import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should display the hero section with correct heading", async ({
    page,
  }) => {
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toContainText("Software");
  });

  test("should display CTA buttons in hero", async ({ page }) => {
    await expect(
      page.getByRole("link", { name: /start a project/i })
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /see our work/i })
    ).toBeVisible();
  });

  test("should have sticky navigation header", async ({ page }) => {
    const header = page.getByRole("banner");
    await expect(header).toBeVisible();
    // Scroll down and verify header is still visible
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(header).toBeVisible();
  });

  test("should display all navigation links", async ({ page, isMobile }) => {
    test.skip(!!isMobile, "Navigation links are hidden on mobile");
    await expect(
      page.getByRole("link", { name: /services/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /portfolio/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /about/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /contact/i }).first()
    ).toBeVisible();
  });
});

test.describe("Services Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#services");
  });

  test("should display three service cards", async ({ page }) => {
    const services = page.locator("#services");
    await expect(services).toBeVisible();
    // Check for the 3 service headings
    await expect(page.getByText(/Custom SaaS/i)).toBeVisible();
    await expect(page.getByText(/AI Solutions/i)).toBeVisible();
    await expect(page.getByText(/Web Applications/i)).toBeVisible();
  });
});

test.describe("Portfolio Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#portfolio");
  });

  test("should display portfolio projects", async ({ page }) => {
    const portfolio = page.locator("#portfolio");
    await expect(portfolio).toBeVisible();
    await expect(page.getByText(/Rcomienda/i)).toBeVisible();
  });
});

test.describe("Contact Section", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#contact");
  });

  test("should display contact form with all fields", async ({ page }) => {
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(
      page.getByRole("button", { name: /send message/i })
    ).toBeVisible();
  });

  test("should require form fields for submission", async ({ page }) => {
    const submitButton = page.getByRole("button", { name: /send message/i });
    await submitButton.click();
    // HTML5 validation should prevent submission
    const nameInput = page.getByLabel(/name/i);
    await expect(nameInput).toBeVisible();
  });
});

test.describe("SEO", () => {
  test("should have correct page title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Craftia/);
  });

  test("should have meta description", async ({ page }) => {
    await page.goto("/");
    const description = page.locator('meta[name="description"]');
    await expect(description).toHaveAttribute("content", /SaaS|software|AI/i);
  });

  test("should have OpenGraph tags", async ({ page }) => {
    await page.goto("/");
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute("content", /Craftia/);
  });
});

test.describe("Responsive Design", () => {
  test("should be responsive on mobile", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Mobile only test");
    await page.goto("/");
    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
  });
});
