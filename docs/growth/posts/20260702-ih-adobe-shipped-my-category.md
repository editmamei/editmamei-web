# IndieHackers post draft — "Adobe shipped my category"

**Status:** DRAFT, not posted · **Account:** EditmameiAlex · **Surface:** IH post (feed/group), build-in-public mold
**Angle:** the flagship post. Vulnerable, real stakes, discussion bait. Post this one FIRST; the lessons post (`20260702-ih-three-lessons-postlaunch.md`) follows 2-3 weeks later.
**Truth check:** every claim below is verifiable (launch date, npm stats, Adobe beta facts). No revenue numbers are quoted anywhere, on purpose. Personalize before posting: if any first-person line doesn't match your actual experience, change it.
**Link policy:** exactly one soft link to editmamei.com, mid-narrative.

---

## Title (pick one)

- Two weeks after I launched, I found out Adobe is shipping the same idea, built into Photoshop, for free. Here's my honest read on whether I'm dead.
- Adobe just shipped my product category. Post-launch postmortem from a very small competitor.

## Body

I launched Editmamei on June 19. It's a tool that lets an AI assistant (Claude, Cursor, any MCP client) drive your own desktop Photoshop with natural language. You say "warm the midtones and mask the sky," and it builds the actual adjustment layers and masks in your actual Photoshop file. Free community edition on npm, paid Pro tier on top.

Two weeks later I did a proper competitive sweep, the kind I should have been doing monthly. Adobe has a conversational AI Assistant in public beta for Photoshop on web and mobile, and an early beta inside desktop Photoshop. Included in the Creative Cloud subscription my target buyer already pays for. Marginal price to them: zero.

That's the nightmare scenario for anyone building on top of a platform: the platform owner ships your feature as a checkbox.

Here's what I found when I actually tested the gap instead of panicking:

Their assistant is genuinely good at the demo, the single-image conversational edit. Select the subject, swap the background, fix the lighting. It's also online-only, English-only, spends metered generative credits, and lives inside Photoshop's own UI.

What it doesn't do is everything around the edit. It can't batch a folder of files on your disk. It can't run the Photoshop Actions you've recorded over ten years. It doesn't save a look as a recipe you can re-apply next shoot. And it can't be composed with anything else, because it isn't in your AI client, it's in theirs. My tool runs inside the assistant you already use, next to your file system and your other tools, on local files that never get uploaded anywhere (a downscaled preview goes to your AI provider when it needs to see the result, same as dropping a photo into chat).

So my read: Adobe compressed my demo, not my product. The single-image "wow" moment is now table stakes they own. What's left for me is the production layer: batch, repeatability, verification, composition. That's a narrower wedge than the one I thought I launched with, and I'd rather know that in week two than month twelve.

Real numbers, since this is IH: npm shows about 1,500 downloads in the last month. I treat that as directional at best, npm download counts are notoriously inflated by mirrors and CI. I'm not sharing revenue because there's nothing meaningful to share yet.

The thing I'm actually chewing on: the same platform shift that created my competitor is also my best marketing. Every Adobe demo teaches the world that you can talk to Photoshop. I just have to be findable when someone asks "okay, but can it do a whole folder, with my Actions, from my own AI?" (That question is what editmamei.com now has to answer in one screen.)

For those of you building on a big platform: how do you decide when the platform owner shipping your feature means pivot, and when it means they just validated the category and you should dig in on the part they'll never prioritize?

---

## Pre-post checklist

- [ ] Re-verify the Adobe beta facts the week you post (their rollout is moving monthly).
- [ ] Refresh the npm download figure to the current window.
- [ ] Confirm nothing in the body claims revenue or user counts we don't have.
- [ ] One link only, mid-narrative. No link in comments unless someone asks.
- [ ] Post morning US/EU, reply to early comments fast.
