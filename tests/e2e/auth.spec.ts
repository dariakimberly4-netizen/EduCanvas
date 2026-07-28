import { expect, test } from "@playwright/test";

test("redirects unauthenticated staff to the Google login page", async ({ page }) => {
  await page.goto("/admin");

  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Sign in to continue" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Continue with Google" })).toBeVisible();
  await expect(page.getByText("No separate password to remember")).toBeVisible();
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
