import { type Alternates, staticRoutes } from "../i18n/index.ts";
import { entryKey, entryLocale, entryPath, getVisible } from "./content.ts";

/** Group a collection's entries by key: one group per page, holding its URL in each locale. */
async function collectionGroups(collection: "work" | "verticals"): Promise<Alternates[]> {
  const groups = new Map<string, Alternates>();
  for (const entry of await getVisible(collection)) {
    const group = groups.get(entryKey(entry)) ?? {};
    group[entryLocale(entry)] = entryPath(collection, entry);
    groups.set(entryKey(entry), group);
  }
  return [...groups.values()];
}

/**
 * Every indexable page with its translations. Feeds the sitemap, which feeds the smoke tests.
 * noindex pages (404, thanks) are left out.
 */
export async function getPageGroups(): Promise<Alternates[]> {
  return [
    staticRoutes.home,
    ...(await collectionGroups("verticals")),
    staticRoutes.work,
    ...(await collectionGroups("work")),
    staticRoutes.about,
    staticRoutes.engineering,
  ];
}
