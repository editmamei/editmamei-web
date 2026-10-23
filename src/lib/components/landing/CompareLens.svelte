<script lang="ts">
	import { reveal } from '$lib/actions/reveal';

	// The street photo: the original, Editmamei's real edit, and ChatGPT's real
	// default-mode result (owner's capture, 2026-10-22, its first result, given the
	// detailed prompt below).
	const BEFORE = '/landing/street/before.webp';
	const CHAT = 'ChatGPT';

	type Pin = { x: number; y: number; label: string; good: boolean };
	type Mode = {
		id: 'editmamei' | 'default';
		tab: string;
		sub: string;
		chip: string;
		src: string;
		how: string;
		line: string;
		badge?: string;
		pins: Pin[];
	};

	const modes: Mode[] = [
		{
			id: 'editmamei',
			tab: 'Editmamei',
			sub: 'Edited in Photoshop',
			chip: 'Edited by Editmamei',
			src: '/landing/street/edited.webp',
			how: 'Desktop · edited in Photoshop, in layers',
			line: 'bg-accent shadow-[0_0_22px_5px_rgba(206,255,140,0.6)]',
			badge: '3000 × 2004, the full original size',
			pins: [
				{ x: 81, y: 45, label: 'Same banner lettering', good: true },
				{ x: 70, y: 60, label: 'Same sign, still readable', good: true },
				{ x: 88, y: 88, label: 'Same people, same faces', good: true }
			]
		},
		{
			id: 'default',
			tab: CHAT,
			sub: 'Default mode',
			chip: `Redrawn by ${CHAT}`,
			src: '/landing/street/chatgpt-default.webp',
			how: 'GPT-6, default mode · image generation',
			line: 'bg-[#ff7a5c] shadow-[0_0_22px_5px_rgba(255,122,92,0.55)]',
			badge: '1534 × 1025, half the size asked for',
			pins: [
				{ x: 48, y: 14, label: 'An invented sky and sun', good: false },
				{ x: 81, y: 45, label: 'Banner lettering garbled', good: false },
				{ x: 88, y: 88, label: 'Faces redrawn', good: false }
			]
		}
	];

	// "Look closer": full-resolution crops cut by prep-street-crops.cjs, which
	// holds the crop rectangles. `ratio` is each crop's width / height.
	const crops = [
		{
			id: 'banner',
			name: 'Banner',
			ratio: 0.545,
			note: {
				editmamei: 'Every word still reads: Brygge, Lybeck, Hamburg.',
				default: 'The words are gone, replaced by made-up marks.'
			}
		},
		{
			id: 'faces',
			name: 'Faces',
			ratio: 1.728,
			note: {
				editmamei: 'The same two people, in warmer light.',
				default: 'Both people have different faces.'
			}
		},
		{
			id: 'sky',
			name: 'Sky',
			ratio: 0.873,
			note: {
				editmamei: 'The same sky, warmed to golden hour.',
				default: 'Clouds that were never in the photo.'
			}
		}
	] as const;
	const cropSrc = (id: string, key: 'before' | 'edited' | 'chatgpt') =>
		`/landing/street/crop-${id}-${key}.webp`;

	const chatPrompt = `Edit this exact photo. Do not generate a new image or recreate the scene. Treat it the way a professional retoucher would in Photoshop: only adjust light and color, as if using adjustment layers (Curves, Color Balance, Hue/Saturation) on top of the original pixels. Make it look like golden hour: warm, low sunlight raking across the building fronts; warmer highlights and midtones, gently lifted shadows; a soft warm glow in the sky. Keep everything else identical to the original: the same framing, crop and aspect ratio; every building, window, roof line and the church spire exactly where they are; every sign and its text, unchanged and readable; every person exactly as they are: same faces, clothes, poses and positions; do not add, remove, move or reshape anything. Return the edited photo at the same size as the original (3000 × 2004).`;

	// Opens on Editmamei's edit; ChatGPT's is one tap away.
	let current = $state(0);
	let pos = $state(50);
	let dragging = $state(false);
	let box = $state<HTMLElement>();
	let lens = $state<{ x: number; y: number; w: number; h: number } | null>(null);
	let openPin = $state<number | null>(null);
	let cropAt = $state(0);

	const mode = $derived(modes[current]);
	const crop = $derived(crops[cropAt]);

	function choose(i: number) {
		current = i;
		openPin = null;
	}
	function setFromEvent(e: PointerEvent) {
		if (!box) return;
		const r = box.getBoundingClientRect();
		pos = Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100));
	}
	function onDown(e: PointerEvent) {
		dragging = true;
		lens = null;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		setFromEvent(e);
	}
	function onMove(e: PointerEvent) {
		if (dragging) return setFromEvent(e);
		if (e.pointerType !== 'mouse' || !box) return;
		const r = box.getBoundingClientRect();
		lens = { x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height };
	}
	function onUp() {
		dragging = false;
	}

	const ZOOM = 2.6;
	const R = 92;
	const lensSrc = $derived(lens ? ((lens.x / lens.w) * 100 < pos ? BEFORE : mode.src) : null);
</script>

<section
	id="compare"
	class="relative scroll-mt-16 bg-paper px-4 py-20 md:py-28"
	aria-labelledby="compare-title"
>
	<div class="mx-auto max-w-6xl">
		<div class="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:items-start lg:gap-14">
			<div class="lg:sticky lg:top-28">
				<p class="lp-eyebrow text-terracotta-ink">The difference</p>
				<h2 id="compare-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
					<span><span>Your photo, edited.</span></span>
					<span><span>Not redrawn.</span></span>
				</h2>
				<p class="mt-6 text-lg leading-relaxed text-neutral-700">
					We gave {CHAT} this photo with a detailed request to edit it like a retoucher and change nothing
					else. In its default mode it painted a new picture: a new sky, garbled lettering, different
					faces, at half the size.
				</p>
				<p class="mt-4 text-lg leading-relaxed text-neutral-700">
					Editmamei did the edit in Photoshop, in layers you can keep working on.
				</p>
				<ul class="mt-7 flex flex-col gap-3 text-[17px] text-brand">
					{#each ['The same photo, at full resolution', 'Every step visible and changeable', 'Nothing added unless you ask for it'] as point (point)}
						<li class="flex items-center gap-3">
							<span
								class="grid size-7 flex-none place-items-center rounded-full bg-brand text-accent"
							>
								<svg
									aria-hidden="true"
									class="size-4"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg
								>
							</span>
							{point}
						</li>
					{/each}
				</ul>
			</div>

			<div class="lp-fade min-w-0" use:reveal>
				<!-- Which result to compare against the original -->
				<p id="compare-pick" class="text-sm font-semibold text-brand">Compare your photo with</p>
				<div
					class="mt-2 grid max-w-[30rem] grid-cols-2 gap-2"
					role="group"
					aria-labelledby="compare-pick"
				>
					{#each modes as m, i (m.id)}
						<button
							type="button"
							aria-pressed={current === i}
							onclick={() => choose(i)}
							class="flex min-h-14 items-center gap-2.5 rounded-2xl border-2 px-3.5 py-2 text-left transition-colors {current ===
							i
								? m.id === 'editmamei'
									? 'border-brand bg-brand text-white'
									: 'border-[#3b2a24] bg-[#3b2a24] text-white'
								: 'border-brand/20 bg-white text-brand hover:border-brand/50'}"
						>
							<span
								class="size-3 flex-none rounded-full {m.id === 'editmamei'
									? 'bg-accent'
									: 'bg-[#ff7a5c]'}"
								aria-hidden="true"
							></span>
							<span class="flex min-w-0 flex-col">
								<span class="text-base leading-tight font-bold">{m.tab}</span>
								<span class="text-[12.5px] leading-tight opacity-75">{m.sub}</span>
							</span>
						</button>
					{/each}
				</div>
				<p class="mt-3 text-sm text-neutral-600">{mode.how}</p>

				<div
					bind:this={box}
					class="relative mt-4 aspect-[1600/1069] cursor-ew-resize touch-pan-y overflow-hidden rounded-[20px] bg-neutral-900 shadow-[0_40px_80px_-40px_rgba(20,55,49,0.6)] select-none"
					onpointerdown={onDown}
					onpointermove={onMove}
					onpointerup={onUp}
					onpointercancel={onUp}
					onpointerleave={() => (lens = null)}
					role="presentation"
				>
					<img
						src={BEFORE}
						alt="The original street, as shot"
						loading="lazy"
						draggable="false"
						class="pointer-events-none absolute inset-0 h-full w-full object-cover [-webkit-touch-callout:none]"
					/>
					<div class="absolute inset-0" style="clip-path: inset(0 0 0 {pos}%);">
						{#each modes as m, i (m.id)}
							<img
								src={m.src}
								alt={i === current ? `The same street: ${m.tab}'s result` : ''}
								loading="lazy"
								draggable="false"
								class="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-300 [-webkit-touch-callout:none] {i ===
								current
									? 'opacity-100'
									: 'opacity-0'}"
							/>
						{/each}

						{#each mode.pins as pin, i (mode.id + pin.label)}
							<div
								class="absolute flex -translate-y-1/2 items-center gap-1 transition-opacity duration-300 {pin.x >
								60
									? '-translate-x-[calc(100%-1.375rem)] flex-row-reverse'
									: '-translate-x-[1.375rem]'} {pin.x > pos + 4
									? 'opacity-100'
									: 'pointer-events-none opacity-0'}"
								style="left: {pin.x}%; top: {pin.y}%;"
							>
								<button
									type="button"
									aria-label={pin.label}
									aria-expanded={openPin === i}
									tabindex={pin.x > pos + 4 ? 0 : -1}
									aria-hidden={pin.x > pos + 4 ? undefined : true}
									class="grid size-11 flex-none place-items-center"
									onpointerdown={(e) => e.stopPropagation()}
									onclick={() => (openPin = openPin === i ? null : i)}
								>
									<span
										class="block size-4 rounded-full {pin.good
											? 'bg-accent shadow-[0_0_0_4px_rgba(206,255,140,0.35)]'
											: 'bg-[#ff7a5c] shadow-[0_0_0_4px_rgba(255,122,92,0.35)]'} {openPin === i
											? 'ring-2 ring-white'
											: ''}"
									></span>
								</button>
								<span
									class="lp-glass rounded-full px-3 py-1 text-[12.5px] font-semibold whitespace-nowrap text-white {openPin ===
									i
										? 'inline'
										: 'hidden sm:inline'}">{pin.label}</span
								>
							</div>
						{/each}
					</div>

					<span
						class="lp-glass absolute top-3 left-3 rounded-full px-3 py-1 text-xs font-semibold text-white"
						>Your photo</span
					>
					<span
						class="absolute top-3 right-3 rounded-full px-3.5 py-1.5 text-[13px] font-bold shadow-lg sm:text-sm {mode.id ===
						'editmamei'
							? 'bg-accent text-brand-deep'
							: 'bg-[#3b2a24] text-white'}">{mode.chip}</span
					>
					{#if mode.badge}
						<span
							class="lp-glass absolute right-3 bottom-3 rounded-full px-3 py-1 text-[11.5px] font-semibold text-white"
							>{mode.badge}</span
						>
					{/if}

					<div
						class="pointer-events-none absolute inset-y-0 w-[3px] {mode.line}"
						style="left: calc({pos}% - 1.5px);"
					>
						<span
							class="absolute top-1/2 left-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-brand shadow-xl"
						>
							<svg
								aria-hidden="true"
								class="size-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.2"
								stroke-linecap="round"
								stroke-linejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6" /></svg
							>
						</span>
					</div>

					{#if lens && lensSrc && !dragging}
						<div
							class="pointer-events-none absolute rounded-full border-2 border-white/90 shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7)]"
							style="width: {R * 2}px; height: {R * 2}px; left: {lens.x - R}px; top: {lens.y -
								R}px; background-image: url({lensSrc}); background-size: {lens.w * ZOOM}px {lens.h *
								ZOOM}px; background-position: {-(lens.x * ZOOM - R)}px {-(lens.y * ZOOM - R)}px;"
							aria-hidden="true"
						></div>
					{/if}

					<label class="sr-only" for="compare-range">Compare the original with the result</label>
					<input
						id="compare-range"
						type="range"
						min="0"
						max="100"
						step="1"
						bind:value={pos}
						class="sr-only"
					/>
				</div>

				<!-- Look closer: one full-resolution crop at a time, original against the chosen result -->
				<div class="mt-8">
					<div class="flex flex-wrap items-center gap-2">
						<p id="closer-pick" class="mr-1 text-sm font-semibold text-brand">Look closer</p>
						<div class="flex gap-2" role="group" aria-labelledby="closer-pick">
							{#each crops as c, i (c.id)}
								<button
									type="button"
									aria-pressed={cropAt === i}
									onclick={() => (cropAt = i)}
									class="min-h-10 rounded-full border-2 px-4 text-sm font-semibold transition-colors {cropAt ===
									i
										? 'border-brand bg-brand text-white'
										: 'border-brand/20 bg-white text-brand hover:border-brand/50'}">{c.name}</button
								>
							{/each}
						</div>
					</div>
					<figure class="m-0 mt-3 {crop.ratio < 1 ? 'sm:max-w-[30rem]' : ''}">
						<div
							class="grid gap-1 overflow-hidden rounded-2xl {crop.ratio > 1
								? 'grid-cols-1 sm:grid-cols-2'
								: 'grid-cols-2'}"
						>
							{#each [{ label: 'Original', key: 'before' as const }, { label: mode.tab, key: mode.id === 'editmamei' ? ('edited' as const) : ('chatgpt' as const) }] as half (half.key)}
								<div class="relative bg-neutral-900" style="aspect-ratio: {crop.ratio};">
									<img
										src={cropSrc(crop.id, half.key)}
										alt="{crop.name}, {half.label}"
										loading="lazy"
										draggable="false"
										class="pointer-events-none absolute inset-0 h-full w-full object-cover [-webkit-touch-callout:none]"
									/>
									<span
										class="absolute top-2 left-2 rounded-full px-2.5 py-1 text-xs font-bold {half.key ===
										'before'
											? 'lp-glass text-white'
											: mode.id === 'editmamei'
												? 'bg-accent text-brand-deep'
												: 'bg-[#3b2a24] text-white'}">{half.label}</span
									>
								</div>
							{/each}
						</div>
						<figcaption class="mt-2.5 flex items-start gap-2 text-[15px] font-semibold text-brand">
							<span
								class="mt-1.5 size-2.5 flex-none rounded-full {mode.id === 'editmamei'
									? 'bg-accent'
									: 'bg-[#ff7a5c]'}"
								aria-hidden="true"
							></span>
							{crop.note[mode.id]}
						</figcaption>
					</figure>
				</div>

				<div class="mt-6 grid gap-2 text-[13.5px] leading-relaxed text-neutral-700">
					<p>
						<span class="font-semibold text-brand">Editmamei was asked:</span> “Make this street look
						like golden hour.”
					</p>
					<details class="group">
						<summary class="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
							<span class="font-semibold text-brand">{CHAT} was asked</span> to edit it like a
							retoucher and keep everything the same.
							<span class="font-semibold text-brand underline underline-offset-2 group-open:hidden"
								>Read the full prompt</span
							>
						</summary>
						<p class="mt-2 rounded-xl bg-white/70 p-3 text-[13px] text-neutral-700">
							“{chatPrompt}”
						</p>
					</details>
					<p class="text-[12.5px] text-neutral-500">
						ChatGPT's result is its first try, captured October 22, 2026. Photo: Signature Edits.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
