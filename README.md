# asndiallo.github.io

Local SEO and Google Business Profile setup for African-owned businesses in the US.
Live at <https://asndiallo.github.io>.

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

## Configuration

| What                                              | Where                                                                                                                     |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Email, WhatsApp number, booking link, area served | `src/config.ts`                                                                                                           |
| Prices and what each package includes             | `src/config.ts` → `pricing`                                                                                               |
| Homepage and UI copy                              | `src/i18n/en.ts`                                                                                                          |
| Contact form (optional)                           | env `PUBLIC_FORM_ENDPOINT`: a Formspree-style POST URL. No value means no form.                                           |
| Analytics (optional, cookieless)                  | env `PUBLIC_ANALYTICS=cloudflare` + `PUBLIC_CF_BEACON_TOKEN`, or `PUBLIC_ANALYTICS=plausible` + `PUBLIC_PLAUSIBLE_DOMAIN` |

For local builds, put env values in `.env` (git-ignored). For deploys, set them as repository **Variables** (Settings → Secrets and variables → Actions → Variables). None of them are secret.

## Deploy

GitHub Actions builds `dist/` and publishes it to GitHub Pages (`.github/workflows/deploy.yml`).

1. One time: Settings → Pages → Source: **GitHub Actions**.
2. Actions → "Deploy to GitHub Pages" → **Run workflow**.

Deploys are manual until the site is ready to go live. To deploy on every push to `develop`, add the `push` trigger shown in the workflow comment.

CI (`.github/workflows/ci.yml`) runs the full `pnpm check` on every push and pull request.

## Add a case study

1. Get the owner's written OK to be named, and to use any numbers or quotes.
2. Add a screenshot or photo to `src/assets/work/` (optional).
3. Create `src/content/work/<business-slug>.md`:

```markdown
---
business: 'Business name'
city: City, ST
vertical: braiding-salons # braiding-salons | restaurants | other
summary: 'One plain sentence, ≤ 155 characters.'
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
  src: ../../assets/work/<file>.png
  alt: 'What the image shows.'
order: 2 # position on the home page and /work/
---

## Before

…

## What I did

…

## After

…
```

The first three entries (by `order`) fill the "My first clients" cards on the home page. Any empty slots show a marked placeholder.

## Add a vertical

Create `src/content/verticals/<slug>.md`, copying `braiding-salons.md`. It's published at `/for/<slug>/` and linked from the home page and footer. The sitemap and tests pick it up automatically. If it should appear in case studies, also add the slug to the `vertical` enum in `src/content.config.ts`.

## Publish the French version

French overrides live in `src/i18n/fr.ts`. When every homepage section is translated, add `"fr"` to `publishedLocales` in `src/i18n/locales.ts`. That builds `/fr/` and adds `hreflang` links and sitemap alternates.

## Project docs

- `PLAN.md`: architecture and the decisions behind it
- `TODO.md`: everything the owner still has to supply
- `CLAUDE.md`: commands and rules for AI-assisted edits
