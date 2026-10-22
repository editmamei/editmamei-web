<script lang="ts">
	import { onMount } from 'svelte';
	import { reveal } from '$lib/actions/reveal';

	// A real session ("Prompting Photoshop", chapter 6): four prompts in one chat,
	// each result exported from Photoshop as it landed. Prompts are verbatim.
	const steps = [
		{
			prompt:
				'Crop it to 4:5 with the lava glow in the lower third, leaving the dark sky at the top for a title.',
			result: 'Cropped to 4:5, lava low in the frame'
		},
		{
			prompt: 'Add the title KILAUEA in a bold, wide sans-serif, in warm off-white.',
			result: 'The title, set in the dark sky'
		},
		{
			prompt:
				'A bit smaller, a thin line under it, ‘Hawai‘i Volcanoes National Park’ in small caps.',
			result: 'A smaller title, a thin rule and a subtitle'
		},
		{
			prompt: 'A subtle orange glow so it picks up the lava light.',
			result: 'A soft orange glow on the type'
		}
	];

	let active = $state(-1);
	let stepEls: HTMLElement[] = $state([]);
	let stage = $state<HTMLElement>();
	// Phones: the poster sits above a stepper that plays itself until tapped.
	// Desktop: the poster is pinned and the prompts scroll past it.
	let autoplay = $state(true);

	function pick(i: number) {
		autoplay = false;
		active = Math.max(-1, Math.min(steps.length - 1, i));
	}

	onMount(() => {
		if (typeof IntersectionObserver === 'undefined') {
			active = steps.length - 1;
			return;
		}
		const phone = matchMedia('(max-width: 767px)').matches;
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

		if (!phone) {
			const io = new IntersectionObserver(
				(entries) => {
					for (const e of entries) {
						if (e.isIntersecting) active = Number((e.target as HTMLElement).dataset.step);
					}
				},
				{ rootMargin: '-45% 0px -45% 0px' }
			);
			for (const el of stepEls) if (el) io.observe(el);
			return () => io.disconnect();
		}

		if (reduced) {
			active = steps.length - 1;
			return;
		}
		let timer = 0;
		const io = new IntersectionObserver(
			(entries) => {
				clearInterval(timer);
				if (!entries[0]?.isIntersecting) return;
				timer = window.setInterval(() => {
					if (!autoplay) return clearInterval(timer);
					active = active >= steps.length - 1 ? -1 : active + 1;
				}, 3200);
			},
			{ threshold: 0.5 }
		);
		if (stage) io.observe(stage);
		return () => {
			io.disconnect();
			clearInterval(timer);
		};
	});

	const shown = $derived(active + 1); // 0 = the original
</script>

<section class="lp-stage lp-grain px-4 py-20 md:py-28" aria-labelledby="convo-title">
	<div
		class="pointer-events-none absolute inset-0 -z-[1]"
		style="background: radial-gradient(40% 45% at 72% 60%, rgba(255,90,40,0.16), transparent 70%);"
		aria-hidden="true"
	></div>
	<div class="mx-auto max-w-6xl">
		<div class="max-w-3xl">
			<p class="lp-eyebrow text-accent">One conversation</p>
			<h2 id="convo-title" class="lp-h2 lp-rise mt-4 text-[#f7f4ec]" use:reveal>
				<span><span>Ask, look, ask again.</span></span>
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-[#c3d2cb]">
				Four short requests turned a night photo into a poster. You see each one land, and you can
				steer the next one from there.
			</p>
		</div>

		<div class="mt-12 grid gap-8 md:mt-16 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-14">
			<!-- The poster: pinned on desktop while the prompts scroll past -->
			<div bind:this={stage} class="self-start md:sticky md:top-24 md:order-2">
				<div
					class="relative mx-auto aspect-[4/5] w-full max-w-[24rem] overflow-hidden rounded-[18px] bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] ring-1 ring-white/10 md:max-h-[78vh] md:max-w-none"
				>
					<img
						src="/landing/poster/0.webp"
						alt="Lava glowing at night in Kilauea's crater, before the edit"
						loading="lazy"
						class="absolute inset-0 h-full w-full object-contain"
					/>
					{#each steps as step, i (step.prompt)}
						<img
							src="/landing/poster/{i + 1}.webp"
							alt={i === steps.length - 1
								? 'The finished poster: KILAUEA over the lava, Hawai‘i Volcanoes National Park beneath'
								: ''}
							loading="lazy"
							class="absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.2,0.75,0.15,1)] motion-reduce:transition-none"
							style="clip-path: inset(0 {i < shown ? 0 : 100}% 0 0);"
						/>
					{/each}
					<span
						class="lp-glass absolute bottom-3 left-3 rounded-full px-3 py-1 font-mono text-xs text-[#e9efe9]"
						>{shown === 0 ? 'Original' : `Step ${shown} of 4`}</span
					>
				</div>

				<!-- Phone stepper -->
				<div class="mx-auto mt-5 max-w-[24rem] md:hidden">
					<div
						class="lp-glass min-h-[8.5rem] rounded-2xl rounded-tl-md px-5 py-4"
						aria-live="polite"
					>
						{#if active < 0}
							<span class="font-mono text-sm text-accent">The photo</span>
							<p class="mt-2 text-lg leading-snug text-[#f7f4ec]">
								A night shot of the lava lake, as shot. Watch it become a poster.
							</p>
						{:else}
							<span class="font-mono text-sm text-accent">Prompt {active + 1}</span>
							<p class="mt-2 text-lg leading-snug text-[#f7f4ec]">“{steps[active].prompt}”</p>
						{/if}
					</div>
					<div class="mt-4 flex items-center justify-between gap-3">
						<button
							type="button"
							onclick={() => pick(active - 1)}
							disabled={active < 0}
							aria-label="Previous step"
							class="grid size-11 place-items-center rounded-full border border-white/20 text-[#f4f1e8] disabled:opacity-30"
							>←</button
						>
						<div class="flex gap-2">
							{#each steps as step, i (step.prompt)}
								<button
									type="button"
									onclick={() => pick(i)}
									aria-label="Prompt {i + 1}"
									aria-current={active === i ? 'step' : undefined}
									class="grid size-11 place-items-center"
								>
									<span
										class="block h-2 rounded-full transition-all duration-300 {active === i
											? 'w-7 bg-accent'
											: i < active
												? 'w-2 bg-accent/60'
												: 'w-2 bg-white/30'}"
									></span>
								</button>
							{/each}
						</div>
						<button
							type="button"
							onclick={() => pick(active + 1)}
							disabled={active >= steps.length - 1}
							aria-label="Next step"
							class="grid size-11 place-items-center rounded-full border border-white/20 text-[#f4f1e8] disabled:opacity-30"
							>→</button
						>
					</div>
				</div>
			</div>

			<!-- Desktop prompts -->
			<ol class="relative hidden flex-col md:order-1 md:flex md:pt-[8vh] md:pb-[28vh]">
				{#each steps as step, i (step.prompt)}
					<li
						bind:this={stepEls[i]}
						data-step={i}
						class="flex min-h-[48vh] flex-col justify-center gap-4 py-6 transition-opacity duration-500 motion-reduce:transition-none md:min-h-[62vh] {active ===
						i
							? 'opacity-100'
							: 'opacity-40'}"
					>
						<span class="font-mono text-sm text-accent">Prompt {i + 1}</span>
						<p
							class="lp-glass max-w-[32rem] rounded-2xl rounded-tl-md px-5 py-4 text-xl leading-snug text-[#f7f4ec] md:text-2xl"
						>
							“{step.prompt}”
						</p>
						<p class="flex items-center gap-2 text-[15px] text-[#b9c9c2]">
							<span class="size-1.5 rounded-full bg-accent"></span>{step.result}
						</p>
					</li>
				{/each}
			</ol>
		</div>
		<p class="text-[13px] text-[#8fa59c]">
			A real session in Photoshop: four prompts in one chat, the result of each exported as it
			landed.
		</p>
	</div>
</section>
