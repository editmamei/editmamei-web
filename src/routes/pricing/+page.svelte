<script lang="ts">
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import Seo from '$lib/components/Seo.svelte';

	// ──────────────────────────────────────────────────────────────────────
	// SANDBOX checkout links (Polar test mode). Feature-branch preview only —
	// this page is not deployed. At Pro launch, swap these three URLs for the
	// PRODUCTION Polar checkout links and remove the test-mode notice below.
	// Generated via POST /v1/checkout-links/ against the Etta-Test sandbox org.
	// ──────────────────────────────────────────────────────────────────────
	const SANDBOX = true;
	const CHECKOUT = {
		monthly:
			'https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_AYF74XTrnr2lpbhejzCUTb4rlmKvGBhk2gsiQ4QzxdB/redirect',
		annual:
			'https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_3hnWx83Tiy6vzizFlJuegqIbM7QF25l3XY5rX1dBQJi/redirect',
		perpetual:
			'https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_EnhiWWlhOfwqe6AvOKqzthoCzbQCAm0riCVGO2lNYHa/redirect'
	};

	const plans = [
		{
			id: 'monthly',
			name: 'Monthly',
			price: '$12',
			cadence: '/month',
			note: 'Billed monthly. Cancel anytime.',
			href: CHECKOUT.monthly,
			featured: false
		},
		{
			id: 'annual',
			name: 'Annual',
			price: '$99',
			cadence: '/year',
			note: 'Best value — under $9/mo, billed yearly.',
			href: CHECKOUT.annual,
			featured: true
		},
		{
			id: 'perpetual',
			name: 'Perpetual',
			price: '$299',
			cadence: 'one-time',
			note: 'Pay once. Yours forever, no subscription.',
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
			<span class="font-semibold">Early-adopter launch offer.</span> First-wave supporters get a
			standing discount — apply your code at checkout (try
			<code class="font-mono font-semibold">EARLY25</code> in this preview).
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
					<div class="mt-4 flex items-baseline gap-1">
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
						Get Pro — {plan.name}
					</a>
				</div>
			{/each}
		</div>

		{#if SANDBOX}
			<p class="mt-6 text-center text-xs text-neutral-500">
				Checkout runs in <span class="font-semibold">Polar test mode</span> on this preview — use a
				<a
					href="https://docs.stripe.com/testing#cards"
					class="underline underline-offset-2 hover:text-brand"
					rel="noopener">Stripe test card</a
				> (e.g. 4242 4242 4242 4242). No real charge.
			</p>
		{/if}
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
			histograms. You can apply, verify, and recall any saved template. For most one-off photo
			edits, that is the full kit.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Pro adds the upgrades that matter once you're doing repeatable, production work:
		</p>

		<ul class="mt-6 space-y-5">
			<li class="rounded-xl border border-neutral-200 bg-paper p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">Template authoring</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Save the current edit as a reproducible recipe and apply it to new images later. Community
					can <em>apply</em>, verify, and recall templates; Pro adds the create / save / delete
					side. This is the feature that turns a one-off look into a repeatable house style.
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
					Content-aware retouch
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Content-Aware Fill, Patch, and Content-Aware Move — Photoshop's premium retouch moves,
					driven against a selection the AI can verify first. Object removal and cleanup that goes
					beyond what adjustment layers can do.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-paper p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">
					Actions, scripting & layer transforms
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Play your recorded Photoshop Actions, run arbitrary ExtendScript through the escape hatch
					when no specific tool fits, and transform layers freely — move, scale, rotate, fit to
					document.
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
