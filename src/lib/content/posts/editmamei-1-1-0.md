---
title: 'Now available: Editmamei 1.1.0'
description: Smart Filters stay editable after they are applied, a clipped layer can be unclipped, and several near-identical tools are now one each.
date: 2026-08-14
---

Two things you can do in 1.1.0 that you couldn't before. A filter applied to a Smart Object stays editable, so the assistant can read back what is on the stack, hide one, change how it blends, or take it off, without rasterizing the layer or redoing the edit. And a clipped layer can be unclipped, which sounds trivial until you have asked for a clipping mask, changed your mind, and found the only way out was the Photoshop menu.

The less obvious change is that a handful of tools became one tool each. Creating a group, deleting one, ungrouping, moving a layer into one, setting its blend mode: five separate tools, all doing related things to the same object. They are one now, with the operation as an argument. The two text tools went the same way. The old names keep answering for one more release so nothing mid-project breaks, and then they retire.

That matters more than it looks, because of how an assistant actually works. It reads the whole list of available tools at the start of every session and picks from that list on every step. Two tools whose names differ by a word, acting on the same object, are exactly where it picks the wrong one or spends a step working out which is which. Give it one obvious name per subject and there are fewer wrong turns, and less of the edit spent undoing them.

So both halves of this release pull the same direction. More of Photoshop is reachable, and the vocabulary for reaching it got simpler.

— Alex
