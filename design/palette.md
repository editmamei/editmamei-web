# Editmamei palette

Reference for the colors in use on editmamei.com, plus saved candidate palettes that could fit specific surfaces if we ever refresh.

## Canonical brand tokens (source of truth: `src/routes/layout.css` `@theme`, locked 2026-06-13)

Deep **evergreen** primary with a **warm neutral ladder** (white → paper → cream → sage) and a small set of accents. The warmth is the differentiation lever — the competitor set (MATE, Topaz, Adobe, Luminar, ON1, Nik) is uniformly cold/corporate. Use surfaces **per section, not everywhere**; lead with **one** accent per section.

| Token (utility)            | Hex                   | Role                                                                                     |
| -------------------------- | --------------------- | ---------------------------------------------------------------------------------------- |
| `brand`                    | `#143731`             | Evergreen — primary surface/text                                                         |
| `brand-light`              | `#1f4d44`             | lighter evergreen — hover, borders/dividers                                              |
| `brand-deep`               | `#0f2922`             | darker evergreen — inner dark surfaces                                                   |
| `paper`                    | `#faf8f3`             | barely off-white — quiet workhorse section surface                                       |
| `cream`                    | `#f7f3ea`             | clearly warm — organic/editorial section surface                                         |
| `sage`                     | `#e4eddd`             | light tonal green — comparison/editions section surface                                  |
| `accent`                   | `#ceff8c`             | Lime cream — pop on dark (evergreen) surfaces only                                       |
| `celadon`                  | `#a8d3a8`             | soft green — shapes/dividers/illustration                                                |
| `terracotta`               | `#cc785c`             | warm accent — fills/chips/the AI spark                                                   |
| `terracotta-ink`           | `#a8512f`             | deeper clay — **accessible terracotta TEXT** (eyebrows); `#cc785c` is only ~3:1 on light |
| `ochre`                    | `#cda349`             | luxe gold accent — token defined, **benched** until a clear spot                         |
| `prompt` / `prompt-border` | `#faf9f5` / `#e8e3d4` | warm "Claude box" prompt card                                                            |
| `spark`                    | `#cc785c`             | AI sparkle / thinking dot (= terracotta)                                                 |

**Color theory:** `#143731` ≈ HSL(170°, 47%, 15%) — a deep teal-evergreen. Terracotta is its warm complement (opposite hue); cream/paper are warm neutrals that keep evergreen from reading clinical; sage/celadon/lime are analogous greens; ochre is the split-complement (green + gold = classic luxe).

**Applied rotation (2026-06-13):** home demo → paper; How-It-Works → cream; editions → sage; Install → evergreen; hero/key sections → white; footer → paper. Marketing section eyebrows → `terracotta-ink`. Secondary/sub-labels, table headers, and stub/utility pages stay neutral.

## Legacy notes (pre-2026-06-13, may be partially superseded)

The pre-evergreen system used neutral grays, an emerald accent for "you"/brand presence, sky-blue for AI/cloud context, and two semantic chips for prompt voice. Some of these (emerald/sky actor pills in `HowItWorks`, amber/indigo prompt-voice chips) still exist and are not yet reconciled into the token table above.

### Surfaces

- `bg-white` — primary surface
- `bg-neutral-50`, `bg-neutral-100` — soft section backgrounds
- `bg-neutral-950` — InstallSection / dark CTA

### Brand accents

- `emerald-50` through `emerald-700` — "You" actor + brand presence. Hero, How It Works actor pill, favicon mark.
- `sky-50` through `sky-800` — AI assistant / "in the cloud" framing. How It Works actor pill, "Check & refine" loop tint.

### InstallSection (dark CTA surface, 2026-06-01)

A custom dark-green palette derived from the Evergreen + Lime Cream reference pair. Replaced `bg-neutral-950 + emerald-300` so the dark CTA reads as brand-aligned rather than generic.

- `#143731` — Evergreen, section background
- `#0F2922` — darker evergreen, inner surfaces (terminal box, info cards, inline code badges)
- `#1F4D44` — lighter evergreen, borders / dividers
- `#CEFF8C` — Lime Cream, accent text (eyebrow, code keywords, link)

### Semantic chips

- `amber-100` / `amber-800` — "Casual" / novice prompt voice
- `indigo-100` / `indigo-800` — "Pro" prompt voice

---

## Saved candidate palettes (not yet in production)

Five paired palettes from a 2026-06-01 reference set. None are committed; they're stashed here as starting points if we want to refresh a specific surface.

| Pair                        | Hex               | Fit assessment                                                                                                                                                                                                      |
| --------------------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~Evergreen + Lime Cream~~  | `#143731 #CEFF8C` | **Adopted 2026-06-01** for InstallSection. See "InstallSection" section above.                                                                                                                                      |
| Celadon + Chocolate Plum    | `#A8D3A8 #553832` | **Photography aesthetic.** Earthy warm palette is what photo prints sit on. Candidate for a future "case studies" / "templates gallery" section background. Chocolate Plum is also a usable warm-dark alt to black. |
| Petal Frost + Coffee Bean   | `#FFD1DC #1B1110` | Coffee Bean is a warm near-black — softer alt to `neutral-950` for a less clinical dark surface (Install, footer). Petal Frost itself is too pink for the current voice.                                            |
| Crimson Violet + Periwinkle | `#470B24 #B5BEDD` | Editorial / fashion-print feel. Possible fit for a future testimonials or magazine-style section. Aspirational — doesn't have an obvious home in the current site.                                                  |
| Hot Fuchsia + Antique White | `#F8395A #F7E6D2` | Antique White is a usable warm off-white (alt to `neutral-50`) for surfaces that should feel more paper than screen. Hot Fuchsia is too high-energy for the current restrained voice.                               |

---

## Decision rule

Don't introduce a new accent color without a reason. Emerald + sky are doing real semantic work (you / AI · brand / cloud). Any new color from this list should either (a) replace one of those because the current choice isn't pulling its weight, or (b) earn its own semantic slot (e.g., a "Pro tier" accent distinct from CE).

Cosmetic swaps (warmer dark, warmer off-white) are lower risk and can land without semantic rework.
