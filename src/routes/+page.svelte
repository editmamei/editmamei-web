<script lang="ts">
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import LayerAccordion from '$lib/components/LayerAccordion.svelte';
	import PromptDisplay from '$lib/components/PromptDisplay.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import ThreePillars from '$lib/components/ThreePillars.svelte';
	import CapabilitySurface from '$lib/components/CapabilitySurface.svelte';
	import WorkflowExamples from '$lib/components/WorkflowExamples.svelte';
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import PrivacySection from '$lib/components/PrivacySection.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import { vividRose, vividRosePrompts } from '$lib/demos/vivid-rose';
</script>

<Hero />

<section id="demo" class="border-y border-neutral-200 bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<header class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
				The demo · {vividRose.title}
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Two prompts. Same edit. Nine layers — captured as a recipe.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				{vividRose.summary}
			</p>
		</header>

		<div class="mb-8">
			<PromptDisplay prompts={vividRosePrompts} />
		</div>

		<div class="grid gap-8 md:grid-cols-[1fr_360px] md:items-start lg:grid-cols-[1fr_400px]">
			<div>
				<BeforeAfterSlider
					beforeSrc={vividRose.before}
					afterSrc={vividRose.after}
					beforeAlt={vividRose.beforeAlt}
					afterAlt={vividRose.afterAlt}
				/>
				<p class="mt-3 text-xs text-neutral-500">
					Drag the bar — or use ← → on the keyboard — to compare. Left of the line is the finished
					edit; right is the original.
				</p>
			</div>

			<aside>
				<p
					class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase"
				>
					Layer stack — built non-destructively
				</p>
				<LayerAccordion layers={vividRose.layers} />
				<p class="mt-4 text-xs leading-relaxed text-neutral-500">
					Every layer above is editable, maskable, removable. Saved as a template, the AI replays
					the same recipe on a new photo and self-judges the result.
				</p>
			</aside>
		</div>
	</div>
</section>

<ThreePillars />
<CapabilitySurface />
<WorkflowExamples />
<EditionsTable />
<PrivacySection />
<InstallSection />
