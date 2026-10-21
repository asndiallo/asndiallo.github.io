import { pricing, SITE_NAME, SITE_URL, site } from "../config.ts";

// Each entity claims only its own profiles, so Google doesn't merge the person and the business.
const { instagram, facebook, linkedin, github } = site.social;
const personSameAs = [linkedin, github];
const businessSameAs = [instagram, facebook];

/** Schema.org Person for Assane. Shared by the business and the about page. */
export const personSchema = {
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: SITE_NAME,
  url: `${SITE_URL}/about/`,
  jobTitle: "Local SEO consultant and software engineer",
  knowsLanguage: ["en", "fr"],
  sameAs: personSameAs,
};

/** ProfessionalService with a service area and no street address. */
export function professionalServiceSchema(description: string): Record<string, unknown> {
  const prices = pricing.tiers.flatMap((tier) => [tier.founding.setup, tier.standard.setup]);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#business`,
    name: `${SITE_NAME}, local SEO`,
    description,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og-default.png`,
    areaServed: { "@type": "Country", name: site.areaServed },
    availableLanguage: ["English", "French"],
    priceRange: `$${Math.min(...prices)}–$${Math.max(...prices)} setup`,
    founder: personSchema,
    sameAs: businessSameAs,
  };
}
