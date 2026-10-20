# Hosting, domain and email: assane-diallo.com

The runbook for how the site is hosted and how the domain and email are wired. Technical values were checked against Cloudflare's, GitHub's and Google's docs on **2026-10-18** (sources at the end).

## Architecture

```text
            visitors
               │  https://assane-diallo.com   (www.assane-diallo.com → 301 → apex)
               ▼
   ┌───────────────────────────┐
   │ Cloudflare (zone + DNS)   │  Registrar: Spaceship (nameservers only, no transfer)
   │ Worker "assane-diallo"    │  Static assets from dist/, no Worker code
   │  · _headers  security + cache
   │  · _redirects real 301s
   │  · 404.html, trailing slashes
   └───────────────────────────┘
               ▲
               │ wrangler deploy (only after lint, typecheck, build, Playwright, Lighthouse, links pass)
   ┌───────────────────────────┐
   │ GitHub Actions            │  PRs: preview URL on workers.dev, posted as a comment
   └───────────────────────────┘

   hello@assane-diallo.com → Zoho Mail (EU)
```

**Why Cloudflare Workers.** Cloudflare recommends Workers static assets for new static sites. Static asset requests are free and unlimited. DNS and hosting sit in the same place, so there's no proxy-versus-certificate conflict. It also gives real HTTP headers (HSTS, CSP), real 301 redirects and a preview URL per pull request. GitHub Pages can do none of these.

**Single source of truth.** The domain lives only in `src/config.ts` (`SITE_URL`, `SITE_NAME`, `CONTACT_EMAIL`).

## Status

|     | Item                                                                                                                                                                                                                                                                                                                                                                    | By           | When       |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ | ---------- |
| ✅  | Domain registered at Spaceship (expires 2027-10-18); nameservers on Cloudflare                                                                                                                                                                                                                                                                                          | you          | before     |
| ✅  | Zone `assane-diallo.com` active on Cloudflare (Free plan)                                                                                                                                                                                                                                                                                                               | you          | before     |
| ↩️  | Cloudflare Email Routing: enabled, then **removed** at your request to switch to Zoho. Disabling removed its 3 MX, SPF and DKIM records; the `hello@` rule and the Gmail destination were deleted                                                                                                                                                                       | Claude       | 2026-10-18 |
| ✅  | DMARC Management enabled                                                                                                                                                                                                                                                                                                                                                | Claude       | 2026-10-18 |
| ✅  | GitHub secret `CLOUDFLARE_ACCOUNT_ID`                                                                                                                                                                                                                                                                                                                                   | Claude       | 2026-10-18 |
| ✅  | workers.dev subdomain `assane-diallo`                                                                                                                                                                                                                                                                                                                                   | you          | 2026-10-18 |
| ✅  | GitHub secret `CLOUDFLARE_API_TOKEN` ("Edit Cloudflare Workers")                                                                                                                                                                                                                                                                                                        | you          | 2026-10-18 |
| ✅  | One DMARC record: `v=DMARC1; p=none; sp=none; adkim=r; aspf=r; rua=` <hello@assane-diallo.com> + Cloudflare DMARC Management; `ruf=` hello@ (duplicate from the Zoho setup merged)                                                                                                                                                                                      | Claude       | 2026-10-18 |
| ✅  | First deploy (one-time, local `wrangler deploy` after `wrangler login`): <https://assane-diallo.assane-diallo.workers.dev>                                                                                                                                                                                                                                              | Claude       | 2026-10-18 |
| ✅  | PR previews working: <https://pr-1-assane-diallo.assane-diallo.workers.dev>                                                                                                                                                                                                                                                                                             | CI           | 2026-10-18 |
| ✅  | Preview reviewed; go-live approved                                                                                                                                                                                                                                                                                                                                      | you          | 2026-10-18 |
| ✅  | **Live**: Custom Domain `assane-diallo.com` on the Worker (Google Trust Services certificate), `workers.dev` off                                                                                                                                                                                                                                                        | Claude       | 2026-10-18 |
| ✅  | www → apex 301 (proxied `AAAA www 100::` + Redirect Rule), Always Use HTTPS on, minimum TLS 1.2                                                                                                                                                                                                                                                                         | Claude       | 2026-10-18 |
| ✅  | GitHub Pages switched to Actions; `SITE_LIVE=true`; asndiallo.github.io serves the redirect-only build                                                                                                                                                                                                                                                                  | Claude       | 2026-10-18 |
| ✅  | PR #1 merged; Deploy runs on every push to `develop`; `pnpm verify:domain` 9/9                                                                                                                                                                                                                                                                                          | Claude       | 2026-10-18 |
| ✅  | Zoho Mail (EU): MX, SPF `include:zohomail.eu`, DKIM, verification                                                                                                                                                                                                                                                                                                       | you          | 2026-10-18 |
| ✅  | GitHub Pages removed (no redirect build for asndiallo.github.io); repo renamed to `asndiallo/assane-diallo.com`                                                                                                                                                                                                                                                         | Claude       | 2026-10-18 |
| ✅  | GitHub security: Dependabot alerts + security updates + version updates (`.github/dependabot.yml`), secret scanning with push protection, CodeQL, private vulnerability reporting, read-only default token, only GitHub-owned actions + `pnpm/action-setup` allowed with SHA pinning required, ruleset "Protect develop" (PR + passing `check`, no force push/deletion) | Claude       | 2026-10-18 |
| ✅  | Cloudflare Web Analytics (cookieless) in every page; Workers Logs enabled                                                                                                                                                                                                                                                                                               | Claude       | 2026-10-18 |
| ✅  | Zone: Always Use HTTPS, TLS 1.3, HTTP/3 on; minimum TLS 1.2; email obfuscation off; Bot Fight Mode and JavaScript detections off (they challenged CI checks and injected a script the CSP blocks)                                                                                                                                                                       | Claude + you | 2026-10-18 |
| ✅  | DNSSEC active (DS record added at Spaceship)                                                                                                                                                                                                                                                                                                                            | Claude + you | 2026-10-18 |
| ⏳  | **Access on preview URLs** (drafts): needs Zero Trust enabled once in the dashboard (below)                                                                                                                                                                                                                                                                             | you          |            |

## Remaining dashboard steps

1. **Access on preview URLs.** Zero Trust → enable it once (team name `assane-diallo`, **Free** plan). Then **Workers & Pages → assane-diallo → Access → Protect this Worker behind Access → Previews only**, policy **Cloudflare account** (only you), **Apply Access**. PR previews then ask for a one-time code; the live site is unaffected. (The API refuses until Zero Trust is enabled: "Access is not enabled".)
2. **Crawler Hints.** Caching → Configuration → **Crawler Hints** on (dashboard only; tells Bing and other IndexNow engines when pages change).
3. **Account security.** Make sure 2FA is on for Cloudflare and GitHub, and give the deploy API token an expiry date you'll remember to renew.

## Initial dashboard steps (done)

These need the dashboard: the CLI has no command for 1 and 3, and for 2 you create the secret yourself so it never passes through Claude.

1. **workers.dev subdomain.** Go to **Workers & Pages**, then click **Change** next to _Your subdomain_, and enter `assane-diallo`. URLs look like `<worker>.assane-diallo.workers.dev`, so a bare `assane-diallo.workers.dev` isn't possible. It's used for previews only; it's switched off for the main site at go-live.
2. **Deploy API token.** Go to **Manage account → Account API tokens → Create Token**:
   - Choose the template **Edit Cloudflare Workers**.
   - Under **Account Resources**, pick your account. Under **Zone Resources**, pick **Specific zone → assane-diallo.com**.
   - Create it and copy it. Then, in the terminal here, run `! gh secret set CLOUDFLARE_API_TOKEN` and paste it when prompted. It never appears in the chat or the repo.
3. **DMARC record.** Go to **Email → DMARC Management** and click **Add** for the DMARC record. Cloudflare fills in its own report address (`rua`). Keep `p=none` to start: it only monitors, nothing is blocked. The Cloudflare API has no call to create this record, and its report address isn't documented, so Claude doesn't guess it.

## Go-live (Claude runs these after you say go)

Each step is shown before it runs.

1. **Custom domain.** Add `{ "pattern": "assane-diallo.com", "custom_domain": true }` to `routes` in `wrangler.jsonc` and set `"workers_dev": false`. On deploy, Cloudflare creates the DNS record and the certificate. ([Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/))
2. **www → apex.** Create a proxied placeholder record `AAAA www → 100::` and a Single Redirect rule: `https://www.*` → `https://${1}`, status 301, query string preserved. ([Redirect from WWW to root](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/); the placeholder record is required per the Custom Domains doc)
3. **Zone settings.** Turn on Always Use HTTPS and set minimum TLS to 1.2.
4. **Live checks.** Set the repo variable `SITE_LIVE=true`; the Deploy workflow then runs `pnpm verify:domain` after each deploy. (Until 2026-10-18 this step also published a redirect-only build to `asndiallo.github.io` on GitHub Pages; that was removed because nobody used the old address.)
5. **Merge** the PR into `develop`. Optionally enable deploy-on-push (see the comment in `.github/workflows/deploy.yml`).
6. **Verify.** `pnpm verify:domain` must show all checks passing.

**HSTS note.** The site sends `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Once browsers have seen it, they refuse plain HTTP on the domain and its subdomains for a year. That's intended. Don't add `preload` unless you're sure, because removal from browsers' preload lists takes months.

## Email

**Receiving** works once the routing rule exists: `hello@assane-diallo.com` forwards to Gmail.

**Sending as hello@ is not set up.** Email Routing only forwards. Options:

| Option                             | Cost (as listed 2026-10-18)                                                                    | Notes                                                                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Gmail "Send mail as" with SMTP     | Free                                                                                           | **Not recommended.** Google removes "Send as" for non-Google addresses in **January 2027** and may already block new setups. |
| Google Workspace Business Starter  | **$7.00/user/month** ($3.50 introductory, Nov 1 2026 – Feb 1 2027)                             | A real mailbox with Gmail's interface. Replaces Email Routing (MX → Google).                                                 |
| Spacemail (Spaceship)              | about **$0.79–$0.98/mailbox/month**, higher on renewal                                         | Cheapest mailbox. Replaces Email Routing.                                                                                    |
| Zoho Mail                          | Free for up to 5 users (not in every region); Mail Lite about **$1/user/month**, billed yearly | Replaces Email Routing.                                                                                                      |
| Cloudflare Email Service (sending) | Workers Paid plan; 3,000 emails/month included, then **$0.35/1,000**                           | For app or website mail (API/SMTP, beta), not a personal inbox.                                                              |

If you switch to a mailbox provider: remove Email Routing, follow that provider's DNS steps, and **merge** its `include:` into the one SPF record. Never add a second SPF record.

**SPF**, in plain words: the list of servers allowed to send mail as `@assane-diallo.com`. `~all` means "treat anything else as suspicious".

**DMARC**, in plain words: what receiving servers should do with mail that fails those checks, plus where to send reports. Start with `p=none` (monitor only). After 2–4 weeks of clean reports, move to `p=quarantine`, then `p=reject`. That timeline is a recommendation, not a Cloudflare rule. You don't send mail from this domain yet, so `p=reject` will be safe sooner.

## Spaceship checklist (do once)

- [ ] 2FA on in the **Security Center** (authenticator app, passkey or hardware key); backup codes saved
- [ ] WHOIS privacy on (free, automatic; confirm in the domain's settings)
- [ ] Registrar lock on (free)
- [ ] Auto-renew on, with a valid payment method. `.com` renews at **$9.98/year** plus a **$0.20** ICANN fee; redemption after lapse costs **$41.40** extra
- [ ] Do **not** transfer the domain or change the nameservers. Website and email both depend on Cloudflare DNS

## Verify

```bash
pnpm verify:domain                    # HTTPS, http→https, www→apex, /about.html 301,
                                      # security headers, immutable caching, sitemap, canonical, robots
VERIFY_ATTEMPTS=1 pnpm verify:domain  # one quick pass

dig assane-diallo.com MX +short       # route1/2/3.mx.cloudflare.net
dig assane-diallo.com TXT +short      # one v=spf1 record
dig _dmarc.assane-diallo.com TXT +short
curl -sI https://assane-diallo.com/ | grep -iE '^(HTTP|strict-transport|content-security)'
curl -sI https://www.assane-diallo.com/ | grep -i location   # https://assane-diallo.com/
```

## Rollback

| Problem                 | What to do                                                                                                                                                       |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A deploy broke the site | `pnpm exec wrangler rollback` (or in the dashboard, Worker → Deployments → roll back). Previous versions stay available.                                         |
| The domain must go dark | Remove the `routes` entry and run the Deploy workflow, or delete the Custom Domain in the dashboard. Leave Email Routing alone; it's independent of the website. |
| Email not arriving      | Check that the destination shows **Verified** and look at the Email Routing activity log. Disabling the rule stops forwarding without touching the website.      |

## Troubleshooting

- **Deploy fails with an auth error.** The `CLOUDFLARE_API_TOKEN` secret is missing or lacks the "Edit Cloudflare Workers" permissions on your account and zone.
- **"You need to register a workers.dev subdomain".** Dashboard step 1.
- **Custom domain fails to attach.** Cloudflare refuses a Custom Domain on a hostname that already has a CNAME record. Remove any manual `@` record first.
- **`ERR_TOO_MANY_REDIRECTS` on `www`.** Check that only one redirect rule exists for `www` and that the `www` record is proxied (orange cloud).
- **Routing rule error 2054.** The destination address isn't verified yet (click the email).
- **CSP errors in the browser console.** An inline script was added outside `src/lib/inline-scripts.ts`. Bundle it with a normal `<script>` instead.

## Sources

- Cloudflare Workers: [Static assets](https://developers.cloudflare.com/workers/static-assets/) · [Use Workers for new projects](https://developers.cloudflare.com/workers/best-practices/workers-best-practices/#use-workers-static-assets-for-new-projects) · [Billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/#billing) · [Headers](https://developers.cloudflare.com/workers/static-assets/headers/) · [Redirects](https://developers.cloudflare.com/workers/static-assets/redirects/) · [Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/) · [workers.dev](https://developers.cloudflare.com/workers/configuration/routing/workers-dev/) · [Wrangler configuration](https://developers.cloudflare.com/workers/wrangler/configuration/) · [GitHub Actions](https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/)
- Cloudflare rules and email: [Redirect www to root](https://developers.cloudflare.com/rules/url-forwarding/examples/redirect-www-to-root/) · [Email Routing](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/) · [Email Routing DNS records](https://developers.cloudflare.com/email-routing/setup/email-routing-dns-records/) · [DMARC Management](https://developers.cloudflare.com/dmarc-management/enable/) · [Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- Astro: [security.csp](https://docs.astro.build/en/reference/configuration-reference/#securitycsp)
- Google: [Send as](https://support.google.com/mail/answer/22370?hl=en) · [Third-party account changes](https://support.google.com/mail/answer/17101213?hl=en) · [Workspace pricing](https://workspace.google.com/pricing)
- Spaceship: [.com pricing](https://www.spaceship.com/domains/gtld/com/) · [Security](https://www.spaceship.com/security/) · [Spacemail](https://www.spaceship.com/business-email/) · Zoho: [Mail pricing](https://www.zoho.com/mail/zohomail-pricing.html)
