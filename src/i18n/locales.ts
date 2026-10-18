export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Locales with finished copy and a page file (e.g. src/pages/fr/index.astro). Drives hreflang and the sitemap. */
export const publishedLocales: readonly Locale[] = ["en"];
