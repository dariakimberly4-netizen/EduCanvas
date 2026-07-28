import { expect, test } from "@playwright/test";

test("redirects unauthenticated staff to the Google login page", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in to continue" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByText("No separate password to remember")).toBeVisible();
});

test("explains how to recover when the OAuth state cookie is missing", async ({
  page,
}) => {
  await page.goto("/admin/login?error=state_mismatch");

  await expect(
    page.getByText(
      "Your sign-in cookie was not returned. Allow cookies for this website, close any other Google sign-in tabs, and try again.",
    ),
  ).toBeVisible();
});

test("moves Google sign-in to the configured canonical origin", async ({
  page,
}) => {
  await page.goto("http://localhost:3101/admin/login");
  await page.getByRole("button", { name: "Continue with Google" }).click();

  await expect(page).toHaveURL(
    "http://127.0.0.1:3101/admin/login?error=origin-mismatch",
  );
  await expect(
    page.getByText(
      "Google sign-in must start from this website address. You are now at the correct address; try again.",
    ),
  ).toBeVisible();
});

test("rejects unauthenticated content and file mutations", async ({
  request,
}) => {
  const contentResponse = await request.put("/api/content", { data: {} });
  expect(contentResponse.status()).toBe(401);

  const fileResponse = await request.post("/api/admin/files");
  expect(fileResponse.status()).toBe(401);

  const enquiriesResponse = await request.get("/api/admission-enquiries");
  expect(enquiriesResponse.status()).toBe(401);
});
