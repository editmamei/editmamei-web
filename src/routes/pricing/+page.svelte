<script lang="ts">
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { PRO_FEATURES } from '$lib/content/pro-features';
	import { toolCounts } from '$lib/content/tools';

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

	const plans = [
		{
			id: 'monthly',
			name: 'Monthly',
			price: '$9',
			cadence: '/month',
			note: '7-day free trial.',
			cta: 'Start free trial',
			href: CHECKOUT.monthly,
			featured: false
		},
		{
			id: 'annual',
			name: 'Annual',
			price: '$79',
			cadence: '/year',
			note: '$29 a year less than paying monthly.',
			cta: 'Get Pro',
			href: CHECKOUT.annual,
			featured: true
		},
		{
			id: 'perpetual',
			name: 'Perpetual',
			price: '$199',
			cadence: 'one-time',
			note: 'Pay once, with every future update included.',
			cta: 'Get Pro',
			href: CHECKOUT.perpetual,
			featured: false
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
	] as const;
</script>

<Seo
	title="Pricing: free Community edition and Pro plans · Editmamei"
	description="Editmamei Community is free. Pro is $9/month, $79/year or $199 one-time, with a 7-day trial on monthly, and adds raw develop, folder batch, templates and precise placement to the Photoshop MCP server."
	path="/pricing"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-5xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Plans</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Free Community. One Pro tier for production work.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Editmamei Community is free, forever. Pro adds the production toolkit, with monthly, annual,
			or a one-time perpetual license. One license covers two of your devices, and Pro works offline
			between check-ins. If a subscription lapses, Editmamei keeps running as Community, so it never
			locks you out of your work.
		</p>
	</div>
</section>

<!-- Early-adopter launch offer -->
<section class="bg-white">
	<div class="mx-auto max-w-5xl px-4">
		<div
			class="rounded-xl border border-terracotta/30 bg-terracotta/10 px-5 py-4 text-sm text-terracotta-ink"
		>
			<span class="font-semibold">Early-adopter pricing.</span> A monthly or annual subscription keeps
			the rate it started at for as long as it stays active.
		</div>
	</div>
</section>

<!-- Pro plan cards -->
<section class="bg-white pt-8 pb-12 md:pt-10 md:pb-16">
	<div class="mx-auto max-w-5xl px-4">
		<div class="grid gap-6 md:grid-cols-3">
			{#each plans as plan (plan.id)}
				<div
					class="flex flex-col rounded-2xl border bg-paper p-6 shadow-sm {plan.featured
						? 'border-brand ring-1 ring-brand'
						: 'border-neutral-200'}"
				>
					<div class="flex items-center justify-between">
						<h2 class="text-lg font-semibold tracking-tight text-neutral-950">{plan.name}</h2>
						{#if plan.featured}
							<span class="rounded-full bg-brand px-2.5 py-0.5 text-xs font-semibold text-white"
								>Best value</span
							>
						{/if}
					</div>
					<div class="mt-4 flex items-baseline gap-2">
						<span class="text-4xl font-bold tracking-tight text-neutral-950">{plan.price}</span>
						<span class="text-sm font-medium text-neutral-500">{plan.cadence}</span>
					</div>
					<p class="mt-2 min-h-10 text-sm leading-relaxed text-neutral-600">{plan.note}</p>
					<a
						href={plan.href}
						class="mt-6 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold shadow-sm transition-colors {plan.featured
							? 'bg-brand text-white hover:bg-brand-light'
							: 'bg-neutral-900 text-white hover:bg-neutral-700'}"
					>
						{plan.cta}
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<EditionsTable />

<section class="bg-cream py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
			Community vs Pro
		</p>
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			When do you need Pro?
		</h2>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Community covers a complete edit: documents, layers, adjustment layers and filters, masks,
			selections (including Photoshop's Select Subject and Select Sky), sky replacement,
			content-aware retouch, straightening and layer transforms, shape layers and pen paths, scene
			awareness that runs on your computer, history, and visual checks with previews and histograms.
			It can also run several steps in one call and roll them back if one fails. For most one-off
			photo edits, that is the full kit.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Pro is for detailed or repeatable work. It adds:
		</p>

		<ul class="mt-6 space-y-5">
			{#each PRO_FEATURES as feature (feature.title)}
				<li class="rounded-xl border border-neutral-200 bg-paper p-5">
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{feature.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{feature.detail}</p>
				</li>
			{/each}
		</ul>
		<p class="mt-4 text-sm">
			<a
				href="/tools?edition=pro"
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
			>
				See all {toolCounts.photoshopPro} Pro tools <span aria-hidden="true">→</span>
			</a>
		</p>

		<p class="mt-6 text-base leading-relaxed text-neutral-700">
			Rule of thumb: Community covers a complete edit of one photo. Pro earns its place when you
			start from raw files or want the same look across a whole shoot.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Everything Pro adds is for Photoshop. If you edit in GIMP, Community already includes all of
			Editmamei's GIMP support.
		</p>
	</div>
</section>

<section id="templates" class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Templates</p>
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			How templates work
		</h2>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			A template is a saved look. When an edit comes out the way you want it, ask the AI to save it
			as a template. It writes down what the look is meant to achieve, which choices stay the same
			on every photo, which settings get tuned for each one, and how to tell when the edit is done.
			The template keeps before and after previews of the original edit too.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			When you apply it to a new photo, the AI looks at that photo first and works out each value
			for it, because the numbers in the template came from a different picture. It skips steps the
			new photo doesn't need, then checks the result against the template's description of done.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			A template can also carry checks Editmamei can measure, such as the subject staying brighter
			than the background or the highlights not clipping. After an edit, Editmamei measures it
			against them and says what to fix wherever it falls short.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			For a whole shoot, templates and folder batch do different jobs. The template carries the
			look, applied photo by photo so each image gets its own values. Folder batch handles the
			mechanical steps (crop, resize, rotate and export) across the folder in one Photoshop pass.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Templates are saved as files on your computer. Saving, applying and checking them are all part
			of Pro.
		</p>
	</div>
</section>

<section id="billing" class="border-t border-neutral-200 bg-white py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Billing</p>
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			Billing questions
		</h2>
		<dl class="mt-8 space-y-8">
			{#each billingFaqs as { q, a } (q)}
				<div>
					<dt class="text-base font-semibold text-neutral-950">{q}</dt>
					<dd class="mt-2 text-sm leading-relaxed text-neutral-700">{a}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<section class="bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4 text-center">
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			Not sure yet? Start with Community. It's free.
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-700">
			Install it for Claude Desktop in one click, or with npm for other AI clients. Upgrade to Pro
			whenever you're ready, with nothing to reinstall.
		</p>
		<div class="mt-8">
			<a
				href="/#install"
				class="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				Get Community free
			</a>
		</div>
	</div>
</section>
