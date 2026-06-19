<script lang="ts">
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Pricing — Editmamei"
	description="Editmamei pricing: Community is free for everyday photo editing. Pro adds the production toolkit for repeatable, professional work. Pro pricing coming soon."
	path="/pricing"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-5xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Pricing</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Free Community. Paid Pro for production work.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Editmamei Community is free. Pro adds the production toolkit for repeatable, professional
			workflows. Community installs from the public npm registry; a Pro purchase delivers the Pro
			build of the same package — install it over Community, restart your AI client, and the Pro
			tools appear. Same CLI, same setup flow.
		</p>
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
			Start with Community — it's free.
		</h2>
		<p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-neutral-700">
			Install from npm and start editing today. Pro pricing lands with the v1.0 launch — watch
			<a
				href="https://github.com/editmamei/editmamei-wiki"
				class="font-medium text-brand underline underline-offset-2 hover:text-brand-light"
				>the repo</a
			> for the announcement.
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
