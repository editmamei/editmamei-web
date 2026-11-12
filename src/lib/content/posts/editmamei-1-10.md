---
title: 'Now available: Editmamei 1.10'
description: Your assistant can now use Photoshop's new Relight to add light to a photo after it was taken, with a free look at the lights before anything renders. Plus Clarity and Dehaze, and Grain layers.
seoTitle: 'Editmamei 1.10: Photoshop Relight from your AI assistant'
seoDescription: "Your AI assistant can now use Photoshop's new Relight to add up to three lights to a photo, with a free preview before any Adobe Firefly credits are spent."
date: 2026-11-12
---

<script>
  import YouTubeShort from '$lib/components/YouTubeShort.svelte';
</script>

Photoshop 2027 brought Relight, which adds new light to a photo that's already been taken, and
in Editmamei 1.10 your assistant can run it. Describe the light you want ("a warm sunset from
the right, at eye level") and your assistant places up to three lights with the Relight panel's
own sliders: where each one sits left to right, how high, how close to the camera, how bright
and how soft. Each light takes one of Photoshop's nine color temperature presets or any color
you name, and you choose how much of the photo's original light stays. The result is a new
Relight layer, with your original underneath.

<YouTubeShort
  id="fWykW9WoaSg"
  title="Claude controls Photoshop 28's new Relight feature"
  poster="/posts/editmamei-1-10-relight-short.jpg"
/>

Relight is one of Photoshop's generative features, and it bills your Adobe account: each render
spends Adobe Firefly credits, 30 a render in Photoshop 28.0. So Editmamei asks you before every
render, in your AI app's approval prompt, or in the chat when the app can't show one. Your
assistant only uses Relight when you ask for it, and
`editmamei config set automation.allow_adobe_generative_credits false` (or **Allow Adobe
generative AI tools** in Claude Desktop) removes it altogether. The
[settings reference](https://github.com/editmamei/editmamei/blob/main/docs/mcp-reference.md#settings)
has the details.

Before you spend anything, your assistant can show you a free preview. It opens the Relight
panel with its lights, brings Photoshop's own low-resolution preview back to the chat, and
closes the panel without rendering, so no credits are used. Photoshop comes to the front
briefly while it works, and for now the preview needs Windows and Photoshop in English. When
you like the look, the real render follows, and asking for a change later re-renders the same
Relight layer in place instead of stacking a new one, at the same cost as the first.

1.10 also adds Photoshop's Clarity and Dehaze, and Grain adjustment layers (Photoshop 2026,
27.3 or later), non-destructive like the other adjustments. On the GIMP side, an operation that
runs past its time limit no longer stops GIMP partway through and takes your layers with it.
The operation finishes, and the next call reports how it ended.

The [changelog](https://github.com/editmamei/editmamei/blob/main/CHANGELOG.md) has the full
list, and [the download page](/download) has 1.10.2, the current build.

— Alex
