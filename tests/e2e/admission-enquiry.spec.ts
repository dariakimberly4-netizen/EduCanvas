import { expect, test } from "@playwright/test";

test("rejects invalid admission data at the API boundary", async ({
  request,
}) => {
  const response = await request.post("/api/admission-enquiries", {
    data: {
      guardianName: "A",
      phone: "invalid",
      classLevel: "Unknown class",
    },
  });

  expect(response.status()).toBe(422);
  await expect(response.json()).resolves.toMatchObject({
    ok: false,
    fieldErrors: {
      guardianName: expect.any(String),
      phone: expect.any(String),
      classLevel: expect.any(String),
    },
  });
});

test("renders and accepts a valid admission email for Resend delivery", async ({
  request,
}) => {
  const response = await request.post("/api/admission-enquiries", {
    headers: {
      "x-e2e-email-token": "playwright-email-delivery-token-2026",
    },
    data: {
      guardianName: "Ayesha Rahman",
      phone: "+880 1712 000 000",
      classLevel: "Classes I–V",
      website: "",
    },
  });

  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ ok: true });
});

test("shows a useful error when email delivery fails", async ({ page }) => {
  await page.route("**/api/admission-enquiries", async (route) => {
    await route.fulfill({
      status: 502,
      contentType: "application/json",
      body: JSON.stringify({
        ok: false,
        message: "We could not send your enquiry right now.",
      }),
    });
  });

  await page.goto("/");
  await page.getByLabel("Parent or guardian name *").fill("Ayesha Rahman");
  await page.getByLabel("Phone number *").fill("+880 1712 000 000");
  await page
    .getByLabel("Class you are interested in *")
    .selectOption({ label: "Classes I–V" });
  await page
    .getByRole("button", { name: "Request a call from admissions" })
    .click();

  await expect(page.locator(".form-status[role='alert']")).toHaveText(
    "We could not send your enquiry right now.",
  );
  await expect(
    page.getByRole("button", { name: "Request a call from admissions" }),
  ).toBeEnabled();
});
