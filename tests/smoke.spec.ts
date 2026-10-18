import { expect, type Page, test } from "@playwright/test";

const SITE = "https://asndiallo.github.io";

/** Indexable pages come from the sitemap, so new pages are covered automatically. */
async function sitemapPaths(page: Page): Promise<string[]> {
  const res = await page.request.get("/sitemap.xml");
  expect(res.ok()).toBe(true);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1] ?? "").pathname);
}

test("sitemap lists the core pages", async ({ page }) => {
  const paths = await sitemapPaths(page);
  for (const path of ["/", "/work/", "/about/", "/engineering/"]) expect(paths).toContain(path);
  expect(paths.filter((p) => p.startsWith("/for/")).length).toBeGreaterThanOrEqual(2);
  expect(paths).not.toContain("/thanks/");
});

test("every page has one h1, unique title and description, canonical, and no console errors", async ({
  page,
}) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const errors: string[] = [];
  page.on(
    "console",
    (msg) => msg.type() === "error" && errors.push(`${page.url()}: ${msg.text()}`),
  );
  page.on("pageerror", (err) => errors.push(`${page.url()}: ${err.message}`));

  for (const path of await sitemapPaths(page)) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page.locator("html"), path).toHaveAttribute("lang", /^(en|fr)$/);

    const title = await page.title();
    expect(title.length, `${path} title length`).toBeGreaterThan(10);
    expect(title.length, `${path} title length`).toBeLessThanOrEqual(60);
    expect(titles.has(title), `${path} duplicate title`).toBe(false);
    titles.add(title);

    const description =
      (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(description.length, `${path} description length`).toBeGreaterThan(50);
    expect(description.length, `${path} description length`).toBeLessThanOrEqual(160);
    expect(descriptions.has(description), `${path} duplicate description`).toBe(false);
    descriptions.add(description);

    await expect(page.locator('link[rel="canonical"]'), path).toHaveAttribute(
      "href",
      `${SITE}${path}`,
    );
    await expect(page.locator('meta[property="og:image"]'), path).toHaveAttribute(
      "content",
      /og-default\.png$/,
    );

    // Every image has alt text (empty alt is allowed for decorative images, missing is not).
    expect(await page.locator("img:not([alt])").count(), `${path} img without alt`).toBe(0);
  }
  expect(errors).toEqual([]);
});

test("hreflang alternates point at pages that exist", async ({ page }) => {
  for (const path of await sitemapPaths(page)) {
    await page.goto(path);
    const hrefs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((links) => links.map((l) => l.getAttribute("href") ?? ""));
    for (const href of hrefs) {
      const res = await page.request.get(new URL(href).pathname);
      expect(res.status(), `${path} → ${href}`).toBe(200);
    }
  }
});

test("home has the WhatsApp CTA and ProfessionalService JSON-LD without an address", async ({
  page,
}) => {
  await page.goto("/");
  const ctas = page.locator('[data-cta="whatsapp"]');
  expect(await ctas.count()).toBeGreaterThanOrEqual(3);
  const href = await ctas.first().getAttribute("href");
  if (href) expect(href).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);

  const json = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(json ?? "[]") as Record<string, unknown>[];
  const business = data.find((d) => d["@type"] === "ProfessionalService");
  expect(business).toBeDefined();
  expect(business?.areaServed).toBeTruthy();
  expect(JSON.stringify(data)).not.toMatch(/"address"|streetAddress|"telephone"/);
});

test("keyboard: first Tab reaches the skip link, which moves focus to main", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Tab navigation is a desktop check");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
});

test("no horizontal scroll on a small phone", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  for (const path of await sitemapPaths(page)) {
    await page.goto(path);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow, path).toBeLessThanOrEqual(0);
  }
});

test("404, robots.txt, and the old /about.html", async ({ page }) => {
  const missing = await page.goto("/no-such-page/");
  expect(missing?.status()).toBe(404);
  await expect(page.locator("h1")).toHaveText("Page not found");

  const robots = await page.request.get("/robots.txt");
  expect(await robots.text()).toContain(`Sitemap: ${SITE}/sitemap.xml`);

  await page.goto("/about.html");
  await expect(page).toHaveURL(/\/about\/$/);
});

test("nothing personal is published", async ({ page }) => {
  for (const path of [...(await sitemapPaths(page)), "/404.html"]) {
    await page.goto(path);
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of [
      "army",
      "military",
      "veteran",
      "sergeant",
      "savannah, ga 314",
      "***REMOVED***",
      "***REMOVED***",
    ]) {
      expect(text, `${path} contains "${banned}"`).not.toContain(banned);
    }
  }
  // The email is assembled in the browser; it must never be in the served HTML (scraper spam).
  for (const path of await sitemapPaths(page)) {
    const html = await (await page.request.get(path)).text();
    expect(html, path).not.toMatch(/[\w.+-]+@[\w-]+\.[a-z]{2,}/i);
  }
  await page.goto("/");
  await expect(page.locator("a[data-email]")).toHaveAttribute("href", /^mailto:/);

  const resume = await page.request.get("/assets/docs/assane_diallo_software_engineer_cv.pdf");
  expect(resume.status()).toBe(404);
});
