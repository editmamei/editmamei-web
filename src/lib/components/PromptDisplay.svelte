<script lang="ts">
	import type { DemoPrompt } from '$lib/types';
	import { fly, fade } from 'svelte/transition';
	import { track } from '$lib/analytics/clarity';
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';

	interface Props {
		prompts: DemoPrompt[];
		typingSpeedMs?: number;
		pauseMs?: number;
		slideDurationMs?: number;
		currentIndex?: number;
		onPrev?: () => void;
		onNext?: () => void;
	}

	let {
		prompts,
		typingSpeedMs = 32,
		pauseMs = 7000,
		slideDurationMs = 1400,
		currentIndex = $bindable(0),
		onPrev,
		onNext
	}: Props = $props();

	// Reduced-motion, tracked reactively so both the auto-advance and the
	// slide/fade transitions respond if the OS setting changes mid-session.
	const reducedMotionPref = prefersReducedMotion();
	const flyDuration = $derived(reducedMotionPref.current ? 0 : slideDurationMs);

	// Autoplay pause (WCAG 2.2.2): stop auto-advancing while the visitor is
	// hovering or keyboard-focused anywhere in the carousel. Two flags so a
	// pointer leaving while focus remains doesn't wrongly resume. Hover is
	// ignored for touch pointers — a tap fires pointerenter but often no
	// pointerleave, which would otherwise leave autoplay stuck paused on
	// mobile; touch visitors pause via focus and drive it with the controls.
	let hovering = $state(false);
	let focusWithin = $state(false);
	const paused = $derived(hovering || focusWithin);

	function onPointerEnter(e: PointerEvent) {
		if (e.pointerType !== 'touch') hovering = true;
	}
	function onPointerLeave(e: PointerEvent) {
		if (e.pointerType !== 'touch') hovering = false;
	}

	// Manual switches only — `prev`, `next`, and `select` are the user-driven
	// paths. The auto-rotate (the auto-advance $effect below) does NOT fire
	// this event (it would otherwise spam the dashboard with one
	// "prompt-switched" per page every 7s of idle time).
	function prev() {
		track('demo-prompt-switched');
		if (onPrev) onPrev();
		else currentIndex = (currentIndex - 1 + prompts.length) % prompts.length;
	}
	function next() {
		track('demo-prompt-switched');
		if (onNext) onNext();
		else currentIndex = (currentIndex + 1) % prompts.length;
	}

	let displayedText = $state('');
	let isTyping = $state(false);
	let typingDone = $state(false);

	const current = $derived(prompts[currentIndex]);

	// Typewriter: types out the current prompt, then marks typingDone. Does NOT
	// auto-advance — that's the separate effect below, so pausing autoplay never
	// restarts the typewriter mid-stream.
	$effect(() => {
		const c = prompts[currentIndex];
		if (!c) return;

		displayedText = '';
		isTyping = false;
		typingDone = false;

		// Read synchronously so this effect re-runs if the setting changes.
		const reducedMotion = reducedMotionPref.current;

		let typeInterval: ReturnType<typeof setInterval> | undefined;
		let startTimer: ReturnType<typeof setTimeout> | undefined;

		const startTyping = () => {
			if (reducedMotion) {
				displayedText = c.text;
				typingDone = true;
				return;
			}
			isTyping = true;
			let i = 0;
			typeInterval = setInterval(() => {
				if (i >= c.text.length) {
					if (typeInterval) clearInterval(typeInterval);
					isTyping = false;
					typingDone = true;
					return;
				}
				displayedText += c.text[i];
				i++;
			}, typingSpeedMs);
		};

		// Wait for the slide-in transition to finish before starting the typewriter.
		startTimer = setTimeout(startTyping, reducedMotion ? 0 : slideDurationMs);

		return () => {
			if (startTimer) clearTimeout(startTimer);
			if (typeInterval) clearInterval(typeInterval);
		};
	});

	// Auto-advance: once the current prompt finishes typing, wait pauseMs then
	// move on — unless paused (hover/focus) or reduced motion (no autoplay at
	// all; the visitor drives it manually via the controls).
	$effect(() => {
		if (reducedMotionPref.current || paused || !typingDone) return;
		const advance = setTimeout(() => {
			currentIndex = (currentIndex + 1) % prompts.length;
		}, pauseMs);
		return () => clearTimeout(advance);
	});

	function select(i: number) {
		if (i === currentIndex) return;
		track('demo-prompt-switched');
		currentIndex = i;
	}
</script>

<div
	class="mx-auto w-full max-w-3xl"
	role="group"
	aria-roledescription="carousel"
	aria-label="Example prompts"
	onpointerenter={onPointerEnter}
	onpointerleave={onPointerLeave}
	onfocusin={() => (focusWithin = true)}
	onfocusout={() => (focusWithin = false)}
>
	<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
		What they asked for
	</p>

	<div class="relative h-72 overflow-hidden">
		{#key currentIndex}
			<div
				class="absolute inset-0 flex flex-col"
				in:fly={{ x: 80, duration: flyDuration }}
				out:fly={{ x: -80, duration: flyDuration }}
			>
				{#if current}
					<div class="mb-2">
						<span
							class="rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase {current.voice ===
							'novice'
								? 'bg-amber-100 text-amber-800'
								: 'bg-indigo-100 text-indigo-800'}"
						>
							{current.label}
						</span>
					</div>

					<div
						class="claude-box relative flex-1 overflow-hidden rounded-2xl border px-5 py-4 shadow-sm"
					>
						<div class="flex items-start gap-3">
							<svg
								class="mt-0.5 shrink-0 text-spark"
								viewBox="0 0 24 24"
								width="20"
								height="20"
								aria-hidden="true"
							>
								<path
									d="M12 2 L13.6 9.8 L21.5 12 L13.6 14.2 L12 22 L10.4 14.2 L2.5 12 L10.4 9.8 Z"
									fill="currentColor"
								/>
							</svg>
							<p class="text-base leading-relaxed text-neutral-800">
								{displayedText}<span class="caret" aria-hidden="true"></span>
							</p>
						</div>

						{#if isTyping}
							<span
								class="thinking absolute right-3 bottom-3"
								transition:fade={{ duration: reducedMotionPref.current ? 0 : 250 }}
								aria-hidden="true"
							></span>
						{/if}
					</div>
				{/if}
			</div>
		{/key}
	</div>

	<div class="mt-3 flex items-center justify-center gap-1">
		<button
			type="button"
			class="grid size-11 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
			aria-label="Previous prompt"
			onclick={prev}
		>
			<svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<path
					d="M15 6 L9 12 L15 18"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
		<div class="flex items-center">
			{#each prompts as p, i (i)}
				<button
					type="button"
					class="grid size-11 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
					aria-label="Show prompt {i + 1}: {p.label}"
					aria-current={i === currentIndex ? 'true' : undefined}
					onclick={() => select(i)}
				>
					<span
						class="rounded-full transition-all {i === currentIndex
							? 'size-2.5 bg-neutral-900'
							: 'size-2 bg-neutral-500 hover:bg-neutral-700'}"
					></span>
				</button>
			{/each}
		</div>
		<button
			type="button"
			class="grid size-11 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-700 shadow-sm transition-colors hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
			aria-label="Next prompt"
			onclick={next}
		>
			<svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
</div>

<style>
	.claude-box {
		background-color: var(--color-prompt);
		border-color: var(--color-prompt-border);
	}

	.caret {
		display: inline-block;
		width: 1px;
		height: 1em;
		margin-left: 1px;
		background-color: rgb(64, 64, 64);
		vertical-align: -2px;
		animation: blink 1s steps(2, end) infinite;
	}

	.thinking {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--color-spark);
		box-shadow: 0 0 8px rgba(204, 120, 92, 0.5);
		animation: thinking-pulse 1.4s ease-in-out infinite;
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

	@keyframes thinking-pulse {
		0%,
		100% {
			opacity: 0.35;
			transform: scale(0.85);
		}
		50% {
			opacity: 1;
			transform: scale(1.1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.caret,
		.thinking {
			animation: none;
		}
		.caret {
			opacity: 1;
		}
		.thinking {
			opacity: 0.8;
		}
	}
</style>
