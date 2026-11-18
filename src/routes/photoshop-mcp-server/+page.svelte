<script lang="ts">
	import PageHero from '#lib/components/PageHero.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import { desktopApp, faqPage } from '#lib/seo/schema.ts';
	import { track } from '#lib/analytics/clarity.ts';
	import {
		photoshopFeatureFloor,
		photoshopFeatureGroups
	} from '#lib/content/photoshop-features.ts';
	import {
		CURSOR_INSTALL_URL,
		GITHUB_INSTALLATION_DOCS_URL,
		GITHUB_REPO_URL,
		MCPB_DOWNLOAD_URL,
		VSCODE_INSTALL_URL
	} from '#lib/links.ts';

	// A page for people who search for a Photoshop MCP server by that name: what
	// one is, how to add Editmamei to their AI app, and what it does in
	// Photoshop. Facts checked against the public repo's docs (clients.md,
	// installation.md, faq.md, privacy.md) and the /desktop page.

	const CLIENTS_DOCS_URL = `${GITHUB_REPO_URL}/blob/main/docs/clients.md`;

	const INSTALL_CMD = 'npx -y editmamei install';
	const JSON_CONFIG = `{
  "mcpServers": {
    "editmamei": { "command": "npx", "args": ["-y", "editmamei"] }
  }
}`;
	const CLAUDE_CODE_CMD = 'claude mcp add --scope user editmamei -- npx -y editmamei';
	const TOML_CONFIG = `[mcp_servers.editmamei]
command = "npx"
args = ["-y", "editmamei"]
startup_timeout_sec = 60
tool_timeout_sec = 600`;
	const PS_ONLY_CMD = 'npx -y @editmamei/photoshop-mcp';

	let copied = $state<string | null>(null);
	async function copy(id: string, text: string) {
		track(`psmcp-copy-${id}`);
		try {
			await navigator.clipboard.writeText(text);
			copied = id;
			setTimeout(() => {
				if (copied === id) copied = null;
			}, 2000);
		} catch {
			/* no clipboard access; the text is still there to select */
		}
	}

	// What to look for in any Photoshop MCP server, and how Editmamei answers each.
	const checklist = [
		{
			title: 'Edits you can keep working on',
			body: 'Editmamei works the way a careful retoucher does: adjustment layers, masks and named groups, not baked-in pixels. Open the file afterwards and every step is still there to change by hand.'
		},
		{
			title: 'An AI that checks its own work',
			body: 'After each step your AI can look at a small preview and read histograms, so it sees what changed and corrects course instead of guessing.'
		},
		{
			title: 'Photoshop’s own tools, not a redraw',
			body: 'Editmamei doesn’t generate or redraw your photo. Every change is made by Photoshop on your full-size photo, and Photoshop’s own AI features, like Relight, run only when you ask for them.'
		},
		{
			title: 'Nothing added to Photoshop',
			body: 'Editmamei talks to Photoshop through its built-in scripting interface. There is no plugin or panel to install, and it never moves your mouse or reads your screen.'
		},
		{
			title: 'Your photos stay on your computer',
			body: 'Your AI sees small previews and details it reads, like layer names, so it can check its work. You can switch previews off. Editmamei never sends your photos or previews to us.'
		},
		{
			title: 'Works in the AI app you already use',
			body: 'One server for Claude Desktop, the ChatGPT desktop app, Cursor, VS Code, Codex and any other app that runs local MCP servers, with one-click and one-command installs.'
		}
	];

	const faqs = [
		{
			q: 'What is a Photoshop MCP server?',
			a: 'MCP (Model Context Protocol) is the standard way AI apps plug into other software. A Photoshop MCP server lets an AI app use Photoshop’s own features, so when you ask for an edit in a chat, the AI can open your photo, add adjustment layers, make selections and export the result in Photoshop itself.'
		},
		{
			q: 'Is Editmamei free?',
			a: `Yes. The free edition uses more than ${photoshopFeatureFloor} of Photoshop's features, from Curves and Select Subject to Content-Aware Fill, enough for a full edit of any photo. Pro adds Camera Raw, Warp, your recorded Actions, saved looks and batch editing across a folder.`
		},
		{
			q: 'Does it work with ChatGPT?',
			a: 'Yes, in the ChatGPT desktop app, in Work mode. Run npx -y editmamei install, then quit and reopen the app. ChatGPT in a browser cannot start a server on your computer; for that, use Editmamei Connect, the hosted version.'
		},
		{
			q: 'Which versions of Photoshop does it support?',
			a: 'Adobe Photoshop 2026 (version 27) on Windows 10 or 11 and macOS 13 or later. It does not work with Photoshop Elements, which lacks the scripting interface it uses, and it does not drive Lightroom.'
		},
		{
			q: 'Is it generative AI?',
			a: 'No. Editmamei generates no images. Your AI app decides the steps, and Photoshop carries them out with its ordinary editing tools on your own photo.'
		},
		{
			q: 'Do my photos get uploaded?',
			a: 'No. The edit happens in Photoshop on your computer. Your AI app sees small previews so it can check its work, and you can switch previews off. Editmamei never sends your photos or previews to us.'
		},
		{
			q: 'Is it made by Adobe?',
			a: 'No. Editmamei is an independent product. It connects to Adobe Photoshop but is not made by, affiliated with, or endorsed by Adobe.'
		}
	];
</script>

<Seo
	title="Photoshop MCP server for Claude, ChatGPT, Cursor: Editmamei"
	description="A free Photoshop MCP server. Your AI app edits in Photoshop on your computer, in adjustment layers and masks you can keep editing. Install with one command."
	path="/photoshop-mcp-server"
	image="/og/desktop.jpg"
	imageAlt="Editmamei Desktop: your AI, working in your Photoshop"
	schema={[desktopApp, faqPage(faqs)]}
/>

{#snippet code(id: string, text: string, label: string)}
	<div class="relative mt-3 min-w-0">
		<pre
			class="overflow-x-auto rounded-xl bg-brand-deep px-4 py-3 pr-20 font-mono text-[14px] leading-relaxed text-[#f4f1e8]"><code
				>{text}</code
			></pre>
		<button
			type="button"
			onclick={() => copy(id, text)}
			aria-label={`Copy ${label}`}
			class="absolute top-2 right-2 cursor-pointer rounded-lg bg-white/10 px-3 py-1.5 text-[13px] font-semibold text-accent transition-colors hover:bg-white/20"
			>{copied === id ? 'Copied' : 'Copy'}</button
		>
	</div>
{/snippet}

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Photoshop MCP server' }]}
	eyebrow="Photoshop MCP server"
	title="The Photoshop MCP server for your AI app"
	lede="Editmamei connects Claude, ChatGPT, Cursor and other AI apps to Adobe Photoshop on your computer. Ask for an edit in the chat, and it happens in Photoshop with Photoshop's own tools, as layers and masks you can keep editing. Free to use."
>
	<div class="max-w-xl">
		<p class="text-[15px] font-semibold text-[#dfe8e3]">
			Install it in Claude, ChatGPT, Cursor and Codex at once:
		</p>
		{@render code('hero', INSTALL_CMD, 'the install command')}
		<p class="mt-3 text-[14px] text-[#9fb5ac]">
			Needs Node.js 22 or later. Prefer one click?
			<a href="#setup" class="font-semibold text-accent underline underline-offset-4"
				>See every way to install</a
			>.
		</p>
	</div>
</PageHero>

<section class="bg-paper px-4 py-16 md:py-24" aria-labelledby="what-title">
	<div class="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
		<div>
			<p class="lp-eyebrow text-terracotta-ink">What it is</p>
			<h2 id="what-title" class="lp-h2 mt-4 text-brand">Your AI decides. Photoshop edits.</h2>
		</div>
		<div class="space-y-5 text-[17px] leading-relaxed text-neutral-800">
			<p>
				MCP is the standard way AI apps plug into other software. Editmamei is an MCP server that
				runs on your computer and lets your AI app use Photoshop's own features: open a file, add a
				Curves layer, select the sky, mask a subject, retouch, add text, export.
			</p>
			<p>
				You ask for an edit in plain words. Your AI plans the steps, Editmamei carries each one out
				in Photoshop, and a small preview comes back so the AI can check the result before the next
				step. When it's done, the document is still in layers, ready for you to keep editing.
			</p>
			<p>
				<a
					href="/desktop"
					onclick={() => track('psmcp-desktop-link')}
					class="font-semibold text-brand underline underline-offset-2"
					>See real requests and results on the Editmamei Desktop page <span aria-hidden="true"
						>→</span
					></a
				>
			</p>
		</div>
	</div>
</section>

<section
	id="setup"
	class="scroll-mt-16 bg-brand px-4 py-16 text-paper md:py-24"
	aria-labelledby="setup-title"
>
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-accent">Set it up</p>
		<h2 id="setup-title" class="lp-h2 mt-4 text-[#f7f4ec]">Add it to your AI app.</h2>
		<p class="mt-5 max-w-[42rem] text-lg leading-relaxed text-[#c9d8d1]">
			Pick your app. After any of these, restart the app, open Photoshop and ask “Is Photoshop
			connected?”
		</p>

		<div class="mt-10 flex flex-wrap gap-3">
			<a
				href={MCPB_DOWNLOAD_URL}
				onclick={() => track('psmcp-download-mcpb')}
				class="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-accent px-6 text-[16px] font-bold text-brand-deep transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
				><span aria-hidden="true">↓</span> Download for Claude Desktop</a
			>
			<a
				href={CURSOR_INSTALL_URL}
				target="_blank"
				rel="noopener"
				onclick={() => track('psmcp-install-cursor')}
				class="inline-flex min-h-12 items-center justify-center rounded-2xl border-[1.5px] border-accent/50 px-6 text-[16px] font-bold text-white transition-colors hover:bg-white/10"
				>Install in Cursor</a
			>
			<a
				href={VSCODE_INSTALL_URL}
				target="_blank"
				rel="noopener"
				onclick={() => track('psmcp-install-vscode')}
				class="inline-flex min-h-12 items-center justify-center rounded-2xl border-[1.5px] border-accent/50 px-6 text-[16px] font-bold text-white transition-colors hover:bg-white/10"
				>Install in VS Code</a
			>
		</div>
		<p class="mt-3 text-[14px] text-[#9fb5ac]">
			For Claude Desktop: Settings, Desktop app, Manage next to Extensions, then Advanced settings
			and Install Extension, and choose the downloaded <code class="text-accent"
				>editmamei.mcpb</code
			>. It brings its own Node.js.
		</p>

		<div class="mt-12 grid gap-6 lg:grid-cols-2">
			<div class="min-w-0 rounded-[22px] bg-brand-deep/60 p-6 ring-1 ring-white/10">
				<h3 class="text-lg font-bold text-white">ChatGPT desktop app, Claude Code, Codex</h3>
				<p class="mt-2 text-[15px] leading-relaxed text-[#c9d8d1]">
					One command adds Editmamei to each of these it finds, and to Claude Desktop and Cursor:
				</p>
				{@render code('install', INSTALL_CMD, 'the install command')}
				<p class="mt-3 text-[14px] leading-relaxed text-[#9fb5ac]">
					In the ChatGPT desktop app, quit it fully from the system tray, reopen it, and use Work
					mode.
				</p>
			</div>
			<div class="min-w-0 rounded-[22px] bg-brand-deep/60 p-6 ring-1 ring-white/10">
				<h3 class="text-lg font-bold text-white">Any other MCP app</h3>
				<p class="mt-2 text-[15px] leading-relaxed text-[#c9d8d1]">
					Windsurf, Gemini CLI, Cline, Warp, Kiro, JetBrains AI Assistant and most others take this
					entry in their MCP settings:
				</p>
				{@render code('json', JSON_CONFIG, 'the JSON config')}
				<p class="mt-3 text-[14px] leading-relaxed text-[#9fb5ac]">
					Each app's file and quirks are in the
					<a href={CLIENTS_DOCS_URL} class="font-semibold text-accent underline underline-offset-4"
						>client guide</a
					>.
				</p>
			</div>
			<div class="min-w-0 rounded-[22px] bg-brand-deep/60 p-6 ring-1 ring-white/10">
				<h3 class="text-lg font-bold text-white">By hand: Claude Code</h3>
				{@render code('claude-code', CLAUDE_CODE_CMD, 'the Claude Code command')}
			</div>
			<div class="min-w-0 rounded-[22px] bg-brand-deep/60 p-6 ring-1 ring-white/10">
				<h3 class="text-lg font-bold text-white">By hand: ChatGPT desktop app and Codex</h3>
				<p class="mt-2 text-[15px] leading-relaxed text-[#c9d8d1]">
					Add to <code class="text-accent">~/.codex/config.toml</code>. The longer timeouts give the
					first start and the slower steps room to finish.
				</p>
				{@render code('toml', TOML_CONFIG, 'the TOML config')}
			</div>
		</div>

		<div class="mt-10 max-w-3xl">
			<h3 class="text-lg font-bold text-white">Photoshop only</h3>
			<p class="mt-2 text-[15px] leading-relaxed text-[#c9d8d1]">
				Editmamei also drives GIMP. If your app caps how many MCP tools it loads, this package
				starts the same server for Photoshop only. In any config above, put this package after <code
					class="text-accent">npx -y</code
				>
				instead of <code class="text-accent">editmamei</code>:
			</p>
			{@render code('ps-only', PS_ONLY_CMD, 'the Photoshop-only command')}
		</div>

		<p class="mt-10 text-[15px] text-[#9fb5ac]">
			Requirements: Adobe Photoshop 2026 on Windows 10/11 or macOS 13+, and Node.js 22 or later
			(except with the Claude Desktop download). Full steps are in the
			<a
				href={GITHUB_INSTALLATION_DOCS_URL}
				class="font-semibold text-accent underline underline-offset-4">install guide</a
			>.
		</p>
	</div>
</section>

<section class="bg-white px-4 py-16 md:py-24" aria-labelledby="tools-title">
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-terracotta-ink">What it can do</p>
		<h2 id="tools-title" class="lp-h2 mt-4 max-w-[24ch] text-brand">
			More than {photoshopFeatureFloor} Photoshop features, free.
		</h2>
		<p class="mt-5 max-w-[42rem] text-lg leading-relaxed text-neutral-700">
			Your AI works with Photoshop's own adjustments, filters, selections and retouching, called by
			the same names you know from its menus.
		</p>
		<ul class="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each photoshopFeatureGroups as g (g.title)}
				<li class="rounded-[22px] bg-paper p-6 ring-1 ring-brand/10">
					<div class="flex items-baseline justify-between gap-3">
						<h3 class="text-lg font-bold text-brand">{g.title}</h3>
						<span class="text-[14px] text-neutral-600">{g.items.length}</span>
					</div>
					<p class="mt-2 text-[15px] leading-relaxed text-neutral-700">
						{g.summary ?? g.items.join(', ')}
					</p>
				</li>
			{/each}
		</ul>
		<p class="mt-8 max-w-[48rem] text-[16px] leading-relaxed text-neutral-800">
			<strong class="text-brand">Pro adds</strong> Camera Raw as a re-editable filter, raw files
			developed before they open, Warp, your recorded Actions, selections of a named object or a
			face, saved looks, and batch runs across a whole folder.
			<a
				href="/desktop/pricing"
				onclick={() => track('psmcp-pro-link')}
				class="font-semibold text-brand underline underline-offset-2">See Pro</a
			>
			·
			<a
				href="/desktop/tools"
				onclick={() => track('psmcp-tools-link')}
				class="font-semibold text-brand underline underline-offset-2"
				>How Editmamei reaches each one <span aria-hidden="true">→</span></a
			>
		</p>
	</div>
</section>

<section class="bg-paper px-4 py-16 md:py-24" aria-labelledby="look-title">
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-terracotta-ink">Choosing one</p>
		<h2 id="look-title" class="lp-h2 mt-4 max-w-[22ch] text-brand">
			What to look for in a Photoshop MCP server.
		</h2>
		<ul class="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
			{#each checklist as item (item.title)}
				<li class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10">
					<h3 class="text-lg font-bold text-brand">{item.title}</h3>
					<p class="mt-2 text-[15px] leading-relaxed text-neutral-700">{item.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<section class="bg-white px-4 py-16 md:py-24" aria-labelledby="faq-title">
	<div class="mx-auto max-w-3xl">
		<p class="lp-eyebrow text-terracotta-ink">Questions</p>
		<h2 id="faq-title" class="lp-h2 mt-4 text-brand">Common questions.</h2>
		<dl class="mt-10 divide-y divide-[#ddd6c4] border-y border-[#ddd6c4]">
			{#each faqs as f (f.q)}
				<div class="py-6">
					<dt class="text-lg font-bold text-brand">{f.q}</dt>
					<dd class="mt-2 text-[16px] leading-relaxed text-neutral-700">{f.a}</dd>
				</div>
			{/each}
		</dl>
		<p class="mt-8 text-[15px] text-neutral-700">
			More in the <a
				href="/faq#desktop"
				class="font-semibold text-brand underline underline-offset-2">FAQ</a
			>.
		</p>

		<div class="mt-12 grid gap-4 sm:grid-cols-2">
			<a
				href="/desktop#gimp"
				onclick={() => track('psmcp-xlink-gimp')}
				class="group rounded-[22px] bg-paper p-6 ring-1 ring-brand/10 transition-shadow hover:shadow-md"
			>
				<span class="block text-lg font-bold text-brand">No Photoshop?</span>
				<span class="mt-1 block text-[15px] text-neutral-700"
					>The same server edits in GIMP, free, on Windows, macOS and Linux.</span
				>
			</a>
			<a
				href="/connect"
				onclick={() => track('psmcp-xlink-connect')}
				class="group rounded-[22px] bg-brand p-6 text-white transition-shadow hover:shadow-lg"
			>
				<span class="block text-lg font-bold">Using ChatGPT or Claude in a browser?</span>
				<span class="mt-1 block text-[15px] text-white/80"
					>Editmamei Connect is the hosted version, with nothing to install.</span
				>
			</a>
		</div>
	</div>
</section>
