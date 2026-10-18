/**
 * Builds dist-legacy/: a redirect-only site for the old address (LEGACY_SITE_URL, GitHub Pages).
 * GitHub Pages can't send real 301s, so every page of the real site gets a stub that redirects
 * instantly to the same path on SITE_URL, with a canonical link search engines treat as the move.
 * Any other path (old links, typos) is caught by 404.html, which redirects with the path kept.
 *
 *   pnpm build && pnpm build:legacy
 */
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, relative, sep } from "node:path";

import { SITE_URL } from "../src/config.ts";

const DIST = "dist";
const OUT = "dist-legacy";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

const stub = (target: string) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>This site moved</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="${escapeHtml(target)}">
<meta http-equiv="refresh" content="0; url=${escapeHtml(target)}">
</head>
<body>
<p>This site moved to <a href="${escapeHtml(target)}">${escapeHtml(target)}</a>.</p>
</body>
</html>
`;

// Keeps the path, query and fragment: /engineering/?x#y → SITE_URL/engineering/?x#y
const fallback = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>This site moved</title>
<meta name="robots" content="noindex">
<script>location.replace(${JSON.stringify(SITE_URL)} + location.pathname + location.search + location.hash);</script>
</head>
<body>
<p>This site moved to <a href="${escapeHtml(SITE_URL)}/">${escapeHtml(SITE_URL)}</a>.</p>
</body>
</html>
`;

async function* htmlFiles(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(path);
    else if (entry.name.endsWith(".html")) yield path;
  }
}

await rm(OUT, { recursive: true, force: true });
let count = 0;
for await (const file of htmlFiles(DIST)) {
  const rel = relative(DIST, file).split(sep).join("/");
  if (rel === "404.html") continue;
  // dist/work/index.html → /work/ ; dist/about.html → /about.html
  const urlPath = `/${rel.replace(/(^|\/)index\.html$/, "$1")}`;
  const target = new URL(urlPath, SITE_URL).href;
  const out = join(OUT, rel);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, stub(target));
  count++;
}
// The old portfolio's about page (removed in Nov 2024); may still be linked from elsewhere.
await writeFile(join(OUT, "about.html"), stub(new URL("/about/", SITE_URL).href));
await writeFile(join(OUT, "404.html"), fallback);
await writeFile(join(OUT, "robots.txt"), "User-agent: *\nAllow: /\n");
console.log(`Wrote ${count + 1} redirect pages and a 404 fallback to ${OUT}/ → ${SITE_URL}`);
