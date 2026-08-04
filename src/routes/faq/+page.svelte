<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';

	const faqs = [
		{
			q: 'Is there an MCP server for Photoshop?',
			a: 'Editmamei is one: a Model Context Protocol (MCP) server for Adobe Photoshop. Your AI client connects to it, and it drives the Photoshop already installed on your computer. You describe the edit, the AI plans the steps, and Photoshop carries them out.'
		},
		{
			q: 'Is Editmamei a web app?',
			a: 'No. Editmamei installs on your computer as a command-line package and drives the Adobe Photoshop you already have. Nothing runs in a browser; there is no hosted editor.'
		},
		{
			q: 'Is Editmamei a Photoshop plugin?',
			a: "No. It is not installed through Adobe's marketplace and does not run inside Photoshop. It runs alongside Photoshop as a separate local program that sends editing instructions to it."
		},
		{
			q: 'Do I need Photoshop to use Editmamei?',
			a: 'Yes. Editmamei drives your own copy of Adobe Photoshop. It is not a replacement for it. You need an active Photoshop license and an installation on the same computer.'
		},
		{
			q: 'Does Editmamei upload my photos?',
			a: "Your photo files stay on your machine. The editing happens inside your own Photoshop. When you ask your AI assistant to look at a preview, a small downscaled version goes to that AI provider, the same as if you'd dropped the file into a chat with it. That's a property of which AI assistant you choose, not something Editmamei adds."
		},
		{
			q: 'What data does Editmamei collect, and how is it used?',
			a: "Nothing about the content of your edits goes to us: no images, documents, or file paths. Editmamei does send anonymous, content-free usage data (which tools ran, whether they succeeded, how long they took) so a small team can see what works and what breaks. It's on by default, documented field by field, and you can switch it off in your settings. (Separately, when your AI assistant needs to see an edit, a downscaled preview goes to that assistant. See the question above.) Full breakdown on the privacy page."
		},
		{
			q: 'Which AI clients work with Editmamei?',
			a: 'Any AI client that supports the Model Context Protocol (MCP). The most common starting points today are Claude Desktop, Claude Code, and Cursor. Claude Desktop is the easiest setup if you are not sure where to begin.'
		},
		{
			q: 'Can an AI assistant edit photos in Photoshop for me?',
			a: 'Yes. Connect Claude Desktop, Claude Code, or Cursor to Editmamei and it becomes a Photoshop assistant: you say what the photo needs in plain English, and it works the real Photoshop tools on your machine, layer by layer.'
		},
		{
			q: 'Is Editmamei free?',
			a: 'The Community Edition is free. Install it from npm and use the full core toolkit at no cost. The Pro Edition adds tools for production workflows (the reproducible-template system, Camera Raw develop, subject-instance targeting, and Photoshop Actions and scripting) and requires a paid license.'
		},
		{
			q: 'Can AI automate Photoshop, like applying one look to a whole shoot?',
			a: "Photo by photo, yes. There is no one-click folder runner. The Pro template system saves a look once; the AI then reapplies it to each new photo, re-deriving the settings for that image rather than stamping identical values, and checks the result against the template's criteria. You review the output, not redo the work."
		},
		{
			q: 'Can AI color grade or retouch photos without generative AI?',
			a: "Both, non-destructively. Color grading lands as real adjustment layers (curves, levels, hue and saturation) you can re-open and re-tune any time. Retouching uses Photoshop's own content-aware tools and runs on a duplicated layer, so the original stays intact. No generative model touches your pixels."
		},
		{
			q: 'Does Editmamei use generative AI to create or alter pixels?',
			a: "No. Editmamei uses only Photoshop's own tools: adjustment layers, masks, selections, and filters. No generative model touches your pixels. The AI plans the edit; Photoshop carries it out with its own standard, non-generative tools."
		},
		{
			q: 'Does Editmamei work on Mac and Windows?',
			a: 'Yes. Editmamei runs on macOS 12 and later and Windows 10 and 11.'
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
	title="FAQ: privacy, data use, AI clients, editions — Editmamei"
	description="Common questions about Editmamei: the Photoshop MCP server, whether it uploads photos, how your data is used, and how the free and Pro editions differ."
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
			{#each faqs as { q, a } (q)}
				<div>
					<dt class="text-base font-semibold text-neutral-950">{q}</dt>
					<dd class="mt-2 text-sm leading-relaxed text-neutral-700">{a}</dd>
				</div>
			{/each}
		</dl>

		<div class="mt-16 border-t border-neutral-200 pt-8">
			<p class="text-sm text-neutral-600">
				Still have questions? See the full <a
					href="https://github.com/editmamei/editmamei-wiki/blob/main/docs/faq.md"
					class="underline hover:text-neutral-950">documentation on GitHub</a
				>
				or <a href="/contact" class="underline hover:text-neutral-950">get in touch</a>.
			</p>
		</div>
	</div>
</section>
