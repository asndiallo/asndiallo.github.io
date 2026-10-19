import { createHash } from "node:crypto";
import { satteri } from "@astrojs/markdown-satteri";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { SITE_URL } from "./src/config.ts";
import { defaultLocale, locales } from "./src/i18n/locales.ts";
import { languageRedirectScript, themeInitScript } from "./src/lib/inline-scripts.ts";
import { externalLinksPlugin } from "./src/lib/markdown-external-links.ts";

const sha256 = (source: string) =>
  `sha256-${createHash("sha256").update(source).digest("base64")}` as const;

// Third-party script hosts: Cloudflare Web Analytics' beacon (in every page, see config.ts),
// and Plausible only when switched on at build time.
const scriptHosts = [
  "https://static.cloudflareinsights.com",
  ...(process.env.PUBLIC_ANALYTICS === "plausible" ? ["https://plausible.io"] : []),
];

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
  security: {
    // Hash-based CSP in a <meta> tag on every page. Astro hashes its own bundled scripts and
    // styles; the inline scripts are hashed here from their source.
    csp: {
      scriptDirective: {
        resources: ["'self'", ...scriptHosts],
        hashes: [sha256(themeInitScript), sha256(languageRedirectScript)],
      },
    },
  },
  build: { format: "directory" },
  // External links in markdown open in a new tab (components use components/Link.astro).
  markdown: { processor: satteri({ hastPlugins: [externalLinksPlugin] }) },
  i18n: {
    locales: [...locales],
    defaultLocale,
    routing: { prefixDefaultLocale: false },
  },
  env: {
    // All optional: an unset variable switches its feature off.
    schema: {
      // Build-time only: include case studies marked `status: in-progress` (PR previews).
      SHOW_IN_PROGRESS: envField.boolean({ context: "server", access: "public", default: false }),
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
        // Cloudflare Web Analytics needs no build setting: Cloudflare injects it at the edge.
        values: ["plausible"],
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
