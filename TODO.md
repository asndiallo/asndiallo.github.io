# TODO: what Assane needs to supply

`pnpm build` prints every `[TODO]` still visible on the site. Keep this list in sync with it.
The site shouldn't go live (manual deploy) until the **Before launch** section is done.

## Before launch: done (confirmed by Assane on 2026-10-18; site live the same day)

### Contact facts (`src/config.ts`)

- [x] Email: `hello@assane-diallo.com` (set in `src/config.ts`). Never in the HTML; the "Email me" link is assembled in the browser. Mail only arrives once Email Routing is set up.
- [x] Booking link: Cal.com `assane-diallo/free-check-up` (phone call; Gmail + Zoho checked for conflicts, bookings written to Zoho). Replaced the Google Calendar appointment page on 2026-10-20.
- [x] WhatsApp number: switched to a separate line (`12109605715`)

### Isa's African Hair Braiding case study (`src/content/work/isa-african-hair-braiding.md`)

- [x] Before / what I did / booking (Telegram booking-request alerts) / 3-month results: filled in from your notes and her Google Business Profile performance screen
- [x] **Confirm the owner is OK with these numbers being public** (calls, directions, website clicks, views, search terms)
- [x] **Quote** from the owner, optional and only with permission
- [x] **Confirm** she's OK with the homepage screenshot of isabraiding.com (`src/assets/work/isa-braiding.png`, taken 2026-10-18)
- [x] Optional: a before/after comparison (e.g. calls in the 3 months after claiming vs. now) would make a stronger story than totals alone

### Djidiawax (`src/content/work/{en,fr}/djidiawax.md`), in progress

- [x] **Confirm the owner agreed** to be named and shown (case study marked "in progress", no numbers)
- [x] Results later: only numbers the owner approves, each with a source
- [x] Confirm the screenshot of djidiawax.com is OK (`src/assets/work/djidiawax.png`, taken 2026-10-18)

### French version

- [x] **Review all French copy**: `src/i18n/fr.ts` and the `fr/` content files. Drafted by me for francophone owners in the US; US search examples stay in English ("braiding near me").

### Vertical pages

- [x] Booking line on vertical pages: kept generic ("A booking link that works on a phone")

### About page (`src/pages/about.astro`)

- [x] Your own words on why this work matters (EN and FR), shown as the last About paragraph

### Copy to approve

Everything I wrote that isn't word-for-word from your `site-copy.md`:

- [x] Home, **"Who this is for"** section (the spec asked for it; your copy doc didn't have it)
- [x] Home, **services heading** changed from "One clear package, done for you" to **"What I set up for you"**, since there are now two packages. There's also a note that the website and search pages come with Profile + Website.
- [x] Home, **pricing section**: heading "Prices", intro line, tier summaries ("For businesses that don't need a website yet." / "Everything in Google Profile, plus…")
- [x] Home, **FAQ**: the "What does it cost?" answer is generated from the prices; "Is there a contract?" is new; "Do you work with businesses outside your city?" now says "anywhere in the US"
- [x] Home, **hero illustration** of a Google listing for "Your business name" (captioned as an illustration). It shows five decorative stars with no rating number.
- [x] **/for/restaurants/**: all copy (follows your vertical template)
- [x] **/for/braiding-salons/**: "knotless braids in [TODO: city]" became "in your city" (you serve the whole US)
- [x] **/about/**: the English and French paragraphs (built only from approved facts)
- [x] **/work/**: intro line; **/engineering/**: lightly edited from your old portfolio (YoBool now also mentions auth, Stripe Connect and the React Native app, from your resume)
- [x] **OG image** text (`scripts/generate-og.ts`)

### Hosting, domain and email (status in DOMAIN-SETUP.md)

- [x] **Zoho Mail** for <hello@assane-diallo.com> (Cloudflare forwarding removed 2026-10-18; mail bounces until Zoho's MX records are added)
- [x] One DMARC record (Cloudflare reporting, `p=none`)
- [x] workers.dev subdomain `assane-diallo`
- [x] API token secret set; preview live at <https://assane-diallo.assane-diallo.workers.dev>
- [x] Review the preview URL, then say "go live" (custom domain, www redirect, github.io redirect, merge)
- [x] Spaceship: 2FA, WHOIS privacy, registrar lock, auto-renew (renews 2027-10-18)

### Infrastructure

- [x] Go-live approval. Then add the `push` trigger to `deploy.yml` if you want automatic deploys.

## Optional (the site works without these)

- [ ] **Contact form**: pick Formspree, Web3Forms or Basin and set the repo variable `PUBLIC_FORM_ENDPOINT`. (The markup uses Formspree field names `_gotcha`/`_next`; tell me if you pick another service.) The privacy page then lists the form automatically; add the chosen service to its "Services involved" list.
- [x] **Privacy note** (`/privacy/`, `/fr/confidentialite/`, added 2026-10-19): what the site and each contact channel collect, use, 12-month retention for non-clients, deletion on request. Text in `src/i18n/{en,fr}.ts` → `privacy`; update the date in `src/components/views/Privacy.astro` whenever it changes. Not legal advice; have it reviewed if the business grows.
- [ ] **Analytics**: Cloudflare Web Analytics (recommended, free, cookieless). Set `PUBLIC_ANALYTICS=cloudflare` and `PUBLIC_CF_BEACON_TOKEN`.
- [x] Photo of you: on /about/ and the home page (added 2026-10-18)
- [ ] **More case studies** as founding clients finish. The home page shows only case studies with approved results (no empty cards); with a single one, its numbers fill the row.
- [ ] **Languages**: anything besides English and French (e.g. Wolof)?
- [ ] **Canada / France**: deferred. France would need a French legal notice page (mentions légales) and EUR (HT) prices.
- [ ] **Old resume PDF**: removed from the site, but it's still in git history, which is public on GitHub (it has your phone number). Rewriting history is a separate decision.
