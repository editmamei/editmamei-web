# Competitive design analysis — Photoshop-adjacent editing tools (2026-06-13)

Reference teardown of six top-Google competitors in the Photoshop / photo-editing
space, captured to inform the next editmamei.com design pass. Two layers of
analysis per site: **visual** (live desktop screenshots at 1440×900, Playwright)
and **technical** (HTML/JS fingerprint — frameworks, animation libs, fonts,
demo mechanics, color tokens, analytics/commerce stack).

Captured by driving the Playwright MCP against each live site. The sites were
chosen by the maintainer as "top Google results in this Photoshop space" —
examples for inspiration _and_ differentiation, not all endorsed as good.

> **Why this doc exists:** editmamei.com is currently a clean white/black
> SvelteKit site where the brand green barely registers. The risk is reading as
> generic-minimal — i.e. indistinguishable from Omata MATE, the one near-exact
> positioning competitor. This analysis is the evidence base for choosing a
> differentiated direction.

---

## TL;DR — the five things that matter

1. **MATE is the direct threat and already owns "black + lime-green + big display
   type."** Its positioning ("The first AI Agent inside Adobe Photoshop —
   automate, script, and edit with natural language") is nearly identical to
   ours. It uses lime `#84cc16` + purple `#7f5beb` accents on pure black, Barlow
   120px headlines, Framer + framer-motion. **We must not converge on that look.**
2. **The category demo is the before/after slider + autoplay video.** Topaz has
   ~36 before/after instances, ON1 ~16, Luminar is video-saturated (114 `<video>`).
   It's table stakes; doing it well is expected, not differentiating.
3. **Everyone uses a distinct display font; we're the only one on a system
   stack.** Barlow (MATE), Adobe Clean, area-normal/Clash (Topaz), Roobert/Gilroy
   (Luminar), Gilroy ExtraBold (ON1), Montserrat (Nik). → validates the decision
   to add a self-hosted display font for H1/H2.
4. **Our genuinely ownable assets:** (a) the **editable layer stack**
   (`LayerAccordion`) — nobody else shows _structure the AI built_, only outputs;
   (b) **bring-your-own-AI / MCP** — runs in your existing AI client, not a
   bundled cloud model like MATE's GPT-5.2; (c) **runs on your machine / your
   Photoshop** (privacy, local); (d) **personality** ("pronounced like edamame")
   — every competitor is corporate and cold.
5. **Our hand-built SvelteKit static site is leaner than the WordPress / Webflow /
   Framer crowd.** Performance is a quiet premium signal worth protecting (and
   not regressing with heavy animation libs).

---

## Per-site profiles

### 1. Omata MATE — `omata.io/mate/photoshop` — THE DIRECT COMPETITOR

- **Positioning:** "The first AI Agent inside Adobe Photoshop / Automate, script,
  and edit with natural language." Cloud LLM (shows a "GPT-5.2" badge).
- **Visual:** stark pure-black, monochrome white/gray, huge centered "MATE"
  wordmark, single light CTA ("Install MATE"), Linear/Vercel dev-tool aesthetic.
  No deal noise. Hero proof = a **real Photoshop 2026 screenshot with the MATE
  panel docked inside**, showing the prompt ("Remove backgrounds from all
  portrait layers"), a model/time badge, and "Results · 3 tools ✓" next to the
  actual canvas + layers panel.
- **Tech:** Built with **Framer** (`generator: Framer`), **framer-motion** for
  animation. Fonts: **Barlow** (H1 120px/700) + Inter family + Geist Mono /
  Fragment Mono (mono). 3 autoplay `<video>` (the demos are videos). Accent
  tokens include lime `#84cc16` and purple `#7f5beb`. Analytics: **Plausible**
  (privacy-first). Payments: **Lemon Squeezy**.
- **Takeaways:** This is the look to _diverge_ from. Note they too lean
  green-ish (lime) — our evergreen `#143731` is deeper and warmer; pairing it
  with warmth + personality is how we separate. Their "real panel in real PS +
  N tools ✓" demo is strong; our equivalent edge is the _editable_ layer stack.

### 2. Adobe — `adobe.com/products/photoshop/ai.html`

- **Visual:** clean white split hero, eyebrow + 44px H1, alternating white/black
  section rhythm. Hero = autoplay **product video** with an in-canvas tool-label
  chip ("Generative Fill") + cursor showing the tool firing — **and a visible
  pause control** on the autoplay. (Notably Adobe ships the very pause toggle we
  deferred on our carousel.)
- **Tech:** custom (no generator). Font: **Adobe Clean** via Typekit
  (`use.typekit.net`), H1 800 weight. Semantic CSS token system
  (`--color-gray-100…800`, `--link-color`, accent blue `rgb(39,77,234)`). 1
  autoplay video.
- **Takeaways:** tool-label callout chips on a real canvas; visible pause on
  autoplay; disciplined semantic color tokens (model for our `@theme` work).

### 3. Topaz Photo — `topazlabs.com/topaz-photo`

- **Visual:** minimal premium, white, photo-forward. Hero = a large **tap-and-hold
  before/after** — the photograph _is_ the hero and carries all the color.
  Credibility eyebrows ("#1 ENTHUSIAST AI SOFTWARE," "PLUGIN OR STANDALONE").
  Single black CTA.
- **Tech:** **Webflow** + **GSAP** + jQuery. Fonts: **area-normal** (Typekit) +
  Clashdisplay + DM Sans + Inter. **7 videos (6 autoplay), ~36 before/after
  elements, 156 images.** Heavy martech: Segment, Amplitude, Klaviyo, Bing, FB,
  Northbeam; Cookiebot consent.
- **Takeaways:** before/after as hero centerpiece; let real photography supply
  the color. The martech bloat is the opposite of our lean posture.

### 4. Nik Collection (DxO) — `nikcollection.dxo.com`

- **Visual:** warm charcoal/taupe surface (a darkroom/print feel, NOT stark
  black/navy) + amber accent. Hero = an **image collage** showing creative range.
  Editorial.
- **Tech:** **WordPress 6.6** + **GSAP** + **Swiper** + jQuery. Font:
  **Montserrat** + Source Sans 3. Vimeo embeds (no inline video). Axeptio
  consent, OptiMonk popups. (The `--wp--preset--*` color vars are stock Gutenberg
  defaults, not their brand palette.)
- **Takeaways:** the **warm-dark surface** is the most useful idea here — it's
  differentiation from the navy/black crowd and aligns with our stashed warm
  candidates (Coffee Bean, Antique White, Celadon in `design/palette.md`).
  Image-collage hero communicates breadth.

### 5. Luminar Neo (Skylum) — `skylum.com/chk/luminar-st`

- **Visual:** dark navy gradient + **one warm amber accent** threaded everywhere
  (logo, sale badge, CTA, float icons). Heavy deal/urgency: "SUMMER SALE" pixel
  badge, live countdown, "70% off," money-back guarantee. In-image AI tool
  overlay (face-aware sliders) on a portrait.
- **Tech:** custom + **Swiper** + slick + jQuery. Font: **Roobert** (H1 36/600) +
  Gilroy + **Calistoga** (display serif) + SF Pro. **114 `<video>` (11 autoplay),
  293 images** — extremely media-heavy. Uses **Microsoft Clarity** (same as us)
  plus a wall of tracking (TikTok, Pinterest, Criteo, AppsFlyer, Rakuten);
  Cookie Information consent.
- **Takeaways:** single-accent discipline is the lesson; the deal/urgency voice
  is explicitly NOT ours. The media weight is a cautionary tale.

### 6. ON1 Effects — `on1.com/products/effects/`

- **Visual:** loud dark blue→purple→teal gradient, heavy bold type, prominent
  price + struck-through discount, trust eyebrows ("No Subscription · Own It
  Forever"). Hero = a screenshot of the **actual app UI** (sliders, histogram,
  layers) as proof. Runs a cookie notice.
- **Tech:** **WordPress** + **Bootstrap** (`--bs-*` vars) + jQuery. Fonts:
  **Gilroy ExtraBold** (H1 52/700) + Rubik Mono One + Bodoni Book (serif).
  16 before/after elements; Vimeo; FastSpring commerce; Marketo.
- **Takeaways:** showing the real editing UI (panels/sliders/histogram) sells
  "real Photoshop-grade tool." Otherwise the loud/deal aesthetic is off-brand.

---

## Cross-cutting patterns

| Dimension          | What the field does                                                                            | Implication for us                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Surface**        | Dark dominates (MATE black; Luminar/ON1 gradient; Nik warm taupe). Only Topaz/Adobe are white. | A warm-dark "moment" or warm off-white base differentiates from both the white minimalists and the navy/black crowd.  |
| **Accent**         | Exactly one, used everywhere (amber, blue, lime).                                              | Thread evergreen `#143731` consistently; we currently under-use it.                                                   |
| **Type**           | Distinct display font, universally. None on a system stack.                                    | Add one self-hosted display face for H1/H2 (**decision locked**). Avoid Barlow/Inter (MATE) and Gilroy (Luminar+ON1). |
| **Hero demo**      | before/after slider and/or autoplay product video; some show the real app panel.               | We have a before/after slider + the unique editable layer stack. Lead with structure, not just output.                |
| **Autoplay a11y**  | Adobe gives a **visible pause**.                                                               | Reinforces the deferred pause-toggle finding on our carousel.                                                         |
| **Animation tech** | GSAP (Topaz, Nik), framer-motion (MATE), Swiper (Nik, Luminar). No Lottie/Rive/Three.          | Svelte transitions + tasteful CSS are enough; don't add a heavy lib and lose the lean edge.                           |
| **Builder**        | Framer, Webflow, WordPress×2, custom×2.                                                        | Our bespoke SvelteKit static build is leaner/faster — a quiet premium asset.                                          |
| **Consent**        | All six run cookie consent (Cookiebot/Axeptio/Cookie Information/etc.).                        | We already shipped ours (2026-06-13); we're in line with the field.                                                   |

### Demo mechanics worth stealing (ranked by fit)

1. **Make the editable layer stack the star** — our unique "orchestration, not
   generation" proof. No competitor shows editable structure.
2. **Tool-label callout chips on the canvas** ("Curves," "Select Subject") + a
   **"N tools ✓"** results badge (Adobe + MATE).
3. **Promote before/after into the hero** (Topaz tap-and-hold). We already have
   `BeforeAfterSlider`.
4. **One real "round-trip" visual** — prompt → AI plan → PS executes → layers
   appear → verify. Extends the existing `HowItWorks` sequence.

---

## Where Editmamei sits + differentiation thesis

Currently in the clean white/black camp (Topaz/Adobe) — premium but the green is
nearly invisible, so it drifts toward generic-minimal, i.e. **toward MATE**.

**Recommended direction (maintainer not yet committed — see open questions):**
differentiate on **warmth + green + personality**. Be the human, characterful,
layer-honest tool against a field of cold black (MATE), corporate navy
(Luminar/ON1), and clinical white (Adobe). Levers:

- Thread evergreen into eyebrows, heading accents, the before/after handle, the
  active carousel dot, the "You" actor pill.
- Use warm off-white surfaces and/or a warm-dark green section (we already have
  the `#143731` Install band; extend the rhythm).
- A characterful self-hosted display font for H1/H2 (warm, not Barlow/Gilroy).
- Lean into the edamame personality and the editable-layer-stack proof.

What to avoid: deal/urgency (Luminar/ON1), stark cold black (MATE), heavy
martech/media bloat (Topaz/Luminar), and any new accent that competes with green.

---

## Decisions & open questions (as of 2026-06-13)

**Locked**

- **Typography:** add one **self-hosted display font for H1/H2 only** (keeps the
  static build, no Google Fonts request). Body stays the system stack. Pick a
  warm/characterful face that is NOT Barlow, Inter, or Gilroy (those read as
  MATE / Luminar / ON1). H1 copy stays "Unlock Photoshop with natural-language
  photo editing" per the brand-voice memory.
- **Brand-color centralization** (worklist item 6, approved): extract the six
  hardcoded hexes (`#143731` brand, `#1f4d44` brand-hover, `#0F2922` brand-deep,
  `#CEFF8C` accent, `#faf9f5`/`#e8e3d4` warm card, `#cc785c` terracotta) into
  `@theme` tokens in `src/routes/layout.css`. Risk-free foundation; no visual
  change. Currently hardcoded across `Hero.svelte`, `SiteHeader.svelte`,
  `InstallSection.svelte`, `PromptDisplay.svelte`, `pricing/+page.svelte`.

**Open (decide at next design pass)**

- Overall aesthetic direction: warm+green+personality (recommended) vs bolder
  dark-green brand moments vs photo-forward (Topaz) vs cool/minimal (NOT advised
  — converges on MATE).
- Demo/hero-visual upgrade priority (before/after-in-hero, tool-label chips,
  layer-stack-as-star) — maintainer chose "ask again later."
- Whether to add a warm-dark surface (Nik-style taupe / palette.md Coffee Bean)
  beyond the existing evergreen Install band.

## Method notes (for re-running)

- Visual: `browser_navigate` + `browser_resize` 1440×900 + viewport screenshots
  (JPEG) per site, read back as images.
- Technical: one `browser_run_code_unsafe` loop over the six URLs —
  `page.goto(domcontentloaded)` + 2.8s settle + `page.evaluate()` extracting
  script hosts, `window` globals + script-src regex for lib detection,
  `document.fonts` families, computed H1 font/size/weight, `<video>`/`<canvas>`
  counts, before/after element heuristics, and same-origin stylesheet CSS custom
  properties. Cross-origin stylesheets can't be read for tokens (CORS) — that's
  why some `colorVars` are empty (e.g. Luminar).
