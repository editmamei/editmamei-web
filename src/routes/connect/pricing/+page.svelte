<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { track } from '$lib/analytics/clarity';
	import { CONNECT_URL } from '$lib/links';
	import { connectApp, faqPage } from '$lib/seo/schema';

	// Connect's prices, from its billing configuration (POLAR_PRODUCTS) and the
	// 10-22 product facts. A credit is never defined in public copy (owner rule):
	// what a credit buys can change as the tools and hosting change.
	const plans = [
		{
			name: 'Free credits',
			price: '150 credits',
			cadence: 'when you sign up',
			body: 'Plus a top-up of up to 50 more credits each month.',
			dark: false
		},
		{
			name: 'Credit packs',
			price: 'From $7',
			cadence: 'pay once',
			body: '750 credits for $7, or 2,000 for $15. Pack credits never expire.',
			dark: false
		},
		{
			name: 'Monthly plans',
			price: 'From $10',
			cadence: 'a month',
			body: '1,500 credits a month for $10, or 7,500 for $35. Unused monthly credits expire when the plan renews.',
			dark: true
		}
	];

	const faqs = [
		{
			q: 'Do I need a card to start?',
			a: 'No. Sign up with your email and the 150 free credits are there when you confirm it.'
		},
		{
			q: 'Is my AI app’s plan separate?',
			a: 'Yes. Your AI app’s own usage counts against your plan with it, as usual, separately from Connect’s credits.'
		},
		{
			q: 'Where do I buy more?',
			a: 'In your Connect account at connect.editmamei.com, where you can also see your balance.'
		}
	];
</script>

<Seo
	title="Editmamei Connect pricing: 150 free credits, packs from $7"
	description="Editmamei Connect starts with 150 free credits and up to 50 more each month. Credit packs from $7 never expire; monthly plans start at $10."
	path="/connect/pricing"
	image="/og/connect-pricing.jpg"
	imageAlt="Editmamei Connect pricing: 150 free credits, then packs from $7"
	schema={[connectApp, faqPage(faqs)]}
/>

<PageHero
	crumbs={[{ label: 'Editmamei Connect', href: '/connect' }, { label: 'Pricing' }]}
	eyebrow="Connect pricing"
	title="Connect is free to start. Pay as you go after that."
	lede="Every account starts with free credits and a monthly top-up. When you want more, buy a pack or a monthly plan in your Connect account."
>
	<a
		href={CONNECT_URL}
		onclick={() => track('connect-start-pricing')}
		class="inline-flex min-h-13 items-center gap-2 rounded-2xl border-[1.5px] border-accent/50 bg-brand px-7 text-[17px] font-bold text-white shadow-[0_10px_40px_-14px_rgba(206,255,140,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-brand-light motion-reduce:transition-none"
		>Start free <span aria-hidden="true">→</span></a
	>
</PageHero>

<section class="bg-paper px-4 py-16 md:py-20">
	<div class="mx-auto max-w-6xl">
		<div class="grid gap-5 lg:grid-cols-3">
			{#each plans as p (p.name)}
				<div
					class="flex flex-col rounded-[22px] p-7 {p.dark
						? 'bg-brand text-white'
						: 'bg-white ring-1 ring-brand/10'}"
				>
					<h2 class="text-lg font-bold {p.dark ? 'text-accent' : 'text-terracotta-ink'}">
						{p.name}
					</h2>
					<p class="mt-4 text-4xl font-bold tracking-[-0.03em] {p.dark ? '' : 'text-brand'}">
						{p.price}
					</p>
					<p class="mt-1 text-sm {p.dark ? 'text-white/70' : 'text-neutral-500'}">{p.cadence}</p>
					<p
						class="mt-5 text-[16px] leading-relaxed {p.dark ? 'text-white/85' : 'text-neutral-800'}"
					>
						{p.body}
					</p>
				</div>
			{/each}
		</div>

		<dl class="mt-14 grid gap-8 md:grid-cols-3">
			{#each faqs as f (f.q)}
				<div>
					<dt class="text-[16px] font-semibold text-brand">{f.q}</dt>
					<dd class="mt-2 text-[15px] leading-relaxed text-neutral-700">{f.a}</dd>
				</div>
			{/each}
		</dl>

		<a
			href="/desktop/pricing"
			class="group mt-14 flex items-center justify-between gap-4 rounded-[22px] bg-white p-6 ring-1 ring-brand/10 transition-shadow hover:shadow-lg"
		>
			<span>
				<span class="block text-lg font-bold text-brand">Editing on your own computer?</span>
				<span class="mt-1 block text-[15px] text-neutral-700"
					>Editmamei Desktop is free in Photoshop or GIMP, with Pro from $9 a month.</span
				>
			</span>
			<span
				aria-hidden="true"
				class="text-xl text-brand transition-transform group-hover:translate-x-1">→</span
			>
		</a>
	</div>
</section>
