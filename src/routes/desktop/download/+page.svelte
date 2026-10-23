<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	// Shared with InstallSection so the two cannot drift, and so the repository
	// move at the split is one edit rather than a hunt. See $lib/links.
	import { MCPB_DOWNLOAD_URL, RELEASES_URL, GITHUB_TROUBLESHOOTING_DOCS_URL } from '$lib/links';
</script>

<!-- noindex: the in-app update notice links here; new installs start at /desktop#install. -->
<Seo
	title="Download the latest Editmamei Desktop"
	description="Download the latest Editmamei Desktop release: the one-click Claude Desktop extension, or the npm package for Claude Code, Cursor and other MCP apps."
	path="/desktop/download"
	noindex
/>

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Download' }]}
	eyebrow="Download"
	title="Get the latest Editmamei"
	lede="If Editmamei told you a new version is available, this is where to get it. Pick the one that matches how you installed it."
/>

<section class="bg-paper px-4 py-14 md:py-20">
	<div class="mx-auto max-w-3xl text-[16px] leading-relaxed text-neutral-700">
		<p>
			Installing for the first time? Start with the
			<a href="/desktop#install" class="font-semibold text-brand underline underline-offset-2"
				>install steps</a
			>.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-[-0.02em] text-brand">Claude Desktop</h2>
		<p class="mt-3">
			If you installed Editmamei as a one-click extension, download the current
			<code class="rounded bg-[#ece6d6] px-1.5 py-0.5 font-mono text-[14px]">.mcpb</code> and
			reinstall it under <strong class="font-semibold text-brand">Settings → Extensions</strong>,
			then restart Claude Desktop. Your settings are kept. If you use Pro, check the extension's Pro
			license key field is still filled in afterwards.
		</p>
		<a
			href={MCPB_DOWNLOAD_URL}
			class="mt-5 inline-flex min-h-12 items-center rounded-2xl bg-brand px-6 text-[16px] font-bold text-white transition-colors hover:bg-brand-light"
			>Download editmamei.mcpb</a
		>
		<p class="mt-3 text-[14px] text-neutral-500">This link always gets the newest release.</p>

		<h2 class="mt-12 text-2xl font-bold tracking-[-0.02em] text-brand">
			Claude Code, Cursor and other MCP apps
		</h2>
		<p class="mt-3">
			If your AI app runs <code class="rounded bg-[#ece6d6] px-1.5 py-0.5 font-mono text-[14px]"
				>npx -y editmamei</code
			>, there is nothing to download: it fetches the latest version each time it starts, so
			restarting the app is enough.
		</p>
		<p class="mt-3">If you installed globally with npm, update it with:</p>
		<pre
			class="mt-4 overflow-x-auto rounded-2xl bg-brand-deep px-5 py-4 font-mono text-[14px] leading-relaxed text-[#f4f1e8]"><code
				>npm install -g editmamei@latest</code
			></pre>
		<p class="mt-3">Then restart your AI app so it picks up the new version.</p>

		<h2 class="mt-12 text-2xl font-bold tracking-[-0.02em] text-brand">Every release</h2>
		<p class="mt-3">
			Release notes and previous versions are on the
			<a
				href={RELEASES_URL}
				rel="noopener"
				class="font-semibold text-brand underline underline-offset-2">releases page</a
			>. Something not working after an update? The
			<a
				href={GITHUB_TROUBLESHOOTING_DOCS_URL}
				rel="noopener"
				class="font-semibold text-brand underline underline-offset-2">troubleshooting guide</a
			> covers the common cases.
		</p>
	</div>
</section>
