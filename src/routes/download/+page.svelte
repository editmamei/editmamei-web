<script lang="ts">
	// Stable "latest release" asset URL, same constant InstallSection uses: it
	// always resolves to the newest published release, so a new version never
	// needs a site edit.
	const MCPB_URL =
		'https://github.com/editmamei/editmamei-wiki/releases/latest/download/editmamei.mcpb';
	const RELEASES_URL = 'https://github.com/editmamei/editmamei-wiki/releases/latest';
</script>

<svelte:head>
	<title>Download Editmamei</title>
	<meta
		name="description"
		content="Download the latest Editmamei release: the one-click Claude Desktop extension, or the npm package for Claude Code, Cursor and other MCP clients."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Download</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Get the latest Editmamei
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			If Editmamei told you a new version is available, this is where to get it. Pick the one that
			matches how you installed it.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">Claude Desktop</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			If you installed Editmamei as a one-click extension, download the current
			<code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs">.mcpb</code> and reinstall
			it under <strong class="font-semibold text-neutral-950">Settings → Extensions</strong>, then
			restart Claude Desktop. Your licence key and settings are stored in your home folder rather
			than inside the extension, so updating keeps them.
		</p>
		<p class="mt-5">
			<a
				href={MCPB_URL}
				class="inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
			>
				Download editmamei.mcpb
			</a>
		</p>
		<p class="mt-3 text-xs leading-relaxed text-neutral-500">
			This link always resolves to the newest release.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">
			Claude Code, Cursor, and other MCP clients
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			If you installed from npm, you do not need a download. Update in place:
		</p>
		<pre
			class="mt-4 overflow-x-auto rounded-lg border border-neutral-200 bg-neutral-950 px-4 py-3 font-mono text-xs leading-relaxed text-neutral-100"><code
				>npm install -g editmamei@latest</code
			></pre>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			Then restart your MCP client so it picks up the new version.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">Every release</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			Release notes and previous versions are on the
			<a href={RELEASES_URL} class="font-semibold text-neutral-950 underline underline-offset-2"
				>releases page</a
			>. New here? The
			<a href="/" class="font-semibold text-neutral-950 underline underline-offset-2">home page</a>
			walks through a first install.
		</p>
	</div>
</section>
