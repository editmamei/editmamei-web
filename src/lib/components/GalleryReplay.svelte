<script lang="ts">
	import { onMount } from 'svelte';
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';
	import { track } from '$lib/analytics/clarity';
	import { CONNECT_URL } from '$lib/links';
	import type { GalleryEntry } from '$lib/gallery/feed.js';
	import {
		HOLD,
		beforeAfterPng,
		canEncodeVideo,
		drawFrame,
		encodeReel,
		loadImages,
		saveBlob,
		sceneDuration,
		type Scene
	} from '$lib/gallery/reel';

	let { entry }: { entry: GalleryEntry } = $props();

	const reduced = prefersReducedMotion();

	// Replay frames, or before then after when the entry carries none.
	const urls = $derived(entry.frames.length > 0 ? entry.frames : [entry.before, entry.after]);
	const labels = $derived.by(() => {
		if (entry.frames.length === 0) return ['Before', 'After'];
		return entry.frames.map((_, i) => {
			const mapped = entry.steps.find((s) => s.frame === i);
			if (mapped) return mapped.title;
			return entry.steps.length === entry.frames.length ? entry.steps[i].title : '';
		});
	});

	let canvas = $state<HTMLCanvasElement>();
	let scene = $state<Scene | null>(null);
	let icon: HTMLImageElement | null = null;
	let exportable = $state(false);
	let loadFailed = $state(false);
	let playing = $state(false);
	let time = $state(0);
	// null until mounted: the download buttons only appear when the browser can encode.
	let encodeSupported = $state<boolean | null>(null);
	let busy = $state<'reel' | 'png' | null>(null);
	let progress = $state(0);
	let problem = $state('');

	const mainDuration = $derived(scene ? sceneDuration(scene, false) : urls.length * HOLD);

	function paint() {
		const ctx = canvas?.getContext('2d');
		if (!ctx || !scene || !canvas) return;
		drawFrame(ctx, canvas.width, canvas.height, scene, time, false, icon);
	}

	$effect(() => {
		// Redraw whenever the time or scene changes (scrubbing, paused seeks).
		void time;
		void scene;
		paint();
	});

	$effect(() => {
		if (!playing || !scene) return;
		let raf = 0;
		let last = performance.now();
		const tick = (now: number) => {
			time = (time + (now - last) / 1000) % mainDuration;
			last = now;
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	onMount(() => {
		encodeSupported = canEncodeVideo();
		let cancelled = false;
		(async () => {
			try {
				await document.fonts?.load(`600 40px "Bricolage Grotesque"`);
			} catch {
				// Fonts are cosmetic; the canvas falls back to the system font.
			}
			try {
				const loaded = await loadImages(urls);
				icon = (await loadImages(['/icons/icon-192.png'])).images[0];
				if (cancelled) return;
				exportable = loaded.exportable;
				scene = {
					images: loaded.images,
					labels,
					mode: entry.frames.length === 0 && entry.aligned ? 'wipe' : 'fade'
				};
				playing = !reduced.current;
			} catch {
				if (!cancelled) loadFailed = true;
			}
		})();
		return () => {
			cancelled = true;
		};
	});

	function toggle() {
		playing = !playing;
		if (playing) track('gallery-replay-played');
	}

	async function downloadReel() {
		if (!scene || busy) return;
		busy = 'reel';
		problem = '';
		progress = 0;
		playing = false;
		try {
			const blob = await encodeReel(scene, icon, (p) => (progress = p));
			saveBlob(blob, `editmamei-${entry.id}-reel.mp4`);
			track('gallery-reel-downloaded');
		} catch (err) {
			problem = err instanceof Error ? err.message : 'The video could not be made.';
		} finally {
			busy = null;
		}
	}

	async function downloadPng() {
		if (!scene || busy) return;
		busy = 'png';
		problem = '';
		try {
			const blob = await beforeAfterPng(
				// `before` and `after` are the first and last of the fallback pair, but
				// the PNG always wants the entry's own before and after photos.
				(await loadImages([entry.before])).images[0],
				(await loadImages([entry.after])).images[0],
				icon
			);
			saveBlob(blob, `editmamei-${entry.id}-before-after.png`);
			track('gallery-png-downloaded');
		} catch (err) {
			problem = err instanceof Error ? err.message : 'The image could not be made.';
		} finally {
			busy = null;
		}
	}

	const btn =
		'inline-flex items-center rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60';
</script>

<section>
	<h2 class="mb-3 text-xl font-bold tracking-tight text-neutral-900">Watch the edit</h2>
	{#if loadFailed}
		<p class="rounded-xl border border-dashed border-neutral-300 p-4 text-sm text-neutral-600">
			The replay could not load its images.
		</p>
	{:else}
		<div class="w-full max-w-[270px]">
			<div
				role="img"
				aria-label="Replay of the edit, one frame after another. The steps are listed in text beside it."
			>
				<canvas
					aria-hidden="true"
					bind:this={canvas}
					width={540}
					height={960}
					class="block aspect-[9/16] w-full rounded-2xl bg-brand-deep"
				></canvas>
			</div>
			<div class="mt-2 flex items-center gap-3">
				<button
					type="button"
					class="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-brand text-white transition-colors hover:bg-brand-light disabled:opacity-50"
					aria-label={playing ? 'Pause the replay' : 'Play the replay'}
					disabled={!scene}
					onclick={toggle}
				>
					<svg viewBox="0 0 24 24" class="size-4" fill="currentColor" aria-hidden="true">
						{#if playing}
							<path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
						{:else}
							<path d="M8 5v14l11-7z" />
						{/if}
					</svg>
				</button>
				<input
					type="range"
					class="min-w-0 flex-1 accent-brand"
					min="0"
					max={mainDuration}
					step="0.05"
					value={time}
					disabled={!scene}
					aria-label="Replay position"
					oninput={(e) => {
						playing = false;
						time = Math.min(Number(e.currentTarget.value), mainDuration - 0.01);
					}}
				/>
			</div>
		</div>
	{/if}
</section>

<section>
	<h2 class="mb-3 text-xl font-bold tracking-tight text-neutral-900">Post it yourself</h2>
	{#if encodeSupported === true || encodeSupported === null}
		<div class="flex flex-wrap gap-2.5">
			<button
				type="button"
				class={btn}
				disabled={!scene || !exportable || busy !== null || encodeSupported === null}
				onclick={downloadReel}
			>
				{busy === 'reel' ? `Making the video ${Math.round(progress * 100)}%` : 'Download reel'}
			</button>
			<button
				type="button"
				class={btn}
				disabled={!scene || !exportable || busy !== null}
				onclick={downloadPng}
			>
				{busy === 'png' ? 'Making the image' : 'Download before/after'}
			</button>
		</div>
	{:else}
		<p class="mb-3 text-sm text-neutral-600">
			This browser can't make the video, so only the image is offered.
		</p>
		<div class="flex flex-wrap gap-2.5">
			<button
				type="button"
				class={btn}
				disabled={!scene || !exportable || busy !== null}
				onclick={downloadPng}
			>
				{busy === 'png' ? 'Making the image' : 'Download before/after'}
			</button>
		</div>
	{/if}
	{#if scene && !exportable}
		<p class="mt-3 text-sm text-neutral-600">
			Downloads are unavailable right now because the photos can't be read by this page.
		</p>
	{/if}
	{#if problem}
		<p class="mt-3 text-sm text-terracotta-ink" role="alert">{problem}</p>
	{/if}
	<p class="mt-3 text-sm text-neutral-600">
		Made in your browser from this edit, with a small Editmamei end card.
	</p>
	<div class="mt-4">
		<a
			href={CONNECT_URL}
			onclick={() => track('gallery-try-cta')}
			class="inline-flex items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-brand-deep transition-colors hover:brightness-95"
		>
			Try this on your photo
		</a>
	</div>
</section>
