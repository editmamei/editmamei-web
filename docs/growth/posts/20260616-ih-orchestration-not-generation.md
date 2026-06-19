# IndieHackers post draft — "orchestration, not generation"

**Status:** DRAFT, not yet posted · **Account:** EditmameiAlex · **Surface:** IndieHackers Post (feed/group), build-in-public mold
**Truth check:** every technical claim below is verifiable in the Editmamei repo. No traction/revenue numbers (pre-launch).
**Link policy:** exactly one soft link to editmamei.com, mid-narrative.

---

## Title (pick one)

- Everyone's building generative photo AI. I built the opposite — AI that drives your _real_ Photoshop. Here's what I learned.
- I spent months making an AI edit photos _without_ generating them. Here's why — and what broke along the way.

## Body

Every "AI photo editor" I tried had the same problem: it didn't edit my photo. It generated a _new_ one that looked kind of like my photo, with my actual pixels gone and the layers, masks, and edit history nowhere to be found.

For a photographer that's a non-starter. You don't want a plausible replacement — you want _your_ shot, adjusted non-destructively, in the tool you already trust.

So I went the other direction. Instead of replacing Photoshop with a model, I built a thing that lets an AI assistant **drive your own copy of Photoshop** with natural language. You say "warm it up, lift the shadows, mask the sky and bring it back a stop" — it runs those as real Photoshop operations: adjustment layers, masks, curves, the actual non-destructive edit you'd do by hand. Your file never gets regenerated. It's orchestration, not generation.

It's a local MCP server (open-source community edition on npm), it runs on your machine next to Photoshop, and the only thing that goes to the cloud is whatever your AI client sends — typically a downscaled preview so the model can _see_ what it's working on.

Three things I learned building it:

**1. "Your photos never leave your machine" was a lie I almost shipped.** It's the obvious marketing line and it's _false_ — a downscaled preview does go to the AI so it can see the image. I caught myself writing the absolute claim and rewrote every privacy statement to be scoped and honest: your files and full-res pixels stay local; a preview goes to the AI; we don't run any image through our own cloud. Scoped-but-true beats absolute-but-false, and people can smell the difference.

**2. My green test suite was lying to me too.** The layer that translates instructions into Photoshop scripting was covered by tests — and they passed while the real Photoshop call failed. Turns out the tests were string-matching the generated script, not _running_ it, so they happily "passed" calls to Photoshop methods that don't actually exist. The only validation that means anything for this kind of work is a live smoke test against real Photoshop. If you're integrating with a black box, your test suite being green tells you almost nothing until you've run it for real.

**3. The same code, same Photoshop version, behaves differently on Mac and Windows.** Windows' Photoshop leniently accepts command shapes that macOS strictly rejects — so something captured and verified on one OS can silently break on the other. I now treat any cross-platform claim as unproven until I've captured it on _both_. That one cost me a few "but it works on my machine" days.

I'm still pre-launch and deep in the unglamorous part — making the native operations bulletproof across two OSes before I expand the toolset. But the core bet feels right: most people don't want AI to _replace_ their craft tool, they want it to _operate_ it.

If you want to see the approach, it's at editmamei.com — the "how it works" page shows the actual round-trip.

Question for the room: for those of you building on top of tools people already trust (Photoshop, Excel, Figma, whatever) instead of replacing them — **how are you handling the "the tool behaves differently in every environment" problem?** I'd love to hear how others keep integration tests honest when the dependency is a black box.

---

## Pre-post checklist

- [ ] Confirm editmamei.com/product ("how it works") link is live and correct.
- [ ] Post into a relevant group (Developers / AI / Building in Public) so it hits the digest.
- [ ] Post morning US/EU.
- [ ] Reply to early comments fast (the algorithm + the etiquette both reward it).
- [ ] Do NOT add a second link or edit in promo after the fact.
