<script lang="ts">
	import PageHero from '#lib/components/PageHero.svelte';
	import Seo from '#lib/components/Seo.svelte';
	import ToolDirectory from '#lib/components/tools/ToolDirectory.svelte';
	import { snapshot, toolCounts } from '#lib/content/tools/index.ts';
	import { CONNECT_TOOLS_URL } from '#lib/links.ts';
</script>

<Seo
	title="Every MCP tool for Photoshop and GIMP · Editmamei Desktop"
	description="All {toolCounts.total} MCP tools Editmamei Desktop gives your AI app: {toolCounts.photoshop} for Photoshop, {toolCounts.gimp} for GIMP, each with what it does and whether it's free or Pro."
	path="/desktop/tools"
	image="/og/tools.jpg"
	imageAlt="Every MCP tool for Photoshop and GIMP in Editmamei Desktop"
/>

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Tools' }]}
	eyebrow="Desktop tools"
	title="Every MCP tool for Photoshop and GIMP."
	lede="Each row is one MCP tool your AI app can call, with what it does and whether it's free or Pro. Most cover a whole family of operations, so one row can stand for several things you'd do by hand in Photoshop or GIMP."
>
	<p class="text-sm text-[#9fb5ac]">
		{toolCounts.photoshop} MCP tools for Photoshop · {toolCounts.gimp} for GIMP · Editmamei {snapshot.version},
		updated {snapshot.date} · Connect's tools are on
		<a href={CONNECT_TOOLS_URL} class="font-semibold text-accent underline underline-offset-2"
			>connect.editmamei.com</a
		>
	</p>
</PageHero>

<ToolDirectory />
