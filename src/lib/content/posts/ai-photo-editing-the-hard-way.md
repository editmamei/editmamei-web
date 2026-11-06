---
title: 'AI photo editing: build on the editors we have instead of replacing them'
description: People keep refining prompts that break on the next model, or letting AI rebuild an editor in a sandbox every time. Why not let AI use the photo editors we already have?
seoTitle: 'AI photo editing: build on the editors we have'
seoDescription: People keep refining prompts that break on the next model, or letting AI rebuild an editor every time. Why not let AI use the photo editors we have?
date: 2026-11-05
---

My X feed keeps showing me the same post: stop asking ChatGPT to make your photo better, use these prompts instead. One of them, from September, has 1.2 million views.

I get the appeal. Everyone has always enjoyed a good photo edit, and there have always been tools that could take something washed out, grainy or out of focus and turn it into something amazing. Then AI made it possible to edit and make anything.

The problem is that AI-edited photos often look fake. They look off, or something changed that you didn't ask to change, and it just doesn't look quite right.

Most of the effort to fix that seems to go one of two ways.

The first is better prompts. Prompt it this way, prompt it that way, and try to turn something that isn't deterministic into something that is. A prompt that works on one model can stop working when the next one is released, because everything behind it has changed, and that super long paragraph someone refined for a month is worth nothing. It wastes a lot of time and energy, and it still doesn't get you a deterministic result.

The second is having the AI build its own editor. Every time you want a photo edited, it opens a Python environment, loads a bunch of libraries and works out a new way to change the image pixel by pixel. Then the session ends and everything it built is gone, and all you have is a one-layer photo. The next day, if you ask for another photo edit, it restarts that process and builds everything from scratch again. That's another waste.

AI is meant to make everything easier and faster. So why is so much of what goes viral about AI focused on doing things the hard way?

Because AI can build things from scratch, everyone builds their own version instead of using what's been developed for years.

Photo editors have had decades of time, energy and investment put into them, and we know what they can do. I think the better approach is to make those tools accessible to AI, and let it accelerate and automate the work.

That's why I'm building Editmamei. I'm tired of seeing all these poor approaches to photo editing with AI. Editmamei connects your AI assistant to a desktop photo editor, Photoshop or GIMP. The AI decides what the edit should be and the editor does the work, layer by layer, with real masks and adjustments, following professional workflows.

It's a more deterministic approach. The AI won't make the same choices every time, and a new model might plan an edit differently, but a curves adjustment does the same thing to the same pixels every time. No model is redrawing your photo, and when it's done you have a layered file you can open, check and change. You get close to professional results without the fake look, and without a fragile prompt holding it together.

If you're frustrated with how AI edits your photos, give Editmamei a try. The desktop version is free, and the source is on GitHub: [github.com/editmamei/editmamei](https://github.com/editmamei/editmamei)

And if you like the work we're doing, leave a star.
