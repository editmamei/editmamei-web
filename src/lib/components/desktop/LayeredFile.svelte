<script lang="ts">
	import { onMount } from 'svelte';
	import { inView, reveal } from '$lib/actions/reveal';

	// Set Sail, a real session's PSD. Each state was exported from the file in
	// Photoshop: every edit layer hidden, then turned on one at a time, bottom
	// to top. Layer names, kinds, opacities and blend modes are the file's own.
	const request =
		'give this shot a full work-up. analyze what could be improved, research the expert processes if you need to, then implement';
	const layers = [
		{
			name: 'Tone Foundation',
			kind: 'Levels',
			note: 'Black point set, midtones opened, white point pulled in: the contrast base for everything above.'
		},
		{
			name: 'Dehaze + Punch',
			kind: 'Brightness/Contrast',
			note: 'A small contrast push that cuts the haze of a flat phone shot.'
		},
		{
			name: 'Vibrancy Boost',
			kind: 'Hue/Saturation',
			note: 'More saturation, most of it in the blues and cyans: a deeper sky and a richer sea.'
		},
		{
			name: 'Golden Hour Warmth',
			kind: 'Hue/Saturation',
			note: 'Yellows pushed toward orange, for late-afternoon warmth at the horizon.'
		},
		{
			name: 'Shadow Lift',
			kind: 'Brightness/Contrast',
			note: 'Opens the deep tones so the hull and rigging keep their detail.'
		},
		{
			name: 'Sky Highlight Recovery',
			kind: 'Levels · masked',
			note: 'Pulls the bright upper sky back, through a soft mask over the sky only.'
		},
		{
			name: 'High-Pass Sharpening',
			kind: 'Overlay · 65%',
			note: 'Crisp rigging without halos: a high-pass copy of the photo, blended at 65%.'
		},
		{
			name: 'Vignette',
			kind: 'Multiply · 40%',
			note: 'A soft darkening at the edges that draws the eye to the boat.'
		}
	];
	const N = layers.length;

	// 0 = the original; n = layers 1..n on.
	let shown = $state(N);
	let prev = $state(N);
	let narrow = $state(false);
	let played = false;
	let touched = false;
	let timer = 0;

	const src = (i: number) => `/desktop/sail/${narrow ? 'sm-' : ''}${i}.webp`;

	onMount(() => {
		narrow = matchMedia('(max-width: 767px)').matches;
		return () => clearInterval(timer);
	});

	function show(i: number) {
		prev = shown;
		shown = i;
	}
	function pick(i: number) {
		touched = true;
		clearInterval(timer);
		show(i);
	}

	// Plays the build once, the first time the section is on screen.
	function onVisible(v: boolean) {
		if (!v || played || touched) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		played = true;
		for (let i = 0; i <= N; i++) new Image().src = src(i);
		show(0);
		timer = window.setInterval(() => {
			if (shown >= N) return clearInterval(timer);
			show(shown + 1);
		}, 1100);
	}
</script>

<section
	class="lp-stage lp-grain overflow-hidden px-4 py-20 md:py-28"
	aria-labelledby="layers-title"
>
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[40rem]">
			<p class="lp-eyebrow text-accent">The file you get back</p>
			<h2 id="layers-title" class="lp-h2 lp-rise mt-4 text-[#f7f4ec]" use:reveal>
				<span><span>One photo, eight layers.</span></span>
				<span><span>Every one still editable.</span></span>
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-[#c3d2cb]">
				Your AI builds the edit the way a retoucher would: adjustment layers and masks, stacked on
				your untouched original. Open the file and change any of it by hand, or ask for a different
				take on one step.
			</p>
		</div>

		<div
			class="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start lg:gap-8"
			use:inView={onVisible}
		>
			<figure class="m-0 min-w-0">
				<div
					class="relative aspect-[4/3] overflow-hidden rounded-[20px] bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
				>
					<img
						src={src(prev)}
						alt=""
						class="absolute inset-0 h-full w-full object-cover"
						loading="lazy"
					/>
					{#key shown}
						<img
							src={src(shown)}
							alt={shown === 0
								? 'The original sailing photo, flat and hazy'
								: `The sailing photo with ${shown} of ${N} layers on`}
							class="sail-in absolute inset-0 h-full w-full object-cover"
							loading="lazy"
						/>
					{/key}
					<span
						class="lp-glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
						>{shown === 0 ? 'Original' : `${shown} of ${N} layers`}</span
					>
				</div>
				<figcaption class="mt-4 min-h-[3.2em] text-[15px] leading-relaxed text-[#c3d2cb]">
					{#if shown === 0}
						<span class="font-semibold text-[#f4f1e8]">The original.</span> It stays at the bottom of
						the file, untouched.
					{:else}
						<span class="font-semibold text-[#f4f1e8]">{layers[shown - 1].name}.</span>
						{layers[shown - 1].note}
					{/if}
				</figcaption>
			</figure>

			<div class="lp-glass rounded-2xl p-3 text-[14px] text-[#e9efe9]">
				<div class="mb-2 flex items-center justify-between px-1 text-[11px] text-[#9fb5ac]">
					<span class="tracking-[0.12em] uppercase">Layers</span>
					<span>Tap one to see the photo up to it</span>
				</div>
				<ol class="flex flex-col-reverse gap-1">
					<li>
						<button
							type="button"
							onclick={() => pick(0)}
							aria-pressed={shown === 0}
							class="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-colors {shown ===
							0
								? 'bg-white/12 ring-1 ring-accent/60'
								: 'hover:bg-white/5'}"
						>
							<span class="size-2 flex-none rounded-full bg-white/40"></span>
							<span class="flex min-w-0 flex-col">
								<span class="truncate font-semibold">Background</span>
								<span class="text-[11.5px] text-[#9fb5ac]">Your original</span>
							</span>
						</button>
					</li>
					{#each layers as layer, i (layer.name)}
						<li>
							<button
								type="button"
								onclick={() => pick(i + 1)}
								aria-pressed={shown === i + 1}
								class="flex min-h-11 w-full items-center gap-2.5 rounded-lg px-2.5 text-left transition-all motion-reduce:transition-none {i <
								shown
									? 'opacity-100'
									: 'opacity-40'} {shown === i + 1
									? 'bg-white/12 ring-1 ring-accent/60'
									: 'hover:bg-white/5'}"
							>
								<span
									class="size-2 flex-none rounded-full {i < shown ? 'bg-accent' : 'bg-white/30'}"
								></span>
								<span class="flex min-w-0 flex-col">
									<span class="truncate font-semibold">{layer.name}</span>
									<span class="text-[11.5px] text-[#9fb5ac]">{layer.kind}</span>
								</span>
							</button>
						</li>
					{/each}
				</ol>
			</div>
		</div>

		<p class="mt-8 max-w-[44rem] text-[15px] leading-relaxed text-[#a9bcb4]">
			<span class="font-semibold text-[#f4f1e8]">The request:</span> “{request}” A real session in
			Photoshop, on an iPhone photo.
		</p>
	</div>
</section>

<style>
	.sail-in {
		animation: sail-in 600ms ease-out both;
	}
	@keyframes sail-in {
		from {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sail-in {
			animation: none;
		}
	}
</style>
