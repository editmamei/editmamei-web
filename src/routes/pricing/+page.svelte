<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { track } from '$lib/analytics/clarity';
	import { CONNECT_URL } from '$lib/links';

	// Both products' prices on one screen, each card handing off to its own
	// pricing page. Facts match /desktop/pricing and /connect/pricing; a Connect
	// credit is never defined in public copy.
</script>

<Seo
	title="Pricing: Editmamei Desktop and Editmamei Connect · Editmamei"
	description="Editmamei Desktop is free, with Pro from $9 a month. Editmamei Connect starts with 150 free credits plus up to 50 a month, then packs from $7. Compare both and pick where you edit."
	path="/pricing"
/>

<PageHero
	eyebrow="Pricing"
	title="Two products. Both free to start."
	lede="Desktop is free on your own computer, with Pro when one photo turns into a whole shoot. Connect starts you with free credits, and after that you pay as you go."
/>

<section class="bg-paper px-4 py-16 md:py-20">
	<div class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-2">
		<div class="flex flex-col rounded-[26px] bg-white p-7 ring-1 ring-brand/10 md:p-9">
			<p class="text-[15px] font-semibold text-terracotta-ink">Editmamei Desktop</p>
			<p class="mt-1 text-sm text-neutral-600">In Photoshop or GIMP, on your computer</p>
			<p class="mt-6 text-5xl font-bold tracking-[-0.03em] text-brand">Free</p>
			<p class="mt-4 text-[16px] leading-relaxed text-neutral-800">
				Pro adds raw develop, templates, whole-folder batches and precise placement for $9 a month,
				$79 a year, or $199 once. The monthly plan has a 7-day free trial.
			</p>
			<div class="mt-auto flex flex-wrap items-center gap-4 pt-8">
				<a
					href="/desktop/pricing"
					onclick={() => track('pricing-desktop')}
					class="inline-flex min-h-12 items-center rounded-2xl bg-accent px-6 text-[16px] font-bold text-brand-deep transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
					>See Desktop pricing <span aria-hidden="true" class="ml-1.5">→</span></a
				>
				<a
					href="/desktop#install"
					class="text-[15px] font-semibold text-brand underline underline-offset-4">Install free</a
				>
			</div>
		</div>

		<div class="flex flex-col rounded-[26px] bg-brand p-7 text-white md:p-9">
			<p class="text-[15px] font-semibold text-accent">Editmamei Connect</p>
			<p class="mt-1 text-sm text-white/70">From any device, with nothing to install</p>
			<p class="mt-6 text-5xl font-bold tracking-[-0.03em]">150 free credits</p>
			<p class="mt-4 text-[16px] leading-relaxed text-white/85">
				Plus up to 50 more each month. After that, credit packs start at $7, and monthly plans at
				$10.
			</p>
			<div class="mt-auto flex flex-wrap items-center gap-4 pt-8">
				<a
					href="/connect/pricing"
					onclick={() => track('pricing-connect')}
					class="inline-flex min-h-12 items-center rounded-2xl border-[1.5px] border-accent/50 bg-brand-light px-6 text-[16px] font-bold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
					>See Connect pricing <span aria-hidden="true" class="ml-1.5">→</span></a
				>
				<a
					href={CONNECT_URL}
					class="text-[15px] font-semibold text-accent underline underline-offset-4">Start free</a
				>
			</div>
		</div>
	</div>

	<div class="mx-auto mt-10 max-w-6xl">
		<p class="max-w-[46em] text-[15px] leading-relaxed text-neutral-700">
			<span class="font-semibold text-brand">Your AI app's plan is separate.</span> Editmamei has no
			AI of its own, so on either product your AI app's usage counts against your plan with it, as
			usual. Not sure which product fits?
			<a href="/faq" class="font-semibold text-brand underline underline-offset-2"
				>The FAQ compares them</a
			>.
		</p>
	</div>
</section>
