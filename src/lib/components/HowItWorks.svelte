<script lang="ts">
	// Compressed 2026-08-14. The full actor-lane sequence diagram that used to
	// sit here now lives on /product as EditFlowDiagram — it is a reference
	// asset for someone already sold, and only ~23-31% of home-page visitors
	// ever scrolled far enough to see it. What stays is the shortest honest
	// answer to "how does this work", because the claim is counterintuitive to a
	// cold reader and cannot be dropped entirely.
	// See docs/20260814-home-page-restructure.md.
	import { onMount } from 'svelte';
	import { trackOnce } from '$lib/analytics/clarity';

	const steps = [
		{
			label: 'Step one',
			title: 'Your words',
			detail: '“warm the golden hour, lift the shadows, clean up the horizon”'
		},
		{
			label: 'Step two',
			title: 'The AI plans',
			detail: 'Picks the tools, the order, and the values.'
		},
		{
			label: 'Step three',
			title: 'Editmamei runs it',
			detail: 'Real edits with native Photoshop tools.'
		}
	];

	// Scroll-depth engagement signal: visitor reached How It Works. Fires once
	// via IntersectionObserver.
	let sectionEl: HTMLElement;
	onMount(() => {
		if (typeof IntersectionObserver === 'undefined' || !sectionEl) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					trackOnce('scroll-howitworks-reached');
					obs.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		obs.observe(sectionEl);
		return () => obs.disconnect();
	});
</script>

<section bind:this={sectionEl} id="how-it-works" class="bg-cream py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<header class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				How it works
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Describe it. Photoshop does it.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				For years, getting the look in your head meant nudging sliders and hunting for a tutorial
				that matched your exact shot.
			</p>
		</header>

		<ol class="grid gap-4 md:grid-cols-3">
			{#each steps as step (step.title)}
				<li class="rounded-xl border border-neutral-200 bg-white p-5">
					<p class="mb-2 text-[10px] font-semibold tracking-wider text-terracotta-ink uppercase">
						{step.label}
					</p>
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{step.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-600">{step.detail}</p>
				</li>
			{/each}
		</ol>

		<p class="mt-6 text-sm">
			<a
				href="/product#edit-flow"
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
			>
				See the full round-trip, step by step →
			</a>
		</p>

		<!-- Privacy, folded in as a sub-point rather than run as a cornerstone
		     (brand-voice guide §12). All three rules still apply: every "never
		     sent" claim stays scoped to us, the preview-to-AI hop is stated as a
		     plain fact, and the mechanism is not re-explained a third time. -->
		<div class="mt-10 rounded-2xl border border-neutral-200 bg-paper p-6 md:p-8">
			<h3 class="text-base font-semibold tracking-tight text-neutral-950">
				Your files, your machine.
			</h3>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700">
				Editing happens on your desktop, inside Photoshop. There's no Editmamei cloud your library
				uploads to. When your AI assistant needs to see a result, a downscaled preview goes to it,
				the same as sharing a photo in a chat. Editmamei's own telemetry is content-free, and you
				can audit it or switch it off.
			</p>
		</div>
	</div>
</section>
