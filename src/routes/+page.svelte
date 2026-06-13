<script lang="ts">
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import LayerAccordion from '$lib/components/LayerAccordion.svelte';
	import HeroMovie from '$lib/components/HeroMovie.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import HowItWorks from '$lib/components/HowItWorks.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { setSail } from '$lib/demos/set-sail';

	// The "inspect it" demo below the hero movie is a single static example
	// (set-sail). The old multi-demo carousel was retired when the Hawaii movie
	// (HeroMovie) took the top — its typewriter/co-work concepts live there now.
	const demo = setSail;
</script>

<Seo
	title="Editmamei — Unlock Photoshop with natural-language photo editing"
	description="Unlock Photoshop with natural-language photo editing. AI orchestration, not generation. Your AI plans the edit; your own Photoshop does it. Pronounced like edamame."
	path="/"
/>

<Hero />

<!-- FEEL IT — the hero "movie": a scripted playback of the real co-work loop. -->
<section id="demo" class="border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mx-auto mb-10 max-w-2xl text-center">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The demo · Hawaii bay wall art
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Watch it build the edit — layer by layer, checking in with you.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				You describe the look. The AI opens your Photoshop, builds the adjustment layers one at a
				time, pauses to confirm a judgment call, then finishes — every step a real, editable layer.
			</p>
		</div>

		<HeroMovie />
	</div>
</section>

<!-- INSPECT IT — the real before/after + the actual layer stack (set-sail). -->
<section id="inspect" class="bg-sage py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<header class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Inspect the layers · {demo.title}
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				{demo.headline}
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				{demo.summary}
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
					Drag the bar — or use ← → on the keyboard — to compare. Left of the line is the finished
					edit; right is the original.
				</p>
			</div>

			<aside>
				<div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg md:p-5">
					<p class="mb-3 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
						Layer stack — built non-destructively
					</p>
					<LayerAccordion layers={demo.layers} />
				</div>
				<p class="mt-4 text-xs leading-relaxed text-neutral-600">
					Every layer above is editable, maskable, removable. Saved as a template (a Pro feature),
					the AI recreates the same look on a new photo and self-judges the result.
				</p>
			</aside>
		</div>

		<div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
			<p class="text-sm text-neutral-700">Want the full capability surface and trust receipts?</p>
			<a
				href="/product"
				class="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-700"
			>
				See the product page <span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>

<HowItWorks />
<InstallSection />
