<script lang="ts">
	import '$lib/components/landing/landing.css';
	import type { Snippet } from 'svelte';

	// The opening band of every inner page: the same dark stage, type and
	// spacing as the home and product pages, so the site reads as one piece.
	let {
		eyebrow,
		title,
		lede,
		crumbs,
		children
	}: {
		eyebrow?: string;
		title: string;
		lede?: string;
		/** Breadcrumb trail above the eyebrow, last item being this page. */
		crumbs?: { label: string; href?: string }[];
		/** Optional actions or a note under the lede. */
		children?: Snippet;
	} = $props();
</script>

<section class="lp-stage lp-grain overflow-hidden px-4 pt-12 pb-14 md:pt-16 md:pb-16">
	<div
		class="pointer-events-none absolute inset-0 -z-[1]"
		style="background: radial-gradient(45% 70% at 85% 0%, rgba(206,255,140,0.10), transparent 70%);"
		aria-hidden="true"
	></div>
	<div class="mx-auto max-w-6xl">
		{#if crumbs?.length}
			<nav aria-label="Breadcrumb" class="mb-4 text-[13px] text-[#9fb5ac]">
				<ol class="flex flex-wrap items-center gap-1.5">
					{#each crumbs as c, i (c.label)}
						<li>
							{#if c.href && i < crumbs.length - 1}
								<a href={c.href} class="hover:text-[#f4f1e8]">{c.label}</a>
							{:else}
								<span aria-current="page" class="text-[#dfe8e3]">{c.label}</span>
							{/if}
						</li>
						{#if i < crumbs.length - 1}<li aria-hidden="true">/</li>{/if}
					{/each}
				</ol>
			</nav>
		{/if}
		{#if eyebrow}<p class="lp-eyebrow text-accent">{eyebrow}</p>{/if}
		<h1
			class="mt-3 max-w-[22ch] text-[clamp(2.2rem,4.6vw,3.6rem)] leading-[1.02] font-bold tracking-[-0.035em] text-[#f7f4ec]"
		>
			{title}
		</h1>
		{#if lede}
			<p class="mt-5 max-w-[40em] text-lg leading-relaxed text-[#c3d2cb]">{lede}</p>
		{/if}
		{#if children}<div class="mt-7">{@render children()}</div>{/if}
	</div>
</section>
