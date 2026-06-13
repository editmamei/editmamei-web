<script lang="ts">
	import type { CapabilityDemo } from '$lib/types';
	import { prefersReducedMotion } from '$lib/a11y/reducedMotion.svelte';
	import { trackOnce } from '$lib/analytics/clarity';
	import { cityStreetHistogram as hist } from '$lib/demos/cityStreetHistogram';

	interface Props {
		demo: CapabilityDemo;
		title: string;
	}

	let { demo, title }: Props = $props();

	const rm = prefersReducedMotion();

	// Before/after toggle (beforeAfter + mask kinds). A pointer (mouse/pen) hover
	// peeks the original; the button pins it for touch + keyboard. Touch pointers
	// never peek — a tap fires pointerenter but often no pointerleave.
	let pinnedBefore = $state(false);
	let peeking = $state(false);
	const showBefore = $derived(pinnedBefore || peeking);

	function onEnter(e: PointerEvent) {
		if (e.pointerType !== 'touch') peeking = true;
	}
	function onLeave() {
		peeking = false;
	}
	function toggle() {
		pinnedBefore = !pinnedBefore;
		trackOnce('capability-demo-toggled');
	}

	// Histogram geometry — real per-channel data derived from the City-Street
	// original (see cityStreetHistogram.ts). Drawn as a Photoshop-style panel.
	const HW = 100;
	const HH = 44;
	const histMax = Math.max(...hist.red, ...hist.green, ...hist.blue, ...hist.luma);

	function linePath(bins: number[]): string {
		const n = bins.length;
		return bins
			.map((v, i) => {
				const x = (i / (n - 1)) * HW;
				const y = HH - (v / histMax) * HH;
				return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
			})
			.join(' ');
	}

	function areaPath(bins: number[]): string {
		return `M0,${HH} ${linePath(bins).replace(/^M/, 'L')} L${HW},${HH} Z`;
	}

	const channels = [
		{ key: 'red' as const, stroke: '#e0563f' },
		{ key: 'green' as const, stroke: '#56b35c' },
		{ key: 'blue' as const, stroke: '#4f86e0' }
	];

	// Representative layer stack for the Layers card chrome (web-rendered to read
	// like a Photoshop panel — not a literal export).
	const layerRows = [
		{ name: 'Saturation +42', swatch: 'linear-gradient(135deg,#d98b3a,#7bb86a)' },
		{ name: 'Sky — deepen', swatch: 'linear-gradient(180deg,#fff,#1c4a8a)' },
		{ name: 'Background blur', swatch: 'linear-gradient(135deg,#9aa0a6,#cfd4d9)' },
		{ name: 'Background', swatch: 'linear-gradient(135deg,#6b7a52,#b6a98a)' }
	];

	const frameClass =
		'relative aspect-[4/3] w-full overflow-hidden border-b border-neutral-200 bg-neutral-100';
	const chipClass =
		'pointer-events-none absolute left-2 top-2 rounded-full bg-neutral-900/80 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white shadow-sm';
	const badgeClass = 'rounded-sm bg-white/15 px-1.5 py-0.5 text-[9px] font-medium text-white/90';
</script>

{#if demo.kind === 'beforeAfter' || demo.kind === 'mask'}
	<div
		class={frameClass}
		role="group"
		aria-label={`${title} — ${demo.tool}, before and after`}
		onpointerenter={onEnter}
		onpointerleave={onLeave}
	>
		<div class="grid h-full w-full">
			<img
				class="col-start-1 row-start-1 h-full w-full object-cover"
				src={demo.before}
				alt={`${title} — original photo`}
				loading="lazy"
				decoding="async"
			/>
			<img
				class={`col-start-1 row-start-1 h-full w-full object-cover ${rm.current ? '' : 'transition-opacity duration-500'}`}
				style:opacity={showBefore ? 0 : 1}
				src={demo.after}
				alt={`${title} — ${demo.tool} applied`}
				loading="lazy"
				decoding="async"
			/>
		</div>

		<span class={chipClass}>{demo.tool}</span>

		{#if demo.kind === 'mask'}
			<figure
				class="pointer-events-none absolute top-2 right-2 w-[28%] max-w-[120px] overflow-hidden rounded border border-white/70 shadow-md"
			>
				<img src={demo.maskThumb} alt={`${title} — black and white layer mask`} loading="lazy" />
				<figcaption class="bg-neutral-900/80 px-1 py-0.5 text-center text-[8px] text-white/90">
					Layer mask
				</figcaption>
			</figure>
		{/if}

		<button
			type="button"
			onclick={toggle}
			aria-pressed={showBefore}
			class="absolute right-2 bottom-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-neutral-900 shadow-sm ring-1 ring-black/5 transition hover:bg-white focus-visible:ring-2 focus-visible:ring-terracotta-ink focus-visible:outline-none"
		>
			{showBefore ? 'Original' : 'Result'}
		</button>
	</div>
{:else if demo.kind === 'selection'}
	<div class={frameClass}>
		<img
			class="h-full w-full object-cover"
			src={demo.image}
			alt={`${title} — ${demo.tool} marquee on the subject`}
			loading="lazy"
			decoding="async"
		/>
		<span class={chipClass}>{demo.tool}</span>
		<div
			class={`marching-ants pointer-events-none absolute inset-1 ${rm.current ? 'reduced' : ''}`}
			aria-hidden="true"
		></div>
	</div>
{:else if demo.kind === 'documents'}
	<div class={frameClass}>
		<img
			class="h-full w-full object-cover"
			src={demo.image}
			alt={`${title} — source photo opened in Photoshop`}
			loading="lazy"
			decoding="async"
		/>
		<div
			class="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-x-2 gap-y-1 bg-neutral-900/75 px-2.5 py-2 backdrop-blur-sm"
		>
			<span class="text-[10px] font-semibold tracking-wide text-white/70 uppercase">In</span>
			{#each ['HEIC', 'RAW', 'PSD'] as f (f)}
				<span class={badgeClass}>{f}</span>
			{/each}
			<svg viewBox="0 0 24 24" class="h-3 w-3 text-white/60" fill="none" aria-hidden="true">
				<path
					d="M5 12h14M13 6l6 6-6 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
			<span class="text-[10px] font-semibold tracking-wide text-white/70 uppercase">Out</span>
			{#each ['PSD', 'JPEG', 'PNG'] as f (f)}
				<span class={badgeClass}>{f}</span>
			{/each}
		</div>
	</div>
{:else if demo.kind === 'layers'}
	<div class={frameClass}>
		<img
			class="h-full w-full object-cover"
			src={demo.image}
			alt={`${title} — document with a layer stack`}
			loading="lazy"
			decoding="async"
		/>
		<div
			class="absolute top-2 right-2 bottom-2 flex w-[46%] max-w-[170px] flex-col overflow-hidden rounded border border-white/10 bg-neutral-900/85 text-white shadow-lg backdrop-blur-sm"
		>
			<div
				class="border-b border-white/10 px-2 py-1 text-[10px] font-semibold tracking-wide text-white/80"
			>
				Layers
			</div>
			<ul class="flex-1 divide-y divide-white/5">
				{#each layerRows as row (row.name)}
					<li class="flex items-center gap-1.5 px-2 py-1.5">
						<svg
							viewBox="0 0 24 24"
							class="h-2.5 w-2.5 shrink-0 text-white/60"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								d="M12 5C6 5 2 12 2 12s4 7 10 7 10-7 10-7-4-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8z"
							/>
						</svg>
						<span
							class="h-4 w-4 shrink-0 rounded-[2px] border border-white/30"
							style:background={row.swatch}
						></span>
						<span class="truncate text-[10px] text-white/90">{row.name}</span>
					</li>
				{/each}
			</ul>
		</div>
	</div>
{:else if demo.kind === 'histogram'}
	<div
		class="flex aspect-[4/3] w-full flex-col overflow-hidden border-b border-neutral-200 bg-neutral-900 p-3"
	>
		<div class="mb-2 flex items-center justify-between">
			<span class="text-[10px] font-semibold tracking-wide text-white/80 uppercase">Histogram</span>
			<span class="text-[10px] text-white/45">RGB · per-channel</span>
		</div>
		<svg
			viewBox={`0 0 ${HW} ${HH}`}
			class="w-full flex-1"
			preserveAspectRatio="none"
			aria-hidden="true"
		>
			<path d={areaPath(hist.luma)} fill="rgba(255,255,255,0.10)" />
			<g style="mix-blend-mode: screen">
				{#each channels as c (c.key)}
					<path d={linePath(hist[c.key])} fill="none" stroke={c.stroke} stroke-width="0.8" />
				{/each}
			</g>
		</svg>
		<div class="mt-2 flex items-center gap-3">
			{#each channels as c (c.key)}
				<span class="flex items-center gap-1 text-[9px] text-white/60">
					<span class="h-2 w-2 rounded-full" style:background={c.stroke}></span>
					{c.key[0].toUpperCase()}{c.key.slice(1)}
				</span>
			{/each}
		</div>
		<span class="sr-only">
			Per-channel histogram of the City-Street photograph, read back from the document so the AI can
			verify tonal range quantitatively.
		</span>
	</div>
{/if}

<style>
	/* Animated marching-ants marquee for the selection card. Four dashed edges
	   whose dash offset scrolls; honors reduced motion by freezing. */
	.marching-ants::before {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(90deg, #fff 50%, transparent 50%),
			linear-gradient(90deg, #fff 50%, transparent 50%),
			linear-gradient(0deg, #fff 50%, transparent 50%),
			linear-gradient(0deg, #fff 50%, transparent 50%);
		background-repeat: repeat-x, repeat-x, repeat-y, repeat-y;
		background-size:
			12px 2px,
			12px 2px,
			2px 12px,
			2px 12px;
		background-position:
			0 0,
			0 100%,
			0 0,
			100% 0;
		filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.55));
		animation: marching-ants 0.6s linear infinite;
	}

	@keyframes marching-ants {
		to {
			background-position:
				24px 0,
				-24px 100%,
				0 -24px,
				100% 24px;
		}
	}

	.marching-ants.reduced::before {
		animation: none;
	}

	@media (prefers-reduced-motion: reduce) {
		.marching-ants::before {
			animation: none;
		}
	}
</style>
