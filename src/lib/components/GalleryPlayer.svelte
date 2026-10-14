<script lang="ts">
	// The edit as a short 9:16 video, drawn by the share kit (the same drawing Connect uses for the
	// maker's downloads). It only plays here: downloads are for the maker, on Connect.
	import { onMount } from 'svelte';
	import { loadFonts, loadPictures, play, timeline } from '$lib/gallery/share-kit.js';
	import type { GalleryShare } from '$lib/gallery/feed.js';

	let { share }: { share: GalleryShare } = $props();
	let canvas: HTMLCanvasElement | undefined = $state();
	let failed = $state(false);

	onMount(() => {
		let stop: (() => void) | undefined;
		let gone = false;
		(async () => {
			try {
				await loadFonts();
				const pictures = await loadPictures([share.before, share.after, ...share.frames]);
				if (gone || !canvas) return;
				stop = play(canvas, timeline(share), pictures);
			} catch {
				failed = true;
			}
		})();
		return () => {
			gone = true;
			stop?.();
		};
	});
</script>

<figure class="m-0">
	<canvas
		bind:this={canvas}
		width="540"
		height="960"
		class="block aspect-[9/16] w-full max-w-[270px] rounded-2xl bg-brand-deep"
		aria-label={`${share.title}: the edit as a short video`}
	></canvas>
	<figcaption class="mt-2 text-sm text-neutral-600">
		{failed ? 'The video could not be loaded.' : 'Tap the video to pause or play it.'}
	</figcaption>
</figure>
