<script lang="ts">
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { GITHUB_GIMP_DOCS_URL as GIMP_GUIDE_URL } from '$lib/links';
	import { gimpHeroMedia as media } from './media';

	const GIMP_GUIDE_CUSTOM_PATH_URL = `${GIMP_GUIDE_URL}#pointing-at-a-custom-install`;
	const GIMP_GUIDE_PIN_EDITOR_URL = `${GIMP_GUIDE_URL}#pinning-the-editor`;
	const GIMP_DOWNLOAD_URL = 'https://www.gimp.org/downloads/';

	// Scope follows docs/gimp.md ("What the beta covers") and the community-tier
	// gimp_* rows in tool-tiers.ts. Keep it to what has shipped.
	const steps = [
		{
			title: 'GIMP runs in the background.',
			body: 'Editmamei starts GIMP’s console build as its own process and drives it directly. Nothing is added to GIMP, and a GIMP window you have open separately is a different process that won’t change.'
		},
		{
			title: 'You follow along in the chat.',
			body: 'With no window to watch, the AI shows you rendered previews in the conversation and checks its work with per-channel histograms and before/after comparisons. Each preview is also saved to a file on your disk that you can keep open and refresh.'
		},
		{
			title: 'Every adjustment stays a live filter.',
			body: 'Adjustments and effects go on as GIMP’s own non-destructive filters. The AI can re-edit or remove any of them later, and they are still live when you open the saved .xcf in GIMP. Exporting a JPEG or PNG writes a flattened copy and leaves the document as it was.'
		},
		{
			title: 'Checkpoints instead of undo.',
			body: 'Headless GIMP keeps no undo history, so crop, resize, rotate, flip, merging and flattening can’t be stepped back one at a time. A checkpoint saves the image with its live filters and restores it later. Each image keeps up to five, and they are deleted when Editmamei exits, so save an .xcf for anything you want to keep.'
		}
	] as const;

	const coverage = [
		{
			title: 'Tone and color',
			body: 'Thirteen live adjustments: curves, levels, exposure, brightness and contrast, hue and saturation, color balance, color temperature, shadows and highlights, saturation, vibrance, sharpen, noise reduction and Gaussian blur. Any of them can be hidden, re-edited or removed.'
		},
		{
			title: 'Effects',
			body: 'Vignette, black and white, motion blur, lens blur, noise and drop shadow, live and re-editable like the adjustments. When you want a layer’s filters fixed in place, they can be baked into its pixels.'
		},
		{
			title: 'Layers and composites',
			body: 'Create, duplicate, group, reorder, move and rename layers, and set their opacity, blend mode and visibility. Merge down or flatten. Place another photo into the image as a new layer to build a composite.'
		},
		{
			title: 'Masks',
			body: 'Confine an adjustment to a rectangle, an ellipse, or a linear or radial gradient.'
		},
		{
			title: 'Files and canvas',
			body: 'Open JPEG, PNG, TIFF, WebP, HEIC, XCF and most other formats GIMP reads, or start from a blank canvas. Crop, resize, rotate to any angle to straighten, flip, extend the canvas for a border, and convert between color and grayscale.'
		},
		{
			title: 'Saving and export',
			body: 'Save an .xcf with every filter still live. Export a flattened JPEG, PNG, WebP or TIFF with the photo’s metadata removed. The .xcf keeps the original metadata, GPS location included.'
		}
	] as const;

	const notYet = [
		'Healing, cloning and content-aware retouching.',
		'Subject or sky selection. Masks are geometric only: rectangles, ellipses and gradients.',
		'Text layers.',
		'Step-by-step undo. Checkpoints take its place.',
		'Camera raw files without a raw plug-in in GIMP (darktable, RawTherapee or ART). Without one, develop the file elsewhere and open the JPEG, TIFF or PNG.'
	] as const;

	const linkClass =
		'font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700';
	const darkLinkClass =
		'font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent';
</script>

<Seo
	title="GIMP MCP server for AI photo editing (beta) · Editmamei"
	description="Editmamei lets your AI assistant edit photos in GIMP 3.2, running headless in the background. Adjustments and effects stay live filters in the saved .xcf. Beta, on Windows, macOS and Linux."
	path="/gimp"
/>

<section class="bg-white pt-12 pb-12 md:pt-16 md:pb-16">
	<div
		class="mx-auto max-w-6xl px-4 {media
			? 'grid gap-10 md:grid-cols-[1.1fr_1fr] md:items-center'
			: ''}"
	>
		<div class="max-w-3xl">
			<p
				class="mb-2 flex items-center gap-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase"
			>
				GIMP
				<span
					class="rounded-full border border-terracotta/40 px-2 py-0.5 text-[0.65rem] tracking-wider"
					>Beta</span
				>
			</p>
			<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
				Natural-language photo editing in GIMP.
			</h1>
			<p class="mt-3 text-lg font-medium text-neutral-800">AI orchestration, not generation.</p>
			<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
				Editmamei runs GIMP 3.2 headless: a separate GIMP process working in the background, with no
				window and nothing installed into GIMP itself. You describe the edit to your AI assistant,
				it plans the steps, and GIMP’s own filters make the changes, so nothing in the photo is
				generated. You follow the work through previews in the chat, then open the saved .xcf in
				GIMP with every adjustment still live.
			</p>
			<div class="mt-7 flex flex-wrap items-center gap-3">
				<a
					href="#setup"
					class="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
				>
					Set it up
				</a>
				<a
					href={GIMP_GUIDE_URL}
					class="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-500"
				>
					Read the GIMP guide
				</a>
			</div>
			<p class="mt-4 text-sm text-neutral-600">
				Needs GIMP 3.2. Runs on Windows, macOS and Linux, including the Flathub Flatpak.
			</p>
		</div>

		{#if media}
			<figure>
				<BeforeAfterSlider
					beforeSrc={media.beforeSrc}
					afterSrc={media.afterSrc}
					beforeAlt={media.beforeAlt}
					afterAlt={media.afterAlt}
				/>
				<figcaption class="mt-3 text-sm leading-relaxed text-neutral-600">
					{media.caption}
				</figcaption>
			</figure>
		{/if}
	</div>
</section>

<section id="how-it-works" class="scroll-mt-20 border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				How it works
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				How the GIMP version works.
			</h2>
		</div>
		<ol class="grid gap-6 md:grid-cols-2">
			{#each steps as step, i (step.title)}
				<li class="rounded-xl border border-neutral-200 bg-white p-6">
					<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
						Step {i + 1}
					</p>
					<h3 class="mt-2 text-lg font-semibold tracking-tight text-neutral-950">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<section id="coverage" class="scroll-mt-20 bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				What the beta covers
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				From a single photo to a layered composite.
			</h2>
		</div>
		<ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each coverage as group (group.title)}
				<li class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5">
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{group.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{group.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section id="example" class="scroll-mt-20 border-y border-neutral-200 bg-cream py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				What you say to it
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				One prompt, start to finish.
			</h2>
		</div>
		<div
			class="grid gap-5 rounded-xl border border-neutral-200 bg-white p-5 md:grid-cols-2 md:items-start md:gap-7 md:p-7"
		>
			<div>
				<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
					The prompt
				</p>
				<blockquote
					class="rounded-lg border border-prompt-border bg-prompt p-4 text-sm leading-relaxed text-neutral-800 italic"
				>
					“In GIMP, open harbor.jpg from my Pictures folder, warm it up a little, add a soft
					vignette, and save it as an .xcf next to the original.”
				</blockquote>
			</div>
			<div>
				<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
					What happens
				</p>
				<p class="text-sm leading-relaxed text-neutral-700">
					Editmamei opens the photo in the background GIMP. The AI adds a color temperature
					adjustment and a vignette as live filters, renders a preview to check the result and shows
					it to you in the chat. If the warmth overshoots, it changes that same filter rather than
					stacking a second one. It saves the .xcf beside the original, and when you open it in GIMP
					both filters are still there to adjust or switch off.
				</p>
			</div>
		</div>
	</div>
</section>

<section id="not-yet" class="scroll-mt-20 bg-paper py-16 md:py-20">
	<div class="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2">
		<div>
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Not in the beta
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				What it can’t do yet.
			</h2>
			<ul class="mt-6 space-y-3 text-sm leading-relaxed text-neutral-700">
				{#each notYet as item (item)}
					<li class="flex gap-3">
						<span aria-hidden="true" class="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-neutral-400"
						></span>
						<span>{item}</span>
					</li>
				{/each}
			</ul>
		</div>
		<div>
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Cost and license
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Fair source, under FSL-1.1-MIT.
			</h2>
			<p class="mt-6 text-sm leading-relaxed text-neutral-700">
				GIMP support is free, and it is the same in both editions of Editmamei. Editmamei is fair
				source: its code is public under the <a href="/license" class={linkClass}
					>FSL-1.1-MIT license</a
				>, and each version becomes MIT-licensed two years after its release.
			</p>
		</div>
	</div>
</section>

<section id="setup" class="scroll-mt-20 bg-brand py-16 text-neutral-100 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-accent uppercase">Setup</p>
			<h2 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
				Set up Editmamei for GIMP.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-300">
				It’s the same install whichever editor you use. Editmamei finds GIMP on its own.
			</p>
		</div>

		<ol class="mt-8 space-y-4">
			<li class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-white">1. Install GIMP 3.2.</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-300">
					From <a href={GIMP_DOWNLOAD_URL} class={darkLinkClass}>gimp.org</a>, or on Linux from your
					distribution or the Flathub Flatpak.
				</p>
			</li>
			<li class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-white">2. Install Editmamei.</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-300">
					Use the <a href="/#install" class={darkLinkClass}>install section on the home page</a>:
					one-click for Claude Desktop, or npm for every other client. On Linux, use npm.
				</p>
			</li>
			<li class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-base font-semibold tracking-tight text-white">
					3. Restart your AI client and ask “Is GIMP ready?”
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-300">
					The GIMP tools appear when GIMP 3.2 is in its usual install location. The first launch on
					a machine can take a few minutes while GIMP builds its font cache. After that it starts in
					seconds.
				</p>
			</li>
		</ol>

		<div class="mt-8 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Requirements</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>GIMP 3.2 with Python support (every official build includes it)</li>
					<li>Windows, macOS or Linux</li>
					<li>Node.js 22+, only for the npm install</li>
					<li>An MCP-compatible AI client</li>
				</ul>
			</div>
			<div class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Custom setups</h3>
				<p class="mt-3 text-sm leading-relaxed text-neutral-300">
					If GIMP is installed in a custom location, <a
						href={GIMP_GUIDE_CUSTOM_PATH_URL}
						class={darkLinkClass}>point Editmamei at it</a
					>. If you also have Photoshop and want only the GIMP tools,
					<a href={GIMP_GUIDE_PIN_EDITOR_URL} class={darkLinkClass}>pin the editor to GIMP</a>.
				</p>
			</div>
		</div>

		<p class="mt-8 text-sm text-neutral-400">
			Requirements, detection and troubleshooting are all in the
			<a href={GIMP_GUIDE_URL} class={darkLinkClass}>GIMP guide</a>.
		</p>
	</div>
</section>
