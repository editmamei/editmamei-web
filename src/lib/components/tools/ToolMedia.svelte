<script lang="ts">
	// A short demo clip for one tool row. The video loads only once the row
	// scrolls near the viewport, plays while it is in view or hovered, and
	// pauses otherwise. Under prefers-reduced-motion only the poster shows.
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';
	import type { ToolMedia } from '$lib/content/tools/tool-copy';

	let { media }: { media: ToolMedia } = $props();

	const reduced = prefersReducedMotion();
	let activeMode = $state<string | null>(null);
	const clip = $derived((activeMode && media.modes?.find((m) => m.mode === activeMode)) || media);

	let video: HTMLVideoElement | undefined = $state();
	let near = $state(false);
	let inView = $state(false);
	let hovered = $state(false);

	function chip(on: boolean): string {
		return `rounded-full border px-2.5 py-0.5 text-xs ${on ? 'border-brand bg-brand text-white' : 'border-neutral-300 text-neutral-700'}`;
	}

	$effect(() => {
		if (!video || typeof IntersectionObserver === 'undefined') return;
		const loader = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) near = true;
			},
			{ rootMargin: '200px 0px' }
		);
		const viewer = new IntersectionObserver(
			([entry]) => {
				inView = entry.intersectionRatio >= 0.5;
			},
			{ threshold: [0, 0.5] }
		);
		loader.observe(video);
		viewer.observe(video);
		return () => {
			loader.disconnect();
			viewer.disconnect();
		};
	});

	$effect(() => {
		if (!video || reduced.current || !near) return;
		// Re-run when the clip changes so a newly chosen mode starts playing.
		void clip.src;
		if (inView || hovered) video.play().catch(() => {});
		else video.pause();
	});
</script>

<div class="mt-3 max-w-sm">
	{#if reduced.current}
		<img
			src={clip.poster}
			alt={clip.alt}
			loading="lazy"
			class="aspect-video w-full rounded-lg border border-neutral-200 bg-neutral-100 object-cover"
		/>
	{:else}
		<video
			bind:this={video}
			src={near ? clip.src : undefined}
			poster={clip.poster}
			aria-label={clip.alt}
			muted
			loop
			playsinline
			preload="none"
			onpointerenter={() => (hovered = true)}
			onpointerleave={() => (hovered = false)}
			class="aspect-video w-full rounded-lg border border-neutral-200 bg-neutral-100 object-cover"
		></video>
	{/if}
	{#if media.modes && media.modes.length > 0}
		<div class="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Demo clips">
			<button
				type="button"
				aria-pressed={activeMode === null}
				onclick={() => (activeMode = null)}
				class={chip(activeMode === null)}>Overview</button
			>
			{#each media.modes as m (m.mode)}
				<button
					type="button"
					aria-pressed={activeMode === m.mode}
					onclick={() => (activeMode = m.mode)}
					class={chip(activeMode === m.mode)}>{m.mode}</button
				>
			{/each}
		</div>
	{/if}
</div>
