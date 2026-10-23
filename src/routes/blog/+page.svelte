<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import SubscribeForm from '$lib/components/SubscribeForm.svelte';
	import { formatDate } from '$lib/blog';

	let { data } = $props();
</script>

<Seo
	path="/blog"
	title="Editmamei blog: release notes and write-ups"
	description="Release notes and write-ups from Editmamei: Desktop for Photoshop and GIMP, and Connect, the photo-editing connector for AI apps."
/>

<PageHero
	eyebrow="Blog"
	title="Release notes and write-ups."
	lede="What changed in each release, and longer pieces on how Editmamei works and what an edit costs."
/>

<div class="mx-auto max-w-3xl px-4 py-12">
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

	<div class="mt-14">
		<SubscribeForm />
	</div>
</div>
