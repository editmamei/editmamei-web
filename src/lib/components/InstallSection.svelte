<script lang="ts">
	import { onMount } from 'svelte';
	import { track, trackOnce, upgradeSession } from '$lib/analytics/clarity';

	// Stable "latest release" asset URL — always resolves to the newest published
	// release, so a new version never needs a site edit.
	const MCPB_URL =
		'https://github.com/editmamei/editmamei-ce/releases/latest/download/editmamei.mcpb';

	// Highest-intent pre-conversion signal for the npm path: the visitor
	// highlighted the command snippet, almost certainly to copy it. (Download
	// clicks are tracked directly via `track`.) Detected via `selectionchange`.
	let snippetEl: HTMLPreElement;

	onMount(() => {
		if (typeof document === 'undefined' || !snippetEl) return;

		const handler = () => {
			const sel = document.getSelection();
			if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			const anchor = range.commonAncestorContainer;
			if (snippetEl.contains(anchor) || snippetEl === anchor) {
				trackOnce('install-snippet-selected');
				upgradeSession('selected-install-snippet');
			}
		};

		document.addEventListener('selectionchange', handler);
		return () => document.removeEventListener('selectionchange', handler);
	});
</script>

<section id="install" class="bg-brand py-16 text-neutral-100 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-accent uppercase">Install</p>
			<h2 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
				Two ways in. Pick your client.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-300">
				Editmamei runs on your own machine with the Photoshop you already have. One-click for Claude
				Desktop, or a one-line install for everything else. Then restart your client and ask
				<span class="text-neutral-200 italic">"Is Photoshop connected?"</span>
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-2">
			<!-- Claude Desktop — one-click .mcpb (ships its own Node) -->
			<div class="flex flex-col rounded-xl border border-brand-light bg-brand-deep/60 p-6">
				<p class="text-xs font-semibold tracking-wider text-accent uppercase">
					Easiest · Claude Desktop
				</p>
				<h3 class="mt-2 text-lg font-bold tracking-tight text-white">One-click install</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-300">
					No terminal, nothing to configure — Claude Desktop ships its own runtime. Download the
					extension and add it from Settings.
				</p>
				<a
					href={MCPB_URL}
					onclick={() => track('download-mcpb-clicked')}
					class="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-brand-deep shadow-sm transition-colors hover:bg-accent/90"
				>
					<span aria-hidden="true">↓</span> Download for Claude Desktop
					<span class="opacity-70">(.mcpb)</span>
				</a>
				<p class="mt-3 text-xs text-neutral-400">Free · Windows &amp; macOS · ~8&nbsp;MB</p>
				<ol class="mt-4 list-inside list-decimal space-y-1.5 text-sm text-neutral-300">
					<li>Open Claude Desktop → Settings → Extensions.</li>
					<li>
						Install the downloaded
						<code class="rounded bg-brand-deep px-1 py-0.5 text-xs">editmamei.mcpb</code>.
					</li>
					<li>Restart Claude Desktop.</li>
				</ol>
			</div>

			<!-- Claude Code / Cursor / any MCP host — npm install -->
			<div class="flex flex-col rounded-xl border border-brand-light bg-brand-deep/60 p-6">
				<p class="text-xs font-semibold tracking-wider text-accent uppercase">
					Claude Code · Cursor · any MCP host
				</p>
				<h3 class="mt-2 text-lg font-bold tracking-tight text-white">Install from npm</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-300">
					For clients that already have Node. The first command installs the package; the second
					registers Editmamei with every MCP client it detects.
				</p>
				<pre
					bind:this={snippetEl}
					class="mt-5 overflow-x-auto rounded-lg border border-brand-light bg-brand-deep px-4 py-3 font-mono text-xs leading-relaxed"><code
						><span class="text-neutral-500">$</span> <span class="text-accent">npm</span
						> install -g editmamei
<span class="text-neutral-500">$</span> <span class="text-accent">editmamei</span> install</code
					></pre>
				<p class="mt-3 text-xs text-neutral-400">
					The setup command also copies the Claude skill to your Downloads folder, ready to upload
					at claude.ai → Settings → Skills.
				</p>
			</div>
		</div>

		<div class="mt-10 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Requirements</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>Adobe Photoshop 2026 (v27.x) &mdash; earlier versions unverified</li>
					<li>Windows 10/11 or macOS 12+ (Apple Silicon or Intel)</li>
					<li>
						Node.js 20+ &mdash; only for the npm path (Claude Desktop bundles its own runtime)
					</li>
					<li>An MCP-compatible AI client</li>
				</ul>
			</div>
			<div class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Supported clients</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>Claude Desktop &mdash; one-click <span class="text-neutral-500">(.mcpb)</span></li>
					<li>Claude Code &mdash; npm</li>
					<li>Cursor &mdash; npm</li>
					<li>Any other MCP host &mdash; npm</li>
				</ul>
			</div>
		</div>

		<p class="mt-8 text-sm text-neutral-400">
			Full setup walkthrough in the
			<a
				href="https://github.com/editmamei/editmamei-ce/blob/main/docs/getting-started.md"
				class="font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
				>Getting Started guide</a
			>.
		</p>
	</div>
</section>
