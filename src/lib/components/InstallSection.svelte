<script lang="ts">
	import { onMount } from 'svelte';
	import { trackOnce, upgradeSession } from '$lib/analytics/clarity';

	// Highest-intent pre-conversion signal: visitor highlighted the install
	// snippet, almost certainly to copy it. Detected via the document's
	// `selectionchange` event — if the active selection's range intersects
	// the install code block, we fire the event once per page load and
	// upgrade the session so Clarity prioritizes its replay.
	let snippetEl: HTMLPreElement;

	onMount(() => {
		if (typeof document === 'undefined' || !snippetEl) return;

		const handler = () => {
			const sel = document.getSelection();
			if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
			const range = sel.getRangeAt(0);
			// commonAncestorContainer is the lowest node that contains the
			// whole selection. If it sits inside the install snippet (or IS
			// the snippet), the visitor is selecting install text.
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

<section id="install" class="bg-[#143731] py-16 text-neutral-100 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-8 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-[#CEFF8C] uppercase">Install</p>
			<h2 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
				Two commands. Restart your MCP client.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-300">
				The first installs the package globally. The second registers Editmamei as an MCP server in
				your Claude Desktop / Cursor / Claude Code config, and drops the Claude skill files into
				<code class="rounded bg-[#0F2922] px-1.5 py-0.5 text-xs">~/.claude/skills/</code>.
			</p>
		</div>

		<div
			class="overflow-hidden rounded-xl border border-[#1F4D44] bg-[#0F2922] font-mono text-sm shadow-lg"
		>
			<div class="border-b border-[#1F4D44] px-4 py-2 text-xs tracking-wide text-neutral-500">
				terminal
			</div>
			<pre bind:this={snippetEl} class="overflow-x-auto px-4 py-4 leading-relaxed"><code
					><span class="text-neutral-500">$</span> <span class="text-[#CEFF8C]">npm</span
					> install -g editmamei
<span class="text-neutral-500">$</span> <span class="text-[#CEFF8C]">editmamei</span> install</code
				></pre>
		</div>

		<p class="mt-4 text-sm leading-relaxed text-neutral-400">
			Then restart your MCP client and ask:
			<span class="text-neutral-200 italic">"Is Photoshop connected?"</span> The AI calls
			<code class="rounded bg-[#0F2922] px-1.5 py-0.5 text-xs">photoshop_ping</code> and you'll see your
			Photoshop version returned.
		</p>

		<div class="mt-10 grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-[#1F4D44] bg-[#0F2922]/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Requirements</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>Node.js 20 or later</li>
					<li>Adobe Photoshop 2022 or later (2024+ recommended)</li>
					<li>Windows 10/11 or macOS 12+</li>
					<li>An MCP-compatible AI client</li>
				</ul>
			</div>
			<div class="rounded-xl border border-[#1F4D44] bg-[#0F2922]/60 p-5">
				<h3 class="text-sm font-semibold tracking-tight text-white">Supported clients</h3>
				<ul class="mt-3 space-y-1.5 text-sm text-neutral-300">
					<li>Claude Desktop</li>
					<li>Cursor</li>
					<li>Claude Code</li>
					<li>Any other MCP host</li>
				</ul>
			</div>
		</div>

		<p class="mt-8 text-sm text-neutral-400">
			Full setup walkthrough in the
			<a
				href="https://github.com/editmamei/editmamei-ce/blob/main/docs/getting-started.md"
				class="font-semibold text-[#CEFF8C] underline decoration-[#CEFF8C]/40 underline-offset-4 hover:decoration-[#CEFF8C]"
				>Getting Started guide</a
			>.
		</p>
	</div>
</section>
