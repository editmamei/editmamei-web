<script lang="ts">
	import '$lib/components/landing/landing.css';
	import ConnectionDiagram from '$lib/components/desktop/ConnectionDiagram.svelte';
	import DesktopHero from '$lib/components/desktop/DesktopHero.svelte';
	import LayeredFile from '$lib/components/desktop/LayeredFile.svelte';
	import RequestCards from '$lib/components/desktop/RequestCards.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { track } from '$lib/analytics/clarity';
	import { toolCounts } from '$lib/content/tools';

	const freeTools = toolCounts.photoshop - toolCounts.photoshopPro;

	// What travels where. Checked against /privacy and the public privacy doc.
	const facts = [
		{
			title: 'The edit happens on your computer.',
			body: 'Photoshop or GIMP does every step, on the full-size photo, with its own tools. Nothing is redrawn.'
		},
		{
			title: 'Your AI sees small previews.',
			body: "So it can check its own work, the same as dropping a photo into a chat. You can switch previews off in Editmamei's settings."
		},
		{
			title: 'Your photos never come to us.',
			body: 'Editmamei never sends us your photos or previews. It sends content-free usage data, which you can turn off, and Pro checks its license and its updates.'
		}
	];

	const pro = [
		{ title: 'Templates', body: 'Save a look once, then put it on the next photo.' },
		{ title: 'Batch', body: 'One recipe across a whole folder, run by Photoshop itself.' },
		{
			title: 'Camera Raw',
			body: 'A re-editable develop, and raw files developed before they open.'
		},
		{
			title: 'Precision',
			body: 'Placement by name, warps, and selections of a named object or a face.'
		}
	];

	// Honest limits, checked against the public docs (faq.md, pro-features.md).
	const notYet = [
		{
			title: 'Lightroom',
			body: 'Editmamei works in Photoshop and in GIMP. It does not drive Lightroom.'
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
	title="Editmamei Desktop · Your AI, working in your Photoshop"
	description="Ask your AI for the edit and it makes it in Photoshop or GIMP on your computer, in layers and masks you can keep editing. An MCP server for Photoshop and GIMP. Free, with Pro for the whole shoot."
	path="/photoshop"
/>

<DesktopHero />

<!-- How it works. `edit-flow` and `process` stay as aliases for older links. -->
<section
	id="how"
	class="relative scroll-mt-16 overflow-hidden bg-brand-deep px-4 py-20 text-paper md:py-28"
	aria-labelledby="how-title"
>
	<span id="edit-flow" class="block"></span>
	<span id="process" class="block"></span>
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[42rem]">
			<p class="lp-eyebrow text-accent">How it works</p>
			<h2 id="how-title" class="lp-h2 lp-rise mt-4" use:reveal>
				<span><span>Your photo stays</span></span>
				<span><span>on your computer.</span></span>
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-[#c9d8d1]">
				Editmamei connects your AI app to the editor on your own machine. Your AI decides each step,
				Editmamei carries it out in Photoshop or GIMP, and a small preview comes back so your AI can
				see what changed.
			</p>
		</div>

		<div class="lp-fade mt-14" use:reveal>
			<ConnectionDiagram />
			<p class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#a9bcb4]">
				<span class="flex items-center gap-2"
					><span class="inline-block w-8 border-t-[3px] border-accent"></span>Stays on your computer</span
				>
				<span class="flex items-center gap-2"
					><span class="inline-block w-8 border-t-[3px] border-dashed border-[#ff9b70]"></span>Goes
					to the AI model</span
				>
			</p>
		</div>

		<div class="mt-14 grid gap-8 md:grid-cols-3">
			{#each facts as f (f.title)}
				<div>
					<h3 class="text-lg font-bold text-[#f4f1e8]">{f.title}</h3>
					<p class="mt-2 text-[15px] leading-relaxed text-[#b9c9c2]">{f.body}</p>
				</div>
			{/each}
		</div>
		<p class="mt-8 text-[14px] text-[#a9bcb4]">
			Every request is listed on the
			<a href="/privacy" class="font-semibold text-accent underline underline-offset-2"
				>privacy page</a
			>.
		</p>
	</div>
</section>

<RequestCards />

<LayeredFile />

<!-- What you need, with an honest word on time -->
<section class="bg-paper px-4 py-20 md:py-28" aria-labelledby="need-title">
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-terracotta-ink">What you need</p>
		<h2 id="need-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
			<span><span>Three things, and a little patience.</span></span>
		</h2>
		<div class="mt-12 grid gap-5 md:grid-cols-3">
			<div class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10">
				<p class="text-sm font-bold text-terracotta-ink">1 · An editor</p>
				<p class="mt-3 text-[16px] leading-relaxed text-neutral-800">
					Photoshop 2026 on Windows or macOS. Or
					<a href="/gimp" class="font-semibold text-brand underline underline-offset-2">GIMP 3.2</a
					>, which is free and also runs on Linux.
				</p>
			</div>
			<div class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10">
				<p class="text-sm font-bold text-terracotta-ink">2 · An AI app on your computer</p>
				<p class="mt-3 text-[16px] leading-relaxed text-neutral-800">
					Claude Desktop installs it in one click. Claude Code, Cursor and other apps that run local
					tools work too. Editmamei has no AI of its own, so edits use your AI app's plan.
				</p>
			</div>
			<div class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10">
				<p class="text-sm font-bold text-terracotta-ink">3 · A few minutes</p>
				<p class="mt-3 text-[16px] leading-relaxed text-neutral-800">
					A first edit takes a while: the three requests above took 4 to 8 minutes, because your AI
					looks, plans and checks at every step. With Pro, a look you've saved goes onto the next
					photo in a few steps.
				</p>
			</div>
		</div>
		<p class="mt-6 text-[14px] text-neutral-600">
			Curious what an edit costs in usage?
			<a
				href="/blog/what-an-edit-costs"
				class="font-semibold text-brand underline underline-offset-2">We measured it</a
			>.
		</p>
	</div>
</section>

<!-- Free and Pro -->
<section class="bg-white px-4 py-20 md:py-28" aria-labelledby="pro-title">
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-terracotta-ink">Free and Pro</p>
		<h2 id="pro-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
			<span><span>Free for the edit.</span></span>
			<span><span>Pro for the whole shoot.</span></span>
		</h2>
		<div class="mt-12 grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
			<div class="flex flex-col rounded-[22px] bg-paper p-7 ring-1 ring-brand/10">
				<div class="flex items-baseline justify-between gap-4">
					<h3 class="text-2xl font-bold text-brand">Free</h3>
					<span class="text-lg font-semibold text-brand">$0</span>
				</div>
				<p class="mt-4 mb-6 text-[16px] leading-relaxed text-neutral-800">
					{freeTools} Photoshop tools and {toolCounts.gimp} for GIMP: adjustment layers, masks, selections,
					Select Subject and Select Sky, sky replacement, retouching, filters and text. Enough for a full
					edit of any photo.
				</p>
				<a
					href="#install"
					onclick={() => track('desktop-install-free')}
					class="mt-auto inline-flex min-h-12 items-center self-start rounded-2xl bg-accent px-6 text-[16px] font-bold text-brand-deep transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
					>Install free</a
				>
			</div>
			<div class="rounded-[22px] bg-brand p-7 text-white">
				<div class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
					<h3 class="text-2xl font-bold">Pro</h3>
					<span class="text-[15px] text-white/80"
						><span class="text-lg font-semibold text-white">$9</span>/month, $79/year, or $199 once</span
					>
				</div>
				<p class="mt-4 text-[16px] leading-relaxed text-white/85">
					Everything in Free, for when one photo turns into a whole shoot.
				</p>
				<ul class="mt-5 grid gap-4 sm:grid-cols-2">
					{#each pro as p (p.title)}
						<li>
							<p class="font-bold text-accent">{p.title}</p>
							<p class="mt-1 text-[14.5px] leading-relaxed text-white/80">{p.body}</p>
						</li>
					{/each}
				</ul>
				<a
					href="/pricing"
					onclick={() => track('desktop-pricing')}
					class="mt-7 inline-flex min-h-12 items-center rounded-2xl border-[1.5px] border-accent/60 px-6 text-[16px] font-bold text-white transition-colors hover:bg-white/10"
					>See Pro, with a 7-day trial <span aria-hidden="true" class="ml-1.5">→</span></a
				>
			</div>
		</div>
		<p class="mt-6 text-[14px] text-neutral-600">
			<a
				href="/tools?editor=photoshop"
				class="font-semibold text-brand underline underline-offset-2"
				>Browse all {toolCounts.photoshop} Photoshop tools</a
			>
		</p>
	</div>
</section>

<InstallSection />

<section id="limits" class="scroll-mt-20 bg-paper px-4 py-16 md:py-20">
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-terracotta-ink">Not yet</p>
		<h2 class="mt-3 text-2xl font-bold tracking-tight text-brand md:text-3xl">
			What it doesn't do.
		</h2>
		<ul class="mt-8 grid gap-4 sm:grid-cols-2">
			{#each notYet as item (item.title)}
				<li class="rounded-xl bg-white p-5 ring-1 ring-brand/10">
					<h3 class="text-sm font-semibold tracking-tight text-neutral-950">{item.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-700">{item.body}</p>
				</li>
			{/each}
		</ul>

		<div class="mt-14 grid gap-4 md:grid-cols-2">
			<a
				href="/gimp"
				onclick={() => track('desktop-xlink-gimp')}
				class="group flex items-center justify-between gap-4 rounded-[22px] bg-white p-6 ring-1 ring-brand/10 transition-shadow hover:shadow-lg"
			>
				<span>
					<span class="block text-lg font-bold text-brand">Using GIMP?</span>
					<span class="mt-1 block text-[15px] text-neutral-700"
						>The same idea, in the free editor.</span
					>
				</span>
				<span
					aria-hidden="true"
					class="text-xl text-brand transition-transform group-hover:translate-x-1">→</span
				>
			</a>
			<a
				href="/connect"
				onclick={() => track('desktop-xlink-connect')}
				class="group flex items-center justify-between gap-4 rounded-[22px] bg-brand p-6 text-white transition-shadow hover:shadow-lg"
			>
				<span>
					<span class="block text-lg font-bold">Rather edit from your phone?</span>
					<span class="mt-1 block text-[15px] text-white/80"
						>Editmamei Connect: nothing to install.</span
					>
				</span>
				<span aria-hidden="true" class="text-xl transition-transform group-hover:translate-x-1"
					>→</span
				>
			</a>
		</div>
	</div>
</section>
