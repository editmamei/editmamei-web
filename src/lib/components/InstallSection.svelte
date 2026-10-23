<script lang="ts">
	import { onMount } from 'svelte';
	import { track, trackOnce, upgradeSession } from '$lib/analytics/clarity';

	// Stable "latest release" asset URL: it always resolves to the newest published
	// release, so a new version never needs a site edit. Shared with /download.
	import {
		GITHUB_GETTING_STARTED_DOCS_URL,
		GITHUB_INSTALLATION_DOCS_URL,
		MCPB_DOWNLOAD_URL as MCPB_URL
	} from '$lib/links';
	import SubscribeForm from '$lib/components/SubscribeForm.svelte';
	import DownloadSignupDialog from '$lib/components/DownloadSignupDialog.svelte';

	const GITHUB_MANUAL_CONFIG_DOCS_URL = `${GITHUB_INSTALLATION_DOCS_URL}#manual-configuration`;

	// The signup dialog opens after the download fires, and only once per
	// browsing session: someone who downloads twice (a retry, a second machine)
	// has already answered, and asking again reads as nagging. sessionStorage is
	// a functional UI preference, not tracking, and is wrapped because a private
	// window can throw on access rather than simply returning null.
	const SEEN_KEY = 'editmamei:download-signup-seen';
	let signupOpen = $state(false);

	function seenThisSession(): boolean {
		try {
			return sessionStorage.getItem(SEEN_KEY) === '1';
		} catch {
			return false;
		}
	}

	function markSeen() {
		try {
			sessionStorage.setItem(SEEN_KEY, '1');
		} catch {
			/* private mode; showing it again next click is an acceptable fallback */
		}
	}

	function offerSignup() {
		if (seenThisSession()) return;
		markSeen();
		signupOpen = true;
	}

	// Two routes, two buttons, steps revealed in place (2026-08-14). The download
	// link points at a GitHub release asset, which is served as an attachment: the
	// file downloads and the visitor stays put with no feedback at all. The reveal
	// IS the feedback, and it keeps the section compact until it is relevant.
	// The anchor stays a real href so the download still works without JS, on a
	// middle-click, and from "copy link address". Both panels are always in the
	// HTML (hidden until opened), so search engines and AI crawlers can read the
	// install steps.
	let openRoute = $state<'mcpb' | 'npm' | null>(null);

	function toggle(route: 'mcpb' | 'npm') {
		openRoute = openRoute === route ? null : route;
	}

	// Highest-intent pre-conversion signal for the npm path: the visitor
	// highlighted the command snippet, almost certainly to copy it. Detected via
	// `selectionchange`. The snippet lives behind the reveal, so this only fires
	// once the panel is open.
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

<section
	id="install"
	class="scroll-mt-16 bg-brand px-4 py-20 text-paper md:py-28"
	aria-labelledby="install-title"
>
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[42rem]">
			<p class="lp-eyebrow text-accent">Install</p>
			<h2 id="install-title" class="lp-h2 mt-4 text-[#f7f4ec]">Install in about a minute.</h2>
			<p class="mt-6 text-lg leading-relaxed text-[#c9d8d1]">
				One click for Claude Desktop. For Claude Code, Cursor and other AI apps, two commands in a
				terminal (they need Node.js).
			</p>
		</div>

		<div class="mt-9 flex flex-wrap items-center gap-3">
			<a
				href={MCPB_URL}
				onclick={() => {
					track('download-mcpb-clicked');
					// Reveal the steps FIRST, so dismissing the dialog lands on them.
					openRoute = 'mcpb';
					offerSignup();
				}}
				aria-expanded={openRoute === 'mcpb'}
				aria-controls="install-mcpb"
				class="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-[17px] font-bold text-brand-deep shadow-[0_10px_40px_-12px_rgba(206,255,140,0.55)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
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
				class="inline-flex min-h-13 cursor-pointer items-center justify-center rounded-2xl border-[1.5px] border-accent/50 px-7 text-[17px] font-bold text-white transition-colors hover:bg-white/10"
			>
				Install with npm
			</button>
		</div>

		<div
			id="install-mcpb"
			hidden={openRoute !== 'mcpb'}
			class="mt-5 max-w-3xl rounded-[22px] bg-brand-deep/70 p-6 ring-1 ring-accent/20"
		>
			<p class="text-[16px] font-semibold text-white">
				Downloading <code
					class="rounded bg-brand-deep px-1.5 py-0.5 font-mono text-[14px] text-accent"
					>editmamei.mcpb</code
				>. Three steps left:
			</p>
			<ol class="mt-3 list-inside list-decimal space-y-1.5 text-[15px] text-[#c9d8d1]">
				<li>In Claude Desktop, open Settings, then Extensions.</li>
				<li>
					Install the downloaded
					<code class="rounded bg-brand-deep px-1.5 py-0.5 font-mono text-[14px] text-accent"
						>editmamei.mcpb</code
					>.
				</li>
				<li>Restart Claude Desktop, then ask it “Is Photoshop connected?”</li>
			</ol>
			<!-- Size is the .mcpb release asset, checked against the GitHub API on
			     2026-10-23 (v1.9.1 = 36,811,546 bytes). Windows reports about 35 for
			     that, macOS about 37, so ~35 covers both. Re-check at a release. -->
			<p class="mt-3 text-[13px] text-[#9fb5ac]">Free · Windows &amp; macOS · ~35&nbsp;MB</p>
		</div>

		<div
			id="install-npm"
			hidden={openRoute !== 'npm'}
			class="mt-5 max-w-3xl rounded-[22px] bg-brand-deep/70 p-6 ring-1 ring-accent/20"
		>
			<p class="text-[16px] font-semibold text-white">Run these two commands:</p>
			<pre
				bind:this={snippetEl}
				class="mt-3 overflow-x-auto rounded-xl bg-brand-deep px-4 py-3 font-mono text-[14px] leading-relaxed text-[#f4f1e8]"><code
					><span class="text-neutral-500">$</span> <span class="text-accent">npm</span
					> install -g editmamei
<span class="text-neutral-500">$</span> <span class="text-accent">editmamei</span> install</code
				></pre>
			<p class="mt-3 text-[15px] leading-relaxed text-[#c9d8d1]">
				The second command registers Editmamei with Claude Desktop, Claude Code and Cursor. Then
				restart your AI app and ask “Is Photoshop connected?” Other apps use the
				<a
					href={GITHUB_MANUAL_CONFIG_DOCS_URL}
					class="font-semibold text-accent underline underline-offset-4">install guide</a
				>.
			</p>
			<p class="mt-2 text-[13px] leading-relaxed text-[#9fb5ac]">
				That command also saves a skill file,
				<code class="rounded bg-brand-deep px-1 py-0.5 text-accent">editmamei-skill.zip</code>, to
				your Downloads folder. Upload it at claude.ai under Settings, then Skills (Add, then Upload
				skill), and Claude gets Editmamei's editing workflow.
			</p>

			<div class="mt-5 border-t border-accent/15 pt-4">
				<SubscribeForm compact tone="dark" placement="install_npm" />
			</div>
		</div>

		<div class="mt-12 grid gap-5 md:grid-cols-2">
			<div class="rounded-[22px] bg-brand-deep/60 p-6 ring-1 ring-white/10">
				<h3 class="text-lg font-bold text-white">Requirements</h3>
				<ul class="mt-3 space-y-2 text-[15px] leading-relaxed text-[#c9d8d1]">
					<li>
						Adobe Photoshop 2026, internal version 27.x (earlier versions unverified), or GIMP 3.2
					</li>
					<li>
						Windows 10/11 or macOS 13+ (Apple Silicon or Intel). With GIMP it also runs on Linux,
						through npm.
					</li>
					<li>Node.js 22+, only for the npm route (Claude Desktop bundles its own)</li>
					<li>
						An AI app that supports MCP. Editmamei has no AI of its own, so edits count against that
						app's plan (see <a
							href="/blog/what-an-edit-costs"
							class="font-semibold text-accent underline underline-offset-4">what an edit costs</a
						>)
					</li>
				</ul>
			</div>
			<div class="rounded-[22px] bg-brand-deep/60 p-6 ring-1 ring-white/10">
				<h3 class="text-lg font-bold text-white">AI apps</h3>
				<ul class="mt-3 space-y-2 text-[15px] leading-relaxed text-[#c9d8d1]">
					<li>Claude Desktop: one click <span class="text-[#9fb5ac]">(.mcpb)</span></li>
					<li>Claude Code: npm</li>
					<li>Cursor: npm</li>
				</ul>
				<p class="mt-3 text-[15px] leading-relaxed text-[#c9d8d1]">
					Other MCP apps use the same setup; the
					<a
						href={GITHUB_MANUAL_CONFIG_DOCS_URL}
						class="font-semibold text-accent underline underline-offset-4">install guide</a
					>
					has it.
				</p>
			</div>
		</div>

		<p class="mt-8 text-[15px] text-[#9fb5ac]">
			Full setup walkthrough in the
			<a
				href={GITHUB_GETTING_STARTED_DOCS_URL}
				class="font-semibold text-accent underline underline-offset-4">Getting Started guide</a
			>.
		</p>
	</div>
</section>

<DownloadSignupDialog bind:open={signupOpen} />
