import { expect, test } from "@playwright/test";

test.describe("About Page Interactive Dialog & Navigation Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/about");
  });

  test("clicking a technology badge opens modal dialog with projects and closes via close button", async ({
    page,
  }) => {
    const dialog = page.locator("dialog");
    await expect(dialog).not.toHaveAttribute("open", "");

    // Click the first interactive technology badge in the TechListing section
    const firstTechBadge = page
      .locator("button, [role='button'], div")
      .filter({
        has: page.locator("img"),
      })
      .first();
    await firstTechBadge.click();

    // Verify native dialog opens
    await expect(dialog).toHaveAttribute("open", "");
    await expect(
      dialog.getByRole("heading", { name: /Projects built with/i }),
    ).toBeVisible();

    // Verify projects list contains at least one linked project
    const projectLinks = dialog.locator("ul li a");
    await expect(projectLinks.first()).toBeVisible();

    // Click close button inside dialog to dismiss
    const closeBtn = dialog.locator("button").first();
    await closeBtn.click();

    // Verify dialog is closed
    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("dialog closes when pressing Escape key", async ({ page }) => {
    const dialog = page.locator("dialog");

    // Click a tech badge to open dialog
    const techBadge = page
      .locator("button, [role='button'], div")
      .filter({
        has: page.locator("img"),
      })
      .first();
    await techBadge.click();
    await expect(dialog).toHaveAttribute("open", "");

    // Press Escape
    await page.keyboard.press("Escape");

    // Verify dialog closes
    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("clicking project link inside dialog navigates to project detail page", async ({
    page,
  }) => {
    const dialog = page.locator("dialog");

    const techBadge = page
      .locator("button, [role='button'], div")
      .filter({
        has: page.locator("img"),
      })
      .first();
    await techBadge.click();
    await expect(dialog).toHaveAttribute("open", "");

    const firstProjectLink = dialog.locator("ul li a").first();
    const projectTitle = (await firstProjectLink.textContent())?.trim();

    await firstProjectLink.click();

    // Verify navigation occurred to project detail page
    await expect(page).toHaveURL(/\/projects\/.+/);
    if (projectTitle) {
      await expect(
        page.getByRole("heading", { name: projectTitle, level: 1 }),
      ).toBeVisible();
    }
  });

  test("clicking bio contact link navigates to contact page", async ({
    page,
  }) => {
    const contactLink = page.getByRole("link", {
      name: /please reach out/i,
    });
    await contactLink.click();

    await expect(page).toHaveURL(/\/contact/);
  });
});
