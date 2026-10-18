import { createHash } from "node:crypto";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { SITE_URL } from "./src/config.ts";
import { defaultLocale, locales } from "./src/i18n/locales.ts";
import { themeInitScript } from "./src/lib/inline-scripts.ts";

const sha256 = (source: string) =>
  `sha256-${createHash("sha256").update(source).digest("base64")}` as const;

// Third-party script hosts, allowed only when that analytics provider is switched on.
const analyticsHosts: Record<string, string[]> = {
  cloudflare: ["https://static.cloudflareinsights.com"],
  plausible: ["https://plausible.io"],
};

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  security: {
    // Hash-based CSP in a <meta> tag on every page. Astro hashes its own bundled scripts and
    // styles; the one inline script is hashed here from its source.
    csp: {
      scriptDirective: {
        resources: ["'self'", ...(analyticsHosts[process.env.PUBLIC_ANALYTICS ?? ""] ?? [])],
        hashes: [sha256(themeInitScript)],
      },
    },
  },
  build: { format: "directory" },
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
  env: {
    // All optional: an unset variable switches its feature off.
    schema: {
      PUBLIC_FORM_ENDPOINT: envField.string({
        context: "client",
        access: "public",
        optional: true,
        url: true,
      }),
      PUBLIC_ANALYTICS: envField.enum({
        context: "client",
        access: "public",
        optional: true,
        values: ["cloudflare", "plausible"],
      }),
      PUBLIC_CF_BEACON_TOKEN: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PUBLIC_PLAUSIBLE_DOMAIN: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
  vite: { plugins: [tailwindcss()] },
});
