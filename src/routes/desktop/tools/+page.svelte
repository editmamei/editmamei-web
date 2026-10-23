<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import ToolDirectory from '$lib/components/tools/ToolDirectory.svelte';
	import { categories, snapshot, toolCounts } from '$lib/content/tools';
	import { CONNECT_TOOLS_URL } from '$lib/links';
</script>

<Seo
	title="Editmamei Desktop tools: every MCP tool for Photoshop and GIMP · Editmamei"
	description="Every MCP tool Editmamei Desktop gives your AI app: {toolCounts.photoshop} for Photoshop and {toolCounts.gimp} for GIMP, in {categories.length} categories, with what each one does, its edition, and the name to call."
	path="/desktop/tools"
/>

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Tools' }]}
	eyebrow="Desktop tools"
	title="Every tool, for both editors."
	lede="Each row is one MCP tool your AI app can call, with what it does and whether it's free or Pro. Most cover a whole family of operations, so one row can stand for several things you'd do by hand in Photoshop or GIMP."
>
	<p class="text-sm text-[#9fb5ac]">
		{toolCounts.photoshop} Photoshop tools · {toolCounts.gimp} GIMP tools · Editmamei {snapshot.version},
		updated {snapshot.date} · Connect's tools are on
		<a href={CONNECT_TOOLS_URL} class="font-semibold text-accent underline underline-offset-2"
			>connect.editmamei.com</a
		>
	</p>
</PageHero>

<ToolDirectory />
