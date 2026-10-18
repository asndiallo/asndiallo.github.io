/**
 * Post-deploy domain check: `pnpm verify:domain`. curl-based, read-only, no secrets.
 * The site is served by Cloudflare Workers on SITE_URL; the old GitHub Pages address serves a
 * redirect-only build.
 * Prints PASS/FAIL per check and exits 1 if any check still fails after the retries.
 *
 *   VERIFY_ATTEMPTS=1 pnpm verify:domain   # one pass, no waiting (default: 5 attempts, 30s apart)
 */
import { execFileSync } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { LEGACY_SITE_URL, SITE_URL } from "../src/config.ts";

const site = new URL(SITE_URL);
const apex = `https://${site.hostname}`;
const attempts = Number(process.env.VERIFY_ATTEMPTS ?? 5);
const delayMs = Number(process.env.VERIFY_DELAY_MS ?? 30_000);

interface Response {
  status: number;
  location: string;
  body: string;
  /** curl's own message when there was no HTTP response (DNS, TLS, timeout). */
  error?: string;
}

const shown = (res: Response): string =>
  res.status === 0 ? `no response (${res.error})` : String(res.status);

/** One request, no redirect following. Network errors come back as status 0. */
function curl(url: string): Response {
  try {
    const out = execFileSync(
      "curl",
      ["-sS", "--max-time", "20", "-D", "-", "-w", "\n%{http_code}", url],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    const status = Number(out.slice(out.lastIndexOf("\n") + 1));
    const location = /^location:\s*(\S+)/im.exec(out)?.[1] ?? "";
    return { status, location, body: out };
  } catch (error) {
    const stderr = (error as { stderr?: string }).stderr?.trim();
    return { status: 0, location: "", body: "", error: stderr || String(error) };
  }
}

type Check = { name: string; run: () => string | true };

/**
 * A permanent redirect to `target` (same host and path). An http:// Location is accepted with a
 * note: a redirect may go via http first; the "Always Use HTTPS" check covers the upgrade.
 */
const redirectsTo = (from: string, target: string) => (): string | true => {
  const res = curl(from);
  if (![301, 308].includes(res.status)) return `expected 301/308, got ${shown(res)}`;
  // Location may be relative (e.g. "/about/"); resolve it against the request URL like a browser.
  const location = res.location ? new URL(res.location, from).href : "";
  if (location === target) return true;
  if (location === target.replace(/^https:/, "http:")) {
    console.log(`        note: redirects via http (${location}); HTTPS upgrade checked separately`);
    return true;
  }
  return `Location is ${location || "(none)"}, want ${target}`;
};

const checks: Check[] = [
  {
    name: `${apex}/ returns 200 over HTTPS`,
    run: () => {
      const res = curl(`${apex}/`);
      return res.status === 200 ? true : `got ${shown(res)}`;
    },
  },
  {
    name: `http://${site.hostname}/ redirects to HTTPS (Always Use HTTPS)`,
    run: redirectsTo(`http://${site.hostname}/`, `${apex}/`),
  },
  {
    name: `https://www.${site.hostname}/ redirects to the apex`,
    run: redirectsTo(`https://www.${site.hostname}/`, `${apex}/`),
  },
  {
    // GitHub Pages serves a redirect-only site (scripts/build-legacy-redirects.ts): no real 301s
    // there, so check the instant refresh and the canonical link to the same path.
    name: `${LEGACY_SITE_URL}/engineering/ forwards to ${apex}/engineering/`,
    run: () => {
      const res = curl(`${LEGACY_SITE_URL}/engineering/`);
      if (res.status !== 200) return `got ${shown(res)}`;
      const target = `${apex}/engineering/`;
      if (!res.body.includes(`<link rel="canonical" href="${target}">`)) return "canonical missing";
      return res.body.includes(`content="0; url=${target}"`) ? true : "meta refresh missing";
    },
  },
  {
    name: "/about.html is a real 301 to /about/",
    run: redirectsTo(`${apex}/about.html`, `${apex}/about/`),
  },
  {
    name: "security headers (HSTS, CSP, nosniff) and immutable caching of /_astro/ files",
    run: () => {
      const res = curl(`${apex}/`);
      if (res.status !== 200) return `got ${shown(res)}`;
      for (const header of [
        "strict-transport-security",
        "content-security-policy",
        "x-content-type-options",
      ]) {
        if (!new RegExp(`^${header}:`, "im").test(res.body)) return `missing ${header}`;
      }
      const asset = /\/_astro\/[^"]+\.css/.exec(res.body)?.[0];
      if (!asset) return "no /_astro/ stylesheet found";
      const cached = curl(`${apex}${asset}`);
      return /^cache-control:.*immutable/im.test(cached.body)
        ? true
        : `${asset} is not cached as immutable`;
    },
  },
  {
    name: "sitemap.xml lists only URLs on the canonical domain",
    run: () => {
      const res = curl(`${apex}/sitemap.xml`);
      const { body } = res;
      if (res.status !== 200) return `got ${shown(res)}`;
      const locs = [...body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1] ?? "");
      if (locs.length === 0) return "no <loc> entries";
      const wrong = locs.filter((loc) => !loc.startsWith(`${apex}/`));
      return wrong.length === 0
        ? true
        : `${wrong.length} off-domain: ${wrong.slice(0, 3).join(", ")}`;
    },
  },
  {
    name: "canonical and og:url tags use the canonical domain",
    run: () => {
      for (const path of ["/", "/engineering/", "/fr/"]) {
        const res = curl(`${apex}${path}`);
        const { body } = res;
        if (res.status !== 200) return `${path} got ${shown(res)}`;
        const canonical = /<link rel="canonical" href="([^"]+)"/.exec(body)?.[1];
        const ogUrl = /<meta property="og:url" content="([^"]+)"/.exec(body)?.[1];
        if (canonical !== `${apex}${path}`) return `${path} canonical is ${canonical}`;
        if (ogUrl !== `${apex}${path}`) return `${path} og:url is ${ogUrl}`;
      }
      return true;
    },
  },
  {
    name: "robots.txt points at the canonical sitemap",
    run: () => {
      const res = curl(`${apex}/robots.txt`);
      if (res.status !== 200) return `got ${shown(res)}`;
      const { body } = res;
      return body.includes(`Sitemap: ${apex}/sitemap.xml`) ? true : "Sitemap line missing or wrong";
    },
  },
];

for (let attempt = 1; attempt <= attempts; attempt++) {
  console.log(`\nDomain checks for ${apex} (attempt ${attempt}/${attempts})`);
  let failed = 0;
  for (const check of checks) {
    const result = check.run();
    if (result === true) console.log(`  PASS  ${check.name}`);
    else {
      failed++;
      console.log(`  FAIL  ${check.name}: ${result}`);
    }
  }
  if (failed === 0) {
    console.log(`\nAll ${checks.length} checks passed.`);
    process.exit(0);
  }
  if (attempt < attempts) {
    console.log(
      `\n${failed} failed. Retrying in ${delayMs / 1000}s (DNS, certificates and caches can lag)…`,
    );
    await sleep(delayMs);
  } else {
    console.log(
      `\n${failed} of ${checks.length} checks failed. See DOMAIN-SETUP.md → Troubleshooting.`,
    );
    process.exit(1);
  }
}
