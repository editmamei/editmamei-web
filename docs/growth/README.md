# Growth — SEO · GEO · backlinks · content distribution

Index for editmamei.com growth work. **Scope: the marketing surface (this repo), not the product.** Product privacy/positioning rules live in `../../Editmamei/docs/` and the brand-voice guide; this folder is about reach, discovery, and AI-search visibility.

## Current state (2026-06-16)

- **GEO baseline** — GeoScoreAI scan of editmamei.com: **56/100 (C)**. Gates: Narrative Control 80, Content Extraction 53, Crawl Access 50, **Citation Trust 40 (bottleneck)**. The Citation Trust gap = lack of third-party links/mentions on authoritative domains.
- **Backlink reality (verified via live HTML 2026-06-16)** — GitHub repo links _and_ IndieHackers post-body links are both `rel="nofollow"`. They pass **no classic PageRank**. Their value is **GEO/AI-citation presence + targeted referral traffic**, not link equity. Don't chase dofollow for GEO; chase presence on high-authority, AI-crawled domains.
- **Crawler access** — `static/robots.txt` is fully open (`User-agent: * / Disallow:`); no AI bot is blocked. Precondition for GEO satisfied.
- **llms.txt** — spec-aligned at `static/llms.txt`; `## Links` section converted to canonical `[name](url): notes` markdown so parsers actually extract the links (fixed 2026-06-16).
- **IndieHackers** — account handle **`EditmameiAlex`** (posts as Alex). Build-in-public cadence. See `posts/`.
- **Reddit** — still the highest-ROI un-actioned third-party mention (per SEO infra notes).

## Posting doctrine (IndieHackers / Reddit / forums)

Build-in-public mold, never an announcement or hard sell:

1. First-person story → 2. real lessons/numbers → 3. **one** soft link to editmamei.com mid-narrative → 4. close with a question to spark replies.

Truth guardrail (updated 2026-07-02, post-launch): **no fabricated traction** (user counts, revenue). Launched 2026-06-19, so real numbers exist — use them, with honest caveats (npm downloads are bot-inflated; say so). Don't quote revenue until there's revenue worth quoting. CE is free and **source-available** under FSL-1.1-MIT (fair source; each version converts to plain MIT two years after it ships) — still never call it open-source, and link any license claim to https://github.com/editmamei/editmamei.

## Files

- [20260810-seo-geo-audit.md](20260810-seo-geo-audit.md) — full-site SEO/GEO audit after the blog launch: blog indexing verified healthy; ranked findings (llms.txt blog link, BlogPosting schema, sitemap lastmod churn).
- [posts/20260702-ih-adobe-shipped-my-category.md](posts/20260702-ih-adobe-shipped-my-category.md) — flagship IH post (Adobe shipped the category; honest gap analysis). Post first.
- [posts/20260702-ih-three-lessons-postlaunch.md](posts/20260702-ih-three-lessons-postlaunch.md) — three-lessons post, post-launch rewrite. Supersedes the 20260616 draft (which wrongly said "open-source" and "pre-launch" — do not post it).
- [posts/20260702-reddit-playbook.md](posts/20260702-reddit-playbook.md) — subreddit strategy, voice cheat sheet, and per-sub drafts (r/mcp, r/ClaudeAI, r/SideProject, cautious r/photoshop).
- [posts/20260616-ih-orchestration-not-generation.md](posts/20260616-ih-orchestration-not-generation.md) — SUPERSEDED first draft; kept for history.

## Related (cross-repo)

- SEO/AI-indexing infra (code): `static/robots.txt`, `static/llms.txt`, dynamic `sitemap.xml`, FAQPage schema, IndexNow-on-deploy.
- Product positioning + privacy rules: `../../Editmamei/docs/` (LAUNCH/PRODUCT) + brand-voice guide §12.
- Design/branding strategy: `../20260613-competitive-design-analysis.md`.
