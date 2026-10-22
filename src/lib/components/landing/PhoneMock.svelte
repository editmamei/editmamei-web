<script lang="ts">
	import { onMount } from 'svelte';

	// A drawn phone running a real Connect edit as a chat: the countertop photo
	// goes in with the session's request, the listing photo and its Amazon
	// version come back. Decorative.
	let phase = $state(3);
	let el = $state<HTMLElement>();

	onMount(() => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		let timer = 0;
		let running = false;
		const start = () => {
			if (running) return;
			running = true;
			phase = 0;
			timer = window.setInterval(() => {
				phase = phase >= 5 ? 0 : phase + 1;
			}, 1500);
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
</script>

<div bind:this={el} class="device device-right flex w-full justify-center" aria-hidden="true">
	<div
		class="w-[250px] rounded-[42px] bg-[#17191a] p-2.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
	>
		<div class="flex h-[500px] flex-col overflow-hidden rounded-[33px] bg-[#faf8f3] text-brand">
			<div class="flex h-7 items-center justify-center">
				<span class="h-[18px] w-[74px] rounded-[10px] bg-[#17191a]"></span>
			</div>
			<div
				class="flex items-center gap-1.5 border-b border-[#efeadf] px-3.5 pt-1 pb-2 text-[11px] text-neutral-600"
			>
				<span class="size-[7px] rounded-full bg-spark"></span>Your AI app
			</div>
			<div
				class="flex flex-1 flex-col justify-end gap-2 overflow-hidden p-2.5 text-[11px] leading-snug"
			>
				<div
					class="flex max-w-[80%] flex-col gap-1.5 self-end rounded-xl rounded-br-sm border border-prompt-border bg-cream p-1.5"
				>
					<img
						src="/landing/range/pendant-before.webp"
						alt=""
						loading="lazy"
						class="block h-[86px] w-full rounded-md object-cover"
					/>
					<span>Make this an Etsy listing photo.</span>
				</div>
				{#if phase === 1}
					<div class="flex gap-1 self-start rounded-xl bg-white px-3 py-2.5 shadow-sm">
						<span class="size-1.5 animate-bounce rounded-full bg-neutral-400"></span>
						<span
							class="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:120ms]"
						></span>
						<span
							class="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:240ms]"
						></span>
					</div>
				{/if}
				{#if phase >= 2}
					<div class="flex max-w-[86%] flex-col gap-1.5 self-start">
						<span class="text-neutral-700">Here's your listing photo.</span>
						<img
							src="/landing/range/pendant-etsy.webp"
							alt=""
							loading="lazy"
							class="block aspect-square w-[150px] rounded-lg object-cover shadow-sm"
						/>
					</div>
				{/if}
				{#if phase >= 3}
					<div class="flex max-w-[86%] flex-col gap-1.5 self-start">
						<span class="text-neutral-700">And a pure-white version for Amazon.</span>
						<div class="flex gap-1.5">
							<img
								src="/landing/range/pendant-amazon.webp"
								alt=""
								loading="lazy"
								class="block aspect-square w-[72px] rounded-md border border-neutral-200 object-cover"
							/>
							<span class="self-end rounded-full bg-sage px-2.5 py-1 font-semibold">Download</span>
						</div>
					</div>
				{/if}
			</div>
			<div
				class="m-2.5 mt-0 rounded-full border border-[#e3ddcf] bg-white px-3 py-2 text-[10.5px] text-neutral-500"
			>
				Ask anything
			</div>
		</div>
	</div>
</div>

<style>
	.device-right {
		transform: perspective(1800px) rotateY(-7deg);
		transform-origin: left center;
	}
	@supports (animation-timeline: view()) {
		@media (prefers-reduced-motion: no-preference) {
			.device-right {
				animation: twist-right linear both;
				animation-timeline: view();
				animation-range: entry 0% cover 45%;
			}
		}
	}
	@keyframes twist-right {
		from {
			transform: perspective(1800px) rotateY(-20deg) translateY(30px);
		}
		to {
			transform: perspective(1800px) rotateY(-5deg);
		}
	}
</style>
