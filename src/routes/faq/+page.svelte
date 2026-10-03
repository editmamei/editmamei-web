<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { PRO_FEATURES_SENTENCE } from '$lib/content/pro-features';
	import {
		GITHUB_FAQ_DOCS_URL,
		GITHUB_GIMP_DOCS_URL,
		GITHUB_TROUBLESHOOTING_DOCS_URL
	} from '$lib/links';

	// Each entry renders once on the page and once in the FAQPage JSON-LD.
	// `a` is the plain-text answer used in both places; the optional `link`
	// renders only on the page, under the answer.
	const faqs = [
		{
			q: 'Is there an MCP server for Photoshop?',
			a: 'Editmamei is one: a Model Context Protocol (MCP) server for Adobe Photoshop. Your AI client connects to it, and it drives desktop Photoshop on your computer. You describe the edit, the AI plans the steps, and Photoshop carries them out.'
		},
		{
			q: 'Can an AI assistant edit photos in Photoshop for me?',
			a: 'Yes: connect Claude Desktop, Claude Code or Cursor to Editmamei, the Photoshop MCP server described above, and it works the Photoshop tools on your computer, layer by layer, from what you say the photo needs.'
		},
		{
			q: 'Is Editmamei a web app?',
			a: 'No. Editmamei installs on your computer, as a one-click Claude Desktop extension or an npm package, and drives desktop Adobe Photoshop (or GIMP, in beta). Nothing runs in a browser, and there is no hosted editor.'
		},
		{
			q: 'Is Editmamei a Photoshop plugin?',
			a: "No. It is not installed through Adobe's marketplace and does not run inside Photoshop. It runs alongside Photoshop as a separate local program that sends editing instructions to it."
		},
		{
			q: 'Do I need Photoshop to use Editmamei?',
			a: 'For Photoshop editing, yes. Editmamei drives desktop Adobe Photoshop and needs an active Photoshop license and an install on the same computer. Its GIMP 3.2 support (beta, free) works with no Photoshop installed.'
		},
		{
			q: 'Does Editmamei work with GIMP?',
			a: "Yes, as a free beta, with GIMP 3.2 on Windows, macOS or Linux. GIMP runs in the background with nothing installed into it, so there is no window to watch. You follow the work through previews in chat, and every adjustment stays a live filter in the .xcf you open afterwards. The beta covers adjustments and effects, layers and composites, crop and resize, and checkpoints you can restore. It can't heal, clone, select a subject or sky, or add text yet. The GIMP page covers what the beta does and how to set it up.",
			link: { href: '/gimp', label: 'See the GIMP page' }
		},
		{
			q: 'Which Photoshop versions does Editmamei support?',
			a: 'Photoshop 2026 (version 27.x) is the version Editmamei is verified against, on Windows and macOS. Earlier versions may work, but they are unverified.'
		},
		{
			q: 'Does Editmamei work on Mac, Windows and Linux?',
			a: 'Photoshop editing runs on macOS 13 and later and on Windows 10 and 11. The GIMP beta also runs on Linux, including GIMP installed from Flathub.'
		},
		{
			q: 'Does Editmamei work with Lightroom or Photoshop Elements?',
			a: "No. Editmamei drives desktop Photoshop and, in beta, GIMP. Photoshop Elements doesn't expose the scripting interface that full Photoshop does, and Lightroom isn't supported either."
		},
		{
			q: 'Does Editmamei upload my photos?',
			a: "Your photo files stay on your machine, and the editing happens in Photoshop (or GIMP) on your machine. When you ask your AI assistant to look at a preview, a small downscaled version goes to that AI provider, the same as if you'd dropped the file into a chat with it. That's a property of which AI assistant you choose, not something Editmamei adds."
		},
		{
			q: 'What data does Editmamei collect, and how is it used?',
			a: 'Nothing about the content of your edits goes to Editmamei: no images, documents or file paths. Editmamei sends content-free usage data (which tools ran, whether they succeeded, how long they took) tied to a random install ID, so it is pseudonymous rather than anonymous. It is on by default, documented field by field, and you can switch it off in your settings. Editmamei also asks the public npm registry for the latest version at startup, with no identifiers, and you can switch that off. On Pro, activation sends the license key and a hashed device ID to a third-party licensing service, a daily check sends it the key, and each Pro startup asks the Editmamei delivery service, with the key, for a newer Pro module. None of these carry images, documents or file paths. Separately, when your AI assistant needs to see an edit, a downscaled preview goes to that assistant, as described above. The privacy page has the full breakdown.',
			link: { href: '/privacy', label: 'Read the privacy page' }
		},
		{
			q: 'Does Editmamei need an internet connection?',
			a: "Editing doesn't. Editmamei drives the editor on your computer without a network call. Your AI assistant needs one, unless it is a model you run yourself. The requests Editmamei makes (usage data, the update check, and on Pro the license check and the module update) are best-effort and never block an edit, and Pro keeps working offline for up to seven days after its last license check."
		},
		{
			q: 'Which AI clients work with Editmamei?',
			a: 'Any AI client that supports the Model Context Protocol (MCP). The most common starting points today are Claude Desktop, Claude Code, and Cursor. Claude Desktop is the easiest setup if you are not sure where to begin.'
		},
		{
			q: 'Does Editmamei use my AI credits or tokens?',
			a: 'Tokens, yes. Editmamei has no credit system of its own and never charges per image, but it runs on whatever AI client you connect it to, and every edit spends that client\'s tokens. That client might be a subscription, an API key, or a model you run yourself. A first edit is a long session, because the AI is working out the look as it goes; once a look is saved as a template and carried across a shoot, the cost per photo drops sharply. The blog post "What an edit costs" has the measurements.',
			link: { href: '/blog/what-an-edit-costs', label: 'Read "What an edit costs"' }
		},
		{
			q: 'Is Editmamei free?',
			a: `The Community edition is free: install it in one click as a Claude Desktop extension, or from npm. ${PRO_FEATURES_SENTENCE} Pro needs a paid license, with a 7-day free trial on the monthly plan. Pro is Photoshop-only, and GIMP support is the same in both editions.`
		},
		{
			q: 'Is there a free trial?',
			a: 'Yes. Pro has a 7-day free trial on the monthly plan. It needs a card, and unless you cancel during the trial it turns into the monthly plan automatically. Community is free with no time limit, and if a Pro subscription lapses, Editmamei keeps running as Community rather than locking you out.'
		},
		{
			q: 'Is Editmamei open source?',
			a: "No. It is fair source. Editmamei CE's source is public on GitHub under the Functional Source License (FSL-1.1-MIT), which is not an OSI-approved open-source license. You can read, run, modify and redistribute the code for almost anything, including commercial photo-editing work. For two years per release, the license holds back one thing: offering the code in a commercial product or service that competes with Editmamei CE or Pro. After those two years, each version converts to the plain MIT license. Editmamei Pro is a separate, commercially licensed module, and its source is not published.",
			link: { href: '/license', label: 'Read the license summary' }
		},
		{
			q: 'Can AI automate Photoshop, like applying one look to a whole shoot?',
			a: 'Yes, in two parts. A template carries the look: the AI applies it photo by photo, fitting the settings to each frame and checking the result against the template. A batch carries the mechanical part, running the crop, resize and export across the whole folder as one Photoshop pass. You review the output rather than redo the work.'
		},
		{
			q: 'Can Editmamei develop raw files?',
			a: 'In Photoshop, yes, two ways. It develops the raw file before it opens, with Upright leveling, perspective and lens correction, crop with straighten and your saved Camera Raw presets, and can open the result at 16-bit. It also applies Camera Raw to an open photo as a re-editable filter. In GIMP, opening a raw file needs a raw-develop plug-in installed in GIMP (darktable, RawTherapee or ART).'
		},
		{
			q: 'Does Editmamei use generative AI to create or alter pixels?',
			a: "No. Editmamei uses only the editor's own tools (Photoshop's, or GIMP's in the beta): adjustments, masks, selections and filters. Color grading lands as adjustments you can reopen and retune at any time, and retouching uses Photoshop's content-aware tools on a duplicated layer, so the original stays intact. The AI plans the edit, and no generative model touches your pixels."
		},
		{
			q: 'Is Editmamei made by Adobe?',
			a: 'No. Editmamei is an independent product. It connects to Adobe Photoshop but is not made by, affiliated with, or endorsed by Adobe.'
		}
	];

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: faqs.map(({ q, a }) => ({
			'@type': 'Question',
			name: q,
			acceptedAnswer: { '@type': 'Answer', text: a }
		}))
	};

	// JSON-LD has to be injected as a raw <script> tag ({@html} below). Two
	// guards: '<' inside the JSON is escaped to < so no answer text can
	// ever close the tag early, and the literal closing tag is split so the
	// Svelte/ESLint parsers don't terminate this script block on it.
	const jsonLd = `<script type="application/ld+json">${JSON.stringify(schema).replace(
		/</g,
		'\\u003c'
	)}${'<'}/script>`;
</script>

<Seo
	title="FAQ: GIMP, privacy, AI clients, editions · Editmamei"
	description="Common questions about Editmamei: the Photoshop MCP server, GIMP support, whether it uploads photos, how your data is used, and how the free and Pro editions differ."
	path="/faq"
/>

<svelte:head>
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- static local JSON-LD, '<' escaped above -->
	{@html jsonLd}
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">FAQ</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">Common questions</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-600">
			What Editmamei is, what it isn't, and how it works.
		</p>

		<dl class="mt-12 space-y-10">
			{#each faqs as { q, a, link } (q)}
				<div>
					<dt class="text-base font-semibold text-neutral-950">{q}</dt>
					<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
						{a}
						{#if link}
							<a href={link.href} class="mt-2 block underline hover:text-neutral-950"
								>{link.label}</a
							>
						{/if}
					</dd>
				</div>
			{/each}
		</dl>

		<div class="mt-16 border-t border-neutral-200 pt-8">
			<p class="text-sm text-neutral-600">
				Still have questions? See the full <a
					href={GITHUB_FAQ_DOCS_URL}
					class="underline hover:text-neutral-950">documentation on GitHub</a
				>
				or <a href="/contact" class="underline hover:text-neutral-950">get in touch</a>.
			</p>
			<p class="mt-3 text-sm text-neutral-600">
				Using GIMP? The <a href={GITHUB_GIMP_DOCS_URL} class="underline hover:text-neutral-950"
					>GIMP guide</a
				> covers requirements, detection, and what the beta can and can't do yet.
			</p>
			<p class="mt-3 text-sm text-neutral-600">
				Something not working? The <a
					href={GITHUB_TROUBLESHOOTING_DOCS_URL}
					class="underline hover:text-neutral-950">troubleshooting guide</a
				> covers Pro not unlocking, Photoshop not responding, and checking an update applied.
			</p>
		</div>
	</div>
</section>
