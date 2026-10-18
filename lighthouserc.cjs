/** Lighthouse CI: every built page, mobile (the default form factor), ≥ 0.95 in all four categories. */
const min = (score) => ["error", { minScore: score }];
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
      numberOfRuns: 1,
    },
    assert: {
      assertMatrix: [
        // 404 and /thanks/ are noindex on purpose, which Lighthouse scores as an SEO failure.
        { matchingUrlPattern: "/(404\\.html|thanks/)", assertions: categories },
        {
          matchingUrlPattern: "^(?!.*/(404\\.html|thanks/)).*$",
          assertions: { ...categories, "categories:seo": min(0.95) },
        },
      ],
    },
    upload: { target: "filesystem", outputDir: "./.lighthouseci/reports" },
  },
};
