<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { PRO_FEATURES_SENTENCE } from '$lib/content/pro-features';
	import {
		CONNECT_PRIVACY_URL,
		CONNECT_TOOLS_URL,
		GITHUB_FAQ_DOCS_URL,
		GITHUB_GIMP_DOCS_URL,
		GITHUB_TROUBLESHOOTING_DOCS_URL
	} from '$lib/links';

	type Faq = { q: string; a: string; link?: { href: string; label: string } };

	// Each entry renders once on the page and once in the FAQPage JSON-LD.
	// `a` is the plain-text answer used in both places; the optional `link`
	// renders only on the page, under the answer. The JSON-LD flattens the
	// groups, so a question has to make sense out of its section: anything
	// true of only one product names that product in the question.
	const general: Faq[] = [
		{
			q: 'What is Editmamei?',
			a: "Editmamei lets an AI assistant edit your photos with real editing tools, from what you describe. It comes two ways. Editmamei Desktop is an MCP server that runs on your computer and edits in desktop Photoshop, or GIMP in beta. Editmamei Connect is a connector you add to your AI assistant, such as Claude or ChatGPT: you send a photo, it's edited on Editmamei's server, and there's nothing to install."
		},
		{
			q: 'Should I use Editmamei Desktop or Editmamei Connect?',
			a: 'Desktop if you work in Photoshop and want each edit as layers in your own document, on your own computer. Connect if you want to edit from a chat with your AI assistant on any device, including your phone, without installing any editing software.'
		},
		{
			q: 'Is Editmamei a web app?',
			a: "Editmamei Desktop isn't: it installs on your computer, as a one-click Claude Desktop extension or an npm package, and nothing runs in a browser. Editmamei Connect is the hosted option. You add it to your AI assistant as a connector and your photos are edited on Editmamei's server, so it works in a browser or a phone app with nothing installed."
		},
		{
			q: 'Does Editmamei upload my photos?',
			a: "Not on the desktop. With Editmamei Desktop your photo files stay on your machine, and the editing happens in Photoshop (or GIMP) on your machine. When you ask your AI assistant to look at a preview, a small downscaled version goes to that AI provider, the same as if you'd dropped the file into a chat with it. That's a property of which AI assistant you choose, not something Editmamei adds. Editmamei Connect, the cloud option, is different by design: you upload the photos you want edited, they're edited on Editmamei's server, and Connect's own privacy policy covers what happens to them."
		},
		{
			q: 'Is Editmamei free?',
			a: `Editmamei Desktop's Community edition is free: install it in one click as a Claude Desktop extension, or from npm. ${PRO_FEATURES_SENTENCE} Pro needs a paid license, with a 7-day free trial on the monthly plan. Pro is Photoshop-only, and GIMP support is the same in both editions. Editmamei Connect uses credits: new accounts start with 150 free credits and get up to 50 free credits each month.`
		},
		{
			q: 'Is there a free trial?',
			a: "Yes. Editmamei Desktop's Pro edition has a 7-day free trial on the monthly plan. It needs a card, and unless you cancel during the trial it turns into the monthly plan automatically. Community is free with no time limit, and if a Pro subscription lapses, Editmamei keeps running as Community rather than locking you out. Editmamei Connect has no trial to start: new accounts get 150 free credits."
		},
		{
			q: 'Is Editmamei open source?',
			a: "No. It is fair source. Editmamei CE's source is public on GitHub under the Functional Source License (FSL-1.1-MIT), which is not an OSI-approved open-source license. You can read, run, modify and redistribute the code for almost anything, including commercial photo-editing work. For two years per release, the license holds back one thing: offering the code in a commercial product or service that competes with Editmamei CE or Pro. After those two years, each version converts to the plain MIT license. Editmamei Pro is a separate, commercially licensed module, and its source is not published. Editmamei Connect is a hosted service, and its source is not published either.",
			link: { href: '/license', label: 'Read the license summary' }
		},
		{
			q: 'Is Editmamei made by Adobe?',
			a: 'No. Editmamei is an independent product. It connects to Adobe Photoshop but is not made by, affiliated with, or endorsed by Adobe.'
		}
	];

	const desktop: Faq[] = [
		{
			q: 'Is there an MCP server for Photoshop?',
			a: 'Editmamei is one: a Model Context Protocol (MCP) server for Adobe Photoshop. Your AI client connects to it, and it drives desktop Photoshop on your computer. You describe the edit, the AI plans the steps, and Photoshop carries them out.'
		},
		{
			q: 'Can an AI assistant edit photos in Photoshop for me?',
			a: 'Yes: connect Claude Desktop, Claude Code or Cursor to Editmamei, the Photoshop MCP server described above, and it works the Photoshop tools on your computer, layer by layer, from what you say the photo needs.'
		},
		{
			q: 'Is Editmamei a Photoshop plugin?',
			a: "No. It is not installed through Adobe's marketplace and does not run inside Photoshop. It runs alongside Photoshop as a separate local program that sends editing instructions to it."
		},
		{
			q: 'Do I need Photoshop to use Editmamei Desktop?',
			a: 'For Photoshop editing, yes. Editmamei Desktop drives desktop Adobe Photoshop and needs an active Photoshop license and an install on the same computer. Its GIMP 3.2 support (beta, free) works with no Photoshop installed. Editmamei Connect needs no editing software at all.'
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
			q: 'Does Editmamei Desktop work on Mac, Windows and Linux?',
			a: 'Photoshop editing runs on macOS 13 and later and on Windows 10 and 11. The GIMP beta also runs on Linux, including GIMP installed from Flathub.'
		},
		{
			q: 'Does Editmamei work with Lightroom or Photoshop Elements?',
			a: "No. Editmamei drives desktop Photoshop and, in beta, GIMP. Photoshop Elements doesn't expose the scripting interface that full Photoshop does, and Lightroom isn't supported either."
		},
		{
			q: 'What data does Editmamei Desktop collect, and how is it used?',
			a: 'Nothing about the content of your edits goes to Editmamei: no images, documents or file paths. Editmamei sends content-free usage data (which tools ran, whether they succeeded, how long they took) tied to a random install ID, so it is pseudonymous rather than anonymous. It is on by default, documented field by field, and you can switch it off in your settings. Editmamei also asks the public npm registry for the latest version at startup, with no identifiers, and you can switch that off. On Pro, activation sends the license key and a hashed device ID to a third-party licensing service, a daily check sends it the key, and each Pro startup asks the Editmamei delivery service, with the key, for a newer Pro module. None of these carry images, documents or file paths. Separately, when your AI assistant needs to see an edit, a downscaled preview goes to that assistant, as described above. The privacy page has the full breakdown.',
			link: { href: '/privacy', label: 'Read the privacy page' }
		},
		{
			q: 'Does Editmamei Desktop need an internet connection?',
			a: "Editing doesn't. Editmamei Desktop drives the editor on your computer without a network call. Your AI assistant needs one, unless it is a model you run yourself. The requests Editmamei makes (usage data, the update check, and on Pro the license check and the module update) are best-effort and never block an edit, and Pro keeps working offline for up to seven days after its last license check."
		},
		{
			q: 'Which AI clients work with Editmamei Desktop?',
			a: 'Any AI client that supports the Model Context Protocol (MCP). The most common starting points today are Claude Desktop, Claude Code, and Cursor. Claude Desktop is the easiest setup if you are not sure where to begin.'
		},
		{
			q: 'Does Editmamei Desktop use my AI credits or tokens?',
			a: 'Tokens, yes. Editmamei Desktop has no credit system of its own and never charges per image, but it runs on whatever AI client you connect it to, and every edit spends that client\'s tokens. That client might be a subscription, an API key, or a model you run yourself. A first edit is a long session, because the AI is working out the look as it goes; once a look is saved as a template and carried across a shoot, the cost per photo drops sharply. The blog post "What an edit costs" has the measurements.',
			link: { href: '/blog/what-an-edit-costs', label: 'Read "What an edit costs"' }
		},
		{
			q: 'Can AI automate Photoshop, like applying one look to a whole shoot?',
			a: 'Yes, in two parts. A template carries the look: the AI applies it photo by photo, fitting the settings to each frame and checking the result against the template. A batch carries the mechanical part, running the crop, resize and export across the whole folder as one Photoshop pass. You review the output rather than redo the work.'
		},
		{
			q: 'Can Editmamei Desktop develop raw files?',
			a: 'In Photoshop, yes, two ways. It develops the raw file before it opens, with Upright leveling, perspective and lens correction, crop with straighten and your saved Camera Raw presets, and can open the result at 16-bit. It also applies Camera Raw to an open photo as a re-editable filter. In GIMP, opening a raw file needs a raw-develop plug-in installed in GIMP (darktable, RawTherapee or ART).'
		},
		{
			q: 'Does Editmamei Desktop use generative AI to create or alter pixels?',
			a: "No. Editmamei Desktop uses only the editor's own tools (Photoshop's, or GIMP's in the beta): adjustments, masks, selections and filters. Color grading lands as adjustments you can reopen and retune at any time, and retouching uses Photoshop's content-aware tools on a duplicated layer, so the original stays intact. The AI plans the edit, and no generative model touches your pixels."
		}
	];

	const connect: Faq[] = [
		{
			q: 'What is Editmamei Connect?',
			a: "A remote MCP server you add to your AI assistant as a connector. You send a photo, describe the edit, and the assistant works through Connect's editing tools on Editmamei's server: it picks the tools, checks each result in a preview, and hands back a download link. There's no editing software to install, so it works on the web, on the desktop and on your phone.",
			link: { href: '/connect', label: 'See Editmamei Connect' }
		},
		{
			q: 'How do I add Editmamei Connect to my AI assistant?',
			a: 'Add https://connect.editmamei.com/mcp as a remote MCP server, which some assistants call a custom connector, and sign up with your email address when it asks you to sign in. On claude.ai, that is Settings › Connectors › Add custom connector, and it then shows up in the Claude desktop and phone apps too. In Claude Code, run claude mcp add --transport http editmamei-connect https://connect.editmamei.com/mcp, then run /mcp and choose it to sign in.'
		},
		{
			q: 'Do I need Photoshop to use Editmamei Connect?',
			a: "No. Connect does the editing on Editmamei's server, so you don't need Photoshop or any other editing software on your device, only an AI assistant to connect it to."
		},
		{
			q: 'How do I get photos into Editmamei Connect?',
			a: 'Ask your assistant to edit a photo and it gives you an upload link. Open it and choose photos from your camera roll on a phone or from your files on a laptop, up to ten at once. Connect can also open a photo from an https:// link.'
		},
		{
			q: 'What can Editmamei Connect do?',
			a: 'Clean up a photo (remove an object by naming it, heal dust spots and small blemishes, fix brightness and color), make product photos (a white or studio backdrop, a transparent cutout, the same item in other colors, and a check against Amazon, Etsy, Shopify and eBay image guidelines), retouch portraits (background blur and light skin smoothing), apply looks you can save and reuse, make posts (platform crops, carousel slides, story frames, photo grids, memes and stickers), and run the same edit over up to ten photos at once.',
			link: { href: CONNECT_TOOLS_URL, label: 'See every Connect tool' }
		},
		{
			q: 'Can I get a layered file from Editmamei Connect?',
			a: 'Yes. Ask for a PSD and Connect exports the edit as a layered Photoshop file you can keep working on. It can also export JPEG, PNG, WebP or TIFF.'
		},
		{
			q: 'How much does Editmamei Connect cost?',
			a: "Connect uses credits. New accounts start with 150 free credits and get up to 50 free credits each month, and credit packs and monthly plans are available from your Connect account. Your AI assistant's own usage counts against your plan with it as usual, separately from Connect's credits."
		},
		{
			q: 'What happens to my photos on Editmamei Connect?',
			a: "They're uploaded to Editmamei's server and edited there. An upload is deleted 24 hours after you upload it, and an edited file's download link stops working 24 hours after it is made. Connect never receives your conversation with your assistant, only the tool requests the assistant sends it. When the assistant looks at a preview, a downscaled copy goes to it, the same as any photo you put in a chat. Connect has its own privacy policy, separate from Editmamei Desktop's.",
			link: { href: CONNECT_PRIVACY_URL, label: "Read Connect's privacy policy" }
		},
		{
			q: 'Does Editmamei Connect use generative AI?',
			a: "It doesn't create images from a prompt, and it edits your original photo rather than making a new one. Most edits are ordinary editing tools: adjustments, masks, filters and crops. AI models do two specific jobs: finding what to select, such as the subject, the sky or an object you name, and, when you ask to remove an object, filling the space it leaves with background that matches its surroundings."
		},
		{
			q: 'Which AI assistants work with Editmamei Connect?',
			a: 'Claude (claude.ai, the Claude desktop and phone apps, and Claude Code), ChatGPT, Cursor, VS Code with GitHub Copilot, Codex, Gemini CLI and Goose all add Connect as a remote MCP server and sign in to it.'
		}
	];

	const sections = [
		{ id: 'about', title: 'About Editmamei', intro: '', faqs: general },
		{
			id: 'desktop',
			title: 'Editmamei Desktop',
			intro: 'Runs on your computer and edits in desktop Photoshop, or GIMP in beta.',
			faqs: desktop
		},
		{
			id: 'connect',
			title: 'Editmamei Connect',
			intro:
				"A connector for your AI assistant that edits photos on Editmamei's server. Nothing to install.",
			faqs: connect
		}
	];

	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: sections
			.flatMap((s) => s.faqs)
			.map(({ q, a }) => ({
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
	title="FAQ: Desktop, Connect, privacy, editions · Editmamei"
	description="Common questions about Editmamei Desktop, the Photoshop MCP server, and Editmamei Connect, the photo-editing connector for AI assistants: setup, GIMP support, your photos and data, credits and editions."
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

		<nav aria-label="FAQ sections" class="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
			{#each sections as s (s.id)}
				<a href="#{s.id}" class="text-neutral-600 underline hover:text-neutral-950">{s.title}</a>
			{/each}
		</nav>

		{#each sections as s (s.id)}
			<section id={s.id} class="mt-16 scroll-mt-24">
				<h2 class="text-2xl font-bold tracking-tight text-neutral-950">{s.title}</h2>
				{#if s.intro}
					<p class="mt-2 text-sm leading-relaxed text-neutral-600">{s.intro}</p>
				{/if}
				<dl class="mt-8 space-y-10">
					{#each s.faqs as { q, a, link } (q)}
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
			</section>
		{/each}

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
