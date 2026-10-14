<script lang="ts">
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';

	interface Slide {
		id: string;
		title: string;
		after: string;
		width: number;
		height: number;
	}

	let { slides }: { slides: Slide[] } = $props();

	const DUR = 6000;
	const reduced = prefersReducedMotion();

	let cur = $state(0);
	let hovered = $state(false);
	let focused = $state(false);
	let userPaused = $state(false);

	const many = $derived(slides.length > 1);
	// Auto-advance runs only while nothing asks it to stop: pointer or focus
	// inside the carousel, the pause button, or a reduced-motion preference.
	const running = $derived(many && !hovered && !focused && !userPaused && !reduced.current);

	function go(i: number) {
		cur = (i + slides.length) % slides.length;
	}

	$effect(() => {
		if (!running) return;
		const timer = setTimeout(() => go(cur + 1), DUR);
		return () => clearTimeout(timer);
	});

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'ArrowLeft') {
			go(cur - 1);
			e.preventDefault();
		} else if (e.key === 'ArrowRight') {
			go(cur + 1);
			e.preventDefault();
		}
	}

	function onFocusout(e: FocusEvent) {
		const next = e.relatedTarget as Node | null;
		if (!next || !(e.currentTarget as HTMLElement).contains(next)) focused = false;
	}

	const ctrlClass =
		'grid size-10 cursor-pointer place-items-center rounded-full bg-white/20 text-lg text-white backdrop-blur-sm transition-colors hover:bg-white/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<section
	class="relative h-[clamp(420px,52vw,600px)] overflow-hidden rounded-2xl bg-brand-deep"
	aria-roledescription="carousel"
	aria-label="Featured edits"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onfocusin={() => (focused = true)}
	onfocusout={onFocusout}
	onkeydown={onKeydown}
>
	{#each slides as s, i (s.id)}
		<article
			class="slide absolute inset-0"
			class:on={i === cur}
			aria-roledescription="slide"
			aria-label="{i + 1} of {slides.length}"
			aria-hidden={i !== cur}
		>
			<img
				src={s.after}
				alt=""
				aria-hidden="true"
				class="absolute -inset-10 h-[calc(100%+5rem)] w-[calc(100%+5rem)] max-w-none object-cover blur-3xl brightness-50 saturate-110"
			/>
			<img
				src={s.after}
				alt={s.title}
				loading={i === 0 ? 'eager' : 'lazy'}
				class="photo absolute inset-0 size-full {s.width / s.height > 1.45
					? 'object-cover'
					: 'object-contain'}"
			/>
			<!-- The whole slide is a link; the button below is the focusable one. -->
			<a
				href="/gallery/{s.id}"
				class="absolute inset-0"
				tabindex="-1"
				aria-hidden="true"
				aria-label="{s.title}: see how it was made"
			></a>
			<a
				href="/gallery/{s.id}"
				tabindex={i === cur ? 0 : -1}
				class="absolute right-4 bottom-4 rounded-full bg-white px-4 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-900 shadow-lg transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5 sm:bottom-5"
			>
				See how it was made
				<span class="sr-only">: {s.title}</span>
			</a>
		</article>
	{/each}

	{#if many}
		<div
			class="absolute top-5 left-4 flex gap-2 sm:left-6"
			role="group"
			aria-label="Choose a slide"
		>
			{#each slides as s, i (s.id)}
				<button
					type="button"
					class="h-4 w-8 cursor-pointer overflow-hidden bg-transparent p-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
					aria-label="Show slide {i + 1}: {s.title}"
					aria-current={i === cur ? 'true' : undefined}
					onclick={() => go(i)}
				>
					<span class="relative block h-1 w-full rounded-sm bg-white/35">
						{#key `${cur}-${running}`}
							{#if i === cur}
								<i
									class="bar absolute inset-y-0 left-0 block bg-white"
									class:run={running}
									style="--dur: {DUR}ms"
								></i>
							{/if}
						{/key}
					</span>
				</button>
			{/each}
		</div>

		<div class="absolute top-3 right-3 flex gap-2 sm:top-4 sm:right-4">
			{#if !reduced.current}
				<button
					type="button"
					class={ctrlClass}
					aria-label={userPaused ? 'Play slideshow' : 'Pause slideshow'}
					onclick={() => (userPaused = !userPaused)}
				>
					<svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true">
						{#if userPaused}
							<path d="M8 5v14l11-7z" />
						{:else}
							<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
						{/if}
					</svg>
				</button>
			{/if}
			<button
				type="button"
				class={ctrlClass}
				aria-label="Previous slide"
				onclick={() => go(cur - 1)}>&lsaquo;</button
			>
			<button type="button" class={ctrlClass} aria-label="Next slide" onclick={() => go(cur + 1)}
				>&rsaquo;</button
			>
		</div>
	{/if}
</section>

<style>
	.slide {
		opacity: 0;
		visibility: hidden;
		transition:
			opacity 0.8s ease,
			visibility 0s linear 0.8s;
	}
	.slide.on {
		opacity: 1;
		visibility: visible;
		transition: opacity 0.8s ease;
	}
	.slide.on .photo {
		animation: drift 7s ease-out both;
	}
	.bar {
		width: 100%;
	}
	.bar.run {
		width: 0;
		animation: fillbar var(--dur, 6s) linear both;
	}
	@keyframes drift {
		from {
			transform: scale(1.04);
		}
		to {
			transform: scale(1);
		}
	}
	@keyframes fillbar {
		to {
			width: 100%;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.slide,
		.slide.on {
			transition: none;
		}
		.slide.on .photo {
			animation: none;
		}
		.bar.run {
			animation: none;
			width: 100%;
		}
	}
</style>
