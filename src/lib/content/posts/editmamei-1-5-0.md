---
title: 'Now available: Editmamei 1.5.0'
description: Raw files can be developed before Photoshop opens them, which reaches the levelling, perspective and lens corrections a filter cannot, and raw can now open straight to 16 bit.
date: 2026-09-18
---

1.5.0 develops a raw file before Photoshop opens it. A crooked horizon and converging
verticals are usually the first two things a photo needs, and they were the two the
assistant could not touch, because a filter cannot change a layer's dimensions and
Photoshop disables that whole panel for the Camera Raw Filter. Working on the file
instead of the opened pixels reaches all of it: Upright levelling, perspective
correction, crop with straighten, and lens profile correction.

How it does that is deliberately unglamorous. It writes Camera Raw's own settings file
next to the photo, the same file Bridge and Lightroom have used to carry settings
between applications for years, and then opens it. It merges into an existing develop
instead of overwriting it, backs the previous settings up first, and carries masks you
painted by hand in Camera Raw through untouched. Saved presets work by name, so asking
for one you already made brings its look across intact.

Raw can also open straight to 16 bit now, which is free in Community. That has to be
decided at the open, because converting afterwards flattens the document, and when the
request can't be honoured the result says so instead of leaving you to spot it later.

Developing the raw file itself is part of Pro. [The download page](/download) has the
current build, and [pricing](/pricing) has what Pro costs.

— Alex
