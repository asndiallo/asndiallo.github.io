import { getCollection } from "astro:content";

/** Every indexable page, by its default-locale path. noindex pages (404, /thanks/) are left out. */
export async function getIndexablePaths(): Promise<string[]> {
  const [work, verticals] = await Promise.all([getCollection("work"), getCollection("verticals")]);
  return [
    "/",
    ...verticals.map((v) => `/for/${v.id}/`),
    "/work/",
    ...work.map((w) => `/work/${w.id}/`),
    "/about/",
    "/engineering/",
  ];
}
