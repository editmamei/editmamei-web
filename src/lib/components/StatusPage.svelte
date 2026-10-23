<script lang="ts">
	import '$lib/components/landing/landing.css';
	import type { Snippet } from 'svelte';

	// A one-message page (not found, email confirmation states) on the same
	// dark stage as every other page's opening band.
	let {
		eyebrow,
		title,
		children
	}: {
		eyebrow?: string;
		title: string;
		/** The message and any links under the title. */
		children?: Snippet;
	} = $props();
</script>

<section class="lp-stage lp-grain overflow-hidden px-4 py-20 md:py-28">
	<div
		class="pointer-events-none absolute inset-0 -z-[1]"
		style="background: radial-gradient(45% 70% at 50% 0%, rgba(206,255,140,0.12), transparent 70%);"
		aria-hidden="true"
	></div>
	<div class="mx-auto max-w-xl text-center">
		{#if eyebrow}<p class="lp-eyebrow text-accent">{eyebrow}</p>{/if}
		<h1
			class="mt-3 text-[clamp(2rem,4.4vw,3rem)] leading-[1.05] font-bold tracking-[-0.035em] text-[#f7f4ec]"
		>
			{title}
		</h1>
		{#if children}
			<div
				class="mt-5 text-lg leading-relaxed text-[#c3d2cb] [&_a]:font-semibold [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4"
			>
				{@render children()}
			</div>
		{/if}
	</div>
</section>
