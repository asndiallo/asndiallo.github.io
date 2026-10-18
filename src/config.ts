/**
 * Business facts in one place. Anything still unknown is the literal TODO marker:
 * it renders as a visible placeholder and the post-build report lists it.
 */
export const TODO = "[TODO]";
export const isTodo = (value: unknown): value is typeof TODO => value === TODO;

export const site = {
  name: "Assane Diallo",
  url: "https://asndiallo.github.io",
  /** Contact email shown on the site. */
  email: "asndiallo98@gmail.com" as string,
  /** Business WhatsApp number, digits only, with country code (e.g. "15551234567"). */
  whatsappNumber: "12109605715" as string,
  /** Booking page for the free 15-minute check-up (Cal.com, Calendly, Google appointment page). */
  bookingUrl: "https://calendar.app.google/7VsGdzUNf8CynFcd8" as string,
  areaServed: "United States",
  social: {
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
