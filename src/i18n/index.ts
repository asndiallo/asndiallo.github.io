import { type Dictionary, en } from "./en.ts";
import { fr } from "./fr.ts";
import {
  type Alternates,
  collectionBase,
  defaultLocale,
  type Locale,
  localeMeta,
  locales,
  staticRoutes,
} from "./locales.ts";

export type { Alternates, Dictionary, Locale };
export { collectionBase, defaultLocale, localeMeta, locales, staticRoutes };

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** A link to a section of the home page, e.g. homeAnchor("fr", "contact") → "/fr/#contact". */
export const homeAnchor = (locale: Locale, id: string): string =>
  `${staticRoutes.home[locale]}#${id}`;
