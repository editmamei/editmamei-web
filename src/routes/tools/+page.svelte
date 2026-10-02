<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import ToolDirectory from '$lib/components/tools/ToolDirectory.svelte';
	import { categories, snapshot, toolCounts } from '$lib/content/tools';
</script>

<Seo
	title="All tools for Photoshop and GIMP · Editmamei"
	description="Every tool Editmamei gives your AI assistant: {toolCounts.photoshop} for Photoshop and {toolCounts.gimp} for GIMP (beta), in {categories.length} categories, with what each one does and the name to call."
	path="/tools"
/>

<section class="bg-white pt-12 pb-8 md:pt-16">
	<div class="mx-auto max-w-6xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">Tools</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Every tool, both editors.
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Each row is one tool your AI can call. Most cover a whole family of operations, so one row can
			stand for several things you'd do by hand in Photoshop or GIMP.
		</p>
		<p class="mt-3 text-sm text-neutral-500">
			Editmamei {snapshot.version} · updated {snapshot.date}
		</p>
	</div>
</section>

<ToolDirectory />
