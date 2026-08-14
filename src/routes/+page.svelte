<script lang="ts">
	import { onMount } from 'svelte';
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import LayerAccordion from '$lib/components/LayerAccordion.svelte';
	import HeroMovie from '$lib/components/HeroMovie.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import HowItWorks from '$lib/components/HowItWorks.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { trackOnce } from '$lib/analytics/clarity';
	import { setSail } from '$lib/demos/set-sail';

	// Section order reversed 2026-08-14: the before/after + layer stack now comes
	// BEFORE the scripted movie. Scroll data put a 42% drop-off between 15% and
	// 20% of the page, which was the top of the movie section — a one-second
	// payoff belongs at the cliff, and a 33-second one is something a convinced
	// reader opts into. See docs/20260814-home-page-restructure.md.
	const demo = setSail;

	// Arrival denominator for `demo-slider-used`: without it we can measure that
	// the slider was used but not what share of arrivals used it.
	let inspectEl: HTMLElement;
	onMount(() => {
		if (typeof IntersectionObserver === 'undefined' || !inspectEl) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					trackOnce('scroll-inspect-reached');
					obs.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		obs.observe(inspectEl);
		return () => obs.disconnect();
	});
</script>

<Seo
	title="Editmamei — Photoshop MCP server for AI photo editing"
	description="A Photoshop MCP server that turns Claude Desktop or Cursor into your AI photo editing assistant. Every edit runs in Photoshop, on your desktop."
	path="/"
/>

<Hero />

<!-- INSPECT IT — the cheapest proof on the site: a real before/after and the
     actual layer stack it produced. -->
<section bind:this={inspectEl} id="inspect" class="bg-sage py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<header class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The result · {demo.title}
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Nine layers. Every one still editable.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				A flat phone shot, graded in a single pass. Drag to compare, then open the stack and see
				exactly what changed.
			</p>
		</header>

		<div class="grid gap-8 md:grid-cols-[1fr_420px] md:items-start lg:grid-cols-[1fr_480px]">
			<div>
				<BeforeAfterSlider
					beforeSrc={demo.before}
					afterSrc={demo.after}
					beforeAlt={demo.beforeAlt}
					afterAlt={demo.afterAlt}
				/>
				<p class="mt-3 text-xs text-neutral-600">
					Drag the bar (or use ← → on the keyboard) to compare. Left of the line is the finished
					edit; right is the original.
				</p>
			</div>

			<aside>
				<div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg md:p-5">
					<p class="mb-3 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
						Layer stack, built non-destructively
					</p>
					<LayerAccordion layers={demo.layers} />
				</div>
				<p class="mt-4 text-xs leading-relaxed text-neutral-600">
					Repaint any mask, re-tune any curve, delete any layer. Nothing is baked in. Save the stack
					as a template and reapply the look to a new photo (Pro).
				</p>
			</aside>
		</div>
	</div>
</section>

<!-- THE CLAIM — moved up from the bottom of How It Works, where it sat past 70%
     scroll depth. It is the strongest differentiator on the site and it also does
     the connective work between the two demos. Framed around what happens to the
     FILE rather than around generation, so it survives Editmamei driving
     Photoshop's own generative tools later. -->
<section class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="max-w-2xl">
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				The original frame, finished.
			</h2>
			<p class="mt-4 text-lg leading-relaxed text-neutral-700">
				Generative AI tools hand back a new picture that resembles your shot. Editmamei works the
				frame you captured, using Photoshop's own adjustment layers, masks, and filters. What comes
				back is a standard Photoshop-edited PSD file, ready for fine-tuning by hand.
			</p>
		</div>
	</div>
</section>

<!-- FEEL IT — the hero "movie": a scripted playback of the real co-work loop.
     Now earned rather than a toll gate. The hero's "See it work" anchors here. -->
<section id="process" class="border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mx-auto mb-10 max-w-2xl text-center">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The process · Hawaii bay wall art
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				One conversation, start to finish.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				The AI plans each step and Photoshop runs it. Halfway through it pauses on a judgment call,
				gets an answer, and carries on.
			</p>
		</div>

		<HeroMovie />
	</div>
</section>

<HowItWorks />
<InstallSection />
