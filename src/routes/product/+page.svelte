<script lang="ts">
	import ThreePillars from '$lib/components/ThreePillars.svelte';
	import CapabilitySurface from '$lib/components/CapabilitySurface.svelte';
	import WorkflowExamples from '$lib/components/WorkflowExamples.svelte';
	import ClientChoiceCallout from '$lib/components/ClientChoiceCallout.svelte';
	import EditFlowDiagram from '$lib/components/EditFlowDiagram.svelte';
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="AI photo editing tools for Photoshop — Editmamei"
	description="Non-destructive AI photo editing in your own Photoshop: adjustment layers, smart selections, masks, filters, and repeatable Pro templates for automation."
	path="/product"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-6xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Product</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			The full editing surface.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			What Editmamei does, broken out: the pillars of the toolkit, every capability category, and
			prompts that work today. For the elevator pitch, see <a
				href="/"
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
				>the home page</a
			>.
		</p>
	</div>
</section>

<ThreePillars />
<CapabilitySurface />

<!-- The full round-trip. Moved off the home page 2026-08-14: it is a reference
     asset for a reader who is already sold, and the home page linked here. -->
<section id="edit-flow" class="scroll-mt-20 bg-white py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The round-trip
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				What one adjustment actually does.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Four participants, one instruction, and a check-and-refine loop that runs until the result
				matches what you asked for.
			</p>
		</div>
		<EditFlowDiagram />
	</div>
</section>

<WorkflowExamples />
<ClientChoiceCallout />
