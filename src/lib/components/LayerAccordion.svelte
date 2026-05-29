<script lang="ts">
	import type { Layer, LayerKind } from '$lib/types';
	import { slide } from 'svelte/transition';

	interface Props {
		layers: Layer[];
		initialExpanded?: number;
	}

	let { layers, initialExpanded = 0 }: Props = $props();

	// svelte-ignore state_referenced_locally
	let expandedIndex = $state(initialExpanded);

	const kindLabel: Record<LayerKind, string> = {
		'brightness-contrast': 'Brightness/Contrast',
		'hue-saturation': 'Hue/Saturation',
		curves: 'Curves',
		levels: 'Levels',
		'color-balance': 'Color Balance',
		pixel: 'Pixel',
		'smart-object': 'Smart Object',
		group: 'Group',
		text: 'Text',
		shape: 'Shape',
		fill: 'Fill',
		other: 'Layer'
	};

	function activate(i: number) {
		expandedIndex = i;
	}
</script>

<ol class="space-y-1">
	{#each layers as layer, i (i)}
		{@const open = i === expandedIndex}
		<li>
			<button
				type="button"
				class="group flex w-full flex-col rounded-md border bg-white px-2.5 py-1.5 text-left transition-colors {open
					? 'border-neutral-300 shadow-sm'
					: 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'}"
				aria-expanded={open}
				onclick={() => activate(i)}
				onpointerenter={() => activate(i)}
				onfocus={() => activate(i)}
			>
				<div class="flex min-w-0 items-center gap-2.5">
					<span
						class="flex size-6 shrink-0 items-center justify-center rounded border border-neutral-200 bg-neutral-50 text-neutral-600 {open
							? 'border-neutral-300 bg-white'
							: ''}"
						aria-hidden="true"
					>
						{#if layer.kind === 'brightness-contrast'}
							<svg
								viewBox="0 0 24 24"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="9" />
								<path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" stroke="none" />
							</svg>
						{:else if layer.kind === 'hue-saturation'}
							<svg
								viewBox="0 0 24 24"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="12" cy="12" r="9" />
								<path d="M12 3v18M3 12h18" />
							</svg>
						{:else if layer.kind === 'curves'}
							<svg
								viewBox="0 0 24 24"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M3 21V3M3 21h18" />
								<path d="M3 21C9 15 12 12 21 3" />
							</svg>
						{:else if layer.kind === 'levels'}
							<svg
								viewBox="0 0 24 24"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							>
								<path d="M4 6h12M4 12h16M4 18h8" />
							</svg>
						{:else if layer.kind === 'pixel'}
							<svg
								viewBox="0 0 24 24"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
								<circle cx="9" cy="9" r="1.6" />
								<path d="M21 15l-4-4-8 10" />
							</svg>
						{:else}
							<svg
								viewBox="0 0 24 24"
								width="13"
								height="13"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect x="3" y="3" width="18" height="18" rx="2" />
							</svg>
						{/if}
					</span>

					<span class="flex-1 truncate text-sm leading-tight font-semibold text-neutral-900">
						{i + 1}. {layer.name}
					</span>
					<span class="shrink-0 text-[10px] tracking-wide text-neutral-500 uppercase">
						{kindLabel[layer.kind]}
					</span>
					{#if layer.masked}
						<span
							class="shrink-0 rounded bg-blue-100 px-1 text-[9px] font-semibold tracking-wider text-blue-800 uppercase"
						>
							masked
						</span>
					{/if}
				</div>

				{#if open}
					<p
						class="mt-1.5 ml-[34px] text-xs leading-relaxed text-neutral-600"
						transition:slide={{ duration: 200 }}
					>
						{layer.summary}
					</p>
				{/if}
			</button>
		</li>
	{/each}
</ol>
