# Domain setup: assane-diallo.com

A step-by-step guide to follow by hand. Nothing here needs passwords in the repo, and Claude does not touch DNS or any account.

Technical values were checked against GitHub's and Cloudflare's official docs on **2026-10-18** (sources at the end). Where something comes from community reports or a live test rather than official docs, it says so.

## Where things stand

| Piece | Status (checked 2026-10-18) |
|---|---|
| Domain | `assane-diallo.com`, registered at **Spaceship**, expires **2027-10-18** |
| Nameservers | Already on Cloudflare: `brit.ns.cloudflare.com`, `jaime.ns.cloudflare.com` |
| DNS records | None yet (no A, AAAA, www, MX or TXT) |
| Hosting | GitHub Pages, repo `asndiallo/asndiallo.github.io`, deployed by the "Deploy to GitHub Pages" workflow |
| Canonical URL | `https://assane-diallo.com` (apex, no www), set in `src/config.ts` |

What the repo already does:

- `SITE_URL`, `SITE_NAME`, `CONTACT_EMAIL` and `LEGACY_SITE_URL` live only in `src/config.ts`. Astro's `site`, canonical and Open Graph URLs, JSON-LD, the sitemap, `robots.txt`, `CNAME`, the OG image and the checks below all read them.
- `dist/CNAME` is generated from `SITE_URL`. **GitHub ignores it** when you deploy with a custom Actions workflow, like this repo does. The custom domain is kept by the setting in step 4, not by the file. The file is still useful if you ever publish from a branch again.
- `pnpm verify:domain` checks the live domain (step 8). It also runs after every deploy as a non-blocking job.

## The order matters

GitHub recommends adding the domain to GitHub **before** pointing DNS at it. DNS records that point to GitHub without a matching repository can let someone else publish a site on your domain. So the order below is:

1. Spaceship: secure the account
2. GitHub: verify the domain (one TXT record)
3. GitHub: switch Pages to GitHub Actions and deploy the new site
4. GitHub: add the custom domain
5. Cloudflare: website DNS records (proxy off)
6. GitHub: enforce HTTPS
7. Cloudflare: email routing, SPF and DMARC
8. Verify everything

---

## 1. Spaceship: secure the account and the domain

Do **not** transfer the domain. Spaceship stays the registrar; Cloudflare only answers DNS.

- [ ] **Two-factor authentication.** Turn it on in Spaceship's **Security Center**. It supports authenticator apps (TOTP), passkeys and hardware keys. Save the backup codes in your password manager.
- [ ] **WHOIS privacy.** Spaceship applies it for free to every domain. Open the domain's settings and confirm it's on.
- [ ] **Registrar lock.** Free at Spaceship. Turn it on to block unauthorized transfers.
- [ ] **Auto-renew.** Turn it on in the domain's settings and make sure a valid payment method is on file. (Spaceship's public docs don't show the exact menu. Look in the domain list or the domain's settings page.)
- [ ] **Renewal price.** Spaceship lists `.com` renewal at **$9.98/year**, plus ICANN's **$0.20/year** fee. Prices can change. If the domain lapses past the grace period, `.com` redemption costs **$41.40** on top of renewal. Your domain expires **2027-10-18**.
- [ ] **Nameservers.** Already done. To confirm, run:

  ```bash
  dig assane-diallo.com NS +short
  # expect: brit.ns.cloudflare.com. and jaime.ns.cloudflare.com.
  ```

  If you ever need to change them: in Spaceship, open **Advanced DNS** for the domain, then **Nameservers → Change → Custom**, and enter the two Cloudflare nameservers. Spaceship warns that any Spaceship-hosted DNS, hosting or email connections stop working when you switch.

## 2. GitHub: verify the domain (takeover protection)

This is done in your **account** settings, not the repository settings.

1. Click your profile picture, then **Settings → Pages** (under "Code, planning, and automation").
2. Click **Add a domain**, enter `assane-diallo.com`, then click **Add domain**.
3. GitHub shows a TXT record to create. In Cloudflare, go to **DNS → Records → Add record**:
   - Type: `TXT`
   - Name: `_github-pages-challenge-asndiallo` (Cloudflare adds `.assane-diallo.com` itself)
   - Content: the value GitHub shows
4. Check that it's visible:

   ```bash
   dig _github-pages-challenge-asndiallo.assane-diallo.com +nostats +nocomments +nocmd TXT
   ```

5. Back in GitHub, click **Verify**. If you left the page, click the **⋯** menu next to the domain, then **Continue verifying**.
6. **Keep this TXT record forever.** Removing it un-verifies the domain.

Once verified, only repositories you own can publish to `assane-diallo.com` and its immediate subdomains.

## 3. GitHub: switch Pages to Actions and deploy the new site

The repo still publishes the old portfolio from the `develop` branch ("legacy" mode). Do this when you're ready for the new site to go public. TODO.md lists what's left.

1. Merge the new site into `develop`.
2. Go to the repository's **Settings → Pages → Build and deployment → Source** and choose **GitHub Actions**.
3. Go to **Actions → Deploy to GitHub Pages → Run workflow**.

## 4. GitHub: add the custom domain

1. Go to the repository's **Settings → Pages**.
2. Under **Custom domain**, type `assane-diallo.com` and click **Save**.

GitHub starts a DNS check. It fails until step 5 is done, which is expected.

## 5. Cloudflare: website DNS records (proxy OFF)

In Cloudflare, go to **DNS → Records**. Make sure there are **no other** A, AAAA, ALIAS or CNAME records on `@` or `www`. GitHub says extra records there can stop the HTTPS certificate from being issued.

Add these records. Set every one to **DNS only** (grey cloud) and TTL **Auto**:

| Type | Name | Content |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `asndiallo.github.io` |

Notes:

- The `www` CNAME points to `asndiallo.github.io` **without** a repository name.
- With both the apex and `www` records in place, GitHub automatically redirects `www.assane-diallo.com` to `assane-diallo.com`.
- Don't create wildcard records such as `*.assane-diallo.com`. GitHub warns they create takeover risk even on a verified domain.
- DNS changes can take up to 24 hours to propagate. On Cloudflare they usually show up within minutes.

### Should the Cloudflare proxy (orange cloud) be on?

**My recommendation: leave it off.** GitHub Pages already serves the site over a CDN with its own Let's Encrypt certificate, so the proxy adds little for a static site.

The proxy also comes with a known risk. GitHub's DNS check and certificate issuing expect to see GitHub's IP addresses. Behind the proxy they see Cloudflare's, and issuing or **renewing** the certificate can fail. (This is widely reported by GitHub and Cloudflare community users. Neither company's docs cover the combination.)

If you want the proxy anyway (for Cloudflare's analytics, caching rules or firewall), do it only after step 6 works, in this order:

1. In **SSL/TLS → Overview**, set the encryption mode to **Full (strict)** *before* turning on the proxy. GitHub serves a valid public certificate, which is exactly what Full (strict) requires. **Never use Flexible.** Cloudflare would then talk to GitHub over HTTP, GitHub would redirect to HTTPS, and visitors would hit a redirect loop (`ERR_TOO_MANY_REDIRECTS`).
2. Switch the `@` and `www` records to **Proxied**.
3. Run step 8's checks.
4. If GitHub later shows a certificate error (certificates renew about every 90 days), switch the records back to **DNS only**, wait for the certificate, then turn the proxy back on.

## 6. GitHub: enforce HTTPS

1. Go back to the repository's **Settings → Pages**. Wait until the custom-domain DNS check passes.
2. GitHub then requests a certificate from Let's Encrypt. This can take **up to an hour**.
3. When the **Enforce HTTPS** checkbox becomes available, tick it. All HTTP requests then redirect to HTTPS.

If it stays stuck, click **Remove** next to the custom domain, type it again and click **Save**. That restarts the certificate process.

## 7. Email: hello@assane-diallo.com → your Gmail

### 7a. Cloudflare Email Routing (receiving)

1. In Cloudflare, go to **Compute → Email Service → Email Routing** and click **Onboard Domain**. Choose `assane-diallo.com`, review the DNS records Cloudflare will add, then click **Done**.
2. Go to **Destination Addresses** and add your Gmail address. Open the verification email and click **Verify email address**.
3. Go to the domain's **Routing Rules** tab, then **Create routing rule**:
   - Email pattern: `hello`
   - Action: **Send to an email**
   - Destination: your Gmail
4. Save. Then send a test from another account to `hello@assane-diallo.com`. (Mail sent from the same Gmail account it forwards to may land in "Sent" instead of the inbox.)

Cloudflare adds these records for you. Don't add them by hand, and don't create a second SPF record:

- **MX** records: `route1.mx.cloudflare.net`, `route2.mx.cloudflare.net`, `route3.mx.cloudflare.net` (priorities set by Cloudflare)
- **SPF** (TXT on `@`): `v=spf1 include:_spf.mx.cloudflare.net ~all`
- **DKIM** (TXT), which authenticates forwarded mail

### 7b. This is receive-only

Email Routing **forwards** mail into Gmail. It gives you no mailbox and no way to send *as* `hello@assane-diallo.com`. Until you pick one of the options below, replies go out from your Gmail address. That's fine for now, as long as you're OK with clients seeing it. Nothing below is set up in the repo.

| Option | Cost (as listed 2026-10-18) | Notes |
|---|---|---|
| **Gmail "Send mail as" with SMTP** | Free | **Not recommended.** Google is removing "Send as" for third-party (non-Google) addresses in **January 2027** and may already block new setups during Q3–Q4 2026. A custom-domain address not hosted at Google counts as third-party. |
| **Google Workspace Business Starter** | **$7.00/user/month** ($3.50 introductory price listed Nov 1, 2026 – Feb 1, 2027) | A real mailbox on your domain, in the Gmail interface you know. "Send as" for Workspace addresses is unaffected. Replaces Email Routing: MX points to Google. |
| **Spacemail (Spaceship)** | From about **$0.79–$0.98/mailbox/month** depending on term; renewals are higher | Cheapest mailbox. From the same company as your registrar. Replaces Email Routing (MX points to Spacemail). |
| **Zoho Mail** | Free plan for up to 5 users (not offered in every region); Mail Lite from about **$1/user/month**, billed yearly | Separate mailbox app. Replaces Email Routing (MX points to Zoho). |
| **Cloudflare Email Service (sending)** | Needs Cloudflare's Workers Paid plan: 3,000 emails/month included, then **$0.35 per 1,000** | Built for app or website mail (API, Workers, SMTP in beta), **not** a personal inbox. Useful later, e.g. if the contact form should email you. Public beta. |

If you move to a mailbox provider, follow that provider's DNS instructions. Remove Email Routing's MX records, and **merge** the provider's SPF `include:` into the single SPF record (step 7c). Never add a second record.

### 7c. SPF and DMARC

**SPF**, in plain words: a public list of servers allowed to send email that claims to be from `@assane-diallo.com`. Receiving servers check it. Email Routing creates it (`v=spf1 include:_spf.mx.cloudflare.net ~all`):

- `include:_spf.mx.cloudflare.net` means "Cloudflare's mail servers are allowed".
- `~all` means "treat anything else with suspicion" (a soft fail).

A domain may have only **one** SPF record. If you add a sending provider later, add its `include:` to the same record, for example `v=spf1 include:_spf.mx.cloudflare.net include:_spf.google.com ~all` for Google. There's a limit of 10 DNS lookups.

**DMARC**, in plain words: your instructions to other mail servers for when a message claims to be from your domain but fails the SPF/DKIM checks. It also tells them where to send you reports. Without it, anyone can more easily send phishing mail "from" `hello@assane-diallo.com`.

1. In Cloudflare, go to **Email → DMARC Management → Enable DMARC Management**. It's available on all plans. If no DMARC record exists, Cloudflare offers to **Add** one, and it sets the reporting (`rua`) address to a Cloudflare inbox so you see reports in the dashboard.
2. Start in monitoring mode. The record (TXT on `_dmarc`) should begin with:

   ```
   v=DMARC1; p=none; rua=mailto:<the address Cloudflare sets>
   ```

   - `p=none` means "don't block anything yet, just report". Nothing gets lost while you watch.
   - `rua=` is where daily summary reports go.
3. After 2–4 weeks of reports, check that the only legitimate senders are the ones you expect. Then tighten to `p=quarantine` (failures go to spam) and later `p=reject` (failures are refused). This step is my recommendation; Cloudflare's page doesn't prescribe a policy. Since you don't send mail from this domain yet, `p=reject` will be safe sooner, but recheck before adding a sending provider.

## 8. Verify everything

From the repo:

```bash
pnpm verify:domain                   # retries 5 times, 30s apart
VERIFY_ATTEMPTS=1 pnpm verify:domain # single quick pass
```

It checks that:

- the apex returns 200 over HTTPS
- `http://` redirects to `https://`
- `www` redirects to the apex
- `asndiallo.github.io/engineering/` redirects to `assane-diallo.com/engineering/`
- the sitemap, canonical and `og:url` tags use the new domain
- `robots.txt` points at the right sitemap

By hand:

```bash
# Nameservers and website records
dig assane-diallo.com NS +short
dig assane-diallo.com +noall +answer -t A       # the four 185.199.10x.153 addresses (Cloudflare IPs here = proxy is on)
dig assane-diallo.com +noall +answer -t AAAA    # the four 2606:50c0:800x::153 addresses
dig www.assane-diallo.com +nostats +nocomments +nocmd   # CNAME → asndiallo.github.io.
dig @1.1.1.1 assane-diallo.com A +short          # compare public resolvers while propagating
dig @8.8.8.8 assane-diallo.com A +short

# HTTPS, redirects, certificate
curl -sI https://assane-diallo.com/ | head -1              # HTTP/2 200
curl -sI http://assane-diallo.com/ | grep -i location      # https://assane-diallo.com/
curl -sI https://www.assane-diallo.com/ | grep -i location # https://assane-diallo.com/
curl -sI https://asndiallo.github.io/engineering/ | grep -i location   # …assane-diallo.com/engineering/
echo | openssl s_client -connect assane-diallo.com:443 -servername assane-diallo.com 2>/dev/null \
  | openssl x509 -noout -issuer -dates -ext subjectAltName  # Let's Encrypt, valid dates, both names

# Email
dig assane-diallo.com MX +short          # route1/2/3.mx.cloudflare.net
dig assane-diallo.com TXT +short         # one v=spf1 … record (plus the GitHub challenge on its own name)
dig _dmarc.assane-diallo.com TXT +short  # v=DMARC1; p=none; …
```

Old URLs: GitHub's docs don't describe it, but in a live test (2026-10-18) of user sites with a custom domain, every `username.github.io/<path>` returned a **301 to the same path** on the custom domain. Once step 4 is done, old links to `asndiallo.github.io`, including `/engineering/`, keep working. The `pnpm verify:domain` check covers this.

## Rollback plan

| Problem | What to do |
|---|---|
| HTTPS certificate stuck or broken | The site still works on `http://` meanwhile. In **Settings → Pages**, **Remove** the custom domain, re-enter it and **Save** to restart issuing. Check there are no extra A/AAAA records on `@` and that the proxy is off. |
| Site down at the new domain (DNS mistake) | In **Settings → Pages**, click **Remove** next to the custom domain. The site is immediately served at `https://asndiallo.github.io` again and the github.io redirect stops. **Keep the `_github-pages-challenge` TXT record.** If the rollback will last more than a day, set `SITE_URL` back to `LEGACY_SITE_URL` in `src/config.ts` and redeploy, so canonical URLs match where the site is actually served. |
| Redirect loop after turning on the proxy | Switch `@` and `www` back to **DNS only**, or set SSL/TLS to **Full (strict)**. Never Flexible. |
| Email not arriving | Check the Email Routing activity log and that the destination address shows as verified. To stop forwarding, disable the routing rule. Website DNS isn't affected. |
| Nameservers | Never change them at Spaceship as a "fix". The website and email both depend on Cloudflare DNS. |

## Troubleshooting

- **"DNS check unsuccessful" in GitHub.** Propagation can take up to 24 hours. Compare `dig @1.1.1.1` and `dig @8.8.8.8`. Remove any extra A/AAAA/CNAME on `@`/`www`. If `dig` shows Cloudflare IPs, the proxy is on: turn it off.
- **"Enforce HTTPS" greyed out or certificate pending.** Allow up to an hour after the DNS check passes. Then Remove and re-add the custom domain. If you ever add a CAA record, it must allow `letsencrypt.org`.
- **`ERR_TOO_MANY_REDIRECTS`.** The proxy is on with SSL mode **Flexible**. Use **Full (strict)**, or turn the proxy off.
- **`www` doesn't redirect.** The `www` CNAME is missing or doesn't point to `asndiallo.github.io`. GitHub only adds the www↔apex redirect when both are set up.
- **github.io doesn't redirect.** The custom domain isn't saved in **Settings → Pages** (step 4).
- **Mixed-content warnings.** The site uses only relative or `https://` URLs. If you add an `http://` asset, change it to `https://`.
- **Hello@ mail missing.** Check Gmail's Spam folder and the Cloudflare Email Routing activity log. Make sure no old MX records from another provider remain.

## Sources

GitHub:
- [Managing a custom domain for your GitHub Pages site](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site): A/AAAA values, www CNAME, apex↔www redirects, wildcard warning, dig commands
- [About custom domains and GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages)
- [Verifying your custom domain for GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages)
- [Securing your GitHub Pages site with HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)
- [Troubleshooting custom domains and GitHub Pages](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/troubleshooting-custom-domains-and-github-pages): CNAME file ignored with Actions, HTTPS up to an hour, CAA

Cloudflare:
- [Encryption modes](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/)
- [ERR_TOO_MANY_REDIRECTS](https://developers.cloudflare.com/ssl/troubleshooting/too-many-redirects/)
- [Proxy status](https://developers.cloudflare.com/dns/proxy-status/)
- [Enable Email Routing](https://developers.cloudflare.com/email-routing/get-started/enable-email-routing/)
- [Email Routing DNS records](https://developers.cloudflare.com/email-routing/setup/email-routing-dns-records/)
- [Email Routing limits](https://developers.cloudflare.com/email-routing/limits/)
- [Email Service pricing](https://developers.cloudflare.com/email-service/platform/pricing/)
- [Enable DMARC Management](https://developers.cloudflare.com/dmarc-management/enable/)

Community reports (not official docs) on the proxy with GitHub Pages:
- [GitHub Community #134087](https://github.com/orgs/community/discussions/134087)
- [Cloudflare Community: GitHub Pages require disabling CF's HTTP proxy](https://community.cloudflare.com/t/github-pages-require-disabling-cfs-http-proxy/147401)

Google:
- [Send emails from a different address or alias](https://support.google.com/mail/answer/22370?hl=en)
- [Changes to third-party email account support in Gmail](https://support.google.com/mail/answer/17101213?hl=en)
- [Google Workspace pricing](https://workspace.google.com/pricing)

Spaceship and others:
- [Custom nameservers](https://www.spaceship.com/knowledgebase/connect-domain-custom-nameservers/)
- [.com pricing](https://www.spaceship.com/domains/gtld/com/)
- [Security (free WHOIS privacy, 2FA)](https://www.spaceship.com/security/)
- [Spacemail](https://www.spaceship.com/business-email/)
- [Zoho Mail pricing](https://www.zoho.com/mail/zohomail-pricing.html)
