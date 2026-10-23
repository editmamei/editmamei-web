<script lang="ts">
	import './flow.css';

	// One link in a wiring diagram: a line (vertical on phones, horizontal on
	// large screens), its label, and what travels along it. Two cues, never
	// colour alone: `editor` links are solid green (Editmamei and the editor),
	// `ai` links are dashed orange (the AI's side). Travellers run on one shared
	// 8 s cycle; `out` moves start to end, `back` end to start, each starting
	// at its own delay so a chip can hop link to link.
	type Chip = 'photo' | 'edit' | 'text';
	let {
		kind,
		label,
		thumb,
		out,
		back,
		outAt = 0,
		backAt = 4
	}: {
		kind: 'editor' | 'ai';
		label: string;
		thumb: string;
		out?: Chip;
		back?: Chip;
		outAt?: number;
		backAt?: number;
	} = $props();
</script>

{#snippet chip(c: Chip, dir: 'out' | 'back', at: number)}
	<span class="fl-chip fl-chip-{c} fl-{dir}" style="--at: {at}s;">
		{#if c === 'photo'}
			<img src={thumb} alt="" class="h-full w-full rounded-[3px] object-cover" />
		{:else if c === 'edit'}
			✎
		{:else}
			<svg viewBox="0 0 24 24" class="size-3" fill="currentColor"
				><path d="M4 5h16v11H9l-5 4V5z" /></svg
			>
		{/if}
	</span>
{/snippet}

<div class="relative flex flex-none items-center justify-center lg:flex-1">
	<div
		class="fl-line {kind === 'editor'
			? 'fl-line-editor'
			: 'fl-line-ai'} h-16 w-0 lg:h-0 lg:w-full lg:min-w-16"
		aria-hidden="true"
	>
		{#if out}{@render chip(out, 'out', outAt)}{/if}
		{#if back}{@render chip(back, 'back', backAt)}{/if}
	</div>
	<span
		class="absolute top-1/2 left-[calc(50%+14px)] w-[calc(50%-14px)] -translate-y-1/2 text-[12.5px] leading-tight font-semibold lg:hidden {kind ===
		'editor'
			? 'text-accent'
			: 'text-[#ffb08f]'}">{label}</span
	>
	<span
		class="absolute inset-x-1 bottom-[calc(50%+12px)] hidden text-center text-[12px] leading-tight font-semibold lg:block {kind ===
		'editor'
			? 'text-accent'
			: 'text-[#ffb08f]'}">{label}</span
	>
</div>
