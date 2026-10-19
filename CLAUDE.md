# CLAUDE.md

Offer site for Assane Diallo: local SEO and Google Business Profile packages for African-owned small businesses in the US. It's a credibility page that turns a referral or a Google check into a WhatsApp conversation.

Astro 7 (static) · Tailwind 4 · TypeScript strict · pnpm · Cloudflare Workers static assets, deployed by GitHub Actions.

## Commands

```bash
pnpm dev          # local dev server
pnpm lint         # biome check (lint + format check). `pnpm format` fixes.
pnpm typecheck    # astro check
pnpm build        # astro build + [TODO] report (warns, never fails)
pnpm test:e2e     # Playwright smoke test against the built dist/ (port 4399)
pnpm lhci         # Lighthouse CI, mobile, ≥ 0.95 in all four categories
pnpm linkcheck    # linkinator on dist/
pnpm check        # all of the above, in order. Run before saying "done".
pnpm og           # regenerate public/og-default.png
pnpm verify:domain  # post-deploy checks of the live domain (curl, no secrets)
pnpm exec wrangler dev     # serve dist/ like production (headers, redirects, 404)
```

Port 4321 is often taken by another local project. Tests use 4399.

## Where things live

- `src/config.ts`: business facts (email, WhatsApp, booking link, prices, area served). Unknown values are `TODO`.
- `src/i18n/en.ts` / `fr.ts`: all UI and home copy (fr is typed as the en dictionary). `src/i18n/locales.ts`: locales and URLs per locale. Pages pass `alternates` to `Base.astro`; hreflang, sitemap and the language switch all read them.
- `src/content/{work,verticals}/{en,fr}/<key>.md`: same key = same page translated. `urlSlug` overrides the URL segment (never `slug`: Astro uses it as the id). Page bodies are `src/components/views/*`; `src/pages/**` are thin per-locale wrappers.
- Theme: `light-dark()` tokens in `global.css`; `ThemeToggle.astro` + an inline head script (no flash). Use tokens (`text-on-brand`, `bg-band`…), never raw `text-white`.
- `src/lib/routes.ts`: list of indexable pages. It feeds `sitemap.xml`, which feeds the Playwright tests.
- Copy source of truth: the owner's `site-copy.md`. Decisions: `PLAN.md` §0. Open items: `TODO.md`.

## Hard rules (honesty)

- **No invented proof.** No fake testimonials, metrics, logos or client names. A missing fact renders as `<Todo label="…">`, or `[TODO: …]` in markdown, and goes in TODO.md.
- Case studies need `consent: true`. Results need a `source`. Only publish numbers the owner approved.
- Approved claims only: the ecommerce sentence ("built and grew an SEO-driven ecommerce store to about 800 pages with no ad spend": no product category, no revenue), the Master's in Data Engineering & AI, and the Isa's African Hair Braiding work. Not approved: "grew up in Senegal".
- No ranking or timeline guarantees. The FAQ says plainly that SEO takes months.
- Never mention military service, rank or branch. No home address, spouse, or personal phone number. The old resume PDF is not published.
- Never link `isahairbraiding.com`. It lapsed and now redirects to spam. The client site is `https://isabraiding.com`.
- The email address never appears in the served HTML (no text, no `mailto:`, no JSON-LD). Use `EmailLink.astro`.
- The domain lives only in `src/config.ts` (`SITE_URL`, `SITE_NAME`, `CONTACT_EMAIL`). Never hard-code a domain elsewhere; a test fails if `github.io` appears in pages, sitemap or robots. Cloudflare changes (DNS, routes, email) are made with the signed-in `cf` CLI only with the owner's explicit approval for each step. Never ask for or handle tokens/passwords: the owner sets secrets with `gh secret set`. DOMAIN-SETUP.md is the runbook and status log.
- Links: use `components/Link.astro` for any link that may leave the site (external = other host over http/https: new tab, rel=noopener, screen-reader hint). Markdown gets the same from `src/lib/markdown-external-links.ts`.
- Drafts: case studies with `status: in-progress` never reach production (one filter in `src/lib/content.ts`); PR previews set `SHOW_IN_PROGRESS=true`.
- Language: `/` redirects French devices to `/fr/` (inline script in `src/lib/inline-scripts.ts`); a choice made with the header switch wins.
- Security: hash-based CSP (Astro `security.csp`). Never add an `is:inline` script other than `src/lib/inline-scripts.ts` (it is hashed in astro.config.ts); use bundled `<script>` instead. Headers live in `public/_headers`, redirects in `public/_redirects`.
- Market: US businesses only, in English and French. Online shops are a quiet side line ("audits by request"), never in the main pitch or home proof cards.
- No spots-left counter. Prices are "starting at", with "final quote after a free check-up".

## Technical rules

- No client-side JS framework. No cookies, no consent banner. Analytics only via `PUBLIC_ANALYTICS` (cookieless).
- One `<h1>` per page. Unique title (≤ 60) and description (≤ 155). Every page goes through `layouts/Base.astro`.
- JSON-LD `ProfessionalService` has `areaServed` and **no address**.
- System fonts only (zero layout shift). Colours come from `@theme` tokens in `src/styles/global.css`, which are AA-checked.
- GitHub Actions are pinned to full commit SHAs with a `# vX.Y.Z` comment; Dependabot (`.github/dependabot.yml`) keeps them and npm packages current (weekly, with a cooldown). Never switch back to tags.
- `develop` is protected by a ruleset: changes land through pull requests with CI (`check`) passing; no force pushes or deletion. Merge only after CI passes.
- Add no dependency without a one-line justification in PLAN.md §2.
- Small conventional commits. Run `pnpm check` before claiming done.
