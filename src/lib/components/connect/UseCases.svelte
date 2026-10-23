<script lang="ts">
	import { reveal } from '$lib/actions/reveal';
	import { track } from '$lib/analytics/clarity';

	// Four real Connect sessions. Titles and steps are each session's own share
	// story; a request is quoted only where its wording was recorded.
	type Case = {
		id: string;
		tab: string;
		title: string;
		request?: string;
		steps: string[];
		before: string;
		after: string;
		alt: string;
	};
	const cases: Case[] = [
		{
			id: 'product',
			tab: 'Product',
			title: 'From countertop to listing',
			request: 'Make this an Etsy listing photo.',
			steps: [
				'Cut the pendant out and set it on a charcoal gradient, keeping the gold its true color.',
				'Cropped so the cord runs off the top.',
				"Sized to 2000 × 2000, Etsy's recommended minimum, without softening the engraving."
			],
			before: '/connect/case/pendant-before.webp',
			after: '/connect/case/pendant-after.webp',
			alt: 'A gold pendant'
		},
		{
			id: 'cleanup',
			tab: 'Clean-up',
			title: 'The stern line out, the water turquoise',
			steps: [
				'Selected the rope with AI: 0.3% of the photo.',
				'Removed it.',
				'Selected the water with AI and gave it more depth, contrast and color.'
			],
			before: '/connect/case/stern-before.webp',
			after: '/connect/case/stern-after.webp',
			alt: 'A rocky cove seen from the stern of a boat'
		},
		{
			id: 'portrait',
			tab: 'Portraits',
			title: 'Late light, and no fake blur',
			steps: [
				'Framed to a 4:5 portrait and selected the dog with AI.',
				"Rolled off the sky's clipped blue and warmed the light toward golden hour.",
				'Darkened and muted the background beyond a wide, soft margin, so the dog stands out without blur or a visible edge.',
				"Opened the coat's shadows, lifted its color and added a soft vignette."
			],
			before: '/connect/case/shepherd-before.webp',
			after: '/connect/case/shepherd-after.webp',
			alt: 'A young shepherd dog sitting in a field'
		},
		{
			id: 'looks',
			tab: 'Looks',
			title: 'Living-room flowers as an old-master still life',
			steps: [
				'Selected the bouquet and vase with AI, then cropped to a 4:5 portrait.',
				'Darkened everything but the flowers, fixed the yellow indoor cast on the flowers only, and added an off-center vignette like window light.',
				'Warmed the white roses to cream with a small nudge in the highlights.',
				"A softer pool of light brought the cabinet top's wood grain back."
			],
			before: '/connect/case/still-before.webp',
			after: '/connect/case/still-after.webp',
			alt: 'A bouquet of roses in a vase'
		}
	];

	let at = $state(0);
	let original = $state(false);
	const c = $derived(cases[at]);

	function pick(i: number) {
		at = i;
		original = false;
		track(`connect-case-${cases[i].id}`);
	}
</script>

<section class="bg-paper px-4 py-20 md:py-28" aria-labelledby="cases-title">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[40rem]">
			<p class="lp-eyebrow text-terracotta-ink">What people edit with it</p>
			<h2 id="cases-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
				<span><span>Real edits,</span></span>
				<span><span>straight from a chat.</span></span>
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-neutral-700">
				Four real Connect sessions, each with the steps it took. Pick one.
			</p>
		</div>

		<div
			class="mt-10 flex gap-2 overflow-x-auto pb-1"
			role="group"
			aria-label="Which kind of edit to show"
		>
			{#each cases as item, i (item.id)}
				<button
					type="button"
					aria-pressed={at === i}
					onclick={() => pick(i)}
					class="min-h-11 flex-none rounded-full border-2 px-5 text-[15px] font-semibold transition-colors {at ===
					i
						? 'border-brand bg-brand text-white'
						: 'border-brand/20 bg-white text-brand hover:border-brand/50'}">{item.tab}</button
				>
			{/each}
		</div>

		<div
			class="mt-6 grid gap-8 rounded-[26px] bg-white p-4 ring-1 ring-brand/10 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:p-6 lg:gap-12"
		>
			<figure class="relative m-0 overflow-hidden rounded-[18px] bg-neutral-900">
				{#key `${c.id}-${original}`}
					<img
						src={original ? c.before : c.after}
						alt={original ? `${c.alt}, as shot` : `${c.alt}, after the edit`}
						class="case-in block aspect-[4/5] w-full object-cover"
						loading="lazy"
					/>
				{/key}
				<span
					class="absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-bold {original
						? 'lp-glass text-white'
						: 'bg-accent text-brand-deep'}">{original ? 'Original' : 'Edited with Connect'}</span
				>
				<button
					type="button"
					aria-pressed={original}
					onclick={() => (original = !original)}
					class="absolute right-3 bottom-3 inline-flex min-h-10 items-center rounded-full px-4 text-[13px] font-bold shadow-lg {original
						? 'bg-white text-brand'
						: 'lp-glass text-white'}">{original ? 'Show the result' : 'Show the original'}</button
				>
			</figure>

			<div class="flex flex-col py-2">
				<h3 class="text-2xl leading-tight font-bold tracking-[-0.02em] text-brand md:text-[1.7rem]">
					{c.title}
				</h3>
				{#if c.request}
					<p class="mt-4 rounded-2xl bg-cream p-4 text-[16px] leading-relaxed text-neutral-800">
						<span
							class="mb-1 block text-[12px] font-bold tracking-wider text-terracotta-ink uppercase"
							>The request</span
						>
						“{c.request}”
					</p>
				{/if}
				<p class="mt-6 text-[12px] font-bold tracking-wider text-neutral-500 uppercase">
					What it did
				</p>
				<ol class="mt-3 grid gap-3">
					{#each c.steps as s, i (s)}
						<li class="flex gap-3 text-[15.5px] leading-relaxed text-neutral-800">
							<span
								class="mt-0.5 grid size-6 flex-none place-items-center rounded-full bg-brand text-[12px] font-bold text-accent"
								>{i + 1}</span
							>
							{s}
						</li>
					{/each}
				</ol>
				<p class="mt-auto pt-6 text-[12.5px] text-neutral-500">
					A real Connect session. Steps are from the session's own record.
				</p>
			</div>
		</div>
	</div>
</section>

<style>
	.case-in {
		animation: case-in 450ms ease-out both;
	}
	@keyframes case-in {
		from {
			opacity: 0.3;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.case-in {
			animation: none;
		}
	}
</style>
