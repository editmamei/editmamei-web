<script lang="ts">
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import Seo from '$lib/components/Seo.svelte';

	// ──────────────────────────────────────────────────────────────────────
	// PRODUCTION Polar checkout links (org `editmamei`). Each link has the
	// early-adopter discount pre-applied — checkout shows $9 / $79 / $199
	// directly, no code needed. Regular list prices: $12 / $99 / $299.
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
			list: '$12',
			cadence: '/month',
			note: 'Early-adopter rate, locked in for the life of your subscription.',
			href: CHECKOUT.monthly,
			featured: false
		},
		{
			id: 'annual',
			name: 'Annual',
			price: '$79',
			list: '$99',
			cadence: '/year',
			note: 'Best value — early-adopter rate, locked in for life.',
			href: CHECKOUT.annual,
			featured: true
		},
		{
			id: 'perpetual',
			name: 'Perpetual',
			price: '$199',
			list: '$299',
			cadence: 'one-time',
			note: 'Pay once. Yours forever — early-adopter price.',
			href: CHECKOUT.perpetual,
			featured: false
		}
	] as const;
</script>

<Seo
	title="Pricing — Editmamei"
	description="Editmamei pricing: Community is free for everyday photo editing. Pro is $12/mo, $99/yr, or $299 once — the production toolkit for repeatable, professional work."
	path="/pricing"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-5xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Pricing</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Free Community. One Pro tier for production work.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Editmamei Community is free, forever. Pro adds the production toolkit — pick monthly, annual,
			or a one-time perpetual licence. One licence covers two of your devices, and Pro works offline
			between check-ins. If a subscription lapses, Editmamei keeps running as Community — it never
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
			<span class="font-semibold">Early-adopter launch pricing.</span> First-wave supporters lock in a
			reduced rate for the life of their subscription — already applied below, no code needed.
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
						<span class="text-sm text-neutral-400 line-through">{plan.list}</span>
					</div>
					<p class="mt-2 min-h-10 text-sm leading-relaxed text-neutral-600">{plan.note}</p>
					<a
						href={plan.href}
						class="mt-6 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold shadow-sm transition-colors {plan.featured
							? 'bg-brand text-white hover:bg-brand-light'
							: 'bg-neutral-900 text-white hover:bg-neutral-700'}"
					>
						Get Pro — {plan.name}
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
			Community Edition covers the everyday editing surface — documents, layers, the standard
			adjustments and filters, masks, selections, history, and visual verification with per-channel
			histograms. It also includes straightening and layer transforms, and content-aware retouch
			(Content-Aware Fill, Patch, Content-Aware Move). For most one-off photo edits, that is the
			full kit.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Pro adds the upgrades that matter once you're doing repeatable, production work:
		</p>

		<ul class="mt-6 space-y-5">
			<li class="rounded-xl border border-neutral-200 bg-paper p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">Templates</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Save the current edit as a reproducible recipe, then apply it to new images later — the AI
					re-derives each value for the new photo and self-judges against the recipe's exit
					criteria. The whole template system (create, save, apply, verify, recall) is Pro — the
					feature that turns a one-off look into a repeatable house style.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-paper p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">
					Sensei-backed selections
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Select Subject and Select Sky — Photoshop's modern AI-assisted selection tools. Community
					ships every other selection method (Magic Wand, rectangle, feather); Pro adds the Sensei
					pair, which mostly matters when the AI needs to isolate complex subjects without you
					nudging the selection by hand.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-paper p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">
					Objective template verification
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Save a machine-checkable style signature with any template, then have the AI measure a new
					edit against it — per-predicate pass/fail with a corrective steer per miss. "Looks right"
					becomes a measurement.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-paper p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">Actions & scripting</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Play your recorded Photoshop Actions, run arbitrary ExtendScript through the escape hatch
					when no specific tool fits. Your recorded Actions become AI-callable steps for repeatable
					production work.
				</p>
			</li>
		</ul>

		<p class="mt-6 text-base leading-relaxed text-neutral-700">
			Rule of thumb: if you mostly do <em>one-off</em> editing, Community is the full toolkit. If you
			find yourself wanting to save a look and re-apply it, batch real client work, or reach for the retouch
			and automation power tools, that's Pro.
		</p>
	</div>
</section>

<section class="bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4 text-center">
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			Not sure yet? Start with Community — it's free.
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-700">
			Install from npm and start editing today. Upgrade to Pro whenever you're ready — the Pro tools
			unlock in the same package once your licence is active.
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
