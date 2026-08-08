---
title: Introducing Editmamei
description: The story behind Editmamei, and why photo editing needed AI that assists the craft instead of replacing it.
date: 2026-08-05
---

Look at how images get edited in 2026 and one pattern dominates. Most of the new AI tools, and most of the AI features landing inside the big editors, are generative. You hand a diffusion model your image and it hands you back something similar. Often something beautiful. But it got there by re-rendering the pixels. What you're looking at isn't your photograph anymore. It's a new picture that resembles it.

For plenty of work, that trade is fine, and the results are honestly impressive. Photography is different. A photographer's finished image is theirs twice over: once when they clicked the shutter, and again through every choice made in the edit. Pulling a photo into Photoshop and working it, the curves, the masks, the dodge and burn, the local cleanup, is a craft in its own right. Even Photoshop's own headline AI features lean generative now, and they're great at what they do. Generative fill on a distracting edge of the frame is sometimes exactly the right tool. What none of it does is make the editing itself faster, easier, or easier to learn. Either the photo gets re-rendered, or you're back to doing everything the hard way.

I built Editmamei because I didn't think those should be the only two options.

## Assist the craft, not replace it

Editmamei connects your AI assistant to your own Photoshop. You describe what you're after the way you'd brief another editor: warm up the skin tones a touch, lift the shadows in the trees, straighten that horizon. The AI plans the edit; Photoshop performs it with its real, non-generative tools. AI orchestration, not generation.

What comes out isn't an export from a model. It's your PSD, on your machine, and it's an ordinary working file, the kind you could hand off to a retoucher: adjustments on their own layers, masks you can repaint, nothing flattened, nothing baked in. Every layer is still yours to tune.

## You shouldn't need a decade in Photoshop

There's a second group I care about: people who never put ten years into learning Photoshop, and the designers and creators who use it every day but stick to the corner of it they know. It ships with hundreds of tools, and knowing which one to reach for is half the battle. Describing the change you want, then watching real, named tools carry it out on visible layers, turns out to be a good way to actually learn the program instead of going around it.

## What Editmamei is, concretely

Editmamei is an MCP server that runs on your desktop next to Photoshop. Connect it to an AI assistant like Claude and the assistant can drive Photoshop directly. Everything happens on your machine, in your copy of Photoshop. When the assistant needs to check its work, it looks at a downscaled preview, the same as if you'd dropped the photo into the chat yourself.

The Community Edition is free. The [install guide](https://github.com/editmamei/editmamei#readme) takes you from zero to your first described edit in a few minutes.

— Alex
