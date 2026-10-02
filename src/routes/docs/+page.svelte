<script lang="ts">
	const BLOB = 'https://github.com/editmamei/editmamei/blob/main';

	const links = [
		{
			label: 'Install',
			href: `${BLOB}/docs/installation.md`,
			note: 'Claude Desktop, Claude Code, Cursor and other MCP clients.'
		},
		{
			label: 'Getting started',
			href: `${BLOB}/docs/getting-started.md`,
			note: 'From first ping to first edit.'
		},
		{ label: 'FAQ', href: `${BLOB}/docs/faq.md`, note: 'Compatibility, privacy, Pro and support.' },
		{
			label: 'Troubleshooting',
			href: `${BLOB}/docs/troubleshooting.md`,
			note: 'Missing tools, Pro not unlocking, version problems.'
		},
		{
			label: 'GIMP guide',
			href: `${BLOB}/docs/gimp.md`,
			note: 'Editing with GIMP 3.2 (beta), no Photoshop needed.'
		},
		{
			label: 'Pro features',
			href: `${BLOB}/docs/pro-features.md`,
			note: 'What Pro adds and how to activate it.'
		},
		{ label: 'Privacy', href: '/privacy', note: 'Exactly what data leaves your machine.' },
		{ label: 'Changelog', href: `${BLOB}/CHANGELOG.md`, note: 'Release notes.' }
	];
</script>

<svelte:head>
	<title>Documentation · Editmamei</title>
	<meta
		name="description"
		content="Editmamei documentation: install, getting started, FAQ, troubleshooting, the GIMP guide, Pro features, privacy and the changelog."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Docs</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">Documentation</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			The guides live in the public repository on GitHub. Pick one below.
		</p>

		<ul class="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
			{#each links as link (link.href)}
				<li class="py-4">
					<a
						href={link.href}
						class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
						>{link.label}</a
					>
					<p class="mt-1 text-sm leading-relaxed text-neutral-600">{link.note}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>
