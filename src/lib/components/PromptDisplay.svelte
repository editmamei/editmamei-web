<script lang="ts">
	import type { DemoPrompt } from '$lib/types';
	import { fly, fade } from 'svelte/transition';

	interface Props {
		prompts: DemoPrompt[];
		typingSpeedMs?: number;
		pauseMs?: number;
		slideDurationMs?: number;
		currentIndex?: number;
	}

	let {
		prompts,
		typingSpeedMs = 32,
		pauseMs = 7000,
		slideDurationMs = 1400,
		currentIndex = $bindable(0)
	}: Props = $props();

	let displayedText = $state('');
	let isTyping = $state(false);

	const current = $derived(prompts[currentIndex]);

	$effect(() => {
		const c = prompts[currentIndex];
		if (!c) return;

		displayedText = '';
		isTyping = false;

		const reducedMotion =
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		let typeInterval: ReturnType<typeof setInterval> | undefined;
		let advance: ReturnType<typeof setTimeout> | undefined;
		let startTimer: ReturnType<typeof setTimeout> | undefined;

		const startTyping = () => {
			if (reducedMotion) {
				displayedText = c.text;
				advance = setTimeout(() => {
					currentIndex = (currentIndex + 1) % prompts.length;
				}, pauseMs);
				return;
			}
			isTyping = true;
			let i = 0;
			typeInterval = setInterval(() => {
				if (i >= c.text.length) {
					if (typeInterval) clearInterval(typeInterval);
					isTyping = false;
					advance = setTimeout(() => {
						currentIndex = (currentIndex + 1) % prompts.length;
					}, pauseMs);
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
			if (advance) clearTimeout(advance);
		};
	});

	function select(i: number) {
		if (i === currentIndex) return;
		currentIndex = i;
	}
</script>

<div class="mx-auto w-full max-w-3xl">
	<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
		What they asked for
	</p>

	<div class="relative h-72 overflow-hidden">
		{#key currentIndex}
			<div
				class="absolute inset-0 flex flex-col"
				in:fly={{ x: 80, duration: slideDurationMs }}
				out:fly={{ x: -80, duration: slideDurationMs }}
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
								class="mt-0.5 shrink-0"
								viewBox="0 0 24 24"
								width="20"
								height="20"
								aria-hidden="true"
							>
								<path
									d="M12 2 L13.6 9.8 L21.5 12 L13.6 14.2 L12 22 L10.4 14.2 L2.5 12 L10.4 9.8 Z"
									fill="#cc785c"
								/>
							</svg>
							<p class="text-base leading-relaxed text-neutral-800">
								{displayedText}<span class="caret" aria-hidden="true"></span>
							</p>
						</div>

						{#if isTyping}
							<span
								class="thinking absolute right-3 bottom-3"
								transition:fade={{ duration: 250 }}
								aria-hidden="true"
							></span>
						{/if}
					</div>
				{/if}
			</div>
		{/key}
	</div>

	<div class="mt-3 flex items-center justify-center gap-2">
		{#each prompts as p, i (i)}
			<button
				type="button"
				class="size-2 rounded-full transition-colors {i === currentIndex
					? 'bg-neutral-800'
					: 'bg-neutral-300 hover:bg-neutral-400'}"
				aria-label="Show prompt {i + 1}: {p.label}"
				aria-current={i === currentIndex ? 'true' : undefined}
				onclick={() => select(i)}
			></button>
		{/each}
	</div>
</div>

<style>
	.claude-box {
		background-color: #faf9f5;
		border-color: #e8e3d4;
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
		background-color: #cc785c;
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
