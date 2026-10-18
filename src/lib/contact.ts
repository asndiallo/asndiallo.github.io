import { isTodo, site } from "../config.ts";

/** Each helper returns null while its fact is still a TODO, so callers can show a placeholder. */
export const whatsappHref = (message: string): string | null =>
  isTodo(site.whatsappNumber)
    ? null
    : `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const mailtoHref = (): string | null => (isTodo(site.email) ? null : `mailto:${site.email}`);

export const bookingHref = (): string | null => (isTodo(site.bookingUrl) ? null : site.bookingUrl);
