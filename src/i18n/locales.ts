export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** Locales with finished copy. Only these get routes, hreflang and sitemap entries. */
export const publishedLocales: readonly Locale[] = ["en"];
