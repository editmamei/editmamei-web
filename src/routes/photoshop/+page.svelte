<script lang="ts">
	import ThreePillars from '$lib/components/ThreePillars.svelte';
	import CapabilitySurface from '$lib/components/CapabilitySurface.svelte';
	import WorkflowExamples from '$lib/components/WorkflowExamples.svelte';
	import ClientChoiceCallout from '$lib/components/ClientChoiceCallout.svelte';
	import EditFlowDiagram from '$lib/components/EditFlowDiagram.svelte';
	import HeroMovie from '$lib/components/HeroMovie.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import Seo from '$lib/components/Seo.svelte';

	// Honest limits. Each line is checked against the public docs (faq.md,
	// pro-features.md) or the shipped tool list.
	const notYet = [
		{
			title: 'Lightroom',
			body: 'Editmamei works in Photoshop, and in GIMP in beta. It does not drive Lightroom.'
		},
		{
			title: 'Photoshop Elements',
			body: 'Elements does not expose the scripting interface that full Photoshop does, so Editmamei cannot drive it.'
		},
		{
			title: 'Camera Raw’s local masks',
			body: 'The AI sets Camera Raw’s develop sliders, but cannot draw its local masks. When it develops a raw file, masks you made by hand in Camera Raw are carried through untouched.'
		},
		{
			title: 'Developing HEIC before it opens',
			body: 'HEIC photos open and edit as usual. Photoshop opens them by a route that never reads Camera Raw’s settings file, so a develop-before-open request for a HEIC is refused.'
		}
	];
</script>

<Seo
	title="AI photo editing in desktop Photoshop · Editmamei"
	description="Describe the edit in a chat and desktop Photoshop builds it with adjustment layers, masks, selections and filters, checking each step as it goes. Windows and macOS."
	path="/photoshop"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-6xl px-4">
		<nav aria-label="Breadcrumb" class="mb-3 hidden text-xs text-neutral-500 sm:block">
			<ol class="flex items-center gap-1.5">
				<li><a href="/product" class="hover:text-neutral-900">Product</a></li>
				<li aria-hidden="true">/</li>
				<li aria-current="page" class="text-neutral-700">Photoshop</li>
			</ol>
		</nav>
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Photoshop</p>
		<h1 class="max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Natural-language photo editing in desktop Photoshop.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Describe the edit in a chat. Your AI plans each step, Photoshop carries it out with its own
			adjustment layers, masks, selections and filters, and you get back a layered PSD you can keep
			changing by hand.
		</p>
		<div class="mt-6 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
			<a
				href="#process"
				class="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				See it work ↓
			</a>
			<a
				href="#install"
				class="text-sm font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-500"
			>
				or install it
			</a>
		</div>
		<p class="mt-4 text-xs text-neutral-500">
			Requires Photoshop 2026 (v27.x) on Windows or macOS.
		</p>
	</div>
</section>

<ThreePillars />

<section id="process" class="scroll-mt-20 border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mx-auto mb-10 max-w-2xl text-center">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The process · Hawaii bay wall art
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				One conversation, start to finish.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				The AI plans each step and Photoshop runs it. Halfway through it pauses on a judgment call,
				gets an answer, and carries on.
			</p>
		</div>

		<HeroMovie />
	</div>
</section>

<CapabilitySurface />

<section id="edit-flow" class="scroll-mt-20 bg-white py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The round-trip
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Behind a single adjustment.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				What happens between your sentence and a finished layer, including the loop where the AI
				checks its own result.
			</p>
		</div>
		<EditFlowDiagram />
	</div>
</section>

<WorkflowExamples />

<section id="limits" class="scroll-mt-20 border-t border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Not yet</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				What it doesn't do.
			</h2>
		</div>
		<ul class="grid gap-4 sm:grid-cols-2">
			{#each notYet as item (item.title)}
				<li class="rounded-xl border border-neutral-200 bg-white p-5">
					<h3 class="text-sm font-semibold tracking-tight text-neutral-950">{item.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-700">{item.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<ClientChoiceCallout />
<InstallSection />
