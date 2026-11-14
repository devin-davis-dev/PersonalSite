import { expect, test } from "@playwright/test";

test.describe("Home Page Interactive Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("toggles hero tooltip popover open and closed on click", async ({
    page,
  }) => {
    const tooltipBtn = page.getByRole("button", {
      name: /more information/i,
    });
    const tooltipPopover = page.locator(".tooltip");

    // Initially tooltip popover is hidden
    await expect(tooltipPopover).toHaveCount(0);

    // Click tooltip button to toggle open
    await tooltipBtn.click();
    await expect(tooltipPopover).toBeVisible();
    await expect(tooltipPopover).toHaveCSS("opacity", "1");

    // Click again to toggle closed
    await tooltipBtn.click();
    await expect(tooltipPopover).toHaveCSS("opacity", "0");
  });

  test("clicking learn more link in intro navigates to about page", async ({
    page,
  }) => {
    const learnMoreLink = page.getByRole("link", { name: /learn more/i });
    await learnMoreLink.click();

    await expect(page).toHaveURL(/\/about/);
    await expect(
      page.getByRole("heading", { name: "Let's Talk About Me", level: 1 }),
    ).toBeVisible();
  });

  test("clicking reach out link in intro navigates to contact page", async ({
    page,
  }) => {
    const reachOutLink = page.getByRole("link", { name: /reach out/i });
    await reachOutLink.click();

    await expect(page).toHaveURL(/\/contact/);
    await expect(
      page.getByRole("heading", { name: "Let's Talk About You", level: 1 }),
    ).toBeVisible();
  });

  test("clicking view button on a recent project navigates to that project", async ({
    page,
  }) => {
    const firstProjectHeading = page.locator("section h2").first();
    const projectTitle = (await firstProjectHeading.textContent())?.trim();

    const viewButton = page.locator(".secondary-btn").first();
    await viewButton.click();

    await expect(page).toHaveURL(/\/projects\/.+/);
    if (projectTitle) {
      await expect(
        page.getByRole("heading", { name: projectTitle, level: 1 }),
      ).toBeVisible();
    }
  });

  test("clicking bottom Call To Action button navigates to contact page", async ({
    page,
  }) => {
    const ctaButton = page.getByRole("button", { name: /Contact Devin/i });
    await ctaButton.click();

    await expect(page).toHaveURL(/\/contact/);
  });
});
