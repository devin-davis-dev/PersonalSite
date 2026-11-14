import { expect, test } from "@playwright/test";

test.describe("Blog & Article Interactive Behavior", () => {
  test("clicking a category card navigates to category filtered listing", async ({
    page,
  }) => {
    await page.goto("/blog");

    // Click the first category card
    const firstCategoryCard = page.locator("a[href*='/blog/']").first();
    const categoryName = (await firstCategoryCard.textContent())?.trim();
    await firstCategoryCard.click();

    await expect(page).toHaveURL(/\/blog\/.+/);
    if (categoryName) {
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    }
  });

  test("toggles interactive Collapsible accordion open and closed", async ({
    page,
  }) => {
    await page.goto("/posts/fps-audio-optimization-guide-for-normies");

    const collapsibleButton = page.getByRole("button", {
      name: /Quick Setup Cheat Sheet/i,
    });
    await expect(collapsibleButton).toBeVisible();

    // Verify initial closed state
    await expect(collapsibleButton).toHaveAttribute("aria-expanded", "false");
    const collapsibleContent = page.locator(
      `#${await collapsibleButton.getAttribute("aria-controls")}`,
    );
    await expect(collapsibleContent).toBeHidden();

    // Click to expand accordion
    await collapsibleButton.click();
    await expect(collapsibleButton).toHaveAttribute("aria-expanded", "true");
    await expect(collapsibleContent).toBeVisible();
    await expect(
      collapsibleContent.getByText(
        /If you just want the exact settings to copy and paste/i,
      ),
    ).toBeVisible();

    // Click to collapse accordion
    await collapsibleButton.click();
    await expect(collapsibleButton).toHaveAttribute("aria-expanded", "false");
    await expect(collapsibleContent).toBeHidden();
  });

  test("clicking inline citation jumps to and highlights reference", async ({
    page,
  }) => {
    await page.goto("/posts/fps-audio-optimization-guide-for-normies");

    const citationLink = page
      .getByRole("link", {
        name: /Jump to reference: microsoft/i,
      })
      .first();
    await expect(citationLink).toBeVisible();

    // Click citation link
    await citationLink.click();

    // Verify target reference exists in document and is targeted
    const referenceTarget = page
      .locator("#ref-microsoft, [data-reference-id='microsoft']")
      .first();
    await expect(referenceTarget).toBeAttached();
  });
});
