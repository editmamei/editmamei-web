# Reddit playbook — subreddit strategy + post drafts (2026-07-02)

**Status:** DRAFTS, none posted. · **Account:** use a real, aged account if possible; brand-new accounts posting product links get filtered.
**The one rule above all:** Reddit rewards builders who show up as people and punishes anything that smells like marketing. Every draft below leads with the demo or the honest limitation, discloses that you built it, and asks a real question. Never post the same text to two subs on the same day.

## Voice cheat sheet (how Reddit differs from the website)

- **Disclose immediately.** "I built this" in the first two sentences. Redditors forgive self-promo from a transparent builder and destroy stealth marketing.
- **Limitations are the trust currency.** A blunt "what it's bad at" section outperforms any feature list. It disarms the "this is an ad" reflex and starts real threads.
- **Jargon is fine here.** These are technical audiences. MCP, stdio, COM, ExtendScript are all allowed (unlike the website, where they're banned). Keep the edamame joke to one light touch or zero; Reddit is quick to read whimsy as branding.
- **Demo or it didn't happen.** Attach a short screen recording (60-90s: prompt in Claude, layers appearing in Photoshop, before/after). The video carries the post; the text supports it.
- **Stay in the thread.** Reply to every substantive comment for the first 3-4 hours. The algorithm and the etiquette both reward it.
- **Check each sub's rules the day you post.** Rules drift; some subs require flair or restrict launch posts to weekly threads. One minute in the sidebar saves a removal that also burns the account's credibility.

## Channel priority (from the 2026-07-02 deep analysis)

The evidence says the near-term buyer is the AI-power-user who shoots, not the working photographer. Post where they are first:

| Priority          | Sub                               | Why                                                                  | Approach                                                                       |
| ----------------- | --------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| 1                 | r/mcp                             | Exact audience, server showcases are the sub's bread and butter      | Draft A                                                                        |
| 2                 | r/ClaudeAI                        | Large, demo-hungry, MCP-native                                       | Draft B                                                                        |
| 3                 | r/SideProject (or r/indiehackers) | Launch-story friendly                                                | Draft C                                                                        |
| Later, carefully  | r/photoshop, r/postprocessing     | The aspirational audience, but self-promo rules are typically strict | Comment-first strategy below; only post Draft D after confirming rules/modmail |
| Do not post promo | r/photography                     | Long-standing hard ban on self-promotion                             | Participate only                                                               |

---

## Draft A — r/mcp

**Title:** I built an MCP server that drives desktop Photoshop directly (no plugin, no open port). Free tier on npm.

**Body:**

Builder here, full disclosure. I've spent the last couple of months on Editmamei, an MCP server that lets Claude (or any MCP client) operate the desktop Photoshop you already have installed.

Architecture, since that's the interesting part for this sub: it's a stdio server that injects ExtendScript over the platform automation channel (COM on Windows, AppleScript on macOS). No resident plugin inside Photoshop, no WebSocket bridge, no listening port. The tradeoff is per-call latency (a process spawn per operation) in exchange for zero-config install: if Photoshop is running, it works. The other Photoshop MCP servers I've seen take the UXP-plugin-plus-socket-broker route, which is lower latency but means installing and activating a plugin and running a local socket server.

What it does: 61 free tools covering documents, layer stacks, non-destructive adjustment layers (curves, levels, hue/sat), selections and masks, filters, content-aware retouch, transforms, and a verification loop (inline previews plus per-channel histograms, so the model can check whether an edit actually changed pixels instead of trusting a success string). A paid tier adds templates, Sensei selections, Actions playback, and a scripting escape hatch.

What it's bad at, honestly: pixel-precise spatial work. Asking for "a curves layer masked to the sky" works well. Asking it to draw an exact path around an object does not, and I keep tools I can't verify against live Photoshop out of the shipped build entirely (string-matching unit tests pass on scripts that fail against the real app, which I learned the hard way).

Windows and macOS, verified against Photoshop 2026. Free CE: `npm install -g editmamei`, or a one-click .mcpb for Claude Desktop. Site: editmamei.com

Question for people building desktop-app servers: how are you handling verification against apps you can't run in CI? My answer so far is a live smoke harness plus keeping unverified tools gated out of releases, and I'm curious what others do.

---

## Draft B — r/ClaudeAI

**Title:** I've been letting Claude edit photos in actual Photoshop (real adjustment layers, real masks). Built the MCP server for it, free tier on npm.

**Body:**

Full disclosure: I built this. But the workflow is the point, so here's a real session.

I open a beach photo and tell Claude: "warm the midtones, lift the shadows a touch, then mask the sky and pull it back half a stop, keep everything editable." Claude plans the steps, then drives my desktop Photoshop through them: a curves adjustment layer, a hue/sat layer, Select Sky into a mask, opacity tweaks. Then it grabs a downscaled preview and a histogram to check its own work, and adjusts once more. The result is a normal layered PSD on my disk. Every layer is still editable by hand afterward, because they're just real Photoshop layers.

(Attached: 90-second screen recording of exactly this.)

What Claude turns out to be good at: planning sensible non-destructive layer stacks, iterating against previews, explaining what it did. Genuinely better than I expected at "make it feel like golden hour but keep it honest."

What it's bad at: precise spatial targeting ("select just the left lamppost" is a coin flip without the smart-selection tools), and it will occasionally declare victory without checking, which is why the server ships histogram and preview tools so it can verify instead of vibe.

Privacy note since this sub asks (correctly): everything runs on your machine against your local files. When Claude needs to see the result, a downscaled preview goes to Anthropic, same as dropping an image into chat. Nothing goes to me except opt-out anonymous usage telemetry.

Free community edition: `npm install -g editmamei` or a one-click .mcpb for Claude Desktop. Needs desktop Photoshop (verified on 2026). Paid tier exists for templates/Actions/Sensei selections, but everything in the video above is doable in the free tier except Select Sky.

Curious what this sub would use it for. Also: if you've found good patterns for making Claude verify visual work instead of asserting it, I want to hear them, that's the hardest open problem in this thing.

---

## Draft C — r/SideProject (adapt for the r/indiehackers sub)

**Title:** Launched: describe a photo edit in plain language, your own Photoshop does it (with real layers you keep)

**Body:**

Launched this in June after a couple of months of building. Editmamei connects AI assistants (Claude Desktop, Claude Code, Cursor) to the desktop Photoshop you already own. You describe the edit, the AI plans it, Photoshop executes it with its own non-destructive tools, and you keep a normal layered file. It deliberately does not generate imagery. The pitch is for people who want their actual photo adjusted, not a lookalike regenerated.

Stack: Node/TypeScript MCP server, a compiled Go core for the Photoshop scripting layer, Cloudflare Workers for license delivery, Polar for payments. Free tier on npm, paid Pro tier ($9/mo early-adopter pricing right now).

The two hardest problems so far, in case they're useful to anyone:

1. Testing against software you don't control. My unit tests were green while real Photoshop calls failed, because the tests checked the generated script text, not its behavior. Fix: a live smoke harness against real Photoshop, and untested tools are excluded from release builds by default.

2. Adobe launched their own AI assistant in beta two weeks after I launched. Included with Creative Cloud. I wrote up my honest gap analysis (short version: they own the single-image demo, I keep batch, Actions, templates, and running inside your own AI client). Week two is a better time to learn your category has a giant in it than month twelve.

Site: editmamei.com. Happy to answer anything about MCP servers, driving desktop apps programmatically, or selling next to a platform owner.

---

## Draft D — r/photoshop (ONLY after rules check; expect this may not be postable)

**Pre-check:** read the sidebar rules and recent "I made a tool" posts the same day. If self-promo posts aren't clearly tolerated, don't post; use the comment-first strategy instead. Consider modmail first: a two-line "is this okay to share?" costs nothing and mods remember politeness.

**Title:** I made a thing: tell an AI what edit you want, and it builds the adjustment layers in your own Photoshop

**Body:**

Disclosure up front: I built this, it has a free version, and if this post isn't appropriate here, mods please remove with my apologies.

It's a bridge between AI assistants (Claude, Cursor) and desktop Photoshop. You describe an edit in plain language and it performs it with ordinary Photoshop operations: adjustment layers, masks, selections, filters, content-aware fill. The point is that you end up with a normal layered document you can keep working on by hand. Nothing is generated, no pixels are replaced with AI imagery, and the file never leaves your machine (the AI sees a downscaled preview when it checks its work).

Where it's genuinely useful: repetitive grading and cleanup across a set of images, building a starting stack you then refine by hand, and "do the boring 80% so I can do the interesting 20%."

Where it isn't: precision work. It will not replace your hands on a tablet, and I'd be lying if I said otherwise.

Free version on npm (needs Photoshop 2026 and an AI client that supports connectors). I'd honestly rather have this sub's criticism than its upvotes: what would make something like this actually useful in your workflow, and where's the line where you'd never let an AI touch the file?

## Comment-first strategy for the photographer subs (do this regardless)

Before (or instead of) any launch post in r/photoshop / r/postprocessing: spend 2-3 weeks answering automation and batch-workflow questions as a knowledgeable human. Photoshop scripting questions, "how do I do X to 300 files" threads, adjustment-layer workflow questions. Mention the tool only when it's the direct answer to what was asked, with disclosure. This builds the account karma and history that make an eventual post survivable, and it's also simply the honest version of participating.

---

## Cadence

Week 1: r/mcp (Draft A). Week 2: r/ClaudeAI (Draft B) plus the IH Adobe post. Week 3-4: r/SideProject (Draft C), IH lessons post. Photographer subs: comment-first throughout; Draft D only after the rules check and only once the demo video exists. Refresh every number (npm downloads, pricing, Adobe beta status) the day each post goes out.
