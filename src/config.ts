/**
 * Business facts in one place. Anything still unknown is the literal TODO marker:
 * it renders as a visible placeholder and the post-build report lists it.
 */
export const TODO = "[TODO]";
export const isTodo = (value: unknown): value is typeof TODO => value === TODO;

/**
 * The domain lives here and only here: astro.config, canonical/OG URLs, JSON-LD, the sitemap,
 * robots.txt, the OG image and scripts/verify-domain.ts all read these.
 */
export const SITE_URL = "https://assane-diallo.com";
export const SITE_NAME = "Assane Diallo";
/** Hosted on Zoho Mail. See DOMAIN-SETUP.md. */
export const CONTACT_EMAIL: string = "hello@assane-diallo.com";

/**
 * Cloudflare Web Analytics (cookieless). The token is public: it ships in every page.
 * Set to "" to turn analytics off. Edge injection doesn't apply to Workers, so it's in the build.
 */
export const CF_WEB_ANALYTICS_TOKEN = "6a847fca966e442d9322e847825c4961";

export const site = {
  /** Business WhatsApp number, digits only, with country code (e.g. "15551234567"). */
  whatsappNumber: "12109605715" as string,
  /** Booking page for the free 15-minute check-up (Cal.com, Calendly, Google appointment page). */
  bookingUrl: "https://calendar.app.google/7VsGdzUNf8CynFcd8" as string,
  areaServed: "United States",
  /** Instagram/Facebook are the business's (pills, business sameAs); LinkedIn/GitHub are Assane's (links, person sameAs). */
  social: {
    instagram: "https://www.instagram.com/assane.seo/",
    facebook: "https://www.facebook.com/assane.seo/",
    linkedin: "https://www.linkedin.com/in/assane-diallo/",
    github: "https://github.com/asndiallo",
  },
} as const;

export type TierId = "profile" | "website";
export type ServiceId = "profile" | "website" | "searchPages" | "reviews" | "report";

interface Price {
  setup: number;
  monthly: number;
}

export interface Tier {
  id: TierId;
  founding: Price;
  standard: Price;
  includes: readonly ServiceId[];
}

export const pricing = {
  currency: "USD",
  /** Founding prices apply to this many clients; standard prices after that. */
  foundingClients: 3,
  /** Usual time from approval to a finished setup. */
  setupWeeks: "1–2",
  tiers: [
    {
      id: "profile",
      founding: { setup: 200, monthly: 79 },
      standard: { setup: 350, monthly: 99 },
      includes: ["profile", "reviews", "report"],
    },
    {
      id: "website",
      founding: { setup: 450, monthly: 129 },
      standard: { setup: 750, monthly: 179 },
      includes: ["profile", "website", "searchPages", "reviews", "report"],
    },
  ] satisfies readonly Tier[],
} as const;

export function getTier(id: TierId): Tier {
  const tier = pricing.tiers.find((t) => t.id === id);
  if (!tier) throw new Error(`Unknown pricing tier: ${id}`);
  return tier;
}
