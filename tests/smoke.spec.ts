import { type BrowserContext, expect, type Page, test } from "@playwright/test";
import { SITE_URL as SITE } from "../src/config.ts";

/**
 * Cloudflare's analytics beacon ships in every page. Tests answer it locally with an empty
 * script, so they never wait on (or fail because of) Cloudflare's servers.
 */
const stubAnalytics = (context: BrowserContext) =>
  context.route(/cloudflareinsights\.com/, (route) =>
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" }),
  );

test.beforeEach(async ({ context }) => {
  await stubAnalytics(context);
});

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
    // Link preview: the default card, or a case study's own screenshot. Either way, it loads.
    const ogImage = (await page.locator('meta[property="og:image"]').getAttribute("content")) ?? "";
    expect(ogImage, path).toMatch(new RegExp(`^${SITE}/.+\\.(png|jpg)$`));
    expect((await page.request.get(ogImage.slice(SITE.length))).status(), path).toBe(200);

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

test("theme toggle is laid out before its script runs, so it never shifts the page", async ({
  page,
}) => {
  // Serve the page without its bundled module scripts: only the head script runs.
  await page.route("/", async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace(/<script type="module"[\s\S]*?<\/script>/g, "");
    await route.fulfill({ response, body });
  });
  await page.goto("/");
  await expect(page.locator("[data-theme-toggle]").first()).toBeVisible();
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

test("only the canonical domain is used: no github.io URLs in pages, sitemap, or robots", async ({
  page,
}) => {
  for (const path of [...(await sitemapPaths(page)), "/sitemap.xml", "/robots.txt"]) {
    const body = await (await page.request.get(path)).text();
    expect(body, path).not.toContain("github.io");
  }
});

test("security and cache headers, and a strict hash-based CSP", async ({ page }) => {
  const res = await page.request.get("/");
  const h = res.headers();
  expect(h["strict-transport-security"]).toContain("max-age=31536000");
  expect(h["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["referrer-policy"]).toBe("strict-origin-when-cross-origin");

  const html = await res.text();
  const csp = /<meta http-equiv="content-security-policy" content="([^"]+)"/.exec(html)?.[1] ?? "";
  expect(csp).toMatch(/script-src 'self'[^;]* 'sha256-/);
  expect(csp).not.toContain("unsafe-inline");

  // Cloudflare Web Analytics ships in the page as an external script, allowed by host.
  expect(html).toContain('src="https://static.cloudflareinsights.com/beacon.min.js"');
  expect(csp).toContain("https://static.cloudflareinsights.com");

  const asset = /\/_astro\/[^"]+\.css/.exec(html)?.[0];
  expect(asset).toBeTruthy();
  const cached = await page.request.get(asset ?? "");
  expect(cached.headers()["cache-control"]).toContain("immutable");
});

test("old /about.html is a real 301 to /about/", async ({ page }) => {
  const res = await page.request.get("/about.html", { maxRedirects: 0 });
  expect(res.status()).toBe(301);
  expect(res.headers().location).toMatch(/\/about\/$/);
});

test("links inside sentences keep their spaces", async ({ page }) => {
  // Astro drops a line break between a text expression and a tag, gluing words to links.
  for (const path of await sitemapPaths(page)) {
    await page.goto(path);
    const glued = await page.evaluate(() =>
      [...document.querySelectorAll("main a, footer a")].flatMap((a) => {
        // Only text touching the link matters; neighbouring elements (buttons, blocks) don't.
        const text = (node: ChildNode | null) =>
          node?.nodeType === Node.TEXT_NODE ? (node.textContent ?? "") : "";
        const before = text(a.previousSibling);
        const after = text(a.nextSibling);
        const bad = /[\p{L}\p{N}?!.,:;)»]$/u.test(before) || /^[\p{L}\p{N}(]/u.test(after);
        return bad ? [`${before.slice(-20)}[${a.textContent}]${after.slice(0, 20)}`] : [];
      }),
    );
    expect(glued, path).toEqual([]);
  }
});

test("external links open in a new tab, safely, with a screen-reader hint", async ({ page }) => {
  const siteHost = new URL(SITE).host;
  for (const path of await sitemapPaths(page)) {
    await page.goto(path);
    const wrong = await page.locator("a[href^='http']").evaluateAll(
      (links, host) =>
        links
          .filter((a) => new URL(a.getAttribute("href") ?? "").host !== host)
          .filter(
            (a) =>
              a.getAttribute("target") !== "_blank" ||
              !(a.getAttribute("rel") ?? "").includes("noopener") ||
              !a.querySelector(".sr-only"),
          )
          .map((a) => a.getAttribute("href")),
      siteHost,
    );
    expect(wrong, path).toEqual([]);
  }
});

test("prices read with spaces, in both languages", async ({ page }) => {
  // Astro drops line breaks between tags; a glued price ("$79a month") is easy to miss.
  for (const [path, pattern] of [
    ["/", /\$\d[\d,]* setup \+ \$\d[\d,]* a month/],
    ["/fr/", /\d[\d\s]*\u00a0\$ de mise en place \+ \d[\d\s]*\u00a0\$ par mois/],
  ] as const) {
    await page.goto(path);
    const text = (await page.locator("#pricing article").first().textContent())?.replace(
      /\s+/g,
      (m) => (m.includes("\u00a0") ? "\u00a0" : " "),
    );
    expect(text, path).toMatch(pattern);
  }
});

test("no draft case study is published", async ({ page }) => {
  // Production builds leave out draft: true entries (only PR previews include them).
  for (const path of await sitemapPaths(page)) {
    await page.goto(path);
    await expect(page.locator("[data-draft]"), path).toHaveCount(0);
  }
});

test("client quotes and results are shown with the relationship disclosure", async ({ page }) => {
  // A family quote or result without "is my cousin" nearby would mislead (FTC endorsement rules).
  let quotes = 0;
  const proof = "[data-testimonial], [data-highlight]";
  for (const path of await sitemapPaths(page)) {
    await page.goto(path);
    const missing = await page.locator(proof).evaluateAll((figures) => {
      // On a card the disclosure sits under the business name; elsewhere, inside the element.
      return figures.filter((f) => !(f.closest("article") ?? f).querySelector("[data-disclosure]"))
        .length;
    });
    quotes += await page.locator(proof).count();
    expect(missing, path).toBe(0);
  }
  expect(quotes).toBeGreaterThan(0);
});

test("the headline result shows on its vertical page, linked to the case study", async ({
  page,
}) => {
  for (const path of ["/for/braiding-salons/", "/fr/pour/salons-de-tresses/"]) {
    await page.goto(path);
    const link = page.locator("[data-highlight] a").first();
    await expect(link, path).toBeVisible();
    expect((await page.request.get((await link.getAttribute("href")) ?? "")).status(), path).toBe(
      200,
    );
  }
});

test("photo of Assane on the about page and the home page, loaded and described", async ({
  page,
}) => {
  for (const path of ["/about/", "/fr/a-propos/", "/", "/fr/"]) {
    await page.goto(path);
    const photo = page.locator('img[alt^="Assane Diallo"]');
    await photo.scrollIntoViewIfNeeded();
    await expect(photo, path).toHaveCount(1);
    await expect
      .poll(() => photo.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0))
      .toBe(true);
  }
});

test.describe("home page follows the device language", () => {
  for (const [deviceLocale, expected] of [
    ["fr-FR", "/fr/"],
    ["fr-CA", "/fr/"],
    ["en-US", "/"],
    ["es-ES", "/"], // unsupported: English
  ] as const) {
    test(`${deviceLocale} → ${expected}`, async ({ browser }) => {
      const context = await browser.newContext({ locale: deviceLocale });
      await stubAnalytics(context);
      const page = await context.newPage();
      await page.goto("/");
      await expect(page).toHaveURL((url) => url.pathname === expected);
      await context.close();
    });
  }

  test("a language picked with the switch wins over the device language", async ({ browser }) => {
    const context = await browser.newContext({ locale: "fr-FR" });
    await stubAnalytics(context);
    const page = await context.newPage();
    await page.goto("/");
    await expect(page).toHaveURL(/\/fr\/$/);
    await page.getByRole("link", { name: "Read this page in English" }).click();
    await expect(page).toHaveURL(/:\d+\/$/);
    await page.goto("/");
    await expect(page).toHaveURL(/:\d+\/$/);
    await context.close();
  });

  test("deep links are never redirected", async ({ browser }) => {
    const context = await browser.newContext({ locale: "fr-FR" });
    await stubAnalytics(context);
    const page = await context.newPage();
    await page.goto("/work/");
    await expect(page).toHaveURL(/\/work\/$/);
    await context.close();
  });
});

// The personal phone number is deliberately not listed here: any form of it (digits or a hash,
// which is trivially reversible for a phone number) would publish it in this repository.
test("nothing personal is published", async ({ page }) => {
  for (const path of [...(await sitemapPaths(page)), "/404.html"]) {
    await page.goto(path);
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["army", "military", "veteran", "sergeant", "savannah, ga 314"]) {
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
