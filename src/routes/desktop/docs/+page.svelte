<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { CONNECT_URL, GITHUB_REPO_URL } from '$lib/links';

	const BLOB = `${GITHUB_REPO_URL}/blob/main`;

	const links = [
		{
			label: 'Install',
			href: `${BLOB}/docs/installation.md`,
			note: 'Claude Desktop, Claude Code, Cursor and other MCP apps.'
		},
		{
			label: 'Getting started',
			href: `${BLOB}/docs/getting-started.md`,
			note: 'From checking Photoshop is connected to your first edit.'
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
			note: 'Editing with GIMP 3.2, no Photoshop needed.'
		},
		{
			label: 'Pro features',
			href: `${BLOB}/docs/pro-features.md`,
			note: 'What Pro adds and how to activate it.'
		},
		{ label: 'Privacy', href: '/privacy', note: 'Exactly what data leaves your computer.' },
		{ label: 'Changelog', href: `${BLOB}/CHANGELOG.md`, note: 'Release notes for every version.' }
	];
</script>

<Seo
	title="Editmamei Desktop documentation"
	description="Editmamei Desktop guides: install, getting started, FAQ, troubleshooting, the GIMP guide, Pro features, privacy and the changelog."
	path="/desktop/docs"
/>

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Docs' }]}
	eyebrow="Docs"
	title="Editmamei Desktop documentation"
	lede="Editmamei Desktop is the MCP server that lets your AI app edit photos in Photoshop or GIMP on your computer. Its guides live in the public repository on GitHub; pick one below."
/>

<section class="bg-paper px-4 py-14 md:py-20">
	<div class="mx-auto max-w-3xl">
		<ul class="divide-y divide-[#ddd6c4] border-y border-[#ddd6c4]">
			{#each links as link (link.href)}
				<li class="py-5">
					<a
						href={link.href}
						class="text-lg font-bold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
						>{link.label}{#if link.href.startsWith('https://')}<span aria-hidden="true">
								↗</span
							><span class="sr-only"> (opens GitHub)</span>{/if}</a
					>
					<p class="mt-1 text-[16px] leading-relaxed text-neutral-700">{link.note}</p>
				</li>
			{/each}
		</ul>
		<p class="mt-8 text-[15px] text-neutral-700">
			Using Editmamei Connect instead? Its setup steps and tools are on
			<a href={CONNECT_URL} class="font-semibold text-brand underline underline-offset-2"
				>connect.editmamei.com</a
			>.
		</p>
	</div>
</section>
