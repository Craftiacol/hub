import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("should scroll to services section when clicking Services link", async ({
    page,
    isMobile,
  }) => {
    test.skip(!!isMobile, "Navigation links are hidden on mobile");
    await page.goto("/");
    await page.getByRole("link", { name: /services/i }).first().click();
    await page.waitForTimeout(500); // smooth scroll
    const services = page.locator("#services");
    await expect(services).toBeInViewport();
  });

  test("should scroll to contact section when clicking CTA", async ({
    page,
  }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /start a project/i }).click();
    await page.waitForTimeout(500);
    const contact = page.locator("#contact");
    await expect(contact).toBeInViewport();
  });

  test("should have footer with copyright", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer).toBeVisible();
    await expect(footer).toContainText("Craftia");
  });
});
