<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { tag, track } from '$lib/analytics/clarity';
	import ClientChoiceCallout from '$lib/components/ClientChoiceCallout.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { GIMP_GUIDE_URL, surfaces } from '$lib/content/surfaces';

	// Sections that now live on /photoshop. A link to /product#process (and the
	// other two) is forwarded there, since a URL fragment never reaches the server.
	const MOVED_ANCHORS = new Set(['#process', '#capabilities', '#edit-flow']);

	onMount(() => {
		const { hash } = window.location;
		if (!MOVED_ANCHORS.has(hash)) return;
		track('legacy-anchor-forwarded');
		goto(`/photoshop${hash}`, { replaceState: true });
	});

	const shared = [
		{
			title: 'Layers you can still change',
			body: 'In Photoshop the edit lands as adjustment layers and masks. In GIMP every adjustment stays a live filter in the .xcf. Either way, you can open the file and change any step by hand.'
		},
		{
			title: 'It checks its own work',
			body: 'Before moving on, the AI checks a step with a preview, a histogram or a measured comparison, so it judges the result from the photo itself.'
		},
		{
			title: 'Runs on your desktop',
			body: 'The editing happens on your computer, in Photoshop or GIMP, and your photos are not uploaded to Editmamei. When your AI assistant needs to see the result, a downscaled preview goes to it, the same as sharing a photo in a chat.'
		}
	];

	const loop = [
		{ step: 'Describe', body: 'Say what you want in a chat, in your own words.' },
		{ step: 'Plan', body: 'Your AI assistant works out the steps.' },
		{ step: 'Edit', body: 'The editor’s own tools carry out each step.' },
		{ step: 'Check', body: 'A preview or a measurement shows what changed.' },
		{ step: 'Refine', body: 'The AI adjusts, or hands the finished file back to you.' }
	];
</script>

<Seo
	title="Natural-language photo editing in Photoshop and GIMP · Editmamei"
	description="Editmamei lets your AI assistant edit photos with the tools in desktop Photoshop, or GIMP 3.2 in beta. Choose an editor and see how the edit stays in layers you can change."
	path="/product"
/>

<!-- Landing points for the moved anchors, so the links still resolve while the
     script above forwards them to /photoshop. -->
<div class="sr-only">
	{#each MOVED_ANCHORS as hash (hash)}
		<span id={hash.slice(1)}></span>
	{/each}
</div>

<section class="bg-white pt-12 pb-10 md:pt-16 md:pb-14">
	<div class="mx-auto max-w-6xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Product</p>
		<h1 class="max-w-3xl text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Natural-language photo editing in Photoshop and GIMP.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Your AI assistant plans the edit, the editor's own tools carry it out, and the file you get
			back keeps the edit in layers you can still change.
		</p>
	</div>
</section>

<section aria-labelledby="choose-editor" class="bg-white pb-16 md:pb-20">
	<div class="mx-auto max-w-6xl px-4">
		<h2
			id="choose-editor"
			class="mb-6 text-xs font-semibold tracking-wider text-neutral-500 uppercase"
		>
			Choose an editor
		</h2>
		<!-- Three-column row; with fewer than three editors the cards center in it. -->
		<ul class="flex flex-col gap-5 md:flex-row md:justify-center">
			{#each surfaces as s (s.id)}
				<li class="md:w-1/3">
					<a
						href={s.href}
						onclick={() => {
							tag('editor-card', s.id);
							track('editor-card-clicked');
						}}
						class="group flex h-full flex-col rounded-xl border border-neutral-200 bg-neutral-50/60 p-6 transition-colors hover:border-neutral-300 hover:bg-white"
					>
						<span class="flex items-center gap-2">
							<span class="text-xl font-bold tracking-tight text-neutral-950">{s.name}</span>
							{#if s.beta}
								<span
									class="rounded-full border border-neutral-300 px-2 py-0.5 text-xs font-medium text-neutral-600"
									>beta</span
								>
							{/if}
						</span>
						<span class="mt-2 flex-1 text-sm leading-relaxed text-neutral-700">{s.descriptor}</span>
						<span
							class="mt-5 text-sm font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 group-hover:decoration-neutral-700"
						>
							{s.cta} <span aria-hidden="true">→</span>
						</span>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				In every editor
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Edited, not generated.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				The editor's own tools make every change, and no generative model touches your pixels.
			</p>
		</div>
		<div class="grid gap-6 md:grid-cols-3">
			{#each shared as item (item.title)}
				<div class="rounded-xl border border-neutral-200 bg-white p-6">
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{item.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{item.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<section class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				The loop
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				From a sentence to a finished file.
			</h2>
		</div>
		<ol class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
			{#each loop as item, i (item.step)}
				<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
					<p
						class="mb-3 inline-flex size-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white"
						aria-hidden="true"
					>
						{i + 1}
					</p>
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{item.step}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-700">{item.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<ClientChoiceCallout />

<section class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4 text-center">
		<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">Ready to try it?</h2>
		<p class="mx-auto mt-3 max-w-xl text-base leading-relaxed text-neutral-700">
			Editmamei works with whichever editor it finds on your computer: Photoshop, GIMP, or both. The
			install section has the setup for each AI client, and the
			<a
				href={GIMP_GUIDE_URL}
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
				>GIMP guide</a
			> covers what GIMP needs.
		</p>
		<a
			href="/#install"
			class="mt-6 inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
		>
			Install Editmamei
		</a>
	</div>
</section>
