<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics/clarity';
	import { inView } from '$lib/actions/reveal';

	let { startHref }: { startHref: string } = $props();

	// A real Connect session (2026-10-15): the owner's own request, verbatim,
	// and the session's steps in order with the photo as of each one (its share
	// page's frames). The phone is drawn, not a copy of any app.
	const request =
		'Edit the uploaded photo with a selective color method, making the flowers pop on the lava field.';
	const steps = [
		{ label: 'Framed to 4:5', frame: 0 },
		{ label: 'Mono yellows', frame: 1 },
		{ label: 'Mono greens', frame: 2 },
		{ label: 'Mono cyans', frame: 3 },
		{ label: 'Mono blues', frame: 4 },
		{ label: 'Mono magentas', frame: 5 },
		{ label: 'Lehua red, boosted', frame: 6 },
		{ label: 'Mono punch', frame: 7 },
		{ label: 'Selected the sky with AI', frame: 7 },
		{ label: 'Darkened the sky, like a film filter', frame: 8 }
	];
	const frames = Array.from({ length: 10 }, (_, i) => `/connect/lehua/${i}.webp`);
	const LAST = steps.length + 2; // 0 request, 1 thinking, 2.. steps, then done
	const HOLD = 4;

	// Plays twice, then rests on the finished photo; the button pauses or
	// replays it (WCAG 2.2.2: moving content can be paused).
	const CYCLES = 2;
	let phase = $state(LAST);
	let playing = $state(false);
	let cycles = 0;
	let userPaused = false;
	let timer = 0;

	const step = $derived(phase >= 2 && phase < 2 + steps.length ? steps[phase - 2] : null);
	const frame = $derived(phase >= LAST ? 9 : step ? step.frame : 0);
	const done = $derived(phase >= LAST);

	// Warm the session's frames only after the page has loaded, so they don't
	// compete with the first paint on a slow connection.
	onMount(() => {
		let warm = 0;
		const preload = () => {
			warm = window.setTimeout(() => {
				for (const f of frames) new Image().src = f;
			}, 300);
		};
		if (document.readyState === 'complete') preload();
		else window.addEventListener('load', preload, { once: true });
		return () => {
			clearInterval(timer);
			clearTimeout(warm);
			window.removeEventListener('load', preload);
		};
	});

	function play(from: number) {
		clearInterval(timer);
		playing = true;
		phase = from;
		timer = window.setInterval(() => {
			if (phase < LAST + HOLD) {
				phase += 1;
				return;
			}
			cycles += 1;
			if (cycles >= CYCLES) {
				stop();
				phase = LAST;
			} else {
				phase = 0;
			}
		}, 950);
	}
	function stop() {
		playing = false;
		clearInterval(timer);
	}

	function setVisible(v: boolean) {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches || userPaused) return;
		if (v && !playing && cycles < CYCLES) play(phase >= LAST ? 0 : phase);
		else if (!v && playing) stop();
	}

	function toggle() {
		if (playing) {
			userPaused = true;
			stop();
		} else {
			userPaused = false;
			cycles = 0;
			play(phase >= LAST ? 0 : phase);
		}
	}
</script>

<section class="lp-stage lp-grain overflow-hidden" aria-labelledby="connect-title">
	<div
		class="pointer-events-none absolute inset-0 -z-[1]"
		style="background: radial-gradient(40% 50% at 72% 45%, rgba(255,70,70,0.16), transparent 70%), radial-gradient(45% 45% at 20% 90%, rgba(206,255,140,0.10), transparent 70%);"
		aria-hidden="true"
	></div>

	<div
		class="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-16 md:pt-20 md:pb-20 lg:grid-cols-[minmax(0,13fr)_minmax(0,9fr)] lg:gap-16"
	>
		<div>
			<p class="lp-eyebrow text-accent">Editmamei Connect</p>
			<h1
				id="connect-title"
				class="mt-4 text-[clamp(2.6rem,5.4vw,4.6rem)] leading-[0.98] font-bold tracking-[-0.04em] text-[#f7f4ec]"
			>
				Send a photo. Get it back edited<span class="text-accent">.</span>
			</h1>
			<p class="mt-5 max-w-[32em] text-lg leading-relaxed text-[#c3d2cb] md:mt-6 md:text-xl">
				Add Connect to your AI app once. Then send a photo from your phone and say what you want.
				It's edited on our server with real editing tools, not redrawn. Nothing to install.
			</p>
			<div class="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center md:mt-10">
				<a
					href={startHref}
					onclick={() => track('connect-start-hero')}
					class="inline-flex min-h-13 items-center gap-2 rounded-2xl border-[1.5px] border-accent/50 bg-brand px-7 text-[17px] font-bold text-white shadow-[0_10px_40px_-14px_rgba(206,255,140,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-brand-light motion-reduce:transition-none"
					>Start free <span aria-hidden="true">→</span></a
				>
				<a
					href="#how"
					onclick={() => track('connect-how-hero')}
					class="text-[15px] font-semibold text-[#dfe8e3] underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
					>See how it works</a
				>
			</div>
			<p class="mt-5 max-w-[34em] text-[14px] leading-relaxed text-[#a9bcb4]">
				150 free credits to start, plus up to 50 more each month. Works in Claude, ChatGPT and other
				AI apps that add connectors.
			</p>
		</div>

		<figure class="m-0" use:inView={setVisible}>
			<div class="mx-auto w-[300px] max-w-full" aria-hidden="true">
				<div
					class="rounded-[46px] bg-[#17191a] p-2.5 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/15"
				>
					<div
						class="flex h-[600px] flex-col overflow-hidden rounded-[37px] bg-[#faf8f3] text-brand"
					>
						<div class="flex h-7 items-center justify-center">
							<span class="h-[18px] w-[80px] rounded-[10px] bg-[#17191a]"></span>
						</div>
						<div
							class="flex items-center gap-1.5 border-b border-[#efeadf] px-4 pt-1 pb-2 text-[11px] text-neutral-600"
						>
							<span class="size-[7px] rounded-full bg-spark"></span>Your AI app · Connect
						</div>
						<div class="flex flex-1 flex-col justify-end gap-2.5 overflow-hidden p-3 text-[11.5px]">
							<div
								class="flex max-w-[86%] items-start gap-2 self-end rounded-2xl rounded-br-sm border border-prompt-border bg-cream p-2 leading-snug"
							>
								<img
									src={frames[0]}
									alt=""
									class="h-[52px] w-[42px] flex-none rounded-md object-cover"
								/>
								<span>{request}</span>
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
								<div class="flex flex-col gap-2 self-start">
									<div class="relative w-[212px] overflow-hidden rounded-xl shadow-sm">
										{#key frame}
											<img
												src={frames[frame]}
												alt=""
												class="lehua-in block aspect-[4/5] w-full object-cover"
											/>
										{/key}
									</div>
									<div
										class="flex min-h-7 items-center gap-1.5 self-start rounded-full px-2.5 py-1 text-[11px] font-semibold {done
											? 'bg-sage text-brand'
											: 'bg-white text-neutral-700 shadow-sm'}"
									>
										{#if done}
											Download link ready · lasts 24 hours
										{:else if step}
											<span class="size-1.5 rounded-full bg-[#ff8a5c]"></span>{step.label}
										{/if}
									</div>
								</div>
							{/if}
						</div>
						<div
							class="m-3 mt-0 rounded-full border border-[#e3ddcf] bg-white px-3 py-2 text-[11px] text-neutral-500"
						>
							Reply
						</div>
					</div>
				</div>
			</div>
			<div class="mt-4 flex justify-center">
				<button
					type="button"
					onclick={toggle}
					class="lp-glass inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-white"
				>
					{#if playing}
						<svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="currentColor"
							><rect x="6" y="5" width="4" height="14" rx="1" /><rect
								x="14"
								y="5"
								width="4"
								height="14"
								rx="1"
							/></svg
						>Pause the session
					{:else}
						<svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="currentColor"
							><path d="M7 5l12 7-12 7z" /></svg
						>Play the session
					{/if}
				</button>
			</div>
			<figcaption class="mt-3 text-center text-[12.5px] leading-relaxed text-[#8fa59c]">
				A real Connect session: the request is the one that was sent, and each step is the session's
				own.
			</figcaption>
		</figure>
	</div>

	<p class="mx-auto max-w-6xl px-4 pb-8 text-[12.5px] leading-normal text-[#8fa59c]">
		Editmamei Connect is a hosted MCP server: a connector your AI app signs in to, so it can edit
		photos with professional tools.
	</p>
</section>

<style>
	.lehua-in {
		animation: lehua-in 500ms ease-out both;
	}
	@keyframes lehua-in {
		from {
			opacity: 0.2;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.lehua-in {
			animation: none;
		}
	}
</style>
