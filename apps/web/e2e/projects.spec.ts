import { expect, test } from "@playwright/test";

test.describe("Projects Page Filter & Navigation Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/projects");
  });

  test("filters project cards by status when clicking FilterBar buttons", async ({
    page,
  }) => {
    const cardHeadings = page.locator("section h2");
    const totalCount = await cardHeadings.count();
    expect(totalCount).toBeGreaterThan(0);

    // Click 'In Progress' filter
    const inProgressFilter = page.getByRole("button", {
      name: "In Progress",
      exact: true,
    });
    await inProgressFilter.click();

    // Verify all remaining cards have in-progress badge and none have complete badge
    const inProgressCount = await cardHeadings.count();
    expect(inProgressCount).toBeLessThanOrEqual(totalCount);
    await expect(page.getByText("COMPLETE")).toHaveCount(0);

    // Click 'Complete' filter
    const completeFilter = page.getByRole("button", {
      name: "Complete",
      exact: true,
    });
    await completeFilter.click();

    // Verify all remaining cards have complete badge and none have in-progress badge
    const completeCount = await cardHeadings.count();
    expect(completeCount).toBeGreaterThan(0);
    await expect(page.getByText("IN PROGRESS")).toHaveCount(0);

    // Click 'All' filter to restore full list
    const allFilter = page.getByRole("button", { name: "All", exact: true });
    await allFilter.click();

    const restoredCount = await cardHeadings.count();
    expect(restoredCount).toBe(totalCount);
  });

  test("clicking project card view button navigates to project detail page", async ({
    page,
  }) => {
    const firstProjectHeading = page.locator("section h2").first();
    const firstProjectTitle = (await firstProjectHeading.textContent())?.trim();

    // Click the first project's View button
    const firstViewBtn = page.locator(".secondary-btn").first();
    await firstViewBtn.click();

    // Verify URL navigated to the project detail page
    await expect(page).toHaveURL(/\/projects\/.+/);

    // Verify heading on detail page matches the selected project
    if (firstProjectTitle) {
      await expect(
        page.getByRole("heading", { name: firstProjectTitle, level: 1 }),
      ).toBeVisible();
    }
  });

  test("clicking CTA button navigates to contact page", async ({ page }) => {
    const ctaButton = page.getByRole("button", { name: /Contact Devin/i });
    await ctaButton.click();

    await expect(page).toHaveURL(/\/contact/);
    await expect(
      page.getByRole("heading", { name: "Let's Talk About You", level: 1 }),
    ).toBeVisible();
  });
});
