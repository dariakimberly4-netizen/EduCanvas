import { expect, test } from "@playwright/test";

test.beforeEach(async ({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "SEO responses are viewport-independent");
});

test("publishes complete homepage metadata and structured data", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(
    "Shapla Grove School & College | Playgroup to Class XII",
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /^https?:\/\/[^/]+\/?$/,
  );
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    "content",
    "website",
  );
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    "content",
    /\/opengraph-image$/,
  );
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
    "content",
    "summary_large_image",
  );
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute(
    "href",
    "/manifest.webmanifest",
  );

  const schemaTypes = await page
    .locator('script[type="application/ld+json"]')
    .evaluateAll((scripts) =>
      scripts.flatMap((script) => {
        const value = JSON.parse(script.textContent ?? "null");
        return (Array.isArray(value) ? value : [value]).flatMap((entry) =>
          Array.isArray(entry?.["@type"]) ? entry["@type"] : [entry?.["@type"]],
        );
      }),
    );

  expect(schemaTypes).toEqual(
    expect.arrayContaining(["WebSite", "EducationalOrganization", "School", "WebPage"]),
  );
});

test("serves crawl directives, sitemap, manifest, and social image", async ({
  request,
}) => {
  const [robots, sitemap, manifest, socialImage] = await Promise.all([
    request.get("/robots.txt"),
    request.get("/sitemap.xml"),
    request.get("/manifest.webmanifest"),
    request.get("/opengraph-image"),
  ]);

  expect(robots.ok()).toBeTruthy();
  const robotsText = await robots.text();
  expect(robotsText).toContain("Disallow: /admin");
  expect(robotsText).toContain("Disallow: /api");
  expect(robotsText).toContain("Sitemap:");

  expect(sitemap.ok()).toBeTruthy();
  const sitemapText = await sitemap.text();
  expect(sitemapText).toContain("<loc>");
  expect(sitemapText).toContain("/faculty</loc>");
  expect(sitemapText).toContain("/notices</loc>");
  expect(sitemapText).not.toContain("/admin");

  expect(manifest.ok()).toBeTruthy();
  expect(await manifest.json()).toMatchObject({
    name: "Shapla Grove School & College",
    display: "standalone",
    start_url: "/",
  });

  expect(socialImage.ok()).toBeTruthy();
  expect(socialImage.headers()["content-type"]).toContain("image/png");
  expect((await socialImage.body()).byteLength).toBeGreaterThan(10_000);
});

test("uses route canonicals and prevents admin indexing", async ({ page }) => {
  await page.goto("/faculty");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/faculty$/,
  );

  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});
