<script lang="ts">
	import '$lib/components/landing/landing.css';
	import PageHero from '$lib/components/PageHero.svelte';
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { track } from '$lib/analytics/clarity';
	import { PRO_FEATURES } from '$lib/content/pro-features';
	import { toolCounts } from '$lib/content/tools';
	import { desktopApp, faqPage } from '$lib/seo/schema';

	// ──────────────────────────────────────────────────────────────────────
	// PRODUCTION Polar checkout links (org `editmamei`). Checkout shows
	// $9 / $79 / $199 directly, with no code needed.
	// Created via POST /v1/checkout-links/.
	// ──────────────────────────────────────────────────────────────────────
	const CHECKOUT = {
		monthly: 'https://buy.polar.sh/polar_cl_pgvSZTf2YwHmfTkRJl7ubotud3O59hKmEykhn1L3qZh',
		annual: 'https://buy.polar.sh/polar_cl_ci0ZpYCKh1KNht5eS6xnvHYkRV7TcX1LDh13L1HGBZb',
		perpetual: 'https://buy.polar.sh/polar_cl_Q7TCkUeGqGBmO5qfq2qaLMbtCiMXXKJtL9A014TEJw3'
	};

	const freeTools = toolCounts.photoshop - toolCounts.photoshopPro;

	const plans = [
		{
			id: 'community',
			name: 'Community',
			price: 'Free',
			cadence: 'no time limit',
			body: `${freeTools} Photoshop tools and ${toolCounts.gimp} for GIMP. A complete edit of any photo.`,
			cta: 'Install free',
			fine: '',
			href: '/desktop#install',
			dark: false
		},
		{
			id: 'monthly',
			name: 'Pro monthly',
			price: '$9',
			cadence: 'a month',
			body: 'Starts with a 7-day free trial.',
			cta: 'Start free trial',
			fine: 'Card required. Becomes the monthly plan unless you cancel within 7 days.',
			href: CHECKOUT.monthly,
			dark: false
		},
		{
			id: 'annual',
			name: 'Pro annual',
			price: '$79',
			cadence: 'a year',
			body: '$29 a year less than paying monthly.',
			cta: 'Get Pro annual',
			fine: '',
			href: CHECKOUT.annual,
			dark: true
		},
		{
			id: 'perpetual',
			name: 'Pro perpetual',
			price: '$199',
			cadence: 'once',
			body: 'Pay once, with every future update included.',
			cta: 'Get Pro perpetual',
			fine: '',
			href: CHECKOUT.perpetual,
			dark: false
		}
	] as const;

	const billingFaqs = [
		{
			q: 'Does the free trial need a card?',
			a: 'Yes. The 7-day free trial is on the monthly plan, and checkout asks for a card to start it. Unless you cancel during the trial, it turns into the monthly plan automatically.'
		},
		{
			q: 'What does the perpetual license include?',
			a: 'Every future update. You pay once, and the license is not revoked.'
		},
		{
			q: 'What happens if Pro stops validating?',
			a: 'Pro checks its license about once a day. If a subscription lapses, or the check keeps failing for more than seven days, the Pro tools stop and the free Community edition keeps working. Templates you saved stay on your computer and come back when the license is valid again.'
		}
	];
</script>

<Seo
	title="Editmamei Desktop pricing: free, or Pro from $9 a month"
	description="Free in Photoshop and GIMP. Pro adds Camera Raw developing, templates and whole-folder batches: $9 a month (7-day trial), $79 a year or $199 once."
	path="/desktop/pricing"
	image="/og/desktop-pricing.jpg"
	imageAlt="Editmamei Desktop pricing: free, with Pro from $9 a month"
	schema={[desktopApp, faqPage(billingFaqs)]}
/>

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Pricing' }]}
	eyebrow="Desktop pricing"
	title="Free in Photoshop and GIMP. Pro for the whole shoot."
	lede="Community is free, with no time limit. Pro adds Camera Raw developing, templates and whole-folder batches. One license covers two of your computers, works offline between checks, and if a subscription lapses you're back on Community, never locked out of your work."
>
	<a
		href="/desktop#install"
		onclick={() => track('desktop-install-pricing-hero')}
		class="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-accent px-7 text-[17px] font-bold text-brand-deep shadow-[0_10px_40px_-12px_rgba(206,255,140,0.55)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
		>Install free <span aria-hidden="true">→</span></a
	>
</PageHero>

<section class="bg-paper px-4 py-16 md:py-20">
	<div class="mx-auto max-w-6xl">
		<div class="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each plans as p (p.id)}
				<div
					class="flex flex-col rounded-[22px] p-7 {p.dark
						? 'bg-brand text-white'
						: 'bg-white ring-1 ring-brand/10'}"
				>
					<div class="flex items-center justify-between gap-3">
						<h2 class="text-lg font-bold {p.dark ? 'text-accent' : 'text-terracotta-ink'}">
							{p.name}
						</h2>
						{#if p.dark}
							<span class="rounded-full bg-accent px-2.5 py-0.5 text-xs font-bold text-brand-deep"
								>Best value</span
							>
						{/if}
					</div>
					<p class="mt-4 text-4xl font-bold tracking-[-0.03em] {p.dark ? '' : 'text-brand'}">
						{p.price}
					</p>
					<p class="mt-1 text-sm {p.dark ? 'text-white/70' : 'text-neutral-500'}">{p.cadence}</p>
					<p
						class="mt-5 mb-7 text-[16px] leading-relaxed {p.dark
							? 'text-white/85'
							: 'text-neutral-800'}"
					>
						{p.body}
					</p>
					<a
						href={p.href}
						onclick={() => track(`desktop-plan-${p.id}`)}
						class="mt-auto inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-[16px] font-bold transition-transform hover:-translate-y-0.5 motion-reduce:transition-none {p.dark
							? 'bg-accent text-brand-deep'
							: 'bg-brand text-white hover:bg-brand-light'}">{p.cta}</a
					>
					{#if p.fine}
						<p class="mt-2.5 text-center text-xs leading-relaxed text-neutral-500">{p.fine}</p>
					{/if}
				</div>
			{/each}
		</div>
		<p class="mt-6 flex items-start gap-2.5 text-[15px] leading-relaxed text-neutral-700">
			<span aria-hidden="true" class="mt-2 size-2 flex-none rounded-full bg-terracotta"></span>
			<span
				><strong class="font-semibold text-brand">Early-adopter pricing.</strong> A monthly or annual
				subscription keeps the rate it started at for as long as it stays active.</span
			>
		</p>
	</div>
</section>

<EditionsTable />

<section class="bg-paper px-4 py-20 md:py-24" aria-labelledby="when-title">
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[42rem]">
			<p class="lp-eyebrow text-terracotta-ink">Community or Pro</p>
			<h2 id="when-title" class="lp-h2 mt-4 text-brand">When do you need Pro?</h2>
			<p class="mt-6 text-lg leading-relaxed text-neutral-700">
				Community covers a complete edit of one photo: layers, adjustment layers, masks, selections
				including Select Subject and Select Sky, sky replacement, content-aware retouching, filters,
				text and shapes, with previews and histograms to check the result. Pro earns its place when
				you start from raw files or want one look across a whole shoot. Everything it adds is for
				Photoshop; GIMP support is the same in both editions.
			</p>
		</div>
		<ul class="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
			{#each PRO_FEATURES as feature (feature.title)}
				<li class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10">
					<h3 class="text-lg leading-snug font-bold text-brand">{feature.title}</h3>
					<p class="mt-2 text-[15px] leading-relaxed text-neutral-700">{feature.detail}</p>
				</li>
			{/each}
		</ul>
		<p class="mt-8 text-[15px]">
			<a
				href="/desktop/tools?edition=pro"
				class="font-semibold text-brand underline underline-offset-2"
				>See all {toolCounts.photoshopPro} Pro tools <span aria-hidden="true">→</span></a
			>
		</p>
	</div>
</section>

<section id="templates" class="scroll-mt-20 bg-white px-4 py-20 md:py-24">
	<div class="mx-auto max-w-3xl">
		<p class="lp-eyebrow text-terracotta-ink">Templates</p>
		<h2 class="lp-h2 mt-4 text-brand">How templates work.</h2>
		<div class="mt-8 grid gap-5 text-[17px] leading-relaxed text-neutral-700">
			<p>
				A template is a saved look. When an edit comes out the way you want it, ask the AI to save
				it as a template. It writes down what the look is meant to achieve, which choices stay the
				same on every photo, which settings get tuned for each one, and how to tell when the edit is
				done. The template keeps before and after previews of the original edit too.
			</p>
			<p>
				When you apply it to a new photo, the AI looks at that photo first and works out each value
				for it, because the numbers in the template came from a different picture. It skips steps
				the new photo doesn't need, then checks the result against the template's description of
				done.
			</p>
			<p>
				A template can also carry checks Editmamei can measure, such as the subject staying brighter
				than the background or the highlights not clipping. After an edit, Editmamei measures it
				against them and says what to fix wherever it falls short.
			</p>
			<p>
				For a whole shoot, templates and folder batch do different jobs. The template carries the
				look, applied photo by photo so each image gets its own values. Folder batch handles the
				mechanical steps (crop, resize, rotate and export) across the folder in one Photoshop pass.
				Templates are saved as files on your computer.
			</p>
		</div>
	</div>
</section>

<section id="billing" class="scroll-mt-20 bg-paper px-4 py-20 md:py-24">
	<div class="mx-auto max-w-3xl">
		<p class="lp-eyebrow text-terracotta-ink">Billing</p>
		<h2 class="lp-h2 mt-4 text-brand">Billing questions.</h2>
		<dl class="mt-8 divide-y divide-[#ddd6c4] border-y border-[#ddd6c4]">
			{#each billingFaqs as { q, a } (q)}
				<div class="py-6">
					<dt class="text-lg font-bold text-brand">{q}</dt>
					<dd class="mt-2.5 text-[16px] leading-relaxed text-neutral-700">{a}</dd>
				</div>
			{/each}
		</dl>
		<p class="mt-6 text-[15px] text-neutral-700">
			Already have a key? Activating it is on
			<a href="/desktop/activate" class="font-semibold text-brand underline underline-offset-2"
				>Activate Pro</a
			>.
		</p>
	</div>
</section>

<section class="bg-paper px-4 pb-24">
	<div
		class="lp-stage lp-grain mx-auto max-w-6xl overflow-hidden rounded-[28px] px-6 py-16 text-center md:py-20"
	>
		<div
			class="pointer-events-none absolute inset-0 -z-[1]"
			style="background: radial-gradient(45% 70% at 50% 120%, rgba(206,255,140,0.22), transparent 70%);"
			aria-hidden="true"
		></div>
		<h2 class="lp-h2 text-[#f7f4ec]">Not sure yet? Start free.</h2>
		<p class="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-[#c3d2cb]">
			Install it for Claude Desktop in one click, or with npm for other AI apps. Add Pro whenever
			you're ready, with nothing to reinstall.
		</p>
		<a
			href="/desktop#install"
			onclick={() => track('desktop-install-pricing-footer')}
			class="mt-8 inline-flex min-h-13 items-center gap-2 rounded-2xl bg-accent px-7 text-[17px] font-bold text-brand-deep transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
			>Install free <span aria-hidden="true">→</span></a
		>
	</div>
</section>
