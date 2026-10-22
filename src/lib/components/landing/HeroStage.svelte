<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics/clarity';
	import { inView } from '$lib/actions/reveal';

	let { desktopHref, connectHref }: { desktopHref: string; connectHref: string } = $props();

	// A real session: desktop Photoshop through Editmamei. Each frame is
	// the photo as of that layer; the names and settings are the session's own.
	const request = 'This sunset came out way too dark. Bring the lake back and make the sky glow.';
	const layers = [
		{ name: 'Develop', detail: 'Camera Raw · exposure +1.1, shadows +70' },
		{ name: 'Sky color', detail: 'Gradient map, masked to the sky' },
		{ name: 'Sun glow', detail: 'Radial glow · Screen 55%' },
		{ name: 'Light rays', detail: 'Radial blur, masked to the sky' },
		{ name: 'Sun reflection', detail: 'Motion blur 400 px · Overlay 45%' },
		{ name: 'Dusk grade', detail: 'Selective color' },
		{ name: 'Vignette', detail: 'Radial · Multiply 60%' },
		{ name: 'Detail', detail: 'High pass · Overlay' }
	];
	const frames = Array.from({ length: 9 }, (_, i) => `/landing/sunset/${i}.webp`);
	const small = Array.from({ length: 9 }, (_, i) => `/landing/sunset/sm-${i}.webp`);

	// Timeline, in seconds.
	const TYPE_START = 0.9;
	const TYPE_END = 3.4;
	const SENT = 3.7;
	const FIRST = 4.2;
	const STEP = 1.15;
	const WIPE = 0.75;
	const DONE = FIRST + STEP * layers.length;
	const LOOP = DONE + 3.6;

	// Starts on the finished edit, so the first paint (and any browser that never
	// animates) shows the result; the loop then rewinds and plays the session.
	let t = $state(DONE + 0.4);
	let reduced = $state(false);
	let visible = $state(true);
	let tiltX = $state(0);
	let tiltY = $state(0);
	let narrow = $state(false);

	const clamp = (v: number) => Math.min(1, Math.max(0, v));
	const ease = (v: number) => 1 - Math.pow(1 - v, 3);

	const typed = $derived(
		request.slice(0, Math.round(clamp((t - TYPE_START) / (TYPE_END - TYPE_START)) * request.length))
	);
	const sent = $derived(t >= SENT);
	// Layers that have started landing (0-8), and the newest one's wipe progress.
	const started = $derived(
		Math.max(0, Math.min(layers.length, Math.floor((t - FIRST) / STEP) + 1))
	);
	const wipe = $derived(
		started === 0 ? 0 : ease(clamp((t - (FIRST + (started - 1) * STEP)) / WIPE))
	);
	const done = $derived(t >= DONE);
	const reset = $derived(clamp((t - (LOOP - 0.8)) / 0.8));
	const warmth = $derived(started / layers.length);
	const src = $derived(narrow ? small : frames);

	onMount(() => {
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		narrow = matchMedia('(max-width: 767px)').matches;
		if (reduced) {
			t = DONE + 1;
			return;
		}
		for (const f of narrow ? small : frames) {
			const img = new Image();
			img.src = f;
		}
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			const dt = Math.min(0.1, (now - last) / 1000);
			last = now;
			if (visible) t = (t + dt) % LOOP;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	function onPointerMove(e: PointerEvent) {
		if (e.pointerType !== 'mouse' || reduced) return;
		const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		tiltY = ((e.clientX - r.left) / r.width - 0.5) * 8;
		tiltX = -((e.clientY - r.top) / r.height - 0.5) * 6;
	}
	function onPointerLeave() {
		tiltX = 0;
		tiltY = 0;
	}
</script>

<section
	class="lp-stage lp-grain overflow-hidden"
	use:inView={(v) => (visible = v)}
	aria-labelledby="hero-title"
>
	<!-- warm light that grows as the sunset comes back -->
	<div
		class="pointer-events-none absolute inset-0 -z-[1] transition-opacity duration-700"
		style="opacity: {0.25 +
			warmth *
				0.75}; background: radial-gradient(45% 55% at 68% 48%, rgba(255,128,64,0.22), transparent 70%);"
		aria-hidden="true"
	></div>

	<div
		class="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-6 pb-14 md:gap-12 md:pt-16 md:pb-20 lg:grid-cols-[minmax(0,11fr)_minmax(0,13fr)] lg:pt-20 lg:pb-24"
	>
		<!-- Copy (second on phones, so the live photo leads) -->
		<div class="order-2 lg:order-1">
			<h1
				id="hero-title"
				class="text-[clamp(2.7rem,5.4vw,4.6rem)] leading-[0.98] font-bold tracking-[-0.04em] text-[#f7f4ec]"
			>
				Give your AI a real photo editor<span class="text-accent">.</span>
			</h1>
			<p class="mt-5 max-w-[30em] text-lg leading-relaxed text-[#c3d2cb] md:mt-6 md:text-xl">
				Ask a typical AI app to edit your photo and it redraws it. With Editmamei, your AI edits the
				real one, using professional editing tools.
			</p>

			<div class="mt-8 flex max-w-[30rem] flex-col-reverse gap-3 md:mt-10 lg:flex-col">
				<a
					href={desktopHref}
					onclick={() => track('fork-desktop-hero')}
					class="group flex flex-1 items-center gap-3.5 rounded-2xl bg-accent px-5 py-4 text-brand-deep shadow-[0_10px_40px_-12px_rgba(206,255,140,0.55)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
				>
					<svg
						aria-hidden="true"
						class="size-8 flex-none"
						viewBox="0 0 32 32"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
						><rect x="6" y="7" width="20" height="13" rx="2" /><path
							d="M3 24h26l-2 2.5H5L3 24z"
						/></svg
					>
					<span class="flex flex-col">
						<span class="text-lg leading-tight font-bold">Edit on your computer</span>
						<span class="text-sm opacity-75">In Photoshop or GIMP. Free.</span>
					</span>
					<span
						aria-hidden="true"
						class="ml-auto text-xl transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
						>→</span
					>
				</a>
				<a
					href={connectHref}
					onclick={() => track('fork-connect-hero')}
					class="group flex flex-1 items-center gap-3.5 rounded-2xl border-[1.5px] border-accent/50 bg-brand px-5 py-4 text-white shadow-[0_10px_40px_-14px_rgba(206,255,140,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-brand-light motion-reduce:transition-none"
				>
					<svg
						aria-hidden="true"
						class="size-8 flex-none"
						viewBox="0 0 32 32"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linejoin="round"
						><rect x="10" y="3.5" width="12" height="25" rx="3" /><path d="M14 24.5h4" /></svg
					>
					<span class="flex flex-col">
						<span class="text-lg leading-tight font-bold">Edit from any device</span>
						<span class="text-sm text-white/80">Nothing to install. Free to start.</span>
					</span>
					<span
						aria-hidden="true"
						class="ml-auto text-xl transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
						>→</span
					>
				</a>
			</div>
			<p class="mt-5 text-[15px] text-[#a9bcb4]">
				Works with Claude, ChatGPT, Cursor and other AI apps.
			</p>
		</div>

		<!-- The live edit -->
		<div
			class="relative order-1 -mx-4 sm:mx-0 lg:order-2"
			style="perspective: 1800px"
			onpointermove={onPointerMove}
			onpointerleave={onPointerLeave}
			role="presentation"
		>
			<div
				class="relative transition-transform duration-300 ease-out motion-reduce:transition-none"
				style="transform-style: preserve-3d; transform: rotateX({tiltX}deg) rotateY({tiltY -
					4}deg);"
			>
				<!-- The print -->
				<figure
					class="relative m-0 aspect-[3/2] overflow-hidden bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)] sm:rounded-[18px]"
				>
					<img
						src={src[Math.max(0, started - 1)]}
						alt="A lake at sunset, being edited layer by layer"
						class="absolute inset-0 h-full w-full object-cover"
						fetchpriority="high"
					/>
					{#if started > 0}
						<img
							src={src[started]}
							alt=""
							class="absolute inset-0 h-full w-full object-cover"
							style="clip-path: inset(0 {100 - wipe * 100}% 0 0);"
						/>
						{#if wipe < 1}
							<div
								class="absolute inset-y-0 w-[3px] bg-accent shadow-[0_0_24px_6px_rgba(206,255,140,0.7)]"
								style="left: calc({wipe * 100}% - 1.5px);"
								aria-hidden="true"
							></div>
						{/if}
					{/if}
					{#if reset > 0}
						<img
							src={src[0]}
							alt=""
							class="absolute inset-0 h-full w-full object-cover"
							style="opacity: {reset};"
						/>
					{/if}
					<!-- specular sweep -->
					<div
						class="pointer-events-none absolute inset-0"
						style="background: linear-gradient(115deg, transparent 35%, rgba(255,255,255,0.07) 48%, transparent 60%);"
						aria-hidden="true"
					></div>

					<!-- Request bubble -->
					<div
						class="lp-glass absolute top-3 left-3 max-w-[78%] rounded-2xl rounded-tl-md px-3.5 py-2.5 text-[13px] leading-snug text-[#f4f1e8] transition-all duration-500 motion-reduce:transition-none sm:top-5 sm:left-5 sm:text-[15px] lg:max-w-[58%]"
						style="opacity: {t < 0.4 && !reduced
							? 0
							: reset > 0
								? 1 - reset
								: 1}; transform: translateY({sent ? 0 : 6}px);"
					>
						<span class="mb-1 flex items-center gap-1.5 text-[11px] text-[#a9bcb4]"
							><span class="size-1.5 rounded-full bg-spark"></span>Your request</span
						>
						{typed}{#if !sent && !reduced}<span
								class="ml-0.5 inline-block w-[2px] animate-pulse bg-accent">&nbsp;</span
							>{/if}
					</div>

					<!-- Phone: one "now" chip instead of the panel -->
					<div
						class="lp-glass absolute right-3 bottom-3 left-3 flex items-center gap-3 rounded-xl px-3 py-2 text-[12.5px] text-[#f4f1e8] lg:hidden"
					>
						<span class="font-mono text-accent">{done ? 8 : started}/8</span>
						<span class="truncate"
							>{#if started > 0}<b class="font-semibold">{layers[started - 1].name}</b> · {layers[
									started - 1
								].detail}{:else}Reading the photo…{/if}</span
						>
					</div>
				</figure>

				<!-- Desktop: the layers panel floats in front of the print -->
				<div
					class="lp-glass absolute top-[10%] -right-3 hidden w-[13rem] rounded-2xl p-3 text-[13px] text-[#e9efe9] lg:block xl:-right-12"
					style="transform: translateZ(70px);"
					aria-hidden="true"
				>
					<div class="mb-2 flex items-center justify-between px-1 text-[11px] text-[#9fb5ac]">
						<span class="tracking-[0.12em] uppercase">Layers</span>
						<span class="font-mono">{started}/8</span>
					</div>
					<ol class="flex flex-col-reverse gap-1">
						{#each layers as layer, i (layer.name)}
							<li
								class="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all duration-500 motion-reduce:transition-none {i <
								started
									? 'opacity-100'
									: 'translate-x-2 opacity-25'} {i === started - 1 && !done
									? 'bg-white/12 ring-1 ring-accent/60'
									: ''}"
							>
								<span
									class="size-1.5 flex-none rounded-full {i < started
										? 'bg-accent'
										: 'bg-white/30'}"
								></span>
								<span class="truncate">{layer.name}</span>
							</li>
						{/each}
						<li class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-[#9fb5ac]">
							<span class="size-1.5 flex-none rounded-full bg-white/20"></span>Background
						</li>
					</ol>
					<div
						class="mt-2 min-h-[2.6em] border-t border-white/10 px-1 pt-2 text-[12px] text-[#b9c9c2]"
					>
						{#if done}
							<span class="text-accent">8 layers. Every one editable.</span>
						{:else if started > 0}
							{layers[started - 1].detail}
						{:else}
							Reading the photo…
						{/if}
					</div>
				</div>
			</div>
			<p class="mt-3 px-4 text-[12px] text-[#8fa59c] sm:px-0">
				A real session in Photoshop, with Pro for Camera Raw. Photo: Signature Edits.
			</p>
		</div>
	</div>

	<p class="mx-auto max-w-6xl px-4 pb-8 text-[12.5px] leading-normal text-[#8fa59c]">
		Editmamei is an MCP server for Adobe Photoshop and GIMP, and a hosted MCP connector, so AI apps
		can edit photos with professional tools.
	</p>
</section>
