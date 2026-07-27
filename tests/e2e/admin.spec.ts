import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Admin journeys run in the desktop workspace");
  await page.context().addCookies([{
    name: "e2e-admin-session",
    value: "playwright-admin-session-token-2026",
    url: "http://127.0.0.1:3101",
  }]);
  const resetResponse = await page.request.post("/api/testing/reset-content");
  expect(resetResponse.ok()).toBe(true);
  await page.goto("/admin");
});

test("renders the authenticated administrator identity", async ({ page }) => {
  await expect(page.getByText("Playwright Admin", { exact: true })).toBeVisible();
  await expect(page.getByTitle("admin@shaplagrove.test")).toBeVisible();
  await expect(
    page.getByRole("img", { name: "Playwright Admin's profile photo" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign out" })).toBeVisible();
  await page.getByRole("button", { name: "Sign out" }).click();
  await expect(
    page.getByRole("heading", { name: "Sign out of EduCanvas?" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(
    page.getByRole("heading", { name: "Sign out of EduCanvas?" }),
  ).not.toBeVisible();
});

test("publishes landing-page content to the public website", async ({ page }) => {
  await page.getByRole("link", { name: "Landing page" }).click();
  await page.getByLabel("Main heading").fill("A complete education, built for every learner.");
  await page
    .locator(".editor-section")
    .filter({ hasText: "Quick actions" })
    .getByLabel("Section heading")
    .fill("Choose your next step.");
  await page
    .getByLabel("Footer summary")
    .fill("A welcoming school community for every stage of learning.");
  await page.getByRole("button", { name: "Review changes" }).click();
  await expect(page.getByRole("heading", { name: "Publish landing-page updates?" })).toBeVisible();
  await page.getByRole("button", { name: "Publish changes" }).click();
  await expect(page.getByText("Landing page published", { exact: true })).toBeVisible();

  await page.goto("/");
  await expect(page.getByRole("heading", { name: "A complete education, built for every learner." })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Choose your next step." }),
  ).toBeVisible();
  await expect(
    page.getByText("A welcoming school community for every stage of learning."),
  ).toBeVisible();
});

test("uploads a carousel image through the storage service", async ({
  page,
}) => {
  await page.getByRole("link", { name: "Landing page" }).click();
  await page.getByLabel(/Choose a landscape image/).setInputFiles({
    name: "science-lab.png",
    mimeType: "image/png",
    buffer: Buffer.from("test-image"),
  });
  await expect(
    page.getByRole("img", { name: "Preview of science-lab.png" }),
  ).toBeVisible();
  await page
    .getByLabel("Slide heading *")
    .fill("Learning through practical discovery");
  await page
    .getByLabel("Supporting line")
    .fill("Science · Technology · Teamwork");
  await page
    .getByLabel("Image description *")
    .fill("Students conducting an experiment in the school laboratory");
  await page.getByRole("button", { name: "Add image to carousel" }).click();
  await expect(page.getByText("Carousel updated", { exact: true })).toBeVisible();

  await page.goto("/");
  await expect(
    page.locator(
      'img[alt="Students conducting an experiment in the school laboratory"]',
    ),
  ).toHaveAttribute("src", /\/api\/assets\//);

  await page.goto("/admin");
  await page.getByRole("link", { name: "Landing page" }).click();
  const slide = page
    .locator(".slide-manager-item")
    .filter({ hasText: "Learning through practical discovery" });
  await slide.getByRole("button", { name: "Remove" }).click();
  const confirmation = page.getByRole("dialog");
  await expect(
    confirmation.getByRole("heading", {
      name: "Remove this carousel image?",
    }),
  ).toBeVisible();
  await expect(
    confirmation.getByText(/image will be deleted from Google Drive/),
  ).toBeVisible();
  await confirmation.getByRole("button", { name: "Cancel" }).click();
  await expect(slide).toBeVisible();

  await slide.getByRole("button", { name: "Remove" }).click();
  await confirmation.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Carousel updated", { exact: true })).toBeVisible();
  await expect(slide).not.toBeVisible();
  await page.getByRole("link", { name: "Overview" }).click();
  await expect(
    page.locator(".activity-list").getByText("Deleted carousel image", {
      exact: true,
    }),
  ).toBeVisible();
});

test("adds a faculty member and publishes the profile", async ({ page }) => {
  await page.getByRole("link", { name: "Faculty profiles" }).click();
  await page.getByRole("button", { name: "Add faculty member" }).click();
  await page.getByLabel("Full name *").fill("Maliha Chowdhury");
  await page.getByLabel("Role *").fill("Senior Teacher");
  await page.getByLabel("Department *").selectOption("Science");
  await page.getByLabel("Subject or specialty *").fill("Chemistry");
  await page.getByLabel("Years of experience *").fill("9");
  await page.getByLabel(/Choose faculty photo/).setInputFiles({
    name: "maliha-chowdhury.png",
    mimeType: "image/png",
    buffer: Buffer.from("faculty-photo"),
  });
  await expect(
    page.getByRole("img", { name: "Preview of maliha-chowdhury.png" }),
  ).toBeVisible();
  await page.getByLabel("Short biography").fill("Teaches chemistry through practical investigation.");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile added")).toBeVisible();
  await page
    .locator(".faculty-manager-row")
    .filter({ hasText: "Maliha Chowdhury" })
    .getByRole("button", { name: "Edit" })
    .click();
  await expect(
    page.getByRole("img", {
      name: "Current faculty photo of Maliha Chowdhury",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("link", { name: "Overview" }).click();
  await expect(
    page.locator(".activity-list").getByText("Created faculty profile", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page.locator(".activity-list").getByText("Maliha Chowdhury", {
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    page
      .locator(".admin-summary article")
      .filter({ hasText: "Faculty profiles" })
      .locator("strong"),
  ).toHaveText("9");

  await page.goto("/faculty");
  await expect(page.getByRole("heading", { name: "Maliha Chowdhury" })).toBeVisible();
  await expect(
    page.getByRole("img", {
      name: "Maliha Chowdhury, Senior Teacher",
    }),
  ).toHaveAttribute("src", /\/api\/assets\//);
});

test("records faculty edits and deletions in recent activity", async ({
  page,
}) => {
  await page.getByRole("link", { name: "Faculty profiles" }).click();
  const hasanRow = page
    .locator(".faculty-manager-row")
    .filter({ hasText: "Hasan Ahmed" });
  await hasanRow.getByRole("button", { name: "Edit" }).click();
  await page.getByLabel("Role *").fill("Academic Lead");
  await page.getByRole("button", { name: "Save profile" }).click();
  await expect(page.getByText("Profile updated", { exact: true })).toBeVisible();

  const sharminRow = page
    .locator(".faculty-manager-row")
    .filter({ hasText: "Sharmin Kabir" });
  await sharminRow.getByRole("button", { name: "Remove" }).click();
  const confirmation = page.getByRole("dialog");
  await expect(
    confirmation.getByRole("heading", { name: "Remove this profile?" }),
  ).toBeVisible();
  await confirmation.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Profile removed", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: "Overview" }).click();
  const activity = page.locator(".activity-list");
  await expect(
    activity.getByText("Edited faculty profile", { exact: true }),
  ).toBeVisible();
  await expect(
    activity.getByText("Deleted faculty profile", { exact: true }),
  ).toBeVisible();
  await expect(activity.getByText("Sharmin Kabir", { exact: true })).toBeVisible();
  await expect(
    page
      .locator(".admin-summary article")
      .filter({ hasText: "Faculty profiles" })
      .locator("strong"),
  ).toHaveText("7");
});

test("records authentication activity with the administrator identity", async ({
  page,
}) => {
  const response = await page.request.post("/api/admin/activity", {
    data: { event: "sign-out" },
  });
  expect(response.ok()).toBe(true);

  await page.reload();
  const activity = page.locator(".activity-list");
  await expect(
    activity.getByText("Administrator signed out", { exact: true }),
  ).toBeVisible();
  await expect(
    activity.getByText(
      "Playwright Admin · admin@shaplagrove.test",
      { exact: true },
    ),
  ).toBeVisible();
});

test("confirms document deletion before removing the PDF", async ({ page }) => {
  await page.getByRole("link", { name: "Notices & results" }).click();
  const documentRow = page
    .locator(".document-manager-row")
    .filter({ hasText: "Half-yearly examination schedule" });
  await documentRow.getByRole("button", { name: "Remove" }).click();

  const confirmation = page.getByRole("dialog");
  await expect(
    confirmation.getByRole("heading", { name: "Remove this document?" }),
  ).toBeVisible();
  await expect(
    confirmation.getByText(/PDF will be deleted from Google Drive/),
  ).toBeVisible();
  await confirmation.getByRole("button", { name: "Cancel" }).click();
  await expect(documentRow).toBeVisible();

  await documentRow.getByRole("button", { name: "Remove" }).click();
  await confirmation.getByRole("button", { name: "Remove" }).click();
  await expect(page.getByText("Document removed", { exact: true })).toBeVisible();
  await expect(documentRow).not.toBeVisible();

  await page.getByRole("link", { name: "Overview" }).click();
  await expect(
    page.locator(".activity-list").getByText("Deleted notice", {
      exact: true,
    }),
  ).toBeVisible();
});

test("publishes a notice and exposes it in document search", async ({ page }) => {
  await page.getByRole("link", { name: "Notices & results" }).click();
  await page.getByRole("button", { name: "Upload PDF" }).click();
  await expect(
    page.getByRole("dialog").getByRole("heading", {
      name: "Upload school document",
    }),
  ).toBeVisible();
  await page.getByLabel("Public title *").fill("Annual sports day schedule");
  await page.getByLabel("Category *").selectOption("Event");
  await page.getByLabel("Publish date *").fill("2026-08-10");
  await page.getByLabel(/Choose a PDF file/).setInputFiles({
    name: "sports-day.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 test"),
  });
  await expect(
    page.getByTitle("PDF preview: sports-day.pdf"),
  ).toBeVisible();
  await page.getByLabel(/I checked this document/).check();
  await page.getByRole("button", { name: "Publish document" }).click();
  await expect(page.getByText("Document published")).toBeVisible();
  await page.getByRole("link", { name: "Overview" }).click();
  await expect(
    page
      .locator(".admin-summary article")
      .filter({ hasText: "Notices" })
      .locator("strong"),
  ).toHaveText("5");
  await expect(
    page.locator(".activity-list").getByText("Created notice", {
      exact: true,
    }),
  ).toBeVisible();

  await page.goto("/notices");
  await page.getByPlaceholder("Search by title or category…").fill("sports day");
  await expect(page.getByRole("heading", { name: "Annual sports day schedule" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Download Annual sports day schedule" }),
  ).toHaveAttribute("href", /\/api\/assets\/.+download=1/);
});
