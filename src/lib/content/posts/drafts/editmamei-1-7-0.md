---
title: 'Now available: Editmamei 1.7.0'
description: The GIMP beta gets layers, composites and live effects, plus checkpoints that save the image's state so you can go back to it. The setting that turns off previews now covers Photoshop too.
date: 2026-10-02
---

1.7.0 gives the GIMP beta layers, and a way back. Eight new tools create, group, reorder
and blend layers, place one photo into another as a new layer, extend the canvas for a
border or a frame, and add vignette, black and white, motion and lens blur, noise and drop
shadow as live effects you can still change in the saved `.xcf`, like the adjustments.

The way back is checkpoints. GIMP has no undo when it runs in the background, so in 1.6.0
a crop or a resize was permanent for the rest of the session. A checkpoint saves the
image's state to disk and can restore it later, so making one before a crop means the crop
can be taken back.

Two fixes came with it. An adjustment aimed at a layer by its id now lands on that layer,
where before it went onto whichever layer happened to be selected. And the setting that
stops previews going to the model, which only applied to GIMP, now covers every tool,
Photoshop included.

[The GIMP guide](https://github.com/editmamei/editmamei/blob/main/docs/gimp.md) covers
checkpoints and the new tools, and [the download page](/download) has the current build.

— Alex
