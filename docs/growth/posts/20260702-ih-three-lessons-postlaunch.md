# IndieHackers post draft — three lessons (post-launch rewrite)

**Status:** DRAFT, not posted · **Account:** EditmameiAlex · **Surface:** IH post, build-in-public mold
**Supersedes:** `20260616-ih-orchestration-not-generation.md`. That draft is UNPOSTABLE as written: it calls the community edition "open-source" (it's free but closed-source) and says "pre-launch" (launched 2026-06-19). This rewrite fixes both, updates the numbers, and scrubs the em-dash/AI-tell patterns.
**Sequencing:** post 2-3 weeks AFTER the Adobe post, not before. Two IH posts in one week reads as a campaign, not a builder.
**Link policy:** one soft link, mid-narrative.

---

## Title (pick one)

- I built an AI that edits photos without generating them. Three things that broke on the way to launch.
- Everyone's building generative photo AI. I shipped the opposite. Here's what actually went wrong.

## Body

Every "AI photo editor" I tried had the same problem: it didn't edit my photo. It generated a new one that looked kind of like my photo, with my pixels gone and the layers and edit history nowhere to be found.

So I built the other thing: a tool that lets an AI assistant drive your own copy of Photoshop. You say "warm it up, lift the shadows, mask the sky and bring it back a stop," and it runs those as real Photoshop operations. Adjustment layers, masks, curves. The actual non-destructive edit you'd do by hand. It launched in June: the community edition is free on npm (closed-source, which I'll happily defend in the comments if anyone wants that debate), and there's a paid Pro tier for the production features.

Three things that broke on the way here:

**1. "Your photos never leave your machine" was a lie I almost shipped.** It's the obvious marketing line and it's false. A downscaled preview does go to the AI so it can see what it's working on. I caught myself writing the absolute claim and rewrote every privacy statement to be scoped: your files stay local, nothing goes to my servers, and a preview goes to the AI provider you chose, same as dropping a photo into a chat. Scoped-but-true beats absolute-but-false, and buyers can smell the difference.

**2. My green test suite was lying to me.** The layer that translates instructions into Photoshop scripting was fully covered by tests, and they passed while the real Photoshop call failed. The tests were string-matching the generated script, not running it, so they happily approved calls to Photoshop methods that don't exist. The only validation that means anything for this kind of work is a live run against real Photoshop. I now keep a rule: no tool ships until it has run against the real app, and untested tools are locked out of the release build by default.

**3. Same code, same Photoshop version, different OS, different behavior.** Windows Photoshop leniently accepts command shapes that macOS strictly rejects. Something verified on one OS can silently no-op on the other. I treat every cross-platform claim as unproven until I've captured evidence on both. That one cost me days of "but it works on my machine."

Where it stands now: npm shows about 1,500 downloads in the last month (inflated by mirrors and CI, like all npm counts, so I treat it as directional). The interesting problem ahead isn't features, it's discovery. The people who'd love this are photographers, and photographers don't browse npm. If you want to see the approach, the round-trip is on editmamei.com.

Question for the room: for those of you building on top of tools people already trust (Photoshop, Excel, Blender, whatever), how do you keep integration tests honest when the dependency is a black box that behaves differently in every environment?

---

## Pre-post checklist

- [ ] Refresh the npm figure to the current window.
- [ ] Confirm the "closed-source" framing still matches how you want to handle that conversation (it WILL come up on IH).
- [ ] One link only. Reply to early comments fast. Don't edit promo in after the fact.
