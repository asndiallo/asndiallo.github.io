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
  for (const path of [
    "/",
    "/work/",
    "/about/",
    "/engineering/",
    "/fr/",
    "/fr/realisations/",
    "/fr/a-propos/",
  ]) {
    expect(paths).toContain(path);
  }
  expect(paths.filter((p) => p.startsWith("/for/")).length).toBeGreaterThanOrEqual(2);
  expect(paths.filter((p) => p.startsWith("/fr/pour/")).length).toBeGreaterThanOrEqual(2);
  expect(paths).not.toContain("/thanks/");
  expect(paths).not.toContain("/fr/merci/");
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

test("every page except /engineering/ exists in English and French", async ({ page }) => {
  for (const path of await sitemapPaths(page)) {
    if (path === "/engineering/") continue;
    await page.goto(path);
    const langs = await page
      .locator('link[rel="alternate"][hreflang]:not([hreflang="x-default"])')
      .evaluateAll((links) => links.map((l) => l.getAttribute("hreflang")).sort());
    expect(langs, path).toEqual(["en", "fr"]);
  }
});

test("language switch links to the same page in the other language", async ({ page }) => {
  await page.goto("/work/isa-african-hair-braiding/");
  await page.getByRole("link", { name: "Lire cette page en français" }).click();
  await expect(page).toHaveURL(/\/fr\/realisations\/isa-african-hair-braiding\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "fr");
  await page.getByRole("link", { name: "Read this page in English" }).click();
  await expect(page).toHaveURL(/\/work\/isa-african-hair-braiding\/$/);
});

test("theme: follows the system, and a saved choice wins and persists", async ({ page }) => {
  const background = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/");
  const systemDark = await background();
  expect(systemDark).not.toBe("rgb(255, 255, 255)");

  const toggle = page.locator("[data-theme-toggle]").first();
  await expect(toggle.getByRole("button", { name: "System" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await toggle.getByRole("button", { name: "Light" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await background()).toBe("rgb(255, 255, 255)");

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(toggle.getByRole("button", { name: "Light" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  await toggle.getByRole("button", { name: "Dark" }).click();
  await page.emulateMedia({ colorScheme: "light" });
  expect(await background()).toBe(systemDark);

  await toggle.getByRole("button", { name: "System" }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", /.+/);
  expect(await background()).toBe("rgb(255, 255, 255)");
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

test("keyboard: first Tab reaches the skip link, and the next Tab lands inside main", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Tab navigation is a desktop check");
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Skip to main content" });
  await expect(skip).toBeFocused();
  await page.keyboard.press("Enter");
  await page.keyboard.press("Tab");
  // Focus skipped the header: the next stop is the first link or button inside <main>.
  expect(await page.evaluate(() => !!document.activeElement?.closest("main"))).toBe(true);
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
