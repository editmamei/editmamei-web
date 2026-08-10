# SEO / GEO quality audit — editmamei.com (2026-08-10)

Triggered by the question "is the new blog page being served for indexing, and
is the sitemap updated?" Short answer: **yes and yes** — verified against a
fresh production build (`npm run build` on `main` @ `7151bd2`), not just source.
The rest of this doc is the general site audit, findings ranked.

Method: read every route + `Seo.svelte` + `app.html` + `sitemap.xml/+server.ts`,
built the site, and inspected the emitted HTML/XML in `build/`.

---

## 1. Blog indexing status — healthy

Verified in the built output:

- **Sitemap** — `build/sitemap.xml` contains `/blog` (priority 0.6,
  changefreq weekly) and every published post URL
  (`/blog/introducing-editmamei`, lastmod `2026-08-05` = the post's own date).
  Post URLs come from the `posts` loader in `$lib/blog.ts`, so new posts join
  the sitemap automatically at build time — no hand-maintenance step to forget.
- **Prerendered HTML** — `/blog` and each post ship as real static files
  (`build/blog.html`, `build/blog/<slug>.html`) with:
  - self-referencing canonical (`https://editmamei.com/blog/...`),
  - unique `<title>` and meta description,
  - full og:/twitter: card set,
  - **no** `noindex` (the draft-only `noindex` branch never reaches
    production builds, by construction — drafts live in a dev-only glob).
- **robots.txt** — fully open, declares `Sitemap: https://editmamei.com/sitemap.xml`.
- **Crawl paths** — `/blog` is linked from the header nav (desktop + mobile)
  and the footer, so discovery doesn't depend on the sitemap alone.
- **Invariants pinned** — `tests/sitemap-routes.test.mjs` enforces
  "every route is in the sitemap XOR noindexed" and the self-canonical
  contract; suite passes.

Nothing to fix here. If Search Console still shows the blog as undiscovered,
it's crawl latency, not a site defect — a manual URL-inspection "Request
indexing" on `/blog` is the only accelerant available.

## 2. Site-wide fundamentals — strong

- Every indexable route: unique descriptive title, single `<h1>`,
  self-referencing canonical via per-page `<Seo>` (the shell-canonical bug
  class is dead and tested).
- Stub/utility pages (`/privacy`, `/security`, `/download`) carry `noindex`
  and are excluded from the sitemap — consistent, no contradictions.
- JSON-LD in the shell: `Organization`, `SoftwareApplication`, `WebSite`
  (disambiguates "editmamei" as a product, not a typo of edamame).
- `llms.txt` present and spec-aligned (GEO surface); no AI crawler is blocked.
- Search-engine verification file served; og-image (1200×630) in place;
  `lang="en"`; single-locale site so no hreflang needed.

## 3. Findings, ranked

### F1 — llms.txt never mentions the blog (GEO gap; cheapest win)

`static/llms.txt` §Links lists Homepage/Product/Pricing/FAQ/Contact/npm/GitHub
— but not `https://editmamei.com/blog`. The blog is the site's only growing
content surface and the natural citation target for AI answers ("what is
Editmamei?" → the introduction post). Add a Blog link (and optionally the
flagship post) to the `## Links` section.

### F2 — blog posts lack article metadata (structured data + OG)

Post pages emit `og:type="website"` and no `BlogPosting` JSON-LD. For date
display in SERPs and better AI-citation grounding, posts should carry:

- `og:type="article"` + `article:published_time` (+ `article:modified_time`
  when `updated` is set),
- a `BlogPosting` JSON-LD block: `headline`, `description`, `datePublished`,
  `dateModified`, `url`, `publisher` → the existing Organization.

Mechanically small: extend `<Seo>` with an optional `article` prop (dates), and
add the JSON-LD in `blog/[slug]/+page.svelte` — all fields already exist on
`PostSummary`.

### F3 — sitemap `lastmod` churns on every deploy (minor)

Static routes stamp `lastmod` with the build date, so every deploy bumps every
route to "changed today". Post URLs already do this right (their own date).
When `lastmod` is demonstrably unreliable, Google ignores it sitewide — which
also devalues the accurate post dates. Options: hand-maintain per-route dates
in the `ROUTES` array, or drop `lastmod` for the static routes entirely
(omitting it is valid).

### F4 — no RSS/Atom feed (owner decision, flagging only)

RSS was deliberately removed 2026-08-05 (`ac6169b`, "owner decision"). Noting
for the record: a feed is a low-cost discovery surface for aggregators and
some AI crawlers, and the removed implementation could be restored nearly
verbatim if the decision is ever revisited. No action unless the owner says so.

### F5 — Bing "title tag too short" alert (2026-08-10) — stale, already fixed

Bing Webmaster Tools flagged `/faq`, `/pricing`, and `/contact` for short
title tags. The alert describes the site as it was before 2026-07-15:

| Page     | Old title (flagged)           | Current title (deployed)                                            |
| -------- | ----------------------------- | ------------------------------------------------------------------- |
| /faq     | `FAQ — Editmamei` (15 ch)     | `FAQ: privacy, data use, AI clients, editions — Editmamei` (56 ch)  |
| /pricing | `Pricing — Editmamei` (19 ch) | `Pricing: free Community edition and Pro plans — Editmamei` (57 ch) |
| /contact | `Contact — Editmamei` (19 ch) | `Contact support or report a security issue — Editmamei` (54 ch)    |

The short titles were replaced in `3542cc2` (2026-07-15, commit message
literally cites this Bing alert) and refined in `6331e51` (2026-08-04).
Deploys are automatic on every push to `main` (`.github/workflows/deploy.yml`)
and the workflow pings IndexNow after each deploy, so the fixes are live.
Current titles sit inside Bing's recommended 50–60-character band on every
route (verified in the built HTML; the sandbox's egress policy blocked
fetching the live pages, so confirm with view-source if in doubt).

**Action (Bing dashboard, not code):** Bing's Site Scan reports the state at
its last crawl — re-run the scan (Site Scan → Start new scan) and the alert
should clear. No repo change needed.

### F6 — cosmetic / defer

- Post title pattern yields "Introducing Editmamei — Editmamei" (brand
  duplicated). Only affects posts whose titles contain the brand; not worth
  machinery, just avoid the brand in future post titles.
- No `BreadcrumbList` JSON-LD on posts (blog → post). Marginal at one level
  of depth; fold into F2 only if convenient.
- Citation Trust remains the GEO bottleneck per the 2026-06-16 GeoScoreAI
  baseline (40/100) — that's off-site work (see `README.md` posting doctrine),
  nothing this repo can fix.

## 4. Suggested order

1. F5 needs no code — re-run the Bing Site Scan from the dashboard
2. F1 (one-line edit to `static/llms.txt`)
3. F2 (Seo component + post page)
4. F3 (sitemap route dates)
5. F6 breadcrumbs, only alongside F2
