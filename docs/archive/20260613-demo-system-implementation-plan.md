# Demo system implementation plan — 3 new demo categories (2026-06-13)

> **🗄️ ARCHIVED 2026-06-14 — DONE.** All 3 demo categories shipped: Hero movie + slider restructure (commit `a56a5be`), product-page per-card mini-demos (commit `46101ef`). Kept for history.

Authoritative spec for the editmamei.com demo overhaul agreed in the 2026-06-13
design session. Written so a **fresh session can pick up any one of the three
categories and build it without re-deriving context.** Each category has its own
section: concept, assets, components, behavior, acceptance, and open questions.

> **Read first:** [`design/palette.md`](../design/palette.md) (tokens, usage,
> a11y), and the memory note `reference_web_competitive_design_analysis`. The
> type + color system is already shipped (see "Already shipped" below).

---

## Why this exists — the new demo architecture

The home page demo and the product page are being restructured into a **three-tier
information hierarchy** that tells the brand story (an AI tool that _builds like a
human, layer by layer, with you in control_):

1. **Feel it → Hero "movie"** (home, top): an animated, cinematic playback of an
   edit being built — prompt → AI works → **checks in with you** → finishes.
   Photo: **Hawaii coast**.
2. **Inspect it → Slider demo** (home, below hero): the current static
   before/after slider + expandable layer stack (the shipped "Option A").
   Photo: **set-sail (sailboat)**.
3. **Full detail → Product-page per-card mini-demos** (`/product`): 8 capability
   cards, each showing **one** real Photoshop tool applied to **one** photo.
   Photo: **City-Street**.

Rationale: the movie creates the emotional "wow," the slider lets skeptics
inspect the real layers, the product cards prove each tool is authentic PS.

### Already shipped this session (do not redo)

- **Bricolage Grotesque** is the site-wide font (`--font-sans` in
  `src/routes/layout.css`; self-hosted woff2 in `static/fonts/`; preload in
  `app.html`). Headings, body, wordmark.
- **Warm palette + section rotation** — tokens in `layout.css` `@theme`
  (`paper #faf8f3`, `cream #f7f3ea`, `sage #e4eddd`, `celadon`, `terracotta
#cc785c`, `terracotta-ink #a8512f` for accessible text, `ochre` benched,
  evergreen `brand/brand-light/brand-deep`, lime `accent`). Sections rotate
  white → paper → cream → sage → evergreen. Eyebrows use `text-terracotta-ink`.
- **og:image** — `static/og-image.png` (1200×630, evergreen + E mark + wordmark),
  wired in `Seo.svelte` with an optional `image` prop.
- **Option A** — the home demo's layer stack already elevated to a co-star
  (elevated card, widened column) in `src/routes/+page.svelte`. This becomes the
  **slider demo** (category 2) once the hero movie (category 1) lands above it.

### Cross-cutting invariants (apply to ALL three)

- **Layout stability:** any cross-state container stacks variants in one grid cell
  (`col-start-1 row-start-1` + opacity/`inert`) so switching never shifts the
  page. Never hand-tune `min-h`. See `feedback_layout_stability_grid_stack`.
- **Reduced motion:** use the shared `prefersReducedMotion()` helper
  (`src/lib/a11y/reducedMotion.svelte.ts`). Under reduce: no autoplay, zeroed
  transition durations, snap to final state.
- **Autoplay a11y (WCAG 2.2.2):** anything auto-advancing pauses on
  hover/focus-within and offers a visible control (replay/pause). Touch pointers
  skip hover-pause (a tap fires `pointerenter` but often no `pointerleave`).
- **Static build:** GitHub Pages / `adapter-static`. No server-only features, no
  Google Fonts request, no `$env/dynamic`. All assets self-hosted in `static/`.
- **Brand:** Bricolage everywhere; palette tokens only (never hardcode hexes);
  eyebrows `text-terracotta-ink`; lime only on evergreen surfaces.
- **Verify before commit (per repo CLAUDE.md):** `npm run check`, `npm run lint`,
  `npm test`, `npm run build`, `node scripts/check-leak-guard.mjs` — all green.
  Each indexable page keeps exactly one `<Seo path>`.
- **Real output only:** every image must depict genuine Photoshop tool output
  (no mocked results) — the worklist constraint.

### Asset-production tooling notes (learned this session)

- **Photoshop is driven via the editmamei MCP** (skill: `editmamei`). It enforces
  `photoshop_ping` first. PS running locally = **27.2.0**, Pro tools available.
- **Known PS 27.x bug:** adjustment layers created _with values_ (Levels, Curves,
  Vibrance) frequently report `customValuesApplied:false` and land at default.
  Brightness/Contrast worked. Workaround: prefer Brightness/Contrast + Hue/Sat,
  or set values via a second path / `execute_script` if a specific curve is
  needed. (See `project_ps27_cross_platform_bugs`.)
- **`photoshop_export_jpeg` arg is `output_path`, `quality` is 1–12** (not 0–100).
- **Rendering web mockups / HTML→image:** `file://` is blocked in the Playwright
  MCP. Pattern that works: write a temp `.html` into `static/`, run
  `npm run dev`, `browser_navigate` to `http://localhost:<port>/<file>.html`,
  screenshot via `browser_run_code_unsafe` (use a 2× `deviceScaleFactor` context
  for crisp output), then delete the temp file. Save review images to
  `E:\iCloudDrive\PhotosInbox\` and also SendUserFile — inline chat delivery of
  large PNGs failed for the user; **JPEG + PhotosInbox is the reliable path**.
- **Source photos** (`E:\iCloudDrive\PhotosInbox\`): `Hawaii-Coast.HEIC` (+ .jpg
  - .psd), `City-Street.HEIC`, set-sail lives at
    `static/demos/set-sail/{before,after}.jpg`, hawaii at
    `static/demos/hawaii-coast-wall-art/{before,after}.jpg`.

---

## CATEGORY 1 — Hero "movie" demo (Hawaii) — the centerpiece

> **SHIPPED 2026-06-13.** Built as `HeroMovie.svelte` + `src/lib/demos/hawaii-movie.ts`,
> mounted as the `#demo` centerpiece on the home page. Motion prototype was signed
> off, then the real cumulative frame sequence was produced in Photoshop 27.2 from
> **IMG_1057** (a Hanauma-style bay vista — note: no foreground lava rock, so the
> "warm the rock" beat became **"Warm the Headland"**; chat copy updated to match).
> 10 cumulative WebP frames (1400px) live in `static/demos/hawaii-movie/`; layered
> master is `Hawaii-Movie-IMG_1057.psd` in PhotosInbox. Mobile uses a rolling-ticker
> rail (newest layer pinned bottom, older rows dissolve under a gradient mask). The
> old multi-demo carousel was retired; `PromptDisplay.svelte` deleted. Category 2
> (below) shipped alongside as the set-sail "inspect the layers" section.

An autoplaying, scripted **cinematic playback** that dramatizes the real Editmamei
co-work loop. Replaces the current carousel as the home hero demo. **Highest
impact, most complex — build with a motion prototype checkpoint before replacing
the current hero.**

### Storyboard (beat sheet) — LOCKED with maintainer

1. **Prompt (chat view).** A cursor types the user's request into a prompt box:
   _"Make this Hawaii shot print-ready wall art — deepen the sky, richer ocean,
   warm the rock, 16:9 crop."_ Then it **sends** (bubble slides up like a chat).
2. **AI acknowledges (chat).** AI bubble appears: _"On it — opening it in your
   Photoshop and starting the layers."_ (✦ terracotta spark icon).
3. **Transition → canvas.** Chat fades out; the **original** Hawaii photo is
   revealed full-frame.
4. **Build (canvas).** Layers appear **one at a time** in a side rail; the image
   **morphs cumulatively** through each layer's effect (tone base → ocean
   richness → sky deepen → …). Each layer label lights as its effect lands.
5. **Check-in (back to chat) — the co-work beat.** Midway, the AI "runs a
   preview": the canvas fades back to the chat, showing a **thumbnail** of the
   in-progress edit, with the AI asking a decision: _"Quick check on the rock —
   too cool, or just right?"_
6. **You decide (chat).** A user bubble replies: _"A touch warmer."_ — dramatizes
   the human staying in control.
7. **Resume → canvas.** Back to the photo; a _"Warm the rock"_ layer lands and the
   rock shifts warm-dark in response to the decision.
8. **Finish.** Remaining layers land, then the **16:9 crop** animates in. Final
   wall-art result holds. Caption: _"Done — fully layered, every step yours to
   adjust."_ (final copy TBD.)

This is the actual `assess → plan → enact → CHECK (surface preview, ask) →
iterate` loop — authentic, not invented. The check-in (beat 5–6) is the soul of
the demo: it shows the preview-decision step that defines the product.

### Required assets (produced in Photoshop from Hawaii-Coast)

Build the Hawaii edit as a real non-destructive layer stack, then export a
**cumulative frame sequence** — the image state after each layer is added:

- `frame-00-original.jpg` — the untouched source.
- `frame-01.jpg … frame-NN.jpg` — one export after **each** layer is enabled,
  cumulatively (so the web can crossfade through them in order).
- **Two temperature variants at the check-in point:** `frame-checkin-cool.jpg`
  (the "too cool" state shown in the thumbnail) and the chosen warm path that
  continues after beat 7. (The decision visibly changes the rock.)
- `frame-final-cropped.jpg` — the 16:9 cropped finish.
- The **layer list** (names + kind + order) as data — reuse/extend the Hawaii
  entry in `src/lib/demos/examples.ts` (`demoExamples`), which already has the
  layer names shown in the current carousel.

Export sizing: target ~1600px-wide JPEGs (retina-friendly, reasonable weight);
store in `static/demos/hawaii-movie/`. Keep total payload modest — consider webp.

### Component design

- New component, e.g. `src/lib/components/HeroMovie.svelte`, rendered at the top
  of `src/routes/+page.svelte` (replacing the current `#demo` carousel position;
  see category 2 for what happens to the existing demo).
- **State machine** over the beats (idle → typing → sent → ai-ack → reveal →
  building(frameIndex) → checkin → decision → resume → finishing → crop → done).
  Drive with timed transitions; `$state` for the current beat + frame index.
- **Crossfade** between cumulative frames as each layer lands (grid-stack the
  frames in one cell, animate opacity). Layer rail labels light in sync.
- **Chat beats** (1,2,5,6): a small chat UI (prompt box, AI/user bubbles,
  thumbnail). The "send" + bubble entrance animations. Reuse the typewriter idea
  from the existing `PromptDisplay.svelte` (typing effect) for beat 1.
- **Controls:** a **Replay** button; pause on hover/focus-within; a visible
  pause/play is recommended (this autoplay is long). Under
  `prefersReducedMotion`: **no autoplay — show the final cropped result + the
  full layer rail statically**, with a "Replay walkthrough" button that, if
  pressed, plays with zeroed transition durations (or steps).
- **Layout stability:** fixed-aspect container (the canvas + rail) sized to the
  tallest beat so chat↔canvas swaps never shift the page. Grid-stack the
  chat-view and canvas-view in one cell.
- **A11y:** `role="group"`/`aria-roledescription`, `aria-label`; the scripted
  user reply is decorative (`aria-hidden` ok); ensure the decision text is
  legible; honor reduced motion; keyboard-reachable replay/pause.
- **Performance:** preload `frame-00` + the first 1–2 frames; lazy-load the rest;
  decode-async. Don't block LCP on the full sequence.

### Acceptance

No layout shift across the whole playback; pauses on hover/focus; reduced-motion
shows a static finished state with no autoplay; replay works; all frames are real
PS exports; verify suite green. Get maintainer sign-off on the **motion
prototype** before it replaces the current hero.

### Open questions

- Scripted-only vs lightly interactive at the decision beat (recommend scripted
  for a hero; everyone sees the same exchange).
- Exact final copy for each bubble + the closing caption.
- Frame count / which layers get their own frame (more frames = smoother morph
  but heavier payload).

---

## CATEGORY 2 — Slider demo (set-sail) — restructure of the current demo

> **SHIPPED 2026-06-13** alongside Category 1. The carousel was removed; this is now
> a single static set-sail before/after slider + `LayerAccordion` in the `#inspect`
> section (bg-sage) directly below the hero movie. Layer stack stays accordion
> (first open). `PromptDisplay.svelte` was deleted, not repurposed.

The current home `#demo` section is a **carousel** (`PromptDisplay` typewriter +
auto-advance) cycling Hawaii + set-sail, with a before/after slider
(`BeforeAfterSlider`) and the elevated layer stack (`LayerAccordion`, shipped as
Option A). After category 1 lands, this becomes the **secondary, static**
"inspect it" demo for **set-sail only**.

### What changes

- The **hero movie (category 1) takes the top**; this slider demo sits **below**
  it.
- **Remove the carousel / auto-advance** from this section. The typewriter/prompt
  concept moves into the hero movie. This demo becomes a **single** set-sail
  example: the before/after slider + the elevated, expandable layer stack
  (current Option A layout), no demo-switching.
- Keep `BeforeAfterSlider` and `LayerAccordion` as-is (both already
  reduced-motion-aware). Keep the elevated layer-stack card from Option A.
- Decide the fate of `PromptDisplay.svelte`: its typewriter/auto-advance logic is
  largely superseded here; either delete it from this section (its concepts live
  in the hero movie) or repurpose. The autoplay-pause + reduced-motion work in it
  is a good reference for the hero movie.

### Files

`src/routes/+page.svelte` (the `#demo` section), `BeforeAfterSlider.svelte`,
`LayerAccordion.svelte`, `src/lib/demos/examples.ts` (set-sail entry).

### Acceptance

Single set-sail demo below the hero movie; slider + expandable layer stack work;
no carousel; layout stable; reduced-motion honored; verify green.

### Open question

Does the set-sail layer stack stay always-expanded or accordion (current:
accordion, first open)? Keep current behavior unless maintainer says otherwise.

---

## CATEGORY 3 — Product-page per-card mini-demos (City-Street)

The `/product` page's `CapabilitySurface.svelte` is **8 text-only gray cards**.
Give each card a **mini-demo visual: the original photo + exactly ONE real
Photoshop tool**, shown independently (NOT a cumulative stack). For utility tools,
show the tool's **own output** (the selection marching-ants, the actual mask, the
histogram) so a Photoshop user recognizes the real workflow.

**Core principle (maintainer, verbatim intent):** "show each [tool] just off the
original… each card [is] original and one edit… for tools that are just for
utilities like selection and masks show the mask result, or the selection. Users
will want to see that it's really actually Photoshop tools happening and what the
tools are doing looks like the workflows they are used to."

### The 8 cards + asset spec (each from the CLEAN original City-Street)

| Card                            | Asset shows                                                                       |
| ------------------------------- | --------------------------------------------------------------------------------- |
| **Documents**                   | the file opening — original + format affordances (HEIC/RAW/PSD in → JPEG/PNG out) |
| **Layers**                      | a Photoshop-style **layers panel** beside the image (a few representative layers) |
| **Smart selections**            | **marching-ants selection** on a subject (the white Jaguar) or the sky            |
| **Non-destructive adjustments** | original → **one** adjustment (Hue/Sat or contrast), before/after                 |
| **Filters & styles**            | original → **one** filter (Smart Sharpen, or a Gaussian-blur background)          |
| **Masks**                       | a real **layer mask** — the B/W mask thumbnail + the masked effect                |
| **Templates**                   | original → a saved-recipe **look** applied, before/after                          |
| **Visual verification**         | the **histogram** panel (per-channel) reading the image                           |

- **Each card starts from the clean original** — revert/reopen between tools; do
  NOT stack. Each is an independent one-tool demonstration.
- **Authentic PS look:** style the card chrome to read like Photoshop panels
  (layers panel, mask thumbnail, histogram), not abstract graphics. The canvas +
  overlay come from real tool output; the panel chrome is web-rendered to match
  PS.
- **Person removal (content-aware fill)** is **Pro retouch, NOT one of the 8 CE
  cards** — keep it as a separate Pro example (a `City-Street_person-removed.jpg`
  reference export already exists in PhotosInbox; quality is "good enough for now,
  refine after the concept is validated").

### Asset production (editmamei MCP)

- Per card: open clean City-Street, run the one tool, capture:
  - before/after edits → `photoshop_export_jpeg` (output_path, quality ≤ 12).
  - selection → `photoshop_get_selection_preview` (returns marquee overlay).
  - histogram → `photoshop_get_histogram`.
  - mask → capture the mask (preview the mask channel / render B/W).
- Mind the PS 27.x adjustment-with-values bug (use Brightness/Contrast or Hue/Sat;
  verify `customValuesApplied`).
- Store assets in `static/product/city-street/` (create dir). Optimize (webp/jpg).

### Component

Extend `src/lib/components/CapabilitySurface.svelte`: add a visual slot to each
card. Card data likely in `src/lib/content/landing.ts` (the capability list —
titles already there). Keep the section on `bg-paper` (already rotated). Cards
should remain responsive (grid) and lazy-load images.

### Acceptance

Each of 8 cards shows one real tool off the original; utilities show their genuine
output; reads as authentic Photoshop; responsive; lazy-loaded; verify green.
Validate the per-card concept on the live site before polishing individual edits.

### Open questions

- Exact one tool per "Documents" and "Layers" (both are structural/utility — pick
  the most legible representation).
- Card interaction: static image, or hover/tap before↔after toggle? (A small
  before/after toggle per card would be compelling but is more build.)

---

## Suggested build order (independent sessions)

1. **Category 3 (product cards)** first — the maintainer wants to "make sure the
   concept works on the website" with good-enough assets before polishing. It's
   the most self-contained (asset production + card layout), lowest risk.
2. **Category 2 (slider restructure)** — small, mostly removing the carousel and
   keeping Option A for set-sail. Do alongside or just before category 1.
3. **Category 1 (hero movie)** last / its own focused effort — highest complexity;
   needs the Hawaii frame sequence + a new animated component + a motion-prototype
   sign-off. Categories 1 and 2 together fully replace the current `#demo`
   carousel, so coordinate them.

Each is independently shippable via the repo's lite/full-path process. Categories
1 and 2 both touch `+page.svelte`'s demo section — whoever does the second should
rebase on the first.

## Status of in-flight Photoshop work (City-Street)

A City-Street.HEIC working doc was opened and explored this session: person
removed (content-aware, good-enough) + a Brightness/Contrast grade. This was
**exploratory** — the per-card approach is independent-from-original, so that
cumulative doc is NOT the basis for the cards. Start each card fresh from the
clean original. The `City-Street_person-removed.jpg` export (PhotosInbox) is a
reference for the separate Pro retouch example only.
