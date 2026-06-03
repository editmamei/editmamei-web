<script lang="ts">
	import ThreePillars from '$lib/components/ThreePillars.svelte';
	import CapabilitySurface from '$lib/components/CapabilitySurface.svelte';
	import WorkflowExamples from '$lib/components/WorkflowExamples.svelte';
	import VerifiableSection from '$lib/components/VerifiableSection.svelte';
	import Changelog from '$lib/components/Changelog.svelte';
</script>

<svelte:head>
	<title>Product — Editmamei</title>
	<meta
		name="description"
		content="The full Editmamei capability surface — adjustment layers, smart selections, filters, masks, templates — plus verifiable build receipts and what's been landing on the way to v1.0."
	/>
</svelte:head>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-6xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Product</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			The full editing surface.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			What Editmamei does, broken out: the pillars of the toolkit, every capability category,
			prompts that work today, the receipts behind the trust claims, and recent work landing on the
			way to v1.0. For the elevator pitch, see <a
				href="/"
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
				>the home page</a
			>.
		</p>
	</div>
</section>

<ThreePillars />
<CapabilitySurface />
<WorkflowExamples />
<VerifiableSection />
<Changelog />
