import type { APIRoute } from "astro";
import { getAlternates } from "../i18n/index.ts";
import { getIndexablePaths } from "../lib/routes.ts";

export const GET: APIRoute = async ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;
  const urls = (await getIndexablePaths()).flatMap((path) => {
    const alternates = getAlternates(path);
    const links =
      alternates.length > 1
        ? alternates
            .map(
              (a) => `<xhtml:link rel="alternate" hreflang="${a.locale}" href="${abs(a.path)}"/>`,
            )
            .join("")
        : "";
    // Each language version is its own <url> carrying the same set of alternates.
    return alternates.map((a) => `<url><loc>${abs(a.path)}</loc>${links}</url>`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
