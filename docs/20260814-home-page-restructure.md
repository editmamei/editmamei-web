# Home page restructure — section order and copy grammar (2026-08-14)

Why the home page was reordered and rewritten. Records the evidence and the
reasoning, because the diff shows _what_ changed and none of _why_.

Visual record of the proposal, with a before/after toggle on every rewritten
block: <https://claude.ai/code/artifact/37244b38-f6ae-428d-a9ac-4931b1c78d45>
(private artifact, owner account).

---

## What the traffic showed

First real Reddit traffic reached the site 2026-08-12 to 08-14. Small sample, so
treat single events as noise and the shape as signal.

- **28 sessions** (12 from Reddit), 24 unique users, 1.32 pages per session.
- **Active time 22s of 50s.** Reddit-only was 29s active out of 29s total: no
  idling, they read fast and leave.
- **Scroll depth on the home page (desktop, 13 page views):**

  | Scrolled | Visitors    | Drop-off |
  | -------- | ----------- | -------- |
  | 10%      | 13 (100%)   | 0%       |
  | 15%      | 12 (92%)    | 8%       |
  | **20%**  | **7 (54%)** | **46%**  |
  | 25–30%   | 6 (46%)     | 54%      |
  | 45–55%   | 4 (31%)     | 69%      |
  | 60–100%  | 3 (23%)     | 77%      |

**42% of everyone who reaches 15% is gone by 20%.** That is by far the largest
single drop, and 15–20% of the old page was the top of the hero-movie section.
Everything below it decayed gently, and 23% read to the very bottom.

Two conclusions followed, and both contradicted the working assumption at the
time:

1. **The How It Works diagram was not the exit point.** `scroll-howitworks-reached`
   fired in 4 of 28 sessions, matching the ~23–31% who got that deep. Almost
   nobody reached it, so it could not have been what lost them.
2. **The page was not too long.** Readers who cleared 20% mostly kept going. The
   page had one wall, early, and the rest worked.

Supporting reads: rage clicks 0%, so nothing was being angrily hammered;
`hero-install-cta-clicked` fired once in 28 sessions, so a top-of-page install
ask was not converting; `/product` drew 2 page views, so relocating content
there removes it from the experience rather than repositioning it.

A confound worth recording: the hero movie had a real loading defect at the time
(ten frames, 3.2 MB, no preload, each fetched at the instant its wipe began).
Fixed in `fix(hero): decode movie frames before the wipe reveals them`. The
reorder still stands on its own — a 33-second demo is the wrong first ask
regardless of whether it loads — but the cliff should be re-measured now that
both changes are live.

## What changed in the order

| Before                           | After                                     |
| -------------------------------- | ----------------------------------------- |
| 1. Hero (+ Install CTA)          | 1. Hero, trimmed, CTA is "See it work"    |
| 2. The movie (~33s)              | 2. **Slider + layer stack** (was 3)       |
| 3. Slider + layer stack          | 3. **The original frame, finished** (new) |
| 4. How It Works + 10-row diagram | 4. **The movie** (was 2)                  |
| 5. Install                       | 5. How It Works, three chips              |
|                                  | 6. Install                                |

A one-second proof now sits where the cliff was. The movie is something a
convinced reader opts into rather than a toll gate. The full sequence diagram
moved to `/product`, which is the one relocation we did accept, because it is a
reference asset for someone already sold rather than a persuasion asset.

The claim that the file stays yours moved _up_ from the bottom of How It Works
(past 70% scroll depth, ~23% reach) into the gap between the two demos, where it
also does the connective work between them.

## What changed in the copy grammar

Modelled on adobe.com/products/photoshop and /photoshop-lightroom, pulled
2026-08-14. Across both pages roughly 80% of headings are bare imperatives and
the rest are noun phrases. **There is not one "You [verb]" heading on either
page.** Lightroom's six feature headings are six imperatives: "Quickly improve
image quality." / "Select your best photos faster." / "Polish portraits with
ease." and so on.

Where Adobe does use "you" it is almost always a trailing benefit clause: "so
you can work faster", "so you can choose the one that matches your vision". The
possessive "your" carries ownership; the reader is never the subject of a
process sentence.

Our copy was the inverse, and its imperatives took _our machinery_ as the object
("Watch it build the edit…") where Adobe's take _the reader's photo_ ("Polish
portraits with ease"). That is what made the page read like a system diagram in
prose.

### Rules adopted

1. Headings are imperative verbs or noun phrases. Never "You [verb]".
2. **No "your" in a heading.** Fine in body copy, but in a title it reads
   possessive and insistent — the same thing that made "your own Photoshop"
   grate. (Owner call, 2026-08-14.)
3. "your" is free in body copy; "so you can" is the benefit connector.
4. State the local/desktop fact once, plainly, then just say "Photoshop".

### Phrases retired

| Retired                                        | Replaced with                                    | Reason                                            |
| ---------------------------------------------- | ------------------------------------------------ | ------------------------------------------------- |
| your own copy of Photoshop                     | Photoshop                                        | Adobe never says it; ownership is assumed         |
| your own Photoshop, on your own computer       | on your desktop, inside Photoshop                | Doubled possessive reads as insistence            |
| the Photoshop you already have (installed)     | Installs on your desktop, runs next to Photoshop | A rebuttal to a misconception, not a benefit      |
| Not a web app. Not a cloud editor.             | (dropped)                                        | Opens on what it isn't; the FAQ answers this      |
| You describe / You talk / You say              | imperative                                       | Reader as subject of a process sentence           |
| editable, maskable, removable                  | Repaint, re-tune, delete                         | Same triple used three times sitewide             |
| the full capability surface and trust receipts | (dropped)                                        | Internal vocabulary on a customer-facing link     |
| The AI is the director, not the artist         | (dropped)                                        | Unlocked "X, not Y", third "director" on one page |

The hero paragraph takes its rhythm from the owner's own r/mcp post rather than
being written fresh: "Open a chat. Direct the changes, or describe a look.
Photoshop does the work, hands-free, one layer at a time. Real photo editing,
with the power of Photoshop, automated with AI."

"Direct the changes, or describe a look" is doing more than it looks. It is the
first copy anywhere on the site to express §4.5's both-modes principle ("never
imply that control means _no_ surprise. Both modes are welcome") — precise
instruction and hand-it-over-and-see are both offered in one line. "Direct" is
also the brand verb from §7.3's "The AI directs; Photoshop edits."

The article in "Direct **the** changes" is load-bearing: without it, "direct
changes" misparses as adjective-plus-noun at hero reading speed.

An earlier draft opened the second sentence with "Describe the edit", which put
the _edit_ root four times in thirty words (H1 "photo editing", "the edit",
"Hands-free edits", "Real photo editing"). The current wording has two.

Note the tension: "the power of Photoshop" uses a word §8 of the brand-voice
guide lists as overused. Kept deliberately, in the owner's own phrasing from a
post that worked. Flagged here rather than silently corrected.

## The generative framing softened

Old copy ran the axis as **generative vs non-generative** and carried a moral
charge that §4.5 rules out ("They _invent_ new pixels", "not fabricated", "the
AI is the director, not the artist").

Two problems. It is brittle — Editmamei automates Photoshop, so if Photoshop
ships a generative tool it is drivable, and the claim breaks. And it reads as a
stance against generative AI, which is not the position.

The axis is now **what happens to your file**, taken from the owner's own blog
post: "What you're looking at isn't your photograph anymore. It's a new picture
that resembles it." Under that framing a generative fill on a distracting edge
is still your photograph, and a full diffusion re-render is not. It survives us
driving Photoshop's generative tools later.

Nothing previously claimed was false, so nothing was retracted. This is a
forward softening: same facts, no loaded vocabulary, sturdier axis.

`AI orchestration, not generation` and the H1 are untouched; both are locked in
§7 of the brand-voice guide.

## Install section

Two equally-weighted cards became two buttons with steps revealed in place.

The old download button pointed straight at the GitHub release asset, which is
served as an attachment — so it downloaded the file and left the visitor where
they were, with no feedback. That only worked because the three setup steps were
printed underneath. Revealing them on click keeps the section compact, gives the
download visible confirmation, and keeps the npm snippet on the page so
`install-snippet-selected` still fires.

## Open, not decided here

- **Movie length.** ~33 seconds against a ~25-second median visit. Shortening it
  is a separate question from the loading fix.
- **Whether "no `your` in headings" generalises** to "Your files, your machine."
  in the privacy box, which uses it twice.
- **§8 red team.** The section conflates truth rules (absolutes — inviolable),
  emptiness rules (hype words — keep), and detector-avoidance rules (em-dashes,
  triples, "X, not Y" — these ban three of our own five approved phrases and are
  worth loosening to a density budget rather than a prohibition). Unresolved.
