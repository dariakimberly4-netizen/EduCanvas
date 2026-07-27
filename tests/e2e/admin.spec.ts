import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Admin journeys run in the desktop workspace");
  await page.context().addCookies([{
    name: "e2e-admin-session",
    value: "playwright-admin-session-token-2026",
    url: "http://127.0.0.1:3101",
  }]);
  await page.goto("/admin");
  await page.evaluate(() => window.localStorage.clear());
  await page.reload();
});

test("renders the authenticated administrator identity", async ({ page }) => {
  await expect(page.getByText("Playwright Admin", { exact: true })).toBeVisible();
  await expect(page.getByTitle("admin@shaplagrove.test")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
});

test("publishes landing-page content to the public website", async ({ page }) => {
  await page.getByRole("link", { name: "Landing page" }).click();
  await page.getByLabel("Main heading").fill("A complete education, built for every learner.");
  await page.getByRole("button", { name: "Review changes" }).click();
  await expect(page.getByRole("heading", { name: "Publish landing-page updates?" })).toBeVisible();
  await page.getByRole("button", { name: "Publish changes" }).click();
  await expect(page.getByText("Landing page published", { exact: true })).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A complete education, built for every learner." })).toBeVisible();
});

test("adds a faculty member and publishes the profile", async ({ page }) => {
  await page.getByRole("link", { name: "Faculty profiles" }).click();
  await page.getByRole("button", { name: "Add faculty member" }).click();
  await page.getByLabel("Full name *").fill("Maliha Chowdhury");
  await page.getByLabel("Role *").fill("Senior Teacher");
  await page.getByLabel("Department *").selectOption("Science");
  await page.getByLabel("Subject or specialty *").fill("Chemistry");
  await page.getByLabel("Years of experience *").fill("9");
  await page.getByLabel("Short biography").fill("Teaches chemistry through practical investigation.");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile added")).toBeVisible();

  await page.goto("/faculty");
  await expect(page.getByRole("heading", { name: "Maliha Chowdhury" })).toBeVisible();
});

test("publishes a notice and exposes it in document search", async ({ page }) => {
  await page.getByRole("link", { name: "Notices & results" }).click();
  await page.getByRole("button", { name: "Upload PDF" }).click();
  await page.getByLabel("Public title *").fill("Annual sports day schedule");
  await page.getByLabel("Category *").selectOption("Event");
  await page.getByLabel("Publish date *").fill("2026-08-10");
  await page.getByLabel(/Choose a PDF file/).setInputFiles({
    name: "sports-day.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 test"),
  });
  await page.getByLabel(/I checked this document/).check();
  await page.getByRole("button", { name: "Publish document" }).click();
  await expect(page.getByText("Document published")).toBeVisible();

  await page.goto("/notices");
  await page.getByPlaceholder("Search by title or category…").fill("sports day");
  await expect(page.getByRole("heading", { name: "Annual sports day schedule" })).toBeVisible();
});
