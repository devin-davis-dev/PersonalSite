import { expect, test } from "@playwright/test";

test.describe("Contact Page Behavior", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/contact");
  });

  test("clicking quick template button populates and toggles form fields", async ({
    page,
  }) => {
    const resumePresetBtn = page.getByRole("button", {
      name: "Request Resume & References",
    });
    const subjectInput = page.getByPlaceholder("Subject...");
    const messageInput = page.getByPlaceholder("Message...");

    // Click to apply template
    await resumePresetBtn.click();
    await expect(subjectInput).toHaveValue("Request for Resume and References");
    await expect(messageInput).toHaveValue(
      /I came across your portfolio and would love to review your detailed resume/i,
    );

    // Click again to toggle off / clear
    await resumePresetBtn.click();
    await expect(subjectInput).toHaveValue("");
    await expect(messageInput).toHaveValue("");
  });

  test("clicking sidebar contact form link highlights form and selects resume template", async ({
    page,
  }) => {
    const sidebarLink = page.getByRole("link", { name: "contact form" });
    const subjectInput = page.getByPlaceholder("Subject...");

    // Clicking the inline sidebar link focuses/highlights the form and applies the resume preset
    await sidebarLink.click();
    await expect(subjectInput).toHaveValue("Request for Resume and References");
  });

  test("pre-fills form when intent query param is present in URL", async ({
    page,
  }) => {
    await page.goto("/contact?intent=fulltime");

    await expect(page.getByPlaceholder("Subject...")).toHaveValue(
      "Full-Time Engineering Opportunity",
    );
    await expect(page.getByPlaceholder("Message...")).toHaveValue(
      /reaching out regarding a full-time Software Product Engineer role/i,
    );
  });

  test("validates required fields before allowing submission", async ({
    page,
  }) => {
    const submitBtn = page.getByRole("button", { name: "SEND" });

    // Submit with empty fields
    await submitBtn.click();

    // The form should not navigate away or show success state
    await expect(page.getByPlaceholder("Email Address...")).toBeVisible();
    await expect(page.getByText("Thank you for the email!")).not.toBeVisible();
  });

  test("successfully submits form, displays success screen, and copies PGP key to clipboard", async ({
    context,
    page,
  }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);

    // Intercept contact form POST submission
    await page.route("**/contact", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 200,
          contentType: "text/plain",
          body: "OK",
        });
      } else {
        await route.continue();
      }
    });

    // Mock PGP public key endpoint
    const mockPgpKey =
      "-----BEGIN PGP PUBLIC KEY BLOCK-----\nmock-key\n-----END PGP PUBLIC KEY BLOCK-----";
    await page.route("**/pgp-key.asc", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "text/plain",
        body: mockPgpKey,
      });
    });

    await page
      .getByPlaceholder("Email Address...")
      .fill("recruiter@example.com");
    await page
      .getByRole("button", { name: "Request Resume & References" })
      .click();

    await page.getByRole("button", { name: "SEND" }).click();

    // Verify success confirmation view replaces form
    await expect(page.getByText("Thank you for the email!")).toBeVisible();
    await expect(
      page.getByText("I'll be in touch with you shortly."),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Back Home" })).toBeVisible();

    // Test Copy PGP button interaction and clipboard write
    await page.getByRole("button", { name: /Copy PGP/i }).click();
    await expect(page.getByText("PGP key copied to clipboard!")).toBeVisible();

    const clipboardText = await page.evaluate(() =>
      navigator.clipboard.readText(),
    );
    expect(clipboardText).toBe(mockPgpKey);
  });

  test("displays error toast and retains input when submission fails", async ({
    page,
  }) => {
    // Intercept contact form POST submission and return error
    await page.route("**/contact", async (route) => {
      if (route.request().method() === "POST") {
        await route.fulfill({
          status: 500,
          contentType: "text/plain",
          body: "Internal Server Error",
        });
      } else {
        await route.continue();
      }
    });

    await page.getByPlaceholder("Email Address...").fill("client@example.com");
    await page.getByPlaceholder("Subject...").fill("Urgent consultation");
    await page
      .getByPlaceholder("Message...")
      .fill("We have an immediate project need.");

    await page.getByRole("button", { name: "SEND" }).click();

    // Verify error toast appears and form contents are preserved
    await expect(
      page.getByText("Oops! We couldn't send your email. Please try again."),
    ).toBeVisible();
    await expect(page.getByPlaceholder("Email Address...")).toHaveValue(
      "client@example.com",
    );
    await expect(page.getByPlaceholder("Subject...")).toHaveValue(
      "Urgent consultation",
    );
    await expect(page.getByPlaceholder("Message...")).toHaveValue(
      "We have an immediate project need.",
    );
  });
});
