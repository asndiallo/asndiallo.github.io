# assane-diallo.com

Local SEO and Google Business Profile setup for African-owned businesses in the US.
Live at <https://assane-diallo.com>. The domain is set only in `src/config.ts` (`SITE_URL`).

Static site: Astro 7, Tailwind 4, TypeScript strict. No client-side JavaScript, no cookies.

## Local development

Requires Node ≥ 22.22 and pnpm 12.

```bash
pnpm install
pnpm dev            # http://localhost:4321 (or the next free port)
```

Before you push:

```bash
pnpm check          # lint → typecheck → build → Playwright → Lighthouse CI → link check
```

The first time, run `pnpm exec playwright install chromium`. Lighthouse uses your installed Chrome.

`pnpm build` ends with a list of every `[TODO]` placeholder still on the site. It warns but never fails.

**Dev server shows a stale error** (for example `LocalImageUsedWrongly … cannot be a string filepath`, or a case study missing) after content files move or the content schema changes: restart `pnpm dev`. If it persists, clear Astro's cache: `rm -rf .astro && pnpm dev`. Production builds start clean, so they're not affected.

## Configuration

| What                                              | Where                                                                                                                                                                                                           |
| ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Email, WhatsApp number, booking link, area served | `src/config.ts`                                                                                                                                                                                                 |
| Prices and what each package includes             | `src/config.ts` → `pricing`                                                                                                                                                                                     |
| Homepage and UI copy                              | `src/i18n/en.ts` and `src/i18n/fr.ts`                                                                                                                                                                           |
| Contact form (optional)                           | env `PUBLIC_FORM_ENDPOINT`: a Formspree-style POST URL. No value means no form.                                                                                                                                 |
| Analytics (cookieless)                            | Cloudflare Web Analytics: `CF_WEB_ANALYTICS_TOKEN` in `src/config.ts` (public token; `""` turns it off). Tests stub the beacon. Optional alternative: `PUBLIC_ANALYTICS=plausible` + `PUBLIC_PLAUSIBLE_DOMAIN`. |

For local builds, put env values in `.env` (git-ignored). For deploys, set them as repository **Variables** (Settings → Secrets and variables → Actions → Variables). None of them are secret.

## Deploy

Hosting is **Cloudflare Workers static assets** (`wrangler.jsonc`). The architecture, status, go-live steps and rollback are in **[DOMAIN-SETUP.md](DOMAIN-SETUP.md)**.

- **Pull requests:** CI runs the full `pnpm check`. PRs from this repo also get a **preview URL** (`pr-<n>-assane-diallo.<subdomain>.workers.dev`), posted as a comment.
- **Production:** Actions → **Deploy** → _Run workflow_. It reruns every check, then deploys exactly the build that passed (`wrangler deploy`). With `SITE_LIVE=true` (set), it then runs `pnpm verify:domain` against the live domain.
- **Rollback:** `pnpm exec wrangler rollback`.
- **Headers and redirects:** `public/_headers` (HSTS, CSP frame rules, caching) and `public/_redirects` (301s). Scripts and styles are covered by a hash-based CSP that Astro generates per page. The only inline script lives in `src/lib/inline-scripts.ts`.
- **Secrets:** `CLOUDFLARE_API_TOKEN` (yours, "Edit Cloudflare Workers" scoped to the account and zone) and `CLOUDFLARE_ACCOUNT_ID`.

## Languages and theme

The site is in English (`/`) and French (`/fr/`), for African-owned businesses in the US.

- UI and home page copy: `src/i18n/en.ts` and `src/i18n/fr.ts`. `fr.ts` is typed as the English dictionary, so a missing French key fails `pnpm typecheck`.
- URLs per language: `src/i18n/locales.ts` (`staticRoutes`, `collectionBase`). French URLs are translated (`/fr/realisations/`, `/fr/a-propos/`, `/fr/pour/…`).
- hreflang, the sitemap and the language switch in the header all read the same alternates, so a page only links to translations that exist. A test fails if a page (other than `/engineering/`) is missing its French or English version.
- Theme: System / Light / Dark switch in the header. The choice is saved in the browser (`localStorage`, no cookies). Colours are `light-dark()` tokens in `src/styles/global.css`.

## Add a case study

1. Get the owner's written OK to be named, and to use any numbers or quotes.
2. Add a screenshot or photo to `src/assets/work/` (optional).
3. Create **two files with the same name**, one per language: `src/content/work/en/<business-slug>.md` and `src/content/work/fr/<business-slug>.md`:

```markdown
---
business: 'Business name'
location: City, ST # or "Online shop"
vertical: braiding-salons # braiding-salons | restaurants | online-shop | other
status: complete # or in-progress: "In progress" badge and a "results to come" note
draft: false # true: hidden in production, shown in PR previews (SHOW_DRAFTS=true)
homepage: true # false keeps it off the home page cards (e.g. online shops)
summary: 'One plain sentence, ≤ 155 characters.'
highlight: '450 calls from Google in 3 months.' # optional: word for word from summary; shown on the matching vertical page
consent: true # required: the build fails without it
website: https://example.com/ # optional
services:
  - Google Business Profile
results: # optional: only numbers the owner approved
  - label: Calls from Google, per month # example format only
    value: '12 → 31'
    source: Google Business Profile insights, Jan vs. Apr 2027
quote: # optional: only with permission
  text: '…'
  author: Name, Business
image:
  src: ../../../assets/work/<file>.png
  alt: 'What the image shows.'
order: 2 # position on the home page and the work page
urlSlug: … # optional: a different URL segment for this language
---

## Before

…

## What I did

…

## After

…
```

The first three `homepage: true` entries (by `order`) fill the "My first clients" cards. Empty slots show a marked placeholder.

## Add a vertical

Create `src/content/verticals/en/<key>.md` and `src/content/verticals/fr/<key>.md` (copy the braiding-salons files). English is published at `/for/<key>/`, French at `/fr/pour/<urlSlug or key>/`. Both are linked from the home page and footer, and the sitemap and tests pick them up automatically. If case studies should use it, add the key to the `vertical` enum in `src/content.config.ts`.

Use `urlSlug`, not `slug`, for a translated URL: Astro reserves `slug` as the entry id.

## Project docs

- `PLAN.md`: architecture and the decisions behind it
- `DOMAIN-SETUP.md`: domain, DNS, HTTPS and email setup, step by step
- `TODO.md`: everything the owner still has to supply
- `CLAUDE.md`: commands and rules for AI-assisted edits
