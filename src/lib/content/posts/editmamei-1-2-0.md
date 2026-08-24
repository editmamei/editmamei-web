---
title: 'Now available: Editmamei 1.2.0'
description: A folder of photos can be cropped, resized and exported in one pass, plus fixes for accented layer names and a thirty-second wait that shouldn't have been there.
date: 2026-08-24
---

1.2.0 takes a whole folder at once. The end of a shoot is forty files that all need the same crop, the same long edge, the same JPEG, which is filing rather than editing, and it used to cost a round trip to Photoshop per photo.

Now you describe the pass, crop everything to 4:5, resize the long edge to 2000 pixels, save as JPEG at quality 10, and it is recorded as a Photoshop Action and played across the set, so the cost is paid once for the folder. You can ask what it would touch before it runs and get the list back without anything being opened, and files a percentage crop would ruin are skipped and named rather than quietly mangled. The steps a batch can run are the mechanical ones: crop to an aspect, resize, rotate, flip, change the color mode, save as JPEG. It covers the prep and the export. A look you developed on one photo still gets applied one photo at a time. Batch is part of Pro.

Three fixes worth naming. Deleting a layer whose name matched a group deleted the group and everything inside it, and reported success; it now declines and tells you the name belongs to a group. Layer names with accented characters, which is most of them if your Photoshop isn't in English, came back on Windows with the accents turned into question marks, so the next call couldn't match the layer that had just been made. They survive the trip now. And asking whether Photoshop is running, when it isn't, could take thirty seconds and start Photoshop in the process. It answers in about a quarter of a second now, and starts nothing.

The rest is in the [changelog](https://github.com/editmamei/editmamei/blob/main/CHANGELOG.md), and [the download page](/download) has the current build.

— Alex
