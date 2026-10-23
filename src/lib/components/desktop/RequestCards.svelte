<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	// Real requests from the "Prompting Photoshop" sessions (Claude Desktop,
	// medium effort, a fresh chat each). Prompts are verbatim; minutes are from
	// each take's run record.
	type Card = {
		id: string;
		prompt: string;
		minutes: string;
		before: string;
		after: { src: string; label?: string; ratio: string }[];
		ratio: string;
		alt: string;
	};
	const cards: Card[] = [
		{
			id: 'beach',
			prompt:
				"Give this beach photo a bright, airy summer-afternoon look. Lift the shadows on the sand so it reads clean and white, deepen the blue in the sky while keeping the clouds bright, and let the umbrella's colors pop without looking fake.",
			minutes: 'about 6 minutes',
			before: '/desktop/beach-before.webp',
			after: [{ src: '/desktop/beach-after.webp', ratio: '4 / 3' }],
			ratio: '4 / 3',
			alt: 'A beach with a rainbow umbrella under a deep blue sky'
		},
		{
			id: 'falls',
			prompt:
				"Replace the sky with one of Photoshop's sunset skies. Keep the waterfall, the cliffs and the spray exactly as they are, warm the foreground a little so the light matches the new sky, then check the horizon at full size for halos or leftover patches of the old sky and fix them before you call it done.",
			minutes: 'about 8 minutes',
			before: '/desktop/falls-before.webp',
			after: [{ src: '/desktop/falls-after.webp', ratio: '3 / 4' }],
			ratio: '3 / 4',
			alt: 'A waterfall under a sunset sky'
		},
		{
			id: 'puppy',
			prompt:
				"Get this ready for three places: an Instagram post, an Instagram story with room at the top and bottom for text, and an 8x10 print for a frame. Keep the puppy's face and both ears in frame in all three.",
			minutes: 'about 4 minutes',
			before: '/desktop/puppy-before.webp',
			after: [
				{ src: '/desktop/puppy-post.webp', label: 'Post', ratio: '4 / 5' },
				{ src: '/desktop/puppy-story.webp', label: 'Story', ratio: '618 / 1100' },
				{ src: '/desktop/puppy-print.webp', label: '8×10 print', ratio: '4 / 5' }
			],
			ratio: '3 / 4',
			alt: 'A puppy lying in autumn leaves'
		}
	];

	let original = $state<Record<string, boolean>>({});
</script>

<section class="bg-paper px-4 py-20 md:py-28" aria-labelledby="ask-title">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[40rem]">
			<p class="lp-eyebrow text-terracotta-ink">What you can ask for</p>
			<h2 id="ask-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
				<span><span>Say what you want.</span></span>
				<span><span>Say where it's going.</span></span>
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-neutral-700">
				Three real requests, each in a fresh chat, each with the result it got. You describe the
				photo you want; your AI works out the steps.
			</p>
		</div>

		<div class="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
			{#each cards as card (card.id)}
				<article
					class="flex min-w-0 flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-40px_rgba(20,55,49,0.55)] ring-1 ring-brand/10"
				>
					<div class="relative bg-neutral-900">
						{#if original[card.id]}
							<img
								src={card.before}
								alt="{card.alt}, as shot"
								loading="lazy"
								class="block w-full object-cover"
								style="aspect-ratio: {card.ratio};"
							/>
						{:else if card.after.length === 1}
							<img
								src={card.after[0].src}
								alt="{card.alt}, after the edit"
								loading="lazy"
								class="block w-full object-cover"
								style="aspect-ratio: {card.ratio};"
							/>
						{:else}
							<div
								class="flex items-end justify-center gap-2 bg-[#efe9dc] px-3 py-4"
								style="aspect-ratio: {card.ratio};"
							>
								{#each card.after as a (a.src)}
									<figure class="m-0 flex min-w-0 flex-1 flex-col items-center gap-1.5">
										<img
											src={a.src}
											alt="{card.alt}, cropped for {a.label}"
											loading="lazy"
											class="w-full rounded-md object-cover shadow-md"
											style="aspect-ratio: {a.ratio};"
										/>
										<figcaption class="text-[11.5px] font-semibold text-brand">
											{a.label}
										</figcaption>
									</figure>
								{/each}
							</div>
						{/if}
						<button
							type="button"
							aria-pressed={!!original[card.id]}
							onclick={() => (original[card.id] = !original[card.id])}
							class="absolute top-3 right-3 inline-flex min-h-9 items-center rounded-full px-3 text-[12.5px] font-bold shadow-lg {original[
								card.id
							]
								? 'bg-white text-brand'
								: 'lp-glass text-white'}"
						>
							{original[card.id] ? 'Show the result' : 'Show the original'}
						</button>
					</div>
					<div class="flex flex-1 flex-col p-5">
						<p class="text-[15px] leading-relaxed text-neutral-800">“{card.prompt}”</p>
						<p class="mt-auto pt-4 text-[12.5px] text-neutral-500">
							A real session in Photoshop, {card.minutes}.
						</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>
