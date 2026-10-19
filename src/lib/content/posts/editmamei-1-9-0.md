---
title: 'Now available: Editmamei 1.9.0'
description: A GIMP edit can now leave as a layered PSD, ready to finish in Photoshop. Plus outlines and glows, text that wraps and sizes itself to a box, and what the GIMP beta picked up in 1.7.0 and 1.8.0.
date: 2026-10-18
---

1.9.0 lets a GIMP edit leave as a layered PSD. Export to a `.psd` and the layers go with it,
masks, opacity, blend modes and groups included, so a picture started in the GIMP beta can be
finished in Photoshop. Live filters are baked into each layer on the way out, since a PSD has
nowhere to keep a GIMP filter, and text is written as pixels. Photoshop blends partly transparent
layers and blend modes in gamma space, so those can look slightly different once the file opens
there, and the export result names them so you know where to look.

The GIMP effects gain an outline, an outer glow and surface blur, a blur that keeps edges sharp,
along with the grain extract and grain merge blend modes. Text can now wrap inside a box, and with
`fit` it takes the largest size that still fits the box, which is most of the work in setting a
caption. A saved selection can also be expanded, contracted, feathered, bordered, inverted,
hardened or smoothed before it becomes a mask.

1.7.0 and 1.8.0 went out without a post here. Between them the GIMP beta went from tone and color
work to layers and groups, a second photo placed in as a layer, the canvas extended for a border,
and live effects from vignette to drop shadow. Checkpoints stand in for undo, which GIMP doesn't
have when it runs in the background. Then came selections by shape, color range or Magic Wand,
layer masks made from them, live text, and moving, scaling or rotating a single layer.

On the Photoshop side, `ps_ping` now says when it can't find a Photoshop install at all and how to
point Editmamei at one with `PHOTOSHOP_PATH`, instead of asking you to open an application the
computer may not have. A save that runs past its time limit is checked on disk before it is
reported as a failure. And since 1.8.0, `editmamei config set automation.allow_execute_script
false` turns off the tools that run script code, a setting no tool can change back.

[The GIMP guide](https://github.com/editmamei/editmamei/blob/main/docs/gimp.md) covers setup and
everything above, the [changelog](https://github.com/editmamei/editmamei/blob/main/CHANGELOG.md)
has the full list, and [the download page](/download) has 1.9.0.

— Alex
