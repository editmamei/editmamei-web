<script lang="ts">
	import { onMount } from 'svelte';

	// The Turkey batch: one sentence, 73 photos graded in Photoshop through 30
	// multi-photo calls. 47 are drawn here; frames with people are left out.
	const COUNT = 47;
	const COLS = 8;
	// The session's first message, typos fixed and condensed: a parenthetical
	// "(about 90)" was cut (owner, 2026-10-22).
	const prompt =
		'I added a bunch of new Turkey photos and I want us to edit them all to the best we can.';
	const tiles = Array.from({ length: COUNT }, (_, i) => ({
		a: `/landing/batch/${i}-a.webp`,
		b: `/landing/batch/${i}-b.webp`,
		delay: ((i % COLS) + Math.floor(i / COLS)) * 70
	}));

	let wall = $state<HTMLElement>();
	let flipped = $state(false);
	// 73 in the rendered page; it only drops to 0 for the count-up while the
	// wall is still off-screen.
	let graded = $state(73);

	onMount(() => {
		const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const onScreen = wall ? wall.getBoundingClientRect().top < window.innerHeight : true;
		if (reduced || onScreen || typeof IntersectionObserver === 'undefined') {
			flipped = true;
			return;
		}
		graded = 0;
		let raf = 0;
		const io = new IntersectionObserver(
			(entries) => {
				if (!entries.some((e) => e.isIntersecting)) return;
				io.disconnect();
				flipped = true;
				const start = performance.now();
				const run = (now: number) => {
					const p = Math.min(1, (now - start) / 2600);
					graded = Math.round(73 * (1 - Math.pow(1 - p, 2)));
					if (p < 1) raf = requestAnimationFrame(run);
				};
				raf = requestAnimationFrame(run);
			},
			{ threshold: 0.25 }
		);
		if (wall) io.observe(wall);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	});
</script>

<section
	class="lp-stage lp-grain overflow-hidden px-4 py-20 md:py-28"
	aria-labelledby="batch-title"
>
	<div
		class="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] lg:items-center"
	>
		<div>
			<p class="lp-eyebrow text-accent">A whole shoot</p>
			<h2 id="batch-title" class="lp-h2 mt-4 text-[#f7f4ec]">One sentence. Every photo.</h2>
			<p class="mt-6 text-lg leading-relaxed text-[#c3d2cb]">
				Hand it a trip's worth of photos and it grades each one in Photoshop, frame by frame, with
				the look fitted to that frame.
			</p>
			<p
				class="lp-glass mt-8 rounded-2xl rounded-tl-md px-5 py-4 text-lg leading-snug text-[#f7f4ec]"
			>
				“{prompt}”
			</p>
			<dl
				class="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
			>
				<div>
					<dt class="text-[13px] text-[#9fb5ac]">Photos graded</dt>
					<dd class="font-mono text-4xl font-semibold text-accent tabular-nums">{graded}</dd>
				</div>
				<div>
					<dt class="text-[13px] text-[#9fb5ac]">Sentences</dt>
					<dd class="font-mono text-4xl font-semibold text-[#f7f4ec]">1</dd>
				</div>
				<div>
					<dt class="text-[13px] text-[#9fb5ac]">Looks</dt>
					<dd class="font-mono text-4xl font-semibold text-[#f7f4ec]">12</dd>
				</div>
				<div>
					<dt class="text-[13px] text-[#9fb5ac]">Generated pixels</dt>
					<dd class="font-mono text-4xl font-semibold text-[#f7f4ec]">0</dd>
				</div>
			</dl>
			<p class="mt-6 text-[13px] text-[#8fa59c]">
				Desktop with Pro (Camera Raw). 47 of the 73 shown; photos with people are left out.
			</p>
		</div>

		<div
			bind:this={wall}
			class="grid grid-cols-5 gap-1.5 sm:grid-cols-8 sm:gap-2"
			style="perspective: 1400px;"
			aria-label="47 of the 73 photos, turning from as shot to graded"
			role="img"
		>
			{#each tiles as tile (tile.a)}
				<div class="relative aspect-square">
					<div
						class="absolute inset-0 transition-transform duration-[900ms] ease-[cubic-bezier(0.3,0.8,0.2,1)] motion-reduce:transition-none"
						style="transform-style: preserve-3d; transform: rotateY({flipped
							? 180
							: 0}deg); transition-delay: {tile.delay}ms;"
					>
						<img
							src={tile.a}
							alt=""
							loading="lazy"
							class="absolute inset-0 h-full w-full rounded-md object-cover [backface-visibility:hidden]"
						/>
						<img
							src={tile.b}
							alt=""
							loading="lazy"
							class="absolute inset-0 h-full w-full rounded-md object-cover [backface-visibility:hidden]"
							style="transform: rotateY(180deg);"
						/>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
