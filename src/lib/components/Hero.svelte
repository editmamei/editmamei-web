<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics/clarity';

	// The batch-flip video plays muted on a loop, started from script rather than the
	// autoplay attribute so a reader who asked for reduced motion gets the poster and
	// controls instead of motion they never agreed to.
	let video: HTMLVideoElement;
	let reducedMotion = $state(false);
	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (!reducedMotion) video?.play().catch(() => {});
	});
</script>

<section class="relative overflow-hidden bg-white">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] bg-gradient-to-b from-emerald-50/80 via-white to-white"
		aria-hidden="true"
	></div>

	<div
		class="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-4 pt-16 pb-12 md:pt-24 md:pb-16 lg:grid-cols-[1fr_minmax(0,460px)] lg:gap-12"
	>
		<div class="text-center lg:text-left">
			<h1
				class="text-4xl font-bold tracking-tight text-neutral-950 md:text-6xl md:leading-[1.05] lg:text-[3.4rem]"
			>
				Unlock Photoshop with<br class="hidden md:inline" />
				natural-language photo editing.
			</h1>

			<p
				class="mx-auto mt-5 max-w-2xl text-lg font-medium tracking-tight text-neutral-700 md:text-xl lg:mx-0"
			>
				AI orchestration, not generation.
			</p>

			<p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-700 md:text-xl lg:mx-0">
				Open a chat. Direct the changes, or describe a look. Photoshop does the work, hands-free,
				one layer at a time. Real photo editing, with the power of Photoshop, automated with AI.
			</p>

			<!-- The demo is the primary ask, not install. A top-of-page install CTA drew
			     one click in 28 sessions (2026-08-14) — it asks for commitment before any
			     proof has landed. See docs/20260814-home-page-restructure.md. -->
			<div
				class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
			>
				<a
					href="#inspect"
					onclick={() => track('hero-demo-cta-clicked')}
					class="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
				>
					See it work ↓
				</a>
				<a
					href="#install"
					onclick={() => track('hero-install-cta-clicked')}
					class="text-sm font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-500"
				>
					or install it free
				</a>
			</div>

			<p class="mt-5 text-xs text-neutral-500">Installs on your desktop, runs next to Photoshop.</p>
			<p class="mt-1 text-xs text-neutral-500">
				GIMP support is in beta.
				<a
					href="https://github.com/editmamei/editmamei/blob/main/docs/gimp.md"
					class="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 hover:decoration-neutral-500"
					>Read the GIMP guide</a
				>
			</p>
		</div>

		<figure class="mx-auto w-full max-w-[460px]">
			<video
				bind:this={video}
				class="aspect-square w-full rounded-2xl border border-neutral-200 bg-paper shadow-xl"
				muted
				loop
				playsinline
				preload="metadata"
				controls={reducedMotion}
				poster="/hero/batch-flip-poster.webp"
				width="1080"
				height="1080"
				aria-label="Seventy-three travel photos graded in Photoshop from a single sentence: the prompt, the grading calls three photos at a time, and the finished set."
			>
				<source src="/hero/batch-flip-720.mp4" type="video/mp4" media="(max-width: 640px)" />
				<source src="/hero/batch-flip-1080.mp4" type="video/mp4" />
			</video>
			<figcaption class="mt-3 text-xs text-neutral-500">
				A real run: 73 travel photos, one sentence, graded in Photoshop.
			</figcaption>
		</figure>
	</div>
</section>
