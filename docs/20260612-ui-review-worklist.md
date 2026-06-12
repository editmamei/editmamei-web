# UI review worklist — 2026-06-12

Actionable findings from a live visual/UX review of editmamei.com, written so a
fresh agent can resolve them without re-deriving context. Review method: local
`npm run build && npm run preview`, driven with the Playwright MCP (Edge,
desktop 1440×900 + mobile 390×844), all six routes, menu/carousel/slider
interactions exercised, computed typography probed, production spot-checked.
Repo state at review: web `e635996`, ce `16820b6`, Editmamei `5e99b98`.

Production was verified healthy the same day: per-page self-referencing
canonicals live, single title/description tags, corrected CE-npm / Pro-download
distribution copy deployed, Clarity loads (a `clarity.ms/tag` 400 seen on
localhost is a localhost-referrer artifact — NOT a production bug), zero
console errors.

## How to work this list

- Each item has a priority, the files involved, a proposed fix, and acceptance
  criteria. Items marked **DECISION** need the maintainer's taste call first —
  do not implement those without asking.
- Process: items 1, 2, 4 are lite-path (code → check → lint → test → build →
  commit). Item 3 touches the hero demo UX — treat as full-path (it changes
  behavior the maintainer iterated on heavily; see the layout-stability comment
  in `src/routes/+page.svelte` and memory `feedback_layout_stability_grid_stack`).
  The cookie banner (item 8) is full-path (form-adjacent UI + privacy surface).
- Invariants that must survive any of this work:
  - `npm run check`, `npm run lint`, `npm test`, `npm run build`,
    `node scripts/check-leak-guard.mjs` all green (see CLAUDE.md verify
    checklist).
  - Every indexable page keeps exactly one `<Seo path="...">` render
    (pinned by `tests/sitemap-routes.test.mjs`).
  - No `photoshop_*` dev/none-tier names in site source (leak guard).
  - No pricing/feature claims beyond `Editmamei/src/core/tool-tiers.ts` and
    no invented pricing mechanics (no price points, no subscription/lifetime
    claims — none are decided).
  - Demo-switch layout stability: all demo variants stay stacked in one grid
    cell (`col-start-1 row-start-1` + opacity/inert). Never replace with
    hand-tuned `min-h`.

---

## 1. Desktop nav is hidden in a hamburger at every width — HIGH, small

**Problem.** At 1440px the header shows only the logo, the Install button, and
a hamburger; Product and Pricing live in a small two-item dropdown. The two
most important marketing pages are invisible unless the visitor hunts; the
footer is the only visible path.

**Files.** `src/lib/components/SiteHeader.svelte`.

**Fix.** Inline `Product` / `Pricing` text links in the header at `md:` and
up (before the Install button); keep the hamburger for `< md` only. While in
there, address the pre-existing menu a11y nits: no focus move on open, no
click-outside dismiss (Escape only).

**Acceptance.** At ≥768px the header shows Product + Pricing inline and no
hamburger; at <768px the hamburger remains; keyboard: menu opens with focus
inside, closes on Escape AND outside click; `npm test` + check/lint green.

## 2. Pricing page has no pricing and no CTA — HIGH, small

**Problem.** `/pricing` ends at the "rule of thumb" paragraph → footer. No
price points exist yet (correct — none are decided), but there is also no
action: no install CTA, no Pro-launch hook. The conversion page has no
conversion path.

**Files.** `src/routes/pricing/+page.svelte`.

**Fix.** Closing CTA section: primary button "Get Community free" → `/#install`
(same style as the hero CTA), plus one honest line for Pro, e.g. "Pro pricing
lands with the v1.0 launch — watch [the repo](https://github.com/editmamei/editmamei-ce)
for the announcement." **Copy constraint:** do NOT state price points,
subscription/lifetime structure, seat counts, or dates — none are public
decisions (memory `feedback_no_fabricated_marketing_data`).

**Acceptance.** Pricing page ends with a CTA block; links resolve; no new
pricing-mechanics claims; verify suite green.

## 3. Demo section balance + carousel controls + autoplay a11y — MED, full-path

**Problem (three related).**
(a) Desktop: the demo header (title + summary) is capped near `max-w-2xl`
while the section is `max-w-6xl`, leaving the upper-right half of the section
empty.
(b) The prompt card reserves the height of the longest prompt (grid-stack —
correct mechanism, keep), so the short "Casual" prompt sits as two lines in a
large empty box.
(c) Carousel arrows/dots are small and low-contrast; autoplay has no pause
control and keeps auto-advancing under `prefers-reduced-motion` (Svelte
`fly`/`slide` transitions also ignore reduced-motion). These are WCAG 2.2.2 /
animation-preference items deferred from the 2026-06-12 QA review.

**Files.** `src/routes/+page.svelte` (section layout),
`src/lib/components/PromptDisplay.svelte` (card height driver, autoplay
`$effect`, controls), `src/lib/components/LayerAccordion.svelte` (`slide`
transition), `src/lib/demos/examples.ts` (prompt text lengths).

**Fix sketch.** Tighten the longest prompt's text to shrink the reserved
height; widen or rebalance the section header; enlarge arrow hit areas
(≥40px) and dot contrast; pause autoplay on hover/focus/interaction; under
`prefers-reduced-motion` stop auto-advance entirely and zero the `fly`/`slide`
durations. Do NOT remove the grid-stack variant stacking.

**Acceptance.** No layout shift when switching demos (manually verify all
demos); autoplay pauses on hover/focus and never runs under reduced motion
(emulate via DevTools/Playwright `emulateMedia`); controls meet ~44px touch
target; verify suite green. Get maintainer sign-off on the pause behavior
BEFORE implementing — this is the hero demo.

## 4. Editions-table "not included" marker reads as blank — LOW, trivial

**Problem.** Absent features render as a faint neutral-300 middot `·`; on
mobile the Community column for Pro-only rows looks like missing data.

**Files.** `src/lib/components/EditionsTable.svelte` (two `{:else}` branches).

**Fix.** Render an em-dash `—` (e.g. `text-neutral-400`) instead of `·`; keep
the existing `sr-only` "Not in Community/Pro" text.

**Acceptance.** Visible dash in both columns where a feature is absent;
`sr-only` semantics unchanged.

## 5. Product page is a text wall — MED, **DECISION**

**Problem.** `/product` is eight gray capability cards plus three example
blocks plus trust receipts — zero imagery, all white/neutral. Informative but
visually flat for a product about photographs.

**Candidate fixes (pick with maintainer).** Reuse a before/after pair from
`static/demos/` as a visual anchor between sections; or a rendered layer-stack
visual (the home page's `LayerAccordion` with a demo's layers); or per-card
icons. Constraint: any image claim must depict real tool output (no mocked
results).

## 6. Brand presence: color + type — MED, **DECISION**

**Problem.** (a) The palette green (`#143731` family + `#CEFF8C` accent — see
`design/palette.md`) appears only in the header button, install band, and
footer; the hero and most sections are black-on-white. (b) Typography is the
Tailwind system stack — solid (H1 60px/700/-1.5px, body 20px/28px) but
generic, and the positioning subhead "AI orchestration, not generation." is
visually tiny next to the H1.

**Candidate fixes (pick with maintainer).** Thread green into eyebrow labels /
link accents; bump the hero subhead a step; optionally one self-hosted display
font for H1/H2 only (self-hosted — keep the static build, no Google Fonts
request; note `feedback_landing_below_fold_density` and the brand-voice memory:
the H1 stays "Unlock Photoshop with natural-language photo editing").
Related pre-existing nit: brand hexes are hardcoded across `Hero.svelte`,
`SiteHeader.svelte`, `InstallSection.svelte` — centralize as Tailwind `@theme`
tokens in `src/routes/layout.css` while touching this.

## 7. Social share cards have no image — LOW, **DECISION**

**Problem.** `Seo.svelte` emits `twitter:card summary_large_image` but no
`og:image`/`twitter:image`, so shares render imageless (pre-existing; carried
over from the old app.html). Needs a 1200×630 share image decision (brand
mark on green? a before/after?). Implementation after the asset exists:
optional `image` prop on `Seo.svelte` with a site-wide default.

## 8. Cookie consent banner (maintainer signalled intent 2026-06-12) — full-path

The maintainer wants to enable Clarity cookies ("I think I want to add the
cookies"); per `CLAUDE.md` §Marketing infrastructure, cookies ⇒ consent banner
required. Confirm go-ahead, then:

1. **Banner component** (`src/lib/components/ConsentBanner.svelte`, rendered
   from `+layout.svelte`): first-visit bottom bar, short copy ("We use
   analytics cookies to understand how the site is used"), Accept / Decline,
   link to `/privacy`.
2. **State**: persist choice in `localStorage` (key e.g.
   `editmamei-cookie-consent` = `granted | denied`). Storing the consent state
   itself needs no consent. Footer gains a "Cookie preferences" link that
   reopens the banner (GDPR withdrawal path).
3. **Wiring**: KEEP the `clarity('consent', false)` default in `src/app.html`
   (deny until told otherwise — this is the EU-safe opt-in design). On Accept,
   call `window.clarity('consent')` to grant cookies; on Decline do nothing —
   analytics keep working cookieless exactly as today. Add a `setConsent()`
   helper in `src/lib/analytics/clarity.ts` (the `'consent'` command is
   already in its type union).
4. **Disclosure**: `/privacy` is a "coming soon" stub — it MUST gain at least
   a short Cookies section (what `_clck`/`_clsk` are, who sets them, how to
   change the choice) before the banner ships pointing at it.
5. **Docs**: update `CLAUDE.md` §Marketing infrastructure (currently records
   the no-cookies state) and note the banner in the verify checklist.
6. **Verify**: in preview — before Accept: no `_clck` cookie; after Accept:
   present; after Decline: absent and events still flow. Banner must not
   shift page layout (fixed/bottom overlay) and must be keyboard reachable.

## Explicitly NOT in scope (deferred with reasons, 2026-06-12 QA)

- `walk()` symlink-following in the leak-guard scripts — pre-existing, CI-only
  blast radius.
- GitHub Actions SHA-pinning — low, bundle with the next CI touch.
- `design/` brand masters being publicly downloadable via the public repo —
  maintainer decision about repo visibility/asset location, not a code fix.
- Mobile editions-table label shortening — nice-to-have; revisit if the table
  grows.

## Re-verifying visually

A `playwright` MCP server is registered at user scope
(`cmd /c npx @playwright/mcp@latest --browser msedge`). Pattern: build +
`npm run preview` (background, poll `http://localhost:4173/`), then
`browser_navigate` / `browser_resize` (1440×900 and 390×844) /
`browser_take_screenshot --fullPage` per route, `browser_console_messages`
for errors, and check `document.documentElement.scrollWidth <= innerWidth`
for overflow. Stop the preview server when done.
