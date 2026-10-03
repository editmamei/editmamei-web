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
				The photo editing assistant<br class="hidden md:inline" />
				you always needed.
			</h1>

			<p
				class="mx-auto mt-5 max-w-2xl text-lg font-medium tracking-tight text-neutral-700 md:text-xl lg:mx-0"
			>
				AI orchestration, not generation.
			</p>

			<p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-700 md:text-xl lg:mx-0">
				Your AI assistant plans the edit from one sentence, and Photoshop carries it out layer by
				layer, so what comes back is a layered file you can keep working on by hand.
			</p>

			<!-- The demo is the primary call to action; install is the secondary link. -->
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

			<p class="mt-5 text-sm text-neutral-600">
				Works with Claude Desktop, Claude Code, Cursor and other MCP clients.
			</p>
			<p class="mt-1 text-xs text-neutral-500">Installs on your desktop, runs next to Photoshop.</p>
			<p class="mt-1 text-xs text-neutral-500">
				GIMP support is in beta.
				<a
					href="/gimp"
					class="underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 hover:decoration-neutral-500"
					>See GIMP support</a
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
