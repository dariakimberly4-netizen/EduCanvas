import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("home page presents the complete school journey", async ({ page }) => {
  await page.route("**/api/admission-enquiries", async (route) => {
    await route.continue({
      headers: {
        ...route.request().headers(),
        "x-e2e-email-token": "playwright-email-delivery-token-2026",
      },
    });
  });

  await expect(page.locator("html")).toHaveAttribute("data-theme", /^(school|madrasha|coaching)$/);
  await expect(page.getByRole("heading", { name: "A complete education from Playgroup to Class XII." })).toBeVisible();
  await expect(page.getByRole("img", { name: /students walking through the school courtyard/i })).toBeVisible();
  await expect(page.getByText("School at a glance")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Find what you need." })).toBeVisible();

  await page.getByRole("link", { name: "Start an admission enquiry" }).click();
  await expect(page.getByRole("heading", { name: "Request admission information" })).toBeVisible();
  await page.getByLabel("Parent or guardian name *").fill("Ayesha Rahman");
  await page.getByLabel("Phone number *").fill("+880 1712 000 000");
  await page.getByLabel("Class you are interested in *").selectOption({ label: "Classes I–V" });
  await page.getByRole("button", { name: "Request a call from admissions" }).click();
  await expect(page.getByRole("button", { name: "Enquiry received" })).toBeVisible();
});

test("faculty filters expose the matching teaching team", async ({ page }) => {
  await page.goto("/faculty");
  await expect(page.getByRole("heading", { name: /Teachers who know every student/i })).toBeVisible();
  await expect(page.locator("#faculty-count")).toHaveText("8 members");

  await page.getByRole("button", { name: "Science" }).click();
  await expect(page.locator("#faculty-count")).toHaveText("3 members");
  await expect(page.getByRole("heading", { name: "Arif Khan" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Nusrat Islam" })).toHaveCount(0);
});

test("documents can be searched, filtered, and reset", async ({ page }) => {
  await page.goto("/notices");
  await expect(page.getByRole("heading", { name: "Official updates, easy to find." })).toBeVisible();
  const search = page.getByPlaceholder("Search by title or category…");
  await search.fill("science fair");
  await expect(page.getByRole("heading", { name: "Inter-house science fair: registration details" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "School closure for Ashura" })).toHaveCount(0);

  await search.fill("does not exist");
  await expect(page.getByRole("heading", { name: "No documents found" })).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(search).toHaveValue("");
  await expect(page.getByRole("heading", { name: "Notices" })).toBeVisible();
});

test("includes the visual tokens for every selectable prototype theme", async ({ page }) => {
  const themes = [
    { id: "school", primary: "#1f5f8b", display: "Merriweather" },
    { id: "madrasha", primary: "#176b51", display: "Newsreader" },
    { id: "coaching", primary: "#3e6682", display: "Sora" },
  ] as const;

  for (const theme of themes) {
    const tokens = await page.evaluate((themeId) => {
      document.documentElement.dataset.theme = themeId;
      const styles = getComputedStyle(document.documentElement);
      return {
        primary: styles.getPropertyValue("--blue").trim(),
        display: styles.getPropertyValue("--serif").trim(),
      };
    }, theme.id);

    expect(tokens.primary).toBe(theme.primary);
    expect(tokens.display).toContain(theme.display);
  }
});

test("mobile navigation remains keyboard and touch accessible", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile-chrome", "Mobile-only navigation assertion");
  const menuButton = page.locator('label[for="nav-toggle"]');
  await menuButton.click();
  await expect(page.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Faculty" }).click();
  await expect(page).toHaveURL(/\/faculty$/);
});
