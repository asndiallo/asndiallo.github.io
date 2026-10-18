import { SITE_URL } from "../config.ts";

const siteHost = new URL(SITE_URL).host;

/** An http(s) URL on another host. mailto:, tel:, relative and same-site links are internal. */
export function isExternal(href: string): boolean {
  if (!/^https?:\/\//i.test(href)) return false;
  return new URL(href).host !== siteHost;
}

/**
 * rel for external links. "noopener" isolates the new tab; the referrer is deliberately kept
 * (limited to our origin by the Referrer-Policy header) so client sites can see the visits.
 */
export const EXTERNAL_REL = "noopener";
