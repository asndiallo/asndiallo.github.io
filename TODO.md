# TODO: what Assane needs to supply

`pnpm build` prints every `[TODO]` still visible on the site. Keep this list in sync with it.
The site shouldn't go live (manual deploy) until the **Before launch** section is done.

## Before launch

### Contact facts (`src/config.ts`)
- [x] Email: `hello@assane-diallo.com` (set in `src/config.ts`). Never in the HTML; the "Email me" link is assembled in the browser. Mail only arrives once Email Routing is set up.
- [x] Booking link: set (Google Calendar appointment page)
- [x] WhatsApp number: switched to a separate line (`12109605715`)

### Isa's African Hair Braiding case study (`src/content/work/isa-african-hair-braiding.md`)
- [x] Before / what I did / booking (Telegram booking-request alerts) / 3-month results: filled in from your notes and her Google Business Profile performance screen
- [ ] **Confirm the owner is OK with these numbers being public** (calls, directions, website clicks, views, search terms)
- [ ] **Quote** from the owner, optional and only with permission
- [ ] **Confirm** she's OK with the homepage screenshot of isabraiding.com (`src/assets/work/isa-braiding.png`, taken 2026-10-18)
- [ ] Optional: a before/after comparison (e.g. calls in the 3 months after claiming vs. now) would make a stronger story than totals alone

### Djidiawax (`src/content/work/{en,fr}/djidiawax.md`), in progress
- [ ] **Confirm the owner agreed** to be named and shown (case study marked "in progress", no numbers)
- [ ] Results later: only numbers the owner approves, each with a source
- [ ] Confirm the screenshot of djidiawax.com is OK (`src/assets/work/djidiawax.png`, taken 2026-10-18)

### French version
- [ ] **Review all French copy**: `src/i18n/fr.ts` and the `fr/` content files. Drafted by me for francophone owners in the US; US search examples stay in English ("braiding near me").
- [ ] French about page: 2–4 sentences in your own words (marked on `/fr/a-propos/`)

### Vertical pages
- [ ] **Booking platform** for braiding salons: "A booking link that works on a phone [TODO: confirm platform option]". Suggestion based on the Isa work: "your existing booking tool, or a free booking request form that alerts you on WhatsApp or Telegram". OK?
- [ ] **Ordering/catering platform** for restaurants: same question (the French pages carry the same two markers)

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

### Domain (follow DOMAIN-SETUP.md)
- [ ] Spaceship: 2FA, WHOIS privacy, registrar lock, auto-renew (renews 2027-10-18)
- [ ] GitHub: verify `assane-diallo.com` in account settings (TXT record)
- [ ] GitHub: custom domain in Settings → Pages, then Enforce HTTPS
- [ ] Cloudflare: GitHub Pages A/AAAA records + `www` CNAME, proxy **off**
- [ ] Cloudflare Email Routing: `hello@assane-diallo.com` → Gmail. **Confirm routing works** (the site already shows this address)
- [ ] DMARC Management on, `p=none` to start
- [ ] Decide how to *send* as hello@ (Workspace, Spacemail, Zoho…). Until then, replies come from Gmail
- [ ] `pnpm verify:domain` passes

### Infrastructure
- [ ] **Pages source** → GitHub Actions (Settings → Pages), then run the "Deploy to GitHub Pages" workflow. I can do the switch with `gh api` when you say go.
- [ ] Go-live approval. Then add the `push` trigger to `deploy.yml` if you want automatic deploys.

## Optional (the site works without these)

- [ ] **Contact form**: pick Formspree, Web3Forms or Basin and set the repo variable `PUBLIC_FORM_ENDPOINT`. (The markup uses Formspree field names `_gotcha`/`_next`; tell me if you pick another service.)
- [ ] **Analytics**: Cloudflare Web Analytics (recommended, free, cookieless). Set `PUBLIC_ANALYTICS=cloudflare` and `PUBLIC_CF_BEACON_TOKEN`.
- [ ] **Photo of you** (square, ≥ 800px) for /about/. It helps trust a lot.
- [ ] **More case studies** as founding clients finish (2 placeholder cards are on the home page now).
- [ ] **Languages**: anything besides English and French (e.g. Wolof)?
- [ ] **Canada / France**: deferred. France would need a French legal notice page (mentions légales) and EUR (HT) prices.
- [ ] **Old resume PDF**: removed from the site, but it's still in git history, which is public on GitHub (it has your phone number). Rewriting history is a separate decision.
