import tailwindcss from "@tailwindcss/vite";
import { defineConfig, envField } from "astro/config";
import { SITE_URL } from "./src/config.ts";
import { defaultLocale, locales } from "./src/i18n/locales.ts";

export default defineConfig({
  site: SITE_URL,
  trailingSlash: "always",
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
