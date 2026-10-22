<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	type Card = {
		after: string;
		before: string;
		ar: string;
		alt: string;
		tag: string;
		request?: string;
		note: string;
		credit?: string;
		href?: string;
	};

	// Every request is the one the session ran on; every image is its real export.
	const cards: Card[] = [
		{
			after: '/landing/range/kodachrome-after.webp',
			before: '/landing/range/kodachrome-before.webp',
			ar: '3 / 4',
			alt: 'An oleander path',
			tag: 'Desktop · Photoshop',
			request:
				'Give this a 1960s Kodachrome travel-postcard look: warm, saturated reds, a deep cyan sky, slightly faded blacks, a soft vignette and fine film grain.',
			note: 'Nine named layers, grouped as “Kodachrome Postcard”.'
		},
		{
			after: '/landing/range/elephant-after.webp',
			before: '/landing/range/elephant-before.webp',
			ar: '3 / 2',
			alt: 'An elephant throwing dust',
			tag: 'Connect',
			request:
				'Make it look like the last light of the day: warm the dust until it glows, darken the hills behind, and make the elephant stand out.',
			note: 'Edited in the cloud from a chat.',
			credit: 'Photo: Signature Edits'
		},
		{
			after: '/landing/range/pendant-etsy.webp',
			before: '/landing/range/pendant-before.webp',
			ar: '1 / 1',
			alt: 'A gold pendant',
			tag: 'Connect',
			request: 'Make this an Etsy listing photo.',
			note: 'From a phone shot on a countertop to a square listing image.',
			href: '/gallery/98232766e7a89771'
		}
	];

	let peek = $state<number | null>(null);
	// iOS reports a tap's click as a mouse click, so the input type is read at
	// pointerdown, which it reports correctly. Empty for keyboard presses.
	let lastPointer = '';
	let scroller = $state<HTMLElement>();

	function scrollBy(dir: 1 | -1) {
		scroller?.scrollBy({
			left: dir * Math.min(560, scroller.clientWidth * 0.85),
			behavior: 'smooth'
		});
	}
</script>

<section class="overflow-hidden bg-cream py-20 md:py-28" aria-labelledby="range-title">
	<div class="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-4">
		<div class="max-w-2xl">
			<p class="lp-eyebrow text-terracotta-ink">Range</p>
			<h2 id="range-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
				<span><span>Any photo. Any look.</span></span>
			</h2>
			<p class="mt-5 text-lg text-neutral-700">
				Grades, styles and product shots, each from one request.
				<span class="hidden md:inline">Hover a photo to see where it started.</span>
				<span class="md:hidden">Tap a photo to see where it started.</span>
			</p>
		</div>
		<div class="hidden gap-2 md:flex">
			<button
				type="button"
				onclick={() => scrollBy(-1)}
				aria-label="Previous"
				class="grid size-12 place-items-center rounded-full border border-brand/20 text-brand transition-colors hover:bg-brand hover:text-accent"
				>←</button
			>
			<button
				type="button"
				onclick={() => scrollBy(1)}
				aria-label="Next"
				class="grid size-12 place-items-center rounded-full border border-brand/20 text-brand transition-colors hover:bg-brand hover:text-accent"
				>→</button
			>
		</div>
	</div>

	<div
		bind:this={scroller}
		class="mt-10 flex snap-x snap-mandatory [scrollbar-width:none] gap-5 overflow-x-auto scroll-smooth px-4 pb-6 md:mt-14 md:gap-7 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))] [&::-webkit-scrollbar]:hidden"
	>
		{#each cards as card, i (card.after)}
			<figure
				class="group relative m-0 flex-none snap-start"
				onpointerenter={(e) => e.pointerType === 'mouse' && (peek = i)}
				onpointerleave={(e) => e.pointerType === 'mouse' && (peek = null)}
			>
				<div
					class="relative aspect-[4/5] w-[84vw] max-w-[26rem] overflow-hidden rounded-[22px] bg-neutral-900 shadow-[0_30px_60px_-30px_rgba(20,55,49,0.55)] select-none md:aspect-(--ar) md:h-[540px] md:w-auto md:max-w-none"
					style="--ar: {card.ar};"
				>
					<img
						src={card.after}
						alt="{card.alt}, after the edit"
						loading="lazy"
						draggable="false"
						class="pointer-events-none absolute inset-0 h-full w-full object-cover [-webkit-touch-callout:none]"
					/>
					<img
						src={card.before}
						alt="{card.alt}, before"
						loading="lazy"
						draggable="false"
						class="pointer-events-none absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-700 ease-[cubic-bezier(0.2,0.75,0.15,1)] [-webkit-touch-callout:none] motion-reduce:transition-none"
						style="clip-path: inset(0 {peek === i ? 0 : 100}% 0 0);"
					/>
					<span
						class="lp-glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
						>{peek === i ? 'Original' : card.tag}</span
					>

					<div
						class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-5 pt-16 text-white transition-opacity duration-300 {peek ===
						i
							? 'opacity-0'
							: 'opacity-100'}"
					>
						{#if card.request}
							<p class="max-w-[30rem] text-[15px] leading-snug md:text-base">“{card.request}”</p>
						{/if}
						<p class="mt-2 text-[13px] text-white/75">
							{card.note}{#if card.credit}
								· {card.credit}{/if}
						</p>
					</div>

					<!-- Tap (or click) toggles the original; hover does it with a mouse. -->
					<button
						type="button"
						class="absolute inset-0 cursor-pointer [-webkit-tap-highlight-color:transparent]"
						aria-pressed={peek === i}
						aria-label="Show the original of {card.alt.toLowerCase()}"
						onpointerdown={(e) => (lastPointer = e.pointerType)}
						onclick={() => {
							// A mouse already peeks on hover; taps and keyboard presses toggle.
							const via = lastPointer;
							lastPointer = '';
							if (via === 'mouse') return;
							peek = peek === i ? null : i;
						}}
					></button>
					<span
						class="pointer-events-none absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand md:hidden"
						aria-hidden="true">{peek === i ? 'Tap for the edit' : 'Tap for the original'}</span
					>
				</div>
				{#if card.href}
					<a
						href={card.href}
						class="mt-3 inline-block text-sm font-semibold text-brand underline-offset-4 hover:underline"
						>See every step →</a
					>
				{/if}
			</figure>
		{/each}
		<div class="w-1 flex-none" aria-hidden="true"></div>
	</div>
</section>
