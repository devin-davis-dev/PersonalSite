const { test, expect } = require("@playwright/test");

test.describe("Hero section layout", () => {
  test("matches screenshot", async ({ page }) => {
    await page.goto("/");
    const heroSection = page.locator("[data-testid='hero']");
    await heroSection.waitFor({ state: "visible" });
    await expect(heroSection).toHaveScreenshot("hero.png", {
      maxDiffPixelRatio: 0.01,
    });
  });
});
