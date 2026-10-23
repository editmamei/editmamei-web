<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics/clarity';
	import { inView } from '$lib/actions/reveal';
	import { mediaUrl } from '$lib/media';

	// The loop is the ch3 take of "Prompting Photoshop": one real Claude Desktop
	// session replacing a sky in Photoshop, sped up. Frames where Photoshop showed
	// a zoomed-in check or a mask are left out, so the montage doesn't flicker.
	let video = $state<HTMLVideoElement>();
	let playing = $state(false);
	let reduced = $state(false);
	let userPaused = $state(false);

	onMount(() => {
		reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	function setVisible(v: boolean) {
		if (!video || reduced || userPaused) return;
		if (v) video.play().catch(() => {});
		else video.pause();
	}

	function toggle() {
		if (!video) return;
		if (video.paused) {
			userPaused = false;
			video.play().catch(() => {});
		} else {
			userPaused = true;
			video.pause();
		}
	}
</script>

<section class="lp-stage lp-grain overflow-hidden" aria-labelledby="desktop-title">
	<div
		class="pointer-events-none absolute inset-0 -z-[1]"
		style="background: radial-gradient(50% 45% at 50% 78%, rgba(206,255,140,0.12), transparent 70%), radial-gradient(40% 40% at 80% 30%, rgba(255,128,64,0.10), transparent 70%);"
		aria-hidden="true"
	></div>

	<div class="mx-auto max-w-6xl px-4 pt-12 pb-14 md:pt-20 md:pb-20">
		<div class="mx-auto max-w-[46rem] text-center">
			<p class="lp-eyebrow text-accent">Editmamei Desktop</p>
			<h1
				id="desktop-title"
				class="mt-4 text-[clamp(2.6rem,5.6vw,4.8rem)] leading-[0.98] font-bold tracking-[-0.04em] text-[#f7f4ec]"
			>
				Your AI, working in your Photoshop<span class="text-accent">.</span>
			</h1>
			<p
				class="mx-auto mt-5 max-w-[34em] text-lg leading-relaxed text-[#c3d2cb] md:mt-6 md:text-xl"
			>
				Tell your AI what you want. It makes the edit in Photoshop on your computer, in layers and
				masks you can keep working on, and checks the result before it hands it back.
			</p>
			<div class="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row md:mt-10">
				<a
					href="#install"
					onclick={() => track('desktop-install-hero')}
					class="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-accent px-7 text-[17px] font-bold text-brand-deep shadow-[0_10px_40px_-12px_rgba(206,255,140,0.55)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
					>Install free <span aria-hidden="true">↓</span></a
				>
				<a
					href="#how"
					onclick={() => track('desktop-how-hero')}
					class="text-[15px] font-semibold text-[#dfe8e3] underline decoration-white/30 underline-offset-4 hover:decoration-white/70"
					>See how it works</a
				>
			</div>
			<p class="mt-5 text-[14px] text-[#a9bcb4]">
				Photoshop 2026 or GIMP 3.2 · Windows, macOS, and Linux with GIMP · Claude Desktop, Claude
				Code, Cursor and more
			</p>
		</div>

		<figure class="relative m-0 mt-12 md:mt-16" use:inView={setVisible}>
			<div
				class="rounded-[22px] bg-[#17191a] p-2 shadow-[0_50px_120px_-40px_rgba(0,0,0,0.9)] ring-1 ring-white/10 md:p-2.5"
			>
				<div class="relative aspect-[1280/718] overflow-hidden rounded-[14px] bg-black">
					<video
						bind:this={video}
						class="absolute inset-0 h-full w-full object-cover"
						poster="/desktop/hero-poster.webp"
						muted
						loop
						playsinline
						preload="metadata"
						aria-label="A real session: the AI app on the left, Photoshop on the right, replacing the sky over a waterfall"
						onplay={() => (playing = true)}
						onpause={() => (playing = false)}
					>
						<source
							src={mediaUrl('desktop/desktop-hero-960.mp4')}
							type="video/mp4"
							media="(max-width: 767px)"
						/>
						<source src={mediaUrl('desktop/desktop-hero-1280.mp4')} type="video/mp4" />
					</video>
					<button
						type="button"
						onclick={toggle}
						class="lp-glass absolute right-3 bottom-3 inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 text-[13px] font-semibold text-white"
						aria-label={playing ? 'Pause the session' : 'Play the session'}
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
							>Pause
						{:else}
							<svg aria-hidden="true" class="size-4" viewBox="0 0 24 24" fill="currentColor"
								><path d="M7 5l12 7-12 7z" /></svg
							>Play
						{/if}
					</button>
				</div>
			</div>
			<figcaption class="mt-4 text-center text-[13px] leading-relaxed text-[#8fa59c]">
				A real session in Claude Desktop and Photoshop: about 8 minutes of work, sped up. Frames
				where Photoshop zoomed in to check the horizon are left out.
			</figcaption>
		</figure>
	</div>

	<p class="mx-auto max-w-6xl px-4 pb-8 text-[12.5px] leading-normal text-[#8fa59c]">
		Editmamei Desktop is an MCP server: it lets AI apps such as Claude Desktop, Claude Code and
		Cursor edit photos in Adobe Photoshop or GIMP on your computer. Free, with Pro for whole shoots.
	</p>
</section>
