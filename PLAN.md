# PLAN: Rebuild asndiallo.github.io as a local-SEO offer site

Status: **approved with the decisions below; in progress.**

---

## 0. Decisions (resolved 2026-10-18)

| #   | Decision                                                                   | Resolution                                                                                                                                                                                                                                                                                                                                               |
| --- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D1  | Resume PDF (contains a personal phone number, city and immigration status) | **Not deployed.** It's removed from the site; `/engineering` links to LinkedIn. Git history is not rewritten.                                                                                                                                                                                                                                            |
| D2  | Deploy gating                                                              | **Manual deploy (`workflow_dispatch`) until you say go**, then on every push to `develop`. CI warns on `[TODO]` but never fails on it.                                                                                                                                                                                                                   |
| D3  | Pages source                                                               | Best practice: switch Pages to **GitHub Actions** as the source (via `gh api`, at first deploy).                                                                                                                                                                                                                                                         |
| D4  | Isa's African Hair Braiding                                                | **Yes, the owner agrees.** Live site is `https://isabraiding.com` (Savannah, GA). Scope: website build, on-site local SEO, Google Business Profile, online booking. **No numbers until you supply approved ones.** Do not link the old `isahairbraiding.com`: it lapsed and now redirects to a spam site.                                                |
| D5  | Package manager                                                            | **pnpm.**                                                                                                                                                                                                                                                                                                                                                |
| D6  | Pricing                                                                    | Two tiers, shown as founding (highlighted, "For my first 3 clients") and standard ("after my first 3 clients"). **No spots-left counter.** Every price is labelled "starting at", with "final quote after a free check-up". Google Profile: $200 setup + $79/mo (standard: $350 + $99/mo). Profile + Website: $450 + $129/mo (standard: $750 + $179/mo). |
| D7  | Tier scope                                                                 | Google Profile tier: profile setup, review-request system, monthly report. Profile + Website adds the website and pages for local searches.                                                                                                                                                                                                              |
| D8  | Terms                                                                      | Month-to-month, cancel anytime. Setup usually takes 1–2 weeks.                                                                                                                                                                                                                                                                                           |
| D9  | Claims approved                                                            | The ecommerce sentence (~800 pages, no ad spend; no category, no revenue); Master's in Data Engineering & AI; the Isa website work. **Not approved:** "grew up in Senegal".                                                                                                                                                                              |
| D10 | Verticals                                                                  | `braiding-salons`, `restaurants` (restaurants & catering).                                                                                                                                                                                                                                                                                               |
| D11 | Service area                                                               | US-wide and remote. `areaServed: United States`. No city named for you.                                                                                                                                                                                                                                                                                  |
| D12 | Copy source                                                                | `~/Downloads/site-copy.md` is the source of truth for wording; its `[TODO]`s stay as `[TODO]`s.                                                                                                                                                                                                                                                          |
| D13 | Theme                                                                      | System / Light / Dark switch, saved in localStorage (no cookies). `light-dark()` tokens, AA in both themes.                                                                                                                                                                                                                                              |
| D14 | French                                                                     | Full French site for francophone owners **in the US** (not France). Translated URLs. Prices in USD. Canada and France deferred; France would need mentions légales.                                                                                                                                                                                      |
| D15 | Online shops                                                               | Off the main pitch: one line, "Online shops: audits by request.", linked to the Djidiawax case study (in progress, no results). Never in home proof cards.                                                                                                                                                                                               |
| D16 | Djidiawax                                                                  | Case study in progress: product/category pages, technical SEO and speed, Google Shopping, conversion. Owner consent assumed from the decision; to confirm.                                                                                                                                                                                               |
| D17 | Domain                                                                     | `https://assane-diallo.com` (apex) in `src/config.ts` only. Spaceship registrar, Cloudflare DNS (proxy off), GitHub Pages. `CNAME` generated (GitHub ignores it with Actions deploys). `pnpm verify:domain` runs after deploys. Manual steps in DOMAIN-SETUP.md.                                                                                         |
| D18 | Hosting | **Supersedes D3/D17's GitHub Pages hosting.** Cloudflare Workers static assets (Cloudflare's recommendation for new static sites): `_headers`, `_redirects`, hash-based CSP, preview URL per PR, deploy gated on CI. github.io serves a redirect-only build. Cloudflare changes are made with the `cf` CLI with per-step approval; the API token is created and stored by the owner. |
| D19 | Proof and launch | Home shows only case studies with approved results, never placeholder cards. Personal relationships are disclosed on the card and the page (`disclosure` field: Isa is Assane's cousin). Go-live approved 2026-10-18. |
| D20 | Names, Pages, repo, history | Packages renamed Get Found / Get Booked (FR: Visibilité / Visibilité + Réservations). GitHub Pages dropped (nobody used the old address); repo renamed `asndiallo/assane-diallo.com`. History rewritten to remove `.vscode/settings.json` and the old resume PDFs. |

---

## 1. What's in the repo today

- **Stack:** one hand-written `index.html` with inline CSS. No build, no JS, no package.json.
- **Hosting:** GitHub Pages, legacy build, source `develop` `/`, HTTPS on, **no custom domain** (`CNAME` for `assane-diallo.me` was deleted in Sept 2024).
- **Content:** a backend-engineer portfolio covering YoBool (Rails API), AIclinix, IntelliAPI, an email contact, and links to GitHub, LinkedIn and the resume.
- **Git history:** before Nov 2024 the site also had `about.html`, Font Awesome, and projects (Isa Hair Salon, Pantry Pal, Express Food). All of it has been deleted already.
- **Existing public URLs**
  - `/` and `/index.html` (the portfolio)
  - `/assets/docs/assane_diallo_software_engineer_cv.pdf` (see D1)
  - `/about.html` has returned 404 since Nov 2024. I'll add a redirect anyway because it costs nothing.
- **Toolchain:** Node 24.22, pnpm 12. Astro 7.4 needs Node ≥ 22.22, so we're fine.

Nothing in the repo is a reason to move away from your stack, so **I'll use it as you specified**, with the small deviations listed in §2.

---

## 2. Stack

| Concern        | Choice                                                                    | Notes / deviations                                                                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework      | **Astro 7** with static output                                            | `trailingSlash: 'always'` and `build.format: 'directory'`, which match how GitHub Pages serves files. This keeps canonical URLs consistent.                                                         |
| CSS            | **Tailwind v4** via `@tailwindcss/vite`                                   | v4 is configured in CSS (`@theme`), so there is **no `tailwind.config.js`**. Markdown body styles are a small hand-written `prose` block, **not** `@tailwindcss/typography`, to avoid a dependency. |
| Types          | TS strict (`astro/tsconfigs/strictest`), typechecked with `astro check`   | **TypeScript 6.x, not 7.** `@astrojs/check` only supports TS ^5 and ^6.                                                                                                                             |
| Fonts          | **System font stack**                                                     | No font files and no network requests, so no font-swap layout shift. This is the easiest way to keep Lighthouse at 95+.                                                                             |
| Client JS      | **None.** WhatsApp, mailto and the form are plain links and an HTML form. | The only possible script is the analytics beacon, and it loads only when the env flag is set.                                                                                                       |
| Lint/format    | **Biome 2**                                                               | Biome handles TS, JS, JSON, CSS and Astro frontmatter. Astro _templates_ get partial coverage, and `astro check` covers the rest.                                                                   |
| Smoke test     | **Playwright** (Chromium only)                                            | Runs against `astro preview` of the built `dist/`.                                                                                                                                                  |
| Perf/a11y gate | **Lighthouse CI** (`@lhci/cli`), mobile preset                            | Asserts ≥ 0.95 in Performance, Accessibility, Best Practices and SEO on every page.                                                                                                                 |
| Link check     | **linkinator** on `dist/`                                                 | Checks internal links and anchors. External links are checked too, except `wa.me` and `mailto:`, which can't be checked.                                                                            |
| Deploy         | GitHub Actions → `actions/deploy-pages`                                   | Gated per D2.                                                                                                                                                                                       |

### Dependencies, each with a one-line justification

| Package                                                                                                                  | Why                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `astro`                                                                                                                  | Static site framework you asked for.                                                                             |
| ~~`@astrojs/sitemap`~~ (dropped: a 30-line `sitemap.xml` endpoint gives the exact path and shares the hreflang registry) | Generates `sitemap.xml` with i18n `hreflang` alternates.                                                         |
| `tailwindcss`, `@tailwindcss/vite`                                                                                       | Tailwind v4 and its official Vite plugin.                                                                        |
| `@astrojs/check`, `typescript@6`                                                                                         | `astro check` is the only typechecker that understands `.astro` files.                                           |
| `@biomejs/biome`                                                                                                         | Lint and format in one fast tool, as you asked.                                                                  |
| `@playwright/test`                                                                                                       | Smoke test.                                                                                                      |
| `@lhci/cli`                                                                                                              | Lighthouse CI.                                                                                                   |
| `linkinator`                                                                                                             | Link check installed as a package, so the same command runs locally and in CI.                                   |
| `@types/node`                                                                                                            | Types for the Node scripts (`scripts/*.ts`) and Playwright config.                                               |
| `sharp`                                                                                                                  | Renders the OG PNG from an SVG template. Astro already installs it, so declaring it adds nothing to the install. |

Nothing else. In particular: no UI framework, no icon library (inline SVG), no i18n library, no form library.

---

## 3. File tree

```txt
.
├── .github/workflows/
│   ├── ci.yml              # lint, typecheck, build, TODO report, Playwright, LHCI, link check
│   └── deploy.yml          # build + deploy to Pages (gated, see D2)
├── public/
│   ├── favicon.svg
│   └── og-default.png      # 1200×630, generated by scripts/generate-og.ts, committed
├── scripts/
│   ├── generate-og.ts      # SVG template → PNG via sharp (run manually, output committed)
│   └── report-todos.ts     # scans dist/ for [TODO]; prints a list; emits ::warning:: in CI
├── src/
│   ├── config.ts           # site facts: name, email, WhatsApp, booking URL, prices, areaServed → [TODO]
│   ├── env.d.ts            # typed PUBLIC_* env vars
│   ├── content.config.ts   # zod schemas for work + verticals collections
│   ├── content/
│   │   ├── work/
│   │   │   ├── _placeholder-1.md   # placeholder: true. Rendered as a clearly marked "coming soon" card
│   │   │   ├── _placeholder-2.md
│   │   │   └── _placeholder-3.md
│   │   └── verticals/
│   │       ├── vertical-a.md       # [TODO] slug/name. E.g. braiding-salons
│   │       └── vertical-b.md       # [TODO] e.g. restaurants
│   ├── i18n/
│   │   ├── index.ts        # locale list, t() helper, route helpers, "is this page translated?"
│   │   ├── en.ts           # all EN UI + homepage copy (typed)
│   │   └── fr.ts           # same keys, FR. Typed as Partial until complete
│   ├── components/
│   │   ├── Seo.astro       # title, description, canonical, OG/Twitter, hreflang, JSON-LD slot
│   │   ├── JsonLd.astro
│   │   ├── Analytics.astro # renders nothing unless PUBLIC_ANALYTICS is set
│   │   ├── Header.astro / Footer.astro / SkipLink.astro
│   │   ├── CtaWhatsApp.astro       # the one primary CTA, reused everywhere
│   │   ├── ContactBlock.astro      # WhatsApp (primary) + email + booking + optional form
│   │   ├── Todo.astro              # visible, clearly marked placeholder; emits literal "[TODO]"
│   │   ├── CaseStudyCard.astro
│   │   └── sections/       # Hero, WhoFor, Problem, Included, HowItWorks, Proof, Pricing, Faq, Contact
│   ├── layouts/
│   │   ├── Base.astro
│   │   └── Prose.astro     # for markdown pages (case studies, verticals)
│   ├── styles/global.css   # Tailwind import, @theme tokens, prose styles
│   └── pages/
│       ├── index.astro             # / offer page (EN)
│       ├── fr/index.astro          # /fr/ mirror. Built only when FR copy is complete (see §5)
│       ├── work/index.astro        # /work/
│       ├── work/[slug].astro       # /work/<case-study>/
│       ├── about.astro             # /about/ (bilingual on one page)
│       ├── for/[vertical].astro    # /for/<vertical>/
│       ├── engineering.astro       # /engineering/ (old portfolio, preserved)
│       ├── thanks.astro            # form success page, noindex
│       ├── 404.astro
│       └── robots.txt.ts
├── tests/smoke.spec.ts
├── astro.config.ts
├── biome.json
├── lighthouserc.cjs
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── CLAUDE.md
├── README.md
└── TODO.md
```

---

## 4. Pages

| Route                        | H1 (draft)                                                                                                                 | Content source               | Notes                                                                                                                                                                                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                          | "More calls and bookings from Google, for [TODO: your community's] small businesses." Final wording to be approved by you. | `src/i18n/en.ts`             | Sections in the order you gave: hero → who it's for → problem → what's included → how it works (3 steps) → proof (3 cards) → pricing → FAQ → contact. The primary CTA "Message me on WhatsApp" appears in the hero, after pricing, and in contact. |
| `/work/`                     | "Client work"                                                                                                              | `src/content/work/*.md`      | Lists entries where `placeholder: false`. If there are none, it says plainly that case studies are being written, and shows **no fake cards**.                                                                                                     |
| `/work/[slug]/`              | case-study title                                                                                                           | markdown                     | Schema: client (optional, only with consent), vertical, city, problem, what I did, results (each with a `source` field), date, `consent: boolean`. **The build fails if `placeholder: false` and `consent: false`.**                               |
| `/about/`                    | "About me / À propos"                                                                                                      | page file                    | Short, human, English then French on the same page with `lang="fr"` on the French section. Includes the approved ecommerce sentence, no category and no revenue. No military, address, family or phone.                                            |
| `/for/[vertical]/`           | e.g. "Get found on Google by people looking for [TODO]"                                                                    | `src/content/verticals/*.md` | One template and two markdown files. Each file sets the vertical's pain points, FAQ additions, and local keywords for title/meta.                                                                                                                  |
| `/engineering/`              | "Engineering work"                                                                                                         | migrated (§7)                | The old portfolio, cleaned up, and linked from the footer.                                                                                                                                                                                         |
| `/thanks/`                   | "Message sent"                                                                                                             | page file                    | `noindex`. The form redirects here.                                                                                                                                                                                                                |
| `/404.html`                  | "Page not found"                                                                                                           | page file                    | Includes a WhatsApp CTA and a link home.                                                                                                                                                                                                           |
| `/sitemap.xml`               |                                                                                                                            | `src/pages/sitemap.xml.ts`   | Built from `src/lib/routes.ts` + the i18n registry. Leaves out `/thanks/` and 404.                                                                                                                                                                 |
| `/robots.txt`                |                                                                                                                            | endpoint                     | `Allow: /` plus the sitemap URL, built from `site`.                                                                                                                                                                                                |
| `/about.html`, `/index.html` |                                                                                                                            | `redirects` in astro config  | GitHub Pages can't do real 301s, so Astro writes meta-refresh pages with canonical tags. `/index.html` already resolves to `/`.                                                                                                                    |

**Proof section on `/`:** this section always shows 3 slots. Real entries fill them first. Empty slots show a `Todo` card with dashed border, grey text, and the label "Case study coming soon". The literal `[TODO]` sits in an HTML comment and `data-todo` so the scanner finds it. **No invented names, logos, quotes or numbers. Ever.**

**Pricing:** all numbers come from `config.ts`. Until you fill them, each one renders as a marked "[TODO]" price. The FAQ copy covers what's included, contract length, and cancellation, each as `[TODO]` for you to confirm.

**FAQ** (draft questions; you approve the answers):

- "How long until I see results?" → honest answer: SEO usually takes months, often 3–6 before clear changes, and **I can't promise rankings or timelines**. Google decides.
- "Do I need a website already?"
- "What do you need from me?"
- "Do you speak French?"
- "What's in the monthly report?"
- "Can I cancel?" [TODO terms]

---

## 5. i18n (EN now, FR structured)

- Astro built-in `i18n`: `locales: ['en','fr']`, `defaultLocale: 'en'`, `prefixDefaultLocale: false`. EN lives at `/`, FR at `/fr/`.
- All homepage copy lives in typed dictionaries (`en.ts` is the source of truth, and `fr.ts` must have the same keys).
- `translations` registry in `src/i18n/index.ts` lists which routes have a finished FR version. **`hreflang` alternates (and sitemap alternates) are emitted only for pages that actually exist in both languages.** That avoids pointing Google at pages that don't exist. When nothing is translated, each page gets only a self-referencing `hreflang="en"` + `x-default`.
- `/fr/` is built only when `fr.ts` is complete. Until then the route isn't generated and nothing links to it. Enabling it is a one-line change.
- `/about/` is bilingual on one page by design. It's not a mirror, so it gets no hreflang pair.

---

## 6. SEO and technical checklist

- [ ] Unique `<title>` (≤ 60 chars) and meta description (≤ 155 chars) per page. Playwright checks uniqueness across all pages.
- [ ] `<link rel="canonical">` on every page, built from `site` + path with trailing slash.
- [ ] Open Graph + Twitter `summary_large_image` tags. One site-wide `og-default.png` (1200×630, name + one-line offer, high contrast). Per-page override supported.
- [ ] JSON-LD `ProfessionalService` on `/`, with `name`, `description`, `url`, `areaServed` (from config, `[TODO]` list of states/cities), `availableLanguage: ["en","fr"]`, `knowsLanguage`, `email` only if you approve it, `priceRange` from config. **No `address`.** `Person` for you on `/about/`. `BreadcrumbList` on case studies.
- [ ] `<html lang>` set correctly; `lang="fr"` on French blocks.
- [ ] One `<h1>` per page (tested), logical heading order, landmarks (`header`, `nav`, `main`, `footer`), skip link.
- [ ] Descriptive link text, with no "click here". External links say where they go.
- [ ] Alt text required by the content schema for every image. Decorative SVGs get `aria-hidden`.
- [ ] Colour tokens chosen to pass WCAG AA (4.5:1 body, 3:1 large text/UI), verified with Lighthouse a11y. Visible focus ring on everything.
- [ ] No layout shift: system fonts, explicit `width`/`height` on images, no late-loading banners.
- [ ] No cookies, no consent banner, no third-party scripts by default.
- [ ] Analytics: `PUBLIC_ANALYTICS=cloudflare|plausible|` + `PUBLIC_ANALYTICS_TOKEN` / `PUBLIC_PLAUSIBLE_DOMAIN`. Empty means no script. **Recommend Cloudflare Web Analytics**: free, cookieless, one deferred beacon.
- [ ] Contact: `https://wa.me/<number>?text=<prefilled, url-encoded>` click-to-chat link, `mailto:`, booking link, and a plain HTML `<form method="POST" action={PUBLIC_FORM_ENDPOINT}>` with a honeypot field and redirect to `/thanks/`. **The form doesn't render if the env var is empty.** It works with Formspree, Web3Forms or Basin. You pick one (TODO).
- [ ] `robots.txt` and sitemap; `/thanks/` and 404 are `noindex`.
- [ ] Lighthouse CI ≥ 0.95 ×4, mobile, every route.

---

## 7. Migrating the old content → `/engineering/`

- I'll port the **current** portfolio (YoBool, AIclinix, IntelliAPI, the intro and the Master's degree) and keep your voice, with light edits only.
- From history I'll restore **Pantry Pal** and **Express Food**, with their GitHub links, under "Earlier projects". **Isa Hair Salon** depends on D4.
- Links: GitHub and LinkedIn. **Resume** depends on D1.
- The page gets its own title and description ("Assane Diallo, software engineer: Rails, Node.js, Python") so recruiters who find you still get a proper page.
- One line at the top: "I now help small businesses get found on Google →" linking home.
- **Removed from the old content:** the personal email in body text (the address comes from `config.ts`) and anything on the honesty-rules list.
- Old anchor links `/#projects`, `/#about` and `/#contact` resolve on the new `/`: `#contact` exists there, and `#about`/`#projects` get small anchor targets pointing to `/about/` and `/engineering/`.

---

## 8. `[TODO]` mechanics

- `src/config.ts` exports every fact that's still unknown as the literal string `'[TODO]'` (typed as `Todo | string`).
- `<Todo label="…">` renders a visible, clearly marked placeholder and includes `[TODO]` in the HTML.
- `scripts/report-todos.ts` runs after `astro build` (as part of `pnpm build`). It scans `dist/**/*.html` and prints something like `12 [TODO] markers in 6 files:` with file:label lines. In GitHub Actions it also prints `::warning file=…::` annotations. **Exit code is always 0** (warn, don't fail).
- TODO.md is the human-readable list (§10). I keep it in sync, and the scanner helps you check it.

---

## 9. CI / workflow

`ci.yml` runs on PRs and on pushes to `develop`:

1. `pnpm install --frozen-lockfile`
2. `pnpm lint` (biome check)
3. `pnpm typecheck` (astro check)
4. `pnpm build` (astro build + TODO report → warnings)
5. `pnpm test:e2e` (Playwright smoke against `astro preview`)
6. `pnpm lhci` (Lighthouse CI on `dist/`, mobile, asserts ≥ 0.95 ×4)
7. `pnpm linkcheck` (linkinator on `dist/`)

`deploy.yml`: build, then `upload-pages-artifact` and `deploy-pages`. It's manual-only until you say otherwise (D2). Env vars come from repo **Variables** (`PUBLIC_*`, none of them secret).

**Playwright smoke checks:** every route returns 200; exactly one `h1`; non-empty unique title and description; canonical present and correct; the WhatsApp CTA is present with a `wa.me` href; no console errors; the 404 page renders; the first Tab reaches the skip link and the CTA is keyboard-reachable; no `hreflang` points at a page that doesn't exist.

**Commits:** small conventional commits, in roughly this order:

1. `chore: scaffold astro + tailwind + biome + ts strict`
2. `feat: base layout, seo component, config`
3. `feat(home): offer page sections`
4. `feat(work): case study collection + pages`
5. `feat(verticals): vertical landing template`
6. `feat(about)`
7. `feat(engineering): migrate old portfolio`
8. `feat: 404, robots, sitemap, redirects`
9. `feat(i18n): fr structure + hreflang`
10. `feat: contact form + analytics flag`
11. `feat: og image`
12. `build: todo report`
13. `test: playwright smoke`
14. `ci: lint/typecheck/build/test/lhci/linkcheck`
15. `ci: pages deploy`
16. `docs: README, CLAUDE.md, TODO.md`

Before I say "done" I'll paste the output of lint, typecheck, build (with TODO report), Playwright, Lighthouse CI and the link check.

---

## 10. Everything you must supply (becomes TODO.md)

### Business facts (`src/config.ts`)

- [ ] WhatsApp number (business line, international format). **Not** a personal number.
- [ ] Contact email. The site used `asn.diallo@outlook.com` before. Reuse it, or use a business address?
- [ ] Booking link (Cal.com / Calendly / Google Calendar appointment page)
- [ ] Prices: package names, setup fee, monthly fee, what's in each tier, minimum term, cancellation terms
- [ ] `areaServed`: which US states/cities, or "United States" + remote
- [ ] Business/brand name, if it's anything other than "Assane Diallo"
- [ ] Response-time promise, if any (e.g. "I reply within 1 business day")

### Positioning and copy

- [ ] The two verticals (slugs + display names), e.g. braiding salons, restaurants
- [ ] Wording for the community you serve. Exact phrasing matters, so I'll draft options and you choose (e.g. "African-owned", "African and Caribbean-owned", or specific diasporas).
- [ ] Approval of hero sentence, FAQ answers, and "how it works" steps
- [ ] Approval to use: "I built and grew an SEO-driven ecommerce store to ~800 pages with no ad spend."
- [ ] Languages you offer (EN/FR; Wolof or others?)
- [ ] About page: 2–4 sentences in your own words, EN and FR
- [ ] Photo of you (optional; it helps trust a lot): a square image of at least 800px
- [ ] French homepage copy (or approval for me to draft it for your review)

### Proof

- [ ] Case study 1–3: client (with written consent to be named, or anonymised), what you did, real results with source and date. Screenshots of GBP Insights are ideal.
- [ ] D4: Isa Hair Salon, yes or no, plus consent
- [ ] Testimonials: only real ones, with permission. None will be shown until you supply them.

### Infrastructure

- [ ] Form service choice + endpoint URL (Formspree / Web3Forms / Basin)
- [ ] Analytics choice + token (Cloudflare recommended)
- [ ] D1 resume decision; D2 go-live approval; D3 Pages source switch
- [ ] Custom domain? The site stays on `asndiallo.github.io` unless you say otherwise. A domain later is a one-line `site` change plus a `CNAME`.

---

## 11. Out of scope for this pass

- Blog/articles, CMS, client portal, payments.
- Per-page generated OG images (one shared image for now; the template makes per-page images easy to add later).
- Rewriting git history to purge the resume PDF.
