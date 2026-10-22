import { type CollectionEntry, getCollection } from "astro:content";
import { SHOW_DRAFTS } from "astro:env/server";
import { type Alternates, collectionBase, type Locale } from "../i18n/index.ts";

type Localized = "work" | "verticals";

/**
 * Content lives in src/content/<collection>/<locale>/<key>.md. The same <key> in two locales is
 * the same page translated; frontmatter `urlSlug` overrides the URL segment (e.g. a French slug).
 */
const split = (id: string) => {
  const [locale, ...rest] = id.split("/");
  return { locale: locale as Locale, key: rest.join("/") };
};

/**
 * Case studies marked `draft: true` stay out of production builds: no page, no listing, no sitemap
 * entry, no link. PR previews set SHOW_DRAFTS=true so drafts can be reviewed.
 */
const isVisible = (entry: CollectionEntry<Localized>): boolean =>
  SHOW_DRAFTS || !("draft" in entry.data && entry.data.draft);

/** Every visible entry of a collection matching `filter`. All content lookups go through here. */
export async function getVisible<C extends Localized>(
  collection: C,
  filter: (entry: CollectionEntry<C>) => boolean = () => true,
): Promise<CollectionEntry<C>[]> {
  return getCollection(collection, (e) => isVisible(e) && filter(e));
}

export const entryLocale = (entry: CollectionEntry<Localized>): Locale => split(entry.id).locale;
export const entryKey = (entry: CollectionEntry<Localized>): string => split(entry.id).key;
export const entrySlug = (entry: CollectionEntry<Localized>): string =>
  entry.data.urlSlug ?? entryKey(entry);

export function entryPath(collection: Localized, entry: CollectionEntry<Localized>): string {
  return `${collectionBase[collection][entryLocale(entry)]}${entrySlug(entry)}/`;
}

/** Entries for one locale, in display order. */
export async function getLocalized<C extends Localized>(
  collection: C,
  locale: Locale,
): Promise<CollectionEntry<C>[]> {
  const entries = await getVisible(collection, (e) => split(e.id).locale === locale);
  return entries.sort((a, b) => a.data.order - b.data.order);
}

/** URLs of every translation of an entry (including itself). */
export async function entryAlternates(
  collection: Localized,
  entry: CollectionEntry<Localized>,
): Promise<Alternates> {
  const key = entryKey(entry);
  const all = await getVisible(collection, (e) => split(e.id).key === key);
  return Object.fromEntries(all.map((e) => [entryLocale(e), entryPath(collection, e)]));
}

/** getStaticPaths body for a localized collection route with a [slug] param. */
export async function staticPathsFor<C extends Localized>(collection: C, locale: Locale) {
  return (await getLocalized(collection, locale)).map((entry) => ({
    params: { slug: entrySlug(entry) },
    props: { entry },
  }));
}
