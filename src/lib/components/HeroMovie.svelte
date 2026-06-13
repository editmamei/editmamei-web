<script lang="ts">
	import { fade } from 'svelte/transition';
	import { track } from '$lib/analytics/clarity';
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';
	import { hawaiiMovie as M, hawaiiMovieRail, type MovieFrame } from '$lib/demos/hawaii-movie';

	// ── Beats (the LOCKED storyboard) ───────────────────────────────────────
	// idle → typing → sent → ai-ack → reveal → building → checkin → decision
	// → resume → finishing → crop → done
	type Beat =
		| 'idle'
		| 'typing'
		| 'sent'
		| 'ai-ack'
		| 'reveal'
		| 'building'
		| 'checkin'
		| 'decision'
		| 'resume'
		| 'finishing'
		| 'crop'
		| 'done';

	type Role = 'user' | 'ai';
	interface Bubble {
		role: Role;
		text: string;
		/** the check-in bubble carries the in-progress preview thumbnail */
		thumb?: MovieFrame;
	}

	// ── Reactive state driving the render ───────────────────────────────────
	let beat = $state<Beat>('idle');
	let view = $state<'chat' | 'canvas'>('chat');
	let messages = $state<Bubble[]>([]);
	let typedText = $state('');
	let showInput = $state(false);
	let litCount = $state(0);
	let activeFrame = $state<MovieFrame>(M.original);
	let showFinal = $state(false); // crossfade to the cropped after.jpg
	let cropped = $state(false); // letterbox / settle for the 16:9 crop
	let captionVisible = $state(false);
	let finished = $state(false);

	// ── Autoplay pause (WCAG 2.2.2) ─────────────────────────────────────────
	// Pause while hovering, keyboard-focused within, or explicitly paused.
	// Hover is ignored for touch pointers (a tap fires pointerenter but often
	// no pointerleave — touch visitors pause via focus and drive the controls).
	let hovering = $state(false);
	let focusWithin = $state(false);
	let manualPaused = $state(false);
	const reduced = prefersReducedMotion();
	const paused = $derived(hovering || focusWithin || manualPaused);

	const crossMs = $derived(reduced.current ? 0 : 600);

	function onPointerEnter(e: PointerEvent) {
		if (e.pointerType !== 'touch') hovering = true;
	}
	function onPointerLeave(e: PointerEvent) {
		if (e.pointerType !== 'touch') hovering = false;
	}

	// ── Cancelable, pause-aware clock ───────────────────────────────────────
	// Each run owns a token; a new run (replay / teardown) bumps it so the old
	// async sequence unwinds. sleep() only counts down while not paused, so
	// hover/focus/pause freezes the movie mid-beat and resumes cleanly.
	let runToken = 0;

	function sleep(ms: number, token: number): Promise<boolean> {
		return new Promise((resolve) => {
			let remaining = ms;
			let last = performance.now();
			const tick = (now: number) => {
				if (token !== runToken) {
					resolve(false);
					return;
				}
				if (!paused) remaining -= now - last;
				last = now;
				if (remaining <= 0) {
					resolve(true);
					return;
				}
				requestAnimationFrame(tick);
			};
			requestAnimationFrame(tick);
		});
	}

	async function typeOut(text: string, token: number, perChar: number): Promise<boolean> {
		typedText = '';
		if (perChar <= 0) {
			typedText = text;
			return token === runToken;
		}
		for (let i = 0; i < text.length; i++) {
			if (!(await sleep(perChar, token))) return false;
			typedText += text[i];
		}
		return true;
	}

	function resetState() {
		beat = 'idle';
		view = 'chat';
		messages = [];
		typedText = '';
		showInput = false;
		litCount = 0;
		activeFrame = M.original;
		showFinal = false;
		cropped = false;
		captionVisible = false;
		finished = false;
	}

	/** Reduced-motion static end state: no autoplay, full result + full rail. */
	function setFinalStatic() {
		runToken++;
		view = 'canvas';
		messages = [
			{ role: 'user', text: M.prompt },
			{ role: 'ai', text: M.aiAck },
			{ role: 'ai', text: M.checkin.question, thumb: M.checkin.coolFrame },
			{ role: 'user', text: M.checkin.userReply }
		];
		typedText = '';
		showInput = false;
		litCount = hawaiiMovieRail.length;
		activeFrame = M.cropStep.frame;
		showFinal = true;
		cropped = true;
		captionVisible = true;
		finished = true;
		beat = 'done';
	}

	async function play() {
		runToken++;
		const token = runToken;
		const fast = reduced.current;
		const hold = (ms: number) => sleep(fast ? Math.min(ms, 110) : ms, token);

		resetState();
		manualPaused = false;

		// Beat 1 — type the request, then send it.
		beat = 'typing';
		view = 'chat';
		showInput = true;
		if (!(await hold(500))) return;
		if (!(await typeOut(M.prompt, token, fast ? 0 : 32))) return;
		if (!(await hold(550))) return;
		showInput = false;
		messages = [...messages, { role: 'user', text: M.prompt }];
		beat = 'sent';
		if (!(await hold(900))) return;

		// Beat 2 — AI acknowledges.
		beat = 'ai-ack';
		messages = [...messages, { role: 'ai', text: M.aiAck }];
		if (!(await hold(1900))) return;

		// Beat 3 — transition to canvas, reveal the original.
		beat = 'reveal';
		view = 'canvas';
		activeFrame = M.original;
		if (!(await hold(1300))) return;

		// Beat 4 — build the layers one at a time (pre check-in).
		beat = 'building';
		for (const step of M.buildSteps) {
			litCount += 1;
			activeFrame = step.frame;
			if (!(await hold(1300))) return;
		}

		// Beat 5 — the co-work check-in: surface a preview, ask a decision.
		beat = 'checkin';
		view = 'chat';
		messages = [...messages, { role: 'ai', text: M.checkin.question, thumb: M.checkin.coolFrame }];
		if (!(await hold(2600))) return;

		// Beat 6 — you decide.
		beat = 'decision';
		messages = [...messages, { role: 'user', text: M.checkin.userReply }];
		if (!(await hold(1700))) return;

		// Beat 7 — resume: the rock warms in response to the decision.
		beat = 'resume';
		view = 'canvas';
		litCount += 1;
		activeFrame = M.resumeStep.frame;
		if (!(await hold(1700))) return;

		// Beat 8 — remaining layers land.
		beat = 'finishing';
		for (const step of M.finishSteps) {
			litCount += 1;
			activeFrame = step.frame;
			if (!(await hold(1200))) return;
		}

		// Beat 8 finish — the 16:9 crop animates in.
		beat = 'crop';
		litCount += 1;
		activeFrame = M.cropStep.frame;
		showFinal = true;
		cropped = true;
		if (!(await hold(1800))) return;

		// Done.
		beat = 'done';
		captionVisible = true;
		finished = true;
	}

	// Autoplay on mount (browser only; $effect never runs during SSR). Under
	// reduced motion: no autoplay — snap to the static finished state. Reading
	// reduced.current makes this re-run if the OS setting flips mid-session.
	$effect(() => {
		if (reduced.current) {
			setFinalStatic();
		} else {
			play();
		}
		return () => {
			runToken++; // cancel any in-flight run on teardown
		};
	});

	function togglePause() {
		manualPaused = !manualPaused;
	}
	function replay() {
		track('hero-movie-replay');
		play();
	}

	// ── Display helpers ─────────────────────────────────────────────────────
	const kindLabel: Record<string, string> = {
		levels: 'Levels',
		curves: 'Curves',
		'hue-saturation': 'Hue/Sat',
		'brightness-contrast': 'Bright/Contrast',
		'selective-color': 'Selective Color',
		'color-balance': 'Color Balance',
		'photo-filter': 'Photo Filter',
		pixel: 'Pixel'
	};

	const activeIndex = $derived(litCount - 1);
	const showPauseControl = $derived(!finished && !reduced.current);

	// Mobile rolling-ticker geometry (rem). Must match the .rail-window / .rail-row
	// rules in the style block: M_ROW = row height, M_GAP = flex gap, M_VISIBLE =
	// rows shown (3 full + a half-faded 4th). The track is translated up so the newest
	// landed layer sits at the window's bottom; per-layer delta is exactly the row
	// pitch (M_ROW + M_GAP), so each new layer scrolls the stack up one row.
	const M_ROW = 2.75;
	const M_GAP = 0.5;
	const M_VISIBLE = 3.5;
	const M_VH = M_VISIBLE * (M_ROW + M_GAP); // window height = 11.375rem
	const landedLayers = $derived(hawaiiMovieRail.slice(0, litCount));
	const railShiftRem = $derived(
		litCount <= 0 ? M_VH : M_VH - (litCount * M_ROW + (litCount - 1) * M_GAP)
	);
	const railTransform = $derived(`translateY(${railShiftRem}rem)`);
</script>

<div
	class="hero-movie group/movie relative mx-auto w-full max-w-5xl"
	data-beat={beat}
	role="group"
	aria-roledescription="animated demo"
	aria-label="Animated walkthrough: editing a Hawaii coast photo into print-ready wall art, layer by layer, pausing midway to check a decision with you."
	onpointerenter={onPointerEnter}
	onpointerleave={onPointerLeave}
	onfocusin={() => (focusWithin = true)}
	onfocusout={() => (focusWithin = false)}
>
	<!-- Accessible text alternative; the animated internals are aria-hidden. -->
	<p class="sr-only">
		A scripted demonstration: the user asks for a print-ready wall-art edit of a Hawaii coast photo.
		The AI opens it in Photoshop and builds adjustment layers one at a time, pauses to ask whether
		the rock looks too cool, the user replies “a touch warmer”, the AI warms the rock and finishes
		with a 16:9 crop. Every step stays an editable Photoshop layer.
	</p>

	<div
		class="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl shadow-neutral-900/5"
		aria-hidden="true"
	>
		<!-- Stage: chat-view and canvas-view stacked in one grid cell so the
		     cell auto-sizes to the taller beat and chat↔canvas swaps never
		     shift the page (feedback_layout_stability_grid_stack). -->
		<div class="grid bg-gradient-to-b from-sage/40 to-paper p-4 md:p-6">
			<!-- CANVAS VIEW -->
			<div
				class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
				class:opacity-0={view !== 'canvas'}
				class:opacity-100={view === 'canvas'}
				inert={view !== 'canvas'}
			>
				<div class="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-start">
					<!-- Canvas -->
					<figure class="m-0">
						<div
							class="canvas-stack relative aspect-[16/10] overflow-hidden rounded-2xl bg-neutral-900 shadow-inner"
							class:cropped
						>
							{#key activeFrame}
								<img
									src={activeFrame.src}
									alt=""
									class="absolute inset-0 h-full w-full object-cover"
									style:filter={activeFrame.filter ?? 'none'}
									in:fade={{ duration: crossMs }}
								/>
							{/key}
							{#if showFinal}
								<img
									src={M.cropStep.frame.src}
									alt=""
									class="absolute inset-0 h-full w-full object-cover"
									in:fade={{ duration: crossMs }}
								/>
							{/if}
							<!-- Letterbox bars that slide in to dramatize the 16:9 crop -->
							<span class="crop-bar crop-bar-top"></span>
							<span class="crop-bar crop-bar-bottom"></span>
						</div>
						{#if captionVisible}
							<figcaption
								class="mt-3 text-center text-sm font-medium text-neutral-700"
								in:fade={{ duration: crossMs }}
							>
								{M.caption}
							</figcaption>
						{/if}
					</figure>

					<!-- Layer rail -->
					<div>
						<p class="mb-1.5 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
							Layer stack
						</p>

						<!-- DESKTOP: full static rail (lit / unlit). -->
						<ol class="rail hidden flex-col gap-1.5 md:flex">
							{#each hawaiiMovieRail as layer, i (layer.name)}
								{@const lit = i < litCount}
								{@const active = i === activeIndex && !finished}
								<li
									class="flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-all duration-500 motion-reduce:transition-none"
									class:border-neutral-200={!lit}
									class:bg-white={lit}
									class:border-brand={active}
									class:opacity-40={!lit}
									class:shadow-sm={lit}
								>
									<span
										class="grid size-4 shrink-0 place-items-center rounded-full text-[10px] transition-colors"
										class:bg-brand={lit}
										class:text-white={lit}
										class:bg-neutral-200={!lit}
										class:text-neutral-400={!lit}
										class:animate-pulse={active}
									>
										{#if lit}✓{/if}
									</span>
									<span class="min-w-0 flex-1">
										<span class="block truncate text-xs font-medium text-neutral-800"
											>{layer.name}</span
										>
										<span class="block text-[10px] text-neutral-500"
											>{kindLabel[layer.kind] ?? layer.kind}</span
										>
									</span>
								</li>
							{/each}
						</ol>

						<!-- MOBILE: rolling ticker — only landed layers, newest pinned at the
						     bottom, the stack scrolls up one row per layer, and rows bumping off
						     the top dissolve under a gradient mask. Keeps mobile height down
						     without losing the live-layering story. The translateY math
						     (railShiftRem) and .rail-window height / mask must stay in lockstep
						     with M_ROW/M_GAP/M_VISIBLE in the script. -->
						<div class="rail-window md:hidden">
							<ol
								class="rail-track flex flex-col gap-2 motion-reduce:transition-none"
								style:transform={railTransform}
							>
								{#each landedLayers as layer, i (layer.name)}
									{@const active = i === activeIndex && !finished}
									<li
										class="rail-row flex items-center gap-2 rounded-lg border bg-white px-2.5 shadow-sm transition-colors duration-500 motion-reduce:transition-none"
										class:border-brand={active}
										class:border-neutral-200={!active}
									>
										<span
											class="grid size-4 shrink-0 place-items-center rounded-full bg-brand text-[10px] text-white"
											class:animate-pulse={active}
										>
											✓
										</span>
										<span class="min-w-0 flex-1">
											<span class="block truncate text-xs font-medium text-neutral-800"
												>{layer.name}</span
											>
											<span class="block text-[10px] text-neutral-500"
												>{kindLabel[layer.kind] ?? layer.kind}</span
											>
										</span>
									</li>
								{/each}
							</ol>
						</div>
					</div>
				</div>
			</div>

			<!-- CHAT VIEW -->
			<div
				class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
				class:opacity-0={view !== 'chat'}
				class:opacity-100={view === 'chat'}
				inert={view !== 'chat'}
			>
				<div class="mx-auto flex min-h-full max-w-2xl flex-col justify-center gap-3 py-6">
					{#each messages as m, i (i)}
						<div class="flex" class:justify-end={m.role === 'user'}>
							<div
								class="max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm"
								class:bg-brand={m.role === 'user'}
								class:text-white={m.role === 'user'}
								class:chat-ai={m.role === 'ai'}
								in:fade={{ duration: crossMs }}
							>
								{#if m.role === 'ai'}
									<div class="flex items-start gap-2">
										<svg
											class="mt-0.5 shrink-0 text-spark"
											viewBox="0 0 24 24"
											width="16"
											height="16"
										>
											<path
												d="M12 2 L13.6 9.8 L21.5 12 L13.6 14.2 L12 22 L10.4 14.2 L2.5 12 L10.4 9.8 Z"
												fill="currentColor"
											/>
										</svg>
										<span class="text-neutral-800">{m.text}</span>
									</div>
									{#if m.thumb}
										<div class="mt-3 overflow-hidden rounded-lg border border-neutral-200">
											<img
												src={m.thumb.src}
												alt=""
												class="block aspect-[16/10] w-full object-cover"
												style:filter={m.thumb.filter ?? 'none'}
											/>
										</div>
									{/if}
								{:else}
									{m.text}
								{/if}
							</div>
						</div>
					{/each}

					{#if showInput}
						<div
							class="prompt-input flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm shadow-sm"
						>
							<span class="text-neutral-800">{typedText}</span><span class="caret"></span>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Controls (real, reachable buttons; the animation above is aria-hidden) -->
	<div class="mt-4 flex items-center justify-center gap-2">
		{#if showPauseControl}
			<button
				type="button"
				class="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
				onclick={togglePause}
				aria-pressed={manualPaused}
			>
				{#if manualPaused}
					<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M8 5v14l11-7z" />
					</svg>
					Play
				{:else}
					<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
						<path d="M6 5h4v14H6zM14 5h4v14h-4z" />
					</svg>
					Pause
				{/if}
			</button>
		{/if}
		<button
			type="button"
			class="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
			onclick={replay}
		>
			<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
				<path
					d="M4 12a8 8 0 1 1 2.34 5.66M4 12V7m0 5h5"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			{reduced.current ? 'Play walkthrough' : 'Replay'}
		</button>
	</div>
</div>

<style>
	.chat-ai {
		background-color: var(--color-prompt);
		border: 1px solid var(--color-prompt-border);
	}

	.prompt-input {
		background-color: var(--color-prompt);
		border-color: var(--color-prompt-border);
	}

	/* Mobile rolling rail. Window shows 3 full rows + a half-faded 4th; the top
	   gradient mask "erases" rows scrolling off. Keep these values in lockstep
	   with M_ROW / M_GAP / M_VISIBLE in the script. */
	.rail-window {
		height: 11.375rem; /* M_VISIBLE * (M_ROW + M_GAP) = 3.5 * 3.25rem */
		overflow: hidden;
		-webkit-mask-image: linear-gradient(to bottom, transparent 0, #000 3.25rem);
		mask-image: linear-gradient(to bottom, transparent 0, #000 3.25rem);
	}
	.rail-track {
		transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1);
		will-change: transform;
	}
	.rail-row {
		height: 2.75rem; /* M_ROW */
		flex: 0 0 auto;
	}

	@media (prefers-reduced-motion: reduce) {
		.rail-track {
			transition: none;
		}
	}

	.caret {
		display: inline-block;
		width: 1px;
		height: 1em;
		background-color: rgb(64, 64, 64);
		animation: blink 1s steps(2, end) infinite;
	}

	/* Letterbox bars: hidden until the crop beat, then slide in. */
	.crop-bar {
		position: absolute;
		left: 0;
		right: 0;
		height: 5%;
		background: #0a0a0a;
		transform: scaleY(0);
		transition: transform 700ms ease;
	}
	.crop-bar-top {
		top: 0;
		transform-origin: top;
	}
	.crop-bar-bottom {
		bottom: 0;
		transform-origin: bottom;
	}
	.canvas-stack.cropped .crop-bar {
		transform: scaleY(1);
	}
	.canvas-stack {
		transition: transform 700ms ease;
	}
	.canvas-stack.cropped {
		transform: scale(1.01);
	}

	@keyframes blink {
		0%,
		49% {
			opacity: 1;
		}
		50%,
		100% {
			opacity: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.caret {
			animation: none;
			opacity: 1;
		}
		.crop-bar,
		.canvas-stack {
			transition: none;
		}
	}
</style>
