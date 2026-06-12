<script lang="ts">
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Pricing — Editmamei"
	description="Editmamei pricing. Community is free and covers everyday editing; Pro adds template authoring, Sensei-backed selections, content-aware retouch, layer transforms, and Photoshop Actions + scripting."
	path="/pricing"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-5xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Pricing</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Free Community. Paid Pro for production work.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Editmamei Community is free. Pro adds the production toolkit for repeatable, professional
			workflows. Both editions ship from the same npm package — a Pro license unlocks the Pro tool
			surface on the next AI-client restart.
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
			Community Edition covers the everyday editing surface — documents, layers, the standard
			adjustments and filters, masks, selections, history, and visual verification with per-channel
			histograms. You can apply, verify, and recall any saved template. For most one-off photo
			edits, that is the full kit.
		</p>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Pro adds the upgrades that matter once you're doing repeatable, production work:
		</p>

		<ul class="mt-6 space-y-5">
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">Template authoring</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Save the current edit as a reproducible recipe and apply it to new images later. Community
					can <em>apply</em>, verify, and recall templates; Pro adds the create / save / delete
					side. This is the feature that turns a one-off look into a repeatable house style.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
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
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-neutral-950">
					Content-aware retouch
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Content-Aware Fill, Patch, and Content-Aware Move — Photoshop's premium retouch moves,
					driven against a selection the AI can verify first. Object removal and cleanup that goes
					beyond what adjustment layers can do.
				</p>
			</li>
			<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
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
