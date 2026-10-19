export const locales = ["en", "fr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

/** A page's URL in each locale it exists in. hreflang, the sitemap and the language switch read this. */
export type Alternates = Partial<Record<Locale, string>>;

export const localeMeta = {
  en: { name: "English", ogLocale: "en_US" },
  fr: { name: "Français", ogLocale: "fr_FR" },
} as const satisfies Record<Locale, { name: string; ogLocale: string }>;

/** Fixed pages. A page missing a locale (engineering) simply has no translation. */
export const staticRoutes = {
  home: { en: "/", fr: "/fr/" },
  work: { en: "/work/", fr: "/fr/realisations/" },
  about: { en: "/about/", fr: "/fr/a-propos/" },
  thanks: { en: "/thanks/", fr: "/fr/merci/" },
  privacy: { en: "/privacy/", fr: "/fr/confidentialite/" },
  engineering: { en: "/engineering/" },
} as const satisfies Record<string, Alternates>;

/** URL prefix for content collections, per locale. Entry slugs are appended. */
export const collectionBase = {
  work: { en: "/work/", fr: "/fr/realisations/" },
  verticals: { en: "/for/", fr: "/fr/pour/" },
} as const satisfies Record<string, Record<Locale, string>>;
