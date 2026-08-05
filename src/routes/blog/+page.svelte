<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/blog';

	let { data } = $props();
</script>

<Seo
	path="/blog"
	title="Blog — Editmamei"
	description="Feature announcements, tutorials, and example edits from Editmamei, the MCP server that puts your AI assistant inside your own Photoshop."
/>

<svelte:head>
	<link rel="alternate" type="application/rss+xml" title="Editmamei blog" href="/blog/rss.xml" />
</svelte:head>

<main class="mx-auto max-w-3xl px-4 py-12">
	<header class="mb-10">
		<h1 class="text-3xl font-bold tracking-tight text-neutral-900">Blog</h1>
		<p class="mt-2 text-neutral-600">
			Feature announcements, tutorials, and example edits. Also available as an
			<a
				href="/blog/rss.xml"
				class="underline decoration-neutral-300 underline-offset-2 hover:text-neutral-950"
				>RSS feed</a
			>.
		</p>
	</header>

	{#if data.posts.length === 0}
		<p class="text-neutral-600">No posts yet.</p>
	{:else}
		<ul class="space-y-10">
			{#each data.posts as post (post.slug)}
				<li>
					<article>
						<p class="text-sm text-neutral-500">
							<time datetime={post.date}>{formatDate(post.date)}</time>
							{#if post.draft}
								<span
									class="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600"
									>Draft</span
								>
							{/if}
						</p>
						<h2 class="mt-1 text-xl font-semibold tracking-tight text-neutral-900">
							<a href={`/blog/${post.slug}`} class="hover:underline">{post.title}</a>
						</h2>
						<p class="mt-2 text-neutral-600">{post.description}</p>
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</main>
