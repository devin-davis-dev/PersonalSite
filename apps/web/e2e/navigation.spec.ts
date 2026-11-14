import { expect, test } from "@playwright/test";

test.describe("Global Navigation & Mobile Drawer Behavior", () => {
  test("desktop navbar links navigate to respective routes", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    // Click 'About' link in desktop header
    const aboutLink = page.getByRole("link", { name: "About", exact: true });
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about/);

    // Click 'Projects' link in desktop header
    const projectsLink = page.getByRole("link", {
      name: "Projects",
      exact: true,
    });
    await projectsLink.click();
    await expect(page).toHaveURL(/\/projects/);

    // Click 'Posts' link in desktop header
    const postsLink = page.getByRole("link", { name: "Posts", exact: true });
    await postsLink.click();
    await expect(page).toHaveURL(/\/posts/);

    // Click 'Contact' link in desktop header
    const contactLink = page.getByRole("link", {
      name: "Contact",
      exact: true,
    });
    await contactLink.click();
    await expect(page).toHaveURL(/\/contact/);

    // Click brand logo to return home
    const brandLogoLink = page.locator("nav").getByRole("link").first();
    await brandLogoLink.click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("mobile viewport toggles SideNav drawer open, close, and navigates", async ({
    page,
  }) => {
    // Set mobile viewport where hamburger is active
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Locate drawer container
    const sideNavDrawer = page
      .locator("nav")
      .locator("div")
      .filter({ hasText: /Navigation/i })
      .first();

    // Verify drawer is initially positioned off-screen
    await expect(sideNavDrawer).toHaveCSS("left", "-375px");

    // Click hamburger button to open drawer
    const hamburgerBtn = page
      .locator("nav .nav-triangle ~ div, nav [class*='hamburger']")
      .or(
        page
          .locator("nav")
          .locator("xpath=//div[count(div)=3 and not(text())]"),
      )
      .first();
    await hamburgerBtn.click();

    // Verify drawer slides open into view (left: 0px)
    await expect(sideNavDrawer).toHaveCSS("left", "0px");

    // Click CloseButton inside drawer to dismiss
    const closeBtn = sideNavDrawer.locator("button").first();
    await closeBtn.click();

    // Verify drawer slides back off-screen
    await expect(sideNavDrawer).toHaveCSS("left", "-375px");

    // Reopen drawer and click a navigation link
    await hamburgerBtn.click();
    await expect(sideNavDrawer).toHaveCSS("left", "0px");

    const drawerProjectsLink = sideNavDrawer.getByRole("link", {
      name: /Projects/i,
    });
    await drawerProjectsLink.click();

    // Verify navigation occurred and drawer closed
    await expect(page).toHaveURL(/\/projects/);
    await expect(sideNavDrawer).toHaveCSS("left", "-375px");
  });
});
