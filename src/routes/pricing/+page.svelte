<script lang="ts">
	import EditionsTable from '$lib/components/EditionsTable.svelte';

	const faqs = [
		{
			q: 'What does Pro cost?',
			a: 'Pricing lands with the v1.0 release. Both a subscription and a one-time lifetime option are planned. Community is free, and will stay free.'
		},
		{
			q: 'Can I switch from Community to Pro later?',
			a: "Yes. Both editions ship from the same npm package. Enter a Pro license key and the Pro tool surface unlocks on your AI client's next restart. No reinstall."
		},
		{
			q: 'Do I need an Adobe Creative Cloud subscription?',
			a: 'You need a working Photoshop install (2022 or later; 2024+ recommended). Editmamei runs against the standard ExtendScript automation surface — no Creative Cloud features required beyond owning Photoshop itself. Generative Fill, UXP plugins, and Adobe cloud features are not used.'
		},
		{
			q: 'What happens to my templates if I cancel Pro?',
			a: "Existing templates stay on disk and remain applicable in Community. The authoring side — saving new templates, deleting templates — becomes read-only until Pro is re-enabled. You don't lose anything; you just can't author."
		}
	];
</script>

<svelte:head>
	<title>Pricing — Editmamei</title>
	<meta
		name="description"
		content="Editmamei pricing. Community is free and covers the full Photoshop editing surface; Pro adds template authoring, Sensei-backed selections, and per-channel histograms."
	/>
</svelte:head>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-5xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Pricing</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Free Community. Paid Pro for production work.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Editmamei Community is free and open. Pro adds three specific upgrades for repeatable,
			production workflows. Both editions ship from the same npm package — a Pro license unlocks the
			Pro tool surface on the next AI-client restart.
		</p>
	</div>
</section>

<EditionsTable />

<section class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
			Community vs Pro
		</p>
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			When do you need Pro?
		</h2>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Community Edition covers the full Photoshop editing surface — documents, layers, every
			standard adjustment and filter, masks, selections, history. You can apply any built-in
			template. For most one-off photo edits, that is the full kit.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Pro adds three specific upgrades that matter once you're doing repeatable, production work:
		</p>

		<ul class="mt-6 space-y-5">
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">Template authoring</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Save the current edit as a reproducible recipe and apply it to new images later. Community
					can <em>apply</em> templates; Pro adds the create / save / delete side. This is the feature
					that turns a one-off look into a repeatable house style.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">
					Sensei-backed selections
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Select Subject and Select Sky — Photoshop's modern AI-assisted selection tools. Community
					ships every other selection method (Color Range, Magic Wand, rectangle, feather); Pro adds
					the Sensei pair, which mostly matters when the AI needs to isolate complex subjects
					without you nudging the selection by hand.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">
					Per-channel histograms
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					256-bin distributions with mean / stdev / median, returned to the AI. Lets the AI confirm
					quantitatively that an operation actually changed pixels — not just that the call
					succeeded. Useful when you want self-verifying edits, especially for batch work.
				</p>
			</li>
		</ul>

		<p class="mt-6 text-base leading-relaxed text-neutral-700">
			Rule of thumb: if you mostly do <em>one-off</em> editing, Community is the full toolkit. If you
			find yourself wanting to save a look and re-apply it, or you want the AI to self-judge at a finer
			grain, that's Pro.
		</p>
	</div>
</section>

<section class="bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-3xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">FAQ</p>
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
			A few common questions.
		</h2>
		<dl class="mt-8 space-y-6">
			{#each faqs as faq, i (i)}
				<div class="rounded-xl border border-neutral-200 bg-white p-5">
					<dt class="text-base font-semibold tracking-tight text-neutral-950">{faq.q}</dt>
					<dd class="mt-2 text-base leading-relaxed text-neutral-700">{faq.a}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>
