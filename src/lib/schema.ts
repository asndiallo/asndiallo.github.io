import { isTodo, pricing, site } from "../config.ts";

const sameAs = Object.values(site.social);

/** Schema.org Person for Assane. Shared by the business and the about page. */
export const personSchema = {
  "@type": "Person",
  "@id": `${site.url}/#person`,
  name: site.name,
  url: `${site.url}/about/`,
  jobTitle: "Local SEO consultant and software engineer",
  knowsLanguage: ["en", "fr"],
  sameAs,
};

/** ProfessionalService with a service area and no street address. */
export function professionalServiceSchema(description: string): Record<string, unknown> {
  const prices = pricing.tiers.flatMap((tier) => [tier.founding.setup, tier.standard.setup]);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#business`,
    name: `${site.name}, local SEO`,
    description,
    url: `${site.url}/`,
    image: `${site.url}/og-default.png`,
    areaServed: { "@type": "Country", name: site.areaServed },
    availableLanguage: ["English", "French"],
    priceRange: `$${Math.min(...prices)}–$${Math.max(...prices)} setup`,
    founder: personSchema,
    ...(isTodo(site.email) ? {} : { email: site.email }),
    sameAs,
  };
}
