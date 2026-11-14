import { expect, test } from "@playwright/test";

test.describe("Home Page", () => {
  test("loads the landing page successfully", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Devin Davis/i);
    await expect(page.locator('[data-testid="hero"]')).toBeVisible();
  });
});
