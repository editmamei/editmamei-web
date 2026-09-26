---
title: 'Now available: Editmamei 1.6.0'
description: Editmamei can now edit in GIMP 3.2, in beta. GIMP runs in the background, and every adjustment stays a live filter in the .xcf you open afterwards.
date: 2026-09-26
---

1.6.0 adds a second editor: GIMP 3.2, as a beta. If GIMP is installed where it normally
goes, the GIMP tools appear next to the Photoshop ones, and if GIMP is the only editor you
have, setting `editor` to `gimp` makes them the only tools your assistant sees.

We're excited to announce GIMP support, which came out of requests to take Editmamei beyond
Photoshop. On the engineering side, GIMP exposes the interfaces Editmamei needs to drive it,
which some of the other editors we've been asked about do not.

It works differently from the Photoshop side, and the difference is worth knowing before you
try it. Editmamei starts GIMP in the background with nothing installed into it, so you don't
watch a GIMP window change while it works. You follow along through the previews in chat,
and a copy of the latest one is written to a file you can keep open beside the conversation.
Every adjustment goes on as one of GIMP 3's non-destructive filters, so when you open the
saved `.xcf` in GIMP afterwards, each curve, level and colour balance is still there to
change by hand.

The beta is tone and colour work: thirteen adjustments, masks for them, crop, resize,
rotate and flip, and export with the metadata removed. It can't heal, clone, select a
subject or set text yet, and there is no undo, so crop and resize are permanent within the
session and it's worth saving the `.xcf` first.

GIMP support is free and works the same in Community and Pro, because Pro's features are
Photoshop-only. [The GIMP guide](https://github.com/editmamei/editmamei/blob/main/docs/gimp.md)
covers setup, and [the download page](/download) has the current build.

— Alex
