<script lang="ts">
	import { fade } from 'svelte/transition';
	import { cubicInOut } from 'svelte/easing';
	import { track } from '$lib/analytics/clarity';
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';
	import { hawaiiMovie as M, hawaiiMovieRail, type MovieFrame } from '$lib/demos/hawaii-movie';

	// Soft-edged left→right sweep. Each new frame wipes in over the previously
	// settled frame (the persistent base img underneath), so there's no black
	// flash between layers — the gradient mask reveals the new frame across the
	// canvas with a feathered leading edge.
	function wipe(_node: Element, { duration }: { duration: number }) {
		return {
			duration,
			easing: cubicInOut,
			css: (t: number) => {
				const p = t * 116; // push past 100% so the sweep fully clears the right edge
				const g = `linear-gradient(to right, #000 ${p - 16}%, transparent ${p}%)`;
				return `-webkit-mask-image:${g};mask-image:${g};-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;`;
			}
		};
	}

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
	// `activeFrame` is the target frame; `displayed` is the last fully-revealed
	// frame, painted as a persistent base underneath so the wipe never flashes
	// the dark canvas background. `displayed` catches up on the wipe's introend.
	let activeFrame = $state<MovieFrame>(M.original);
	let displayed = $state<MovieFrame>(M.original);
	let cropped = $state(false); // inset the frame to 16:9 at the final crop
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

	const crossMs = $derived(reduced.current ? 0 : 600); // chat-bubble / caption fades
	const wipeMs = $derived(reduced.current ? 0 : 700); // canvas frame-to-frame sweep

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
		displayed = M.original;
		cropped = false;
		finished = false;
		manualMode = false;
		sceneIndex = 0;
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
		displayed = M.cropStep.frame;
		cropped = true;
		finished = true;
		sceneIndex = scenes.length - 1;
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

		// Beat 3 — transition to canvas, reveal the original (scene 1).
		beat = 'reveal';
		view = 'canvas';
		activeFrame = M.original;
		sceneIndex = 1;
		if (!(await hold(1300))) return;

		// Beat 4 — build the layers one at a time (pre check-in). Each layer
		// dwells ~1s longer than the wipe so the viewer can read the change.
		beat = 'building';
		for (const step of M.buildSteps) {
			litCount += 1;
			sceneIndex = 1 + litCount; // scenes 2..5
			activeFrame = step.frame;
			if (!(await hold(2300))) return;
		}

		// Beat 5 — the co-work check-in: surface a preview, ask a decision (scene 6).
		beat = 'checkin';
		view = 'chat';
		sceneIndex = 6;
		messages = [...messages, { role: 'ai', text: M.checkin.question, thumb: M.checkin.coolFrame }];
		if (!(await hold(2600))) return;

		// Beat 6 — you decide.
		beat = 'decision';
		messages = [...messages, { role: 'user', text: M.checkin.userReply }];
		if (!(await hold(1700))) return;

		// Beat 7 — resume: the headland warms in response to the decision (scene 7).
		beat = 'resume';
		view = 'canvas';
		litCount += 1;
		sceneIndex = 7;
		activeFrame = M.resumeStep.frame;
		if (!(await hold(2700))) return;

		// Beat 8 — remaining layers land.
		beat = 'finishing';
		for (const step of M.finishSteps) {
			litCount += 1;
			sceneIndex = litCount + 2; // scenes 8..10
			activeFrame = step.frame;
			if (!(await hold(2200))) return;
		}

		// Beat 8 finish — the 16:9 crop animates in (scene 11).
		beat = 'crop';
		litCount += 1;
		sceneIndex = 11;
		activeFrame = M.cropStep.frame;
		cropped = true;
		if (!(await hold(1800))) return;

		// Done.
		beat = 'done';
		finished = true;
	}

	// Element ref + a one-shot guard so autoplay starts when the movie scrolls
	// into view — not at page load (otherwise it's half-finished by the time the
	// viewer arrives).
	let rootEl = $state<HTMLElement>();
	let hasStarted = false;

	// Browser only ($effect never runs during SSR). Under reduced motion: no
	// autoplay — snap to the static finished state immediately (it doesn't move,
	// so it's fine before scroll). Otherwise wait for the element to enter the
	// viewport, then play once. Reading reduced.current makes this re-run if the
	// OS setting flips mid-session.
	$effect(() => {
		if (reduced.current) {
			setFinalStatic();
			return () => {
				runToken++;
			};
		}
		let disposed = false;

		// Begin only once the thread is calm: fonts loaded (so the swap can't
		// relayout mid-type) and the browser reports idle time. Started eagerly on
		// load, the rAF-driven typewriter competes with hydration / font / image
		// work and stutters ("slow and intermittent at first"). timeout caps the
		// wait so a never-idle thread still starts the movie.
		const whenIdle = (cb: () => void) =>
			typeof window.requestIdleCallback === 'function'
				? window.requestIdleCallback(cb, { timeout: 600 })
				: window.setTimeout(cb, 1);
		const startWhenCalm = () => {
			const begin = () => {
				if (!disposed) play();
			};
			if (document.fonts?.ready) {
				document.fonts.ready.then(() => {
					if (!disposed) whenIdle(begin);
				});
			} else {
				whenIdle(begin);
			}
		};

		const el = rootEl;
		if (!el || typeof IntersectionObserver === 'undefined') {
			// No ref yet or no IO support → fall back to immediate autoplay.
			startWhenCalm();
			return () => {
				disposed = true;
				runToken++;
			};
		}
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting) && !hasStarted) {
					hasStarted = true;
					startWhenCalm();
					io.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		io.observe(el);
		return () => {
			disposed = true;
			io.disconnect();
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

	// ── Step navigation (scenes) ────────────────────────────────────────────
	// When paused/finished the viewer can scrub the whole story with prev/next:
	// the opening chat, each layer, the mid-edit check-in chat, and the crop.
	type Scene = {
		label: string;
		view: 'chat' | 'canvas';
		messages: Bubble[];
		litCount: number;
		frame: MovieFrame;
		cropped: boolean;
	};
	const introMessages: Bubble[] = [
		{ role: 'user', text: M.prompt },
		{ role: 'ai', text: M.aiAck }
	];
	const checkinMessages: Bubble[] = [
		...introMessages,
		{ role: 'ai', text: M.checkin.question, thumb: M.checkin.coolFrame },
		{ role: 'user', text: M.checkin.userReply }
	];
	const scenes: Scene[] = [
		// The opening request and the mid-edit check-in are first-class scenes so
		// the scrubber never lands on a bare photo with no context.
		{
			label: 'The request',
			view: 'chat',
			messages: introMessages,
			litCount: 0,
			frame: M.original,
			cropped: false
		},
		{
			label: 'Original',
			view: 'canvas',
			messages: [],
			litCount: 0,
			frame: M.original,
			cropped: false
		},
		...M.buildSteps.map((s, i) => ({
			label: s.name,
			view: 'canvas' as const,
			messages: [] as Bubble[],
			litCount: i + 1,
			frame: s.frame,
			cropped: false
		})),
		{
			label: 'Your check-in',
			view: 'chat',
			messages: checkinMessages,
			litCount: 4,
			frame: M.checkin.coolFrame,
			cropped: false
		},
		{
			label: M.resumeStep.name,
			view: 'canvas',
			messages: [],
			litCount: 5,
			frame: M.resumeStep.frame,
			cropped: false
		},
		...M.finishSteps.map((s, i) => ({
			label: s.name,
			view: 'canvas' as const,
			messages: [] as Bubble[],
			litCount: 6 + i,
			frame: s.frame,
			cropped: false
		})),
		{
			label: M.cropStep.name,
			view: 'canvas',
			messages: [],
			litCount: 9,
			frame: M.cropStep.frame,
			cropped: true
		}
	];
	let sceneIndex = $state(0);
	let manualMode = $state(false);

	const clampScene = (i: number) => Math.min(Math.max(i, 0), scenes.length - 1);
	// sceneIndex tracks the live position during autoplay (set per beat in play)
	// and the scrubbed position in manual mode, so the counter is always correct.
	const navIndex = $derived(clampScene(sceneIndex));

	// Pause/play toggles the autoplay clock; only meaningful while auto-playing.
	const showPauseControl = $derived(!manualMode && !finished && !reduced.current);
	// The step scrubber appears whenever playback is halted: explicitly paused,
	// already scrubbing, or finished.
	const showStepNav = $derived(manualMode || manualPaused || finished);

	function enterManual() {
		if (manualMode) return;
		runToken++; // cancel the autoplay loop — we're taking manual control
		manualMode = true;
		manualPaused = true;
		finished = false;
	}
	function gotoScene(i: number) {
		enterManual();
		const idx = clampScene(i);
		sceneIndex = idx;
		const s = scenes[idx];
		view = s.view;
		messages = s.messages;
		showInput = false; // scrubbed scenes are stills, not the live typewriter
		litCount = s.litCount;
		cropped = s.cropped;
		activeFrame = s.frame; // triggers the wipe over `displayed` (canvas scenes)
	}
	function stepPrev() {
		track('hero-movie-step');
		gotoScene(sceneIndex - 1);
	}
	function stepNext() {
		track('hero-movie-step');
		gotoScene(sceneIndex + 1);
	}

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
	bind:this={rootEl}
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
		<!-- Stage: the canvas view defines the height (in flow); the chat view is
		     an absolute overlay so it never grows the panel — even on mobile where
		     the short rolling rail makes the canvas view shorter than the chat.
		     This keeps the stage height stable across chat↔canvas swaps on every
		     breakpoint (feedback_layout_stability_grid_stack). -->
		<div class="relative grid bg-gradient-to-b from-sage/40 to-paper p-4 md:p-6">
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
						<div class="relative aspect-[16/10]">
							<div
								class="canvas-frame absolute overflow-hidden rounded-2xl bg-neutral-900 shadow-inner"
								class:cropped
							>
								<!-- BASE: the last fully-revealed frame, painted underneath so the
							     sweep never flashes the dark canvas background. -->
								<img
									src={displayed.src}
									alt=""
									class="absolute inset-0 h-full w-full object-cover"
									style:filter={displayed.filter ?? 'none'}
								/>
								<!-- WIPE: each new frame sweeps in left→right over the base, then
							     becomes the base on introend. -->
								{#key activeFrame}
									<img
										src={activeFrame.src}
										alt=""
										class="absolute inset-0 h-full w-full object-cover"
										style:filter={activeFrame.filter ?? 'none'}
										in:wipe={{ duration: wipeMs }}
										onintroend={() => (displayed = activeFrame)}
									/>
								{/key}
							</div>
						</div>
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

			<!-- CHAT VIEW — absolute overlay (does not contribute to the cell height,
			     so the canvas view alone drives the stable panel height). -->
			<div
				class="absolute inset-0 overflow-y-auto p-4 transition-opacity duration-500 motion-reduce:transition-none md:p-6"
				class:opacity-0={view !== 'chat'}
				class:opacity-100={view === 'chat'}
				inert={view !== 'chat'}
			>
				<div class="mx-auto flex h-full max-w-2xl flex-col justify-center gap-3">
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
										<!-- Kept compact (≈half width) so the check-in chat view never grows
										     taller than the canvas view — the stage height stays stable. -->
										<div
											class="mt-2.5 max-w-[210px] overflow-hidden rounded-lg border border-neutral-200"
										>
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
	<div class="mt-4 flex flex-col items-center gap-3">
		<!-- Step scrubber: visible when paused / finished, walks the layer build.
		     Always rendered (reserves its row height) so appearing or hiding never
		     shifts the page. -->
		<div
			class="flex min-h-9 items-center gap-2"
			class:invisible={!showStepNav}
			aria-hidden={!showStepNav}
		>
			<button
				type="button"
				class="grid size-9 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
				aria-label="Previous step"
				disabled={navIndex <= 0}
				onclick={stepPrev}
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
					<path
						d="M15 6 L9 12 L15 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<div class="min-w-[11rem] text-center text-sm">
				<span class="font-semibold text-neutral-900">{scenes[navIndex].label}</span>
				<span class="ml-1 text-neutral-500">({navIndex + 1}/{scenes.length})</span>
			</div>
			<button
				type="button"
				class="grid size-9 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
				aria-label="Next step"
				disabled={navIndex >= scenes.length - 1}
				onclick={stepNext}
			>
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
					<path
						d="M9 6 L15 12 L9 18"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		</div>

		<div class="flex items-center justify-center gap-2">
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

	/* The photo frame fills the 16:10 outer box during the movie, then insets
	   top/bottom to 16:9 at the final crop — revealing the warm stage background
	   above and below instead of black letterbox bars. */
	.canvas-frame {
		inset: 0;
		transition:
			top 700ms ease,
			bottom 700ms ease;
	}
	.canvas-frame.cropped {
		top: 5%;
		bottom: 5%;
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
		.canvas-frame {
			transition: none;
		}
	}
</style>
