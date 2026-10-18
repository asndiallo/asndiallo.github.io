# TODO: what Assane needs to supply

`pnpm build` prints every `[TODO]` still visible on the site. Keep this list in sync with it.
The site shouldn't go live (manual deploy) until the **Before launch** section is done.

## Before launch

### Contact facts (`src/config.ts`)
- [ ] **WhatsApp number**: a business line, digits only, with country code (e.g. `15551234567`). Not a personal number. It powers every "Message me on WhatsApp" button.
- [ ] **Email**: the old site used `asn.diallo@outlook.com`. Keep it, or use a business address?
- [ ] **Booking link** for the free 15-minute check-up (Cal.com, Calendly, or a Google Calendar appointment page)

### Isa's African Hair Braiding case study (`src/content/work/isa-african-hair-braiding.md`)
- [ ] **Before**: what their Google profile and website looked like before. Calls or direction requests per month, if known.
- [ ] **Google profile work**: what you changed (categories, photos, services, booking link)
- [ ] **Booking tool**: which one you set up
- [ ] **After**: results over a stated period, only numbers the owner approves, each with its source (e.g. Google Business Profile insights). If there are no numbers yet, I'll remove the "After" section rather than leave it empty.
- [ ] **Quote** from the owner, optional and only with permission
- [ ] **Confirm** the owner is OK with the home-page screenshot of isabraiding.com being shown (`src/assets/work/isa-braiding.png`, taken 2026-10-18)

### Vertical pages
- [ ] **Booking platform** for braiding salons: "A booking link that works on a phone [TODO: confirm platform option]". Name a tool you support, or say "your existing tool"?
- [ ] **Ordering/catering platform** for restaurants: same question

### About page (`src/pages/about.astro`)
- [ ] 2–4 sentences in your own words on why this work matters to you (EN)
- [ ] The same in French (FR)

### Copy to approve
Everything I wrote that isn't word-for-word from your `site-copy.md`:
- [ ] Home, **"Who this is for"** section (the spec asked for it; your copy doc didn't have it)
- [ ] Home, **services heading** changed from "One clear package, done for you" to **"What I set up for you"**, since there are now two packages. There's also a note that the website and search pages come with Profile + Website.
- [ ] Home, **pricing section**: heading "Prices", intro line, tier summaries ("For businesses that don't need a website yet." / "Everything in Google Profile, plus…")
- [ ] Home, **FAQ**: the "What does it cost?" answer is generated from the prices; "Is there a contract?" is new; "Do you work with businesses outside your city?" now says "anywhere in the US"
- [ ] Home, **hero illustration** of a Google listing for "Your business name" (captioned as an illustration). It shows five decorative stars with no rating number.
- [ ] **/for/restaurants/**: all copy (follows your vertical template)
- [ ] **/for/braiding-salons/**: "knotless braids in [TODO: city]" became "in your city" (you serve the whole US)
- [ ] **/about/**: the English and French paragraphs (built only from approved facts)
- [ ] **/work/**: intro line; **/engineering/**: lightly edited from your old portfolio (YoBool now also mentions auth, Stripe Connect and the React Native app, from your resume)
- [ ] **OG image** text (`scripts/generate-og.ts`)

### Infrastructure
- [ ] **Pages source** → GitHub Actions (Settings → Pages), then run the "Deploy to GitHub Pages" workflow. I can do the switch with `gh api` when you say go.
- [ ] Go-live approval. Then add the `push` trigger to `deploy.yml` if you want automatic deploys.

## Optional (the site works without these)

- [ ] **Contact form**: pick Formspree, Web3Forms or Basin and set the repo variable `PUBLIC_FORM_ENDPOINT`. (The markup uses Formspree field names `_gotcha`/`_next`; tell me if you pick another service.)
- [ ] **Analytics**: Cloudflare Web Analytics (recommended, free, cookieless). Set `PUBLIC_ANALYTICS=cloudflare` and `PUBLIC_CF_BEACON_TOKEN`.
- [ ] **Photo of you** (square, ≥ 800px) for /about/. It helps trust a lot.
- [ ] **French homepage**: translate the rest of `src/i18n/fr.ts` (or approve a draft from me), then publish `/fr/`.
- [ ] **More case studies** as founding clients finish (2 placeholder cards are on the home page now).
- [ ] **Languages**: anything besides English and French (e.g. Wolof)?
- [ ] **Custom domain**: none now. If you want one later, it's a `site` change plus a CNAME.
- [ ] **Old resume PDF**: removed from the site, but it's still in git history, which is public on GitHub (it has your phone number). Rewriting history is a separate decision.
