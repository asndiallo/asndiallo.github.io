import { type Dictionary, en } from "./en.ts";
import { fr } from "./fr.ts";
import { defaultLocale, type Locale, locales, publishedLocales } from "./locales.ts";

export { defaultLocale, type Locale, locales, publishedLocales };

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends readonly unknown[]
    ? T[K]
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function merge<T>(base: T, override: DeepPartial<T> | undefined): T {
  if (!override) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, value] of Object.entries(override)) {
    const current = out[key];
    out[key] = isPlainObject(current) && isPlainObject(value) ? merge(current, value) : value;
  }
  return out as T;
}

const overrides: Record<Locale, DeepPartial<Dictionary> | undefined> = { en: undefined, fr };

export const getDictionary = (locale: Locale): Dictionary => merge(en, overrides[locale]);

/** "/" + locale prefix (none for the default locale) + path, always with a trailing slash. */
export function localizedPath(path: string, locale: Locale): string {
  const clean = `/${path.replace(/^\/+|\/+$/g, "")}/`.replace(/\/+/g, "/");
  return locale === defaultLocale ? clean : `/${locale}${clean}`.replace(/\/+$/, "/");
}

/**
 * Paths that exist in more than one locale, keyed by their default-locale path.
 * hreflang links and sitemap alternates come only from here, so they never point at missing pages.
 */
const translatedPaths = ["/"];

export function getAlternates(path: string): { locale: Locale; path: string }[] {
  const available = translatedPaths.includes(path) ? publishedLocales : [defaultLocale];
  return available.map((locale) => ({ locale, path: localizedPath(path, locale) }));
}
