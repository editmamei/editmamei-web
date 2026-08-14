<script lang="ts">
	import { onMount } from 'svelte';
	import { track, trackOnce, upgradeSession } from '$lib/analytics/clarity';

	// Stable "latest release" asset URL — always resolves to the newest published
	// release, so a new version never needs a site edit. Shared with /download.
	import { GITHUB_GETTING_STARTED_DOCS_URL, MCPB_DOWNLOAD_URL as MCPB_URL } from '$lib/links';

	// Two routes, two buttons, steps revealed in place (2026-08-14). The download
	// link points at a GitHub release asset, which is served as an attachment: the
	// file downloads and the visitor stays put with no feedback at all. The reveal
	// IS the feedback, and it keeps the section compact until it is relevant.
	// The anchor stays a real href so the download still works without JS, on a
	// middle-click, and from "copy link address".
	let openRoute = $state<'mcpb' | 'npm' | null>(null);

	function toggle(route: 'mcpb' | 'npm') {
		openRoute = openRoute === route ? null : route;
	}

	// Highest-intent pre-conversion signal for the npm path: the visitor
	// highlighted the command snippet, almost certainly to copy it. Detected via
	// `selectionchange`. The snippet now lives behind the reveal, so this only
	// fires once the panel is open — which is a truer signal than before.
	let snippetEl = $state<HTMLPreElement>();

	onMount(() => {
		if (typeof document === 'undefined') return;

		const handler = () => {
			if (!snippetEl) return;
			const sel = document.getSelection();
			if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
			const anchor = sel.getRangeAt(0).commonAncestorContainer;
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
		<div class="max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-accent uppercase">Install</p>
			<h2 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
				Install in about a minute.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-300">
				One click for Claude Desktop, one line for everything else.
			</p>
		</div>

		<div class="mt-7 flex flex-wrap items-center gap-3">
			<a
				href={MCPB_URL}
				onclick={() => {
					track('download-mcpb-clicked');
					openRoute = 'mcpb';
				}}
				aria-expanded={openRoute === 'mcpb'}
				aria-controls="install-mcpb"
				class="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-3 text-sm font-semibold text-brand-deep shadow-sm transition-colors hover:bg-accent/90"
			>
				<span aria-hidden="true">↓</span> Download for Claude Desktop
			</a>
			<button
				type="button"
				onclick={() => {
					track('install-npm-clicked');
					toggle('npm');
				}}
				aria-expanded={openRoute === 'npm'}
				aria-controls="install-npm"
				class="inline-flex cursor-pointer items-center justify-center rounded-md border border-accent/40 px-5 py-3 text-sm font-semibold text-accent transition-colors hover:border-accent/70 hover:bg-accent/10"
			>
				Install with npm
			</button>
		</div>

		{#if openRoute === 'mcpb'}
			<div
				id="install-mcpb"
				class="mt-4 rounded-xl border border-accent/20 bg-brand-deep/60 p-5 md:p-6"
			>
				<p class="text-sm font-semibold text-neutral-100">
					Downloading <code class="rounded bg-brand-deep px-1 py-0.5 text-xs text-accent"
						>editmamei.mcpb</code
					>. Three steps left:
				</p>
				<ol class="mt-3 list-inside list-decimal space-y-1.5 text-sm text-neutral-300">
					<li>In Claude Desktop, open Settings, then Extensions.</li>
					<li>
						Install the downloaded
						<code class="rounded bg-brand-deep px-1 py-0.5 text-xs text-accent">editmamei.mcpb</code
						>.
					</li>
					<li>Restart Claude Desktop, then ask it “Is Photoshop connected?”</li>
				</ol>
				<p class="mt-3 text-xs text-neutral-400">Free · Windows &amp; macOS · ~8&nbsp;MB</p>
			</div>
		{/if}

		{#if openRoute === 'npm'}
			<div
				id="install-npm"
				class="mt-4 rounded-xl border border-accent/20 bg-brand-deep/60 p-5 md:p-6"
			>
				<p class="text-sm font-semibold text-neutral-100">Run these two commands:</p>
				<pre
					bind:this={snippetEl}
					class="mt-3 overflow-x-auto rounded-lg border border-brand-light bg-brand-deep px-4 py-3 font-mono text-xs leading-relaxed"><code
						><span class="text-neutral-500">$</span> <span class="text-accent">npm</span
						> install -g editmamei
<span class="text-neutral-500">$</span> <span class="text-accent">editmamei</span> install</code
					></pre>
				<p class="mt-3 text-sm leading-relaxed text-neutral-300">
					The second command registers Editmamei with every MCP client it finds. Then restart the
					client and ask “Is Photoshop connected?”
				</p>
				<p class="mt-2 text-xs text-neutral-400">
					It also copies the Claude skill to your Downloads folder, ready to upload at claude.ai →
					Settings → Skills.
				</p>
			</div>
		{/if}

		<div class="mt-10 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Requirements</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>Adobe Photoshop 2026, internal version 27.x (earlier versions unverified)</li>
					<li>Windows 10/11 or macOS 12+ (Apple Silicon or Intel)</li>
					<li>Node.js 20+, only for the npm path (Claude Desktop bundles its own runtime)</li>
					<li>An MCP-compatible AI client</li>
				</ul>
			</div>
			<div class="rounded-xl border border-brand-light bg-brand-deep/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Supported clients</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>Claude Desktop: one-click <span class="text-neutral-500">(.mcpb)</span></li>
					<li>Claude Code: npm</li>
					<li>Cursor: npm</li>
					<li>Any other MCP host: npm</li>
				</ul>
			</div>
		</div>

		<p class="mt-8 text-sm text-neutral-400">
			Full setup walkthrough in the
			<a
				href={GITHUB_GETTING_STARTED_DOCS_URL}
				class="font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
				>Getting Started guide</a
			>.
		</p>
	</div>
</section>
