<script lang="ts">
	import { onMount } from 'svelte';

	// A drawn laptop replaying the hero's real session: the frame as of each
	// layer, and the layer names lighting up as they land. Decorative.
	const names = [
		'Develop',
		'Sky color',
		'Sun glow',
		'Light rays',
		'Sun reflection',
		'Dusk grade',
		'Vignette',
		'Detail'
	];
	const frames = Array.from({ length: 9 }, (_, i) => `/landing/sunset/sm-${i}.webp`);

	let step = $state(8);
	let el = $state<HTMLElement>();

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let timer = 0;
		let running = false;
		const start = () => {
			if (running) return;
			running = true;
			step = 0;
			timer = window.setInterval(() => {
				step = step >= 11 ? 0 : step + 1;
			}, 900);
		};
		const stop = () => {
			running = false;
			clearInterval(timer);
		};
		const io = new IntersectionObserver((es) => (es[0]?.isIntersecting ? start() : stop()));
		if (el) io.observe(el);
		return () => {
			io.disconnect();
			stop();
		};
	});

	const shown = $derived(Math.min(8, step));
</script>

<div bind:this={el} class="device device-left w-full max-w-[600px]" aria-hidden="true">
	<div
		class="rounded-t-2xl rounded-b-md bg-[#17191a] p-3 pb-3.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10"
	>
		<div class="relative flex aspect-[16/10] overflow-hidden rounded-md bg-[#232526]">
			<div class="relative flex min-w-0 flex-1 items-center justify-center bg-[#2f3132] p-3">
				<div class="relative aspect-[3/2] w-full overflow-hidden rounded-sm">
					{#each frames as f, i (f)}
						<img
							src={f}
							alt=""
							loading="lazy"
							class="absolute inset-0 h-full w-full object-cover transition-[clip-path] duration-700 ease-out motion-reduce:transition-none"
							style="clip-path: inset(0 {i <= shown ? 0 : 100}% 0 0);"
						/>
					{/each}
				</div>
			</div>
			<div
				class="flex w-[30%] flex-none flex-col-reverse justify-end gap-[3px] border-l border-white/10 bg-[#1f2122] px-2 py-2.5 text-[9.5px] text-[#d5d8d6]"
			>
				<div class="rounded-[3px] bg-white/5 px-1.5 py-[3px] text-[#8d9491]">Background</div>
				{#each names as name, i (name)}
					<div
						class="rounded-[3px] px-1.5 py-[3px] transition-all duration-500 {i < shown
							? 'bg-white/10 opacity-100'
							: 'opacity-0'} {i === shown - 1 && step <= 8 ? 'bg-[#4b5a3a] text-white' : ''}"
					>
						{name}
					</div>
				{/each}
				<div class="mb-1 text-[8.5px] tracking-widest text-[#8d9491] uppercase">Layers</div>
			</div>
			<div
				class="absolute bottom-3 left-3 flex w-[50%] flex-col gap-1.5 rounded-lg bg-[#faf8f3]/95 p-2 text-[10.5px] leading-snug text-brand shadow-xl"
			>
				<div class="self-end rounded-md bg-[#f0e2d6] px-2 py-1">
					This sunset came out way too dark. Bring the lake back and make the sky glow.
				</div>
				<div class="flex items-center gap-1.5 self-start text-neutral-600">
					<span class="size-1.5 rounded-full bg-spark"></span>{shown < 8
						? `Adding ${names[shown]}…`
						: '8 layers, all editable.'}
				</div>
			</div>
		</div>
	</div>
	<div class="-mx-7 h-3.5 rounded-b-2xl bg-gradient-to-b from-[#3a3d3e] to-[#222425]"></div>
</div>

<style>
	.device-left {
		transform: perspective(1800px) rotateY(7deg);
		transform-origin: right center;
	}
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.device-left {
				animation: twist-left linear both;
				animation-timeline: view();
				animation-range: entry 0% cover 45%;
			}
		}
	}
	@keyframes twist-left {
		from {
			transform: perspective(1800px) rotateY(20deg) translateY(30px);
		}
		to {
			transform: perspective(1800px) rotateY(5deg);
		}
	}
</style>
