import type { APIRoute } from "astro";
import { locales } from "../i18n/index.ts";
import { getPageGroups } from "../lib/routes.ts";

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const urls = (await getPageGroups()).flatMap((group) => {
    const versions = locales.flatMap((locale) => {
      const path = group[locale];
      return path ? [{ locale, href: abs(path) }] : [];
    });
    // Each language version is its own <url>, listing every version (itself included).
    const links =
      versions.length > 1
        ? versions
            .map((v) => `<xhtml:link rel="alternate" hreflang="${v.locale}" href="${v.href}"/>`)
            .join("")
        : "";
    return versions.map((v) => `<url><loc>${v.href}</loc>${links}</url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
