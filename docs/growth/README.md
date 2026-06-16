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

Truth guardrail: pre-launch, so **no fabricated traction** (user counts, revenue). Use only details verifiable in the repo. Fabricated numbers get discounted on IH anyway.

## Files

- [posts/20260616-ih-orchestration-not-generation.md](posts/20260616-ih-orchestration-not-generation.md) — first IndieHackers post draft (orchestration-not-generation angle).

## Related (cross-repo)

- SEO/AI-indexing infra (code): `static/robots.txt`, `static/llms.txt`, dynamic `sitemap.xml`, FAQPage schema, IndexNow-on-deploy.
- Product positioning + privacy rules: `../../Editmamei/docs/` (LAUNCH/PRODUCT) + brand-voice guide §12.
- Design/branding strategy: `../20260613-competitive-design-analysis.md`.
