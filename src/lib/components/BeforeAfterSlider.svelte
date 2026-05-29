<script lang="ts">
	interface Props {
		beforeSrc: string;
		afterSrc: string;
		beforeAlt?: string;
		afterAlt?: string;
		initialPosition?: number;
		showLabels?: boolean;
	}

	let {
		beforeSrc,
		afterSrc,
		beforeAlt = 'Before',
		afterAlt = 'After',
		initialPosition = 50,
		showLabels = true
	}: Props = $props();

	const clamp = (v: number) => Math.max(0, Math.min(100, v));

	// svelte-ignore state_referenced_locally
	let position = $state(clamp(initialPosition));
	let dragging = $state(false);
	let container: HTMLDivElement;

	const afterOpacity = $derived(Math.max(0, Math.min(1, (position - 18) / 12)));
	const beforeOpacity = $derived(Math.max(0, Math.min(1, (82 - position) / 12)));

	function pickFromClientX(clientX: number) {
		if (!container) return;
		const rect = container.getBoundingClientRect();
		position = clamp(((clientX - rect.left) / rect.width) * 100);
	}

	function onPointerDown(e: PointerEvent) {
		dragging = true;
		container.setPointerCapture(e.pointerId);
		pickFromClientX(e.clientX);
		e.preventDefault();
	}

	function onPointerMove(e: PointerEvent) {
		if (!dragging) return;
		pickFromClientX(e.clientX);
	}

	function onPointerUp(e: PointerEvent) {
		dragging = false;
		if (container.hasPointerCapture(e.pointerId)) {
			container.releasePointerCapture(e.pointerId);
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		const step = e.shiftKey ? 10 : 2;
		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowDown':
				position = clamp(position - step);
				e.preventDefault();
				break;
			case 'ArrowRight':
			case 'ArrowUp':
				position = clamp(position + step);
				e.preventDefault();
				break;
			case 'Home':
				position = 0;
				e.preventDefault();
				break;
			case 'End':
				position = 100;
				e.preventDefault();
				break;
		}
	}
</script>

<div
	bind:this={container}
	class="relative touch-none overflow-hidden rounded-xl bg-neutral-100 select-none"
	class:cursor-ew-resize={!dragging}
	class:cursor-grabbing={dragging}
	role="presentation"
	onpointerdown={onPointerDown}
	onpointermove={onPointerMove}
	onpointerup={onPointerUp}
	onpointercancel={onPointerUp}
>
	<!-- AFTER on bottom — always visible. BEFORE on top, clipped from the left so it
	     only shows on the right side of the slider. Result: left of bar = AFTER, right of bar = BEFORE. -->
	<img
		src={afterSrc}
		alt={afterAlt}
		class="pointer-events-none block h-auto w-full"
		draggable="false"
	/>
	<img
		src={beforeSrc}
		alt={beforeAlt}
		class="pointer-events-none absolute inset-0 block h-auto w-full"
		style="clip-path: inset(0 0 0 {position}%)"
		draggable="false"
	/>

	{#if showLabels}
		<div
			class="pointer-events-none absolute top-4 left-[25%] -translate-x-1/2 transition-opacity duration-150"
			style="opacity: {afterOpacity}"
		>
			<span
				class="rounded-full bg-black/65 px-4 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm"
			>
				After
			</span>
		</div>
		<div
			class="pointer-events-none absolute top-4 left-[75%] -translate-x-1/2 transition-opacity duration-150"
			style="opacity: {beforeOpacity}"
		>
			<span
				class="rounded-full bg-black/65 px-4 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm"
			>
				Before
			</span>
		</div>
	{/if}

	<div
		role="slider"
		tabindex="0"
		aria-label="Before / after comparison position"
		aria-valuemin={0}
		aria-valuemax={100}
		aria-valuenow={Math.round(position)}
		aria-orientation="horizontal"
		class="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
		style="left: {position}%; transform: translateX(-50%)"
		onkeydown={onKeyDown}
	>
		<div
			class="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-700 shadow-lg ring-1 ring-black/5"
		>
			<svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
				<path
					d="M8 6 L4 11 L8 16 M14 6 L18 11 L14 16"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
	</div>
</div>
