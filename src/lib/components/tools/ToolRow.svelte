<script lang="ts">
	import { track } from '$lib/analytics/clarity';
	import type { Tool } from '$lib/content/tools';
	import ToolMedia from './ToolMedia.svelte';

	let { tool, showEditor = true }: { tool: Tool; showEditor?: boolean } = $props();

	let copied = $state(false);
	let resetTimer: ReturnType<typeof setTimeout> | undefined;

	async function copyId() {
		try {
			await navigator.clipboard.writeText(tool.id);
		} catch {
			return;
		}
		copied = true;
		track('tools-id-copied');
		clearTimeout(resetTimer);
		resetTimer = setTimeout(() => (copied = false), 1500);
	}
</script>

<li class="border-t border-neutral-200 py-4 first:border-t-0">
	<div class="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-6">
		<div class="min-w-0">
			<h3 id={tool.id} class="scroll-mt-24 text-base font-semibold text-neutral-950">
				{tool.task}
			</h3>
			<p class="mt-1 text-sm leading-relaxed text-neutral-700">{tool.summary}</p>
		</div>
		<div class="flex shrink-0 flex-wrap gap-1.5 md:justify-end">
			{#if showEditor}
				<span
					class="rounded-full border border-neutral-300 px-2 py-0.5 text-xs whitespace-nowrap text-neutral-700"
				>
					{tool.editor === 'gimp' ? 'GIMP · beta' : 'Photoshop'}
				</span>
			{/if}
			<span
				class="rounded-full border px-2 py-0.5 text-xs whitespace-nowrap {tool.edition === 'pro'
					? 'border-neutral-400 font-medium text-neutral-800'
					: 'border-neutral-200 text-neutral-600'}"
			>
				{tool.edition === 'pro' ? 'Pro' : 'Community'}
			</span>
		</div>
	</div>
	<div class="mt-2 flex items-center gap-2">
		<code class="font-mono text-xs break-all text-neutral-500">{tool.id}</code>
		<button
			type="button"
			onclick={copyId}
			aria-label="Copy tool name {tool.id}"
			class="rounded border border-neutral-200 px-1.5 py-0.5 text-xs text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-brand"
		>
			<span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
		</button>
	</div>
	{#if tool.media}
		<ToolMedia media={tool.media} />
	{/if}
</li>
