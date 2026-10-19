/** Lighthouse CI: every built page, mobile (the default form factor), ≥ 0.95 in all four categories. */
const min = (score) => ["error", { minScore: score }];
// Pages that are noindex on purpose (404 and the form thank-you pages in each language).
const NOINDEX = "(404\\.html|thanks/|fr/merci/)";

const categories = {
  "categories:performance": min(0.95),
  "categories:accessibility": min(0.95),
  "categories:best-practices": min(0.95),
};

module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      maxAutodiscoverUrls: 0, // 0 = audit every HTML page, not just the first five
      staticDirFileDiscoveryDepth: 4, // default 2 misses /fr/pour/<vertical>/ and /fr/realisations/<case>/
      // Median of 3 runs per page: a single run on a shared CI machine is too noisy to gate on.
      numberOfRuns: 3,
      // The analytics beacon is a third-party request; keep scores about the site itself.
      settings: { blockedUrlPatterns: ["*cloudflareinsights.com*"] },
    },
    assert: {
      assertMatrix: [
        // Lighthouse scores noindex as an SEO failure, so those pages skip the SEO assertion.
        { matchingUrlPattern: `/${NOINDEX}`, assertions: categories },
        {
          matchingUrlPattern: `^(?!.*/${NOINDEX}).*$`,
          assertions: { ...categories, "categories:seo": min(0.95) },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: "./.lighthouseci/reports" },
  },
};
