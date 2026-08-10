<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/blog';

	let { data } = $props();
	const post = $derived(data.post);
	const Content = $derived(data.content);

	const ORIGIN = 'https://editmamei.com';

	// BlogPosting schema so engines get the post's dates and authorship
	// (dates in SERPs, AI-citation grounding). Injected as a raw <script>
	// tag via {@html} with the same two guards as the FAQPage schema on
	// /faq: '<' in the JSON is escaped so frontmatter text can never close
	// the tag early, and the literal closing tag is split for the parsers.
	const jsonLd = $derived.by(() => {
		const org = { '@type': 'Organization', name: 'Editmamei', url: `${ORIGIN}/` };
		const schema = {
			'@context': 'https://schema.org',
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.description,
			url: `${ORIGIN}/blog/${post.slug}`,
			mainEntityOfPage: `${ORIGIN}/blog/${post.slug}`,
			datePublished: post.date,
			dateModified: post.updated ?? post.date,
			image: `${ORIGIN}/og-image.png`,
			author: org,
			publisher: org
		};
		return `<script type="application/ld+json">${JSON.stringify(schema).replace(
			/</g,
			'\\u003c'
		)}${'<'}/script>`;
	});
</script>

<Seo
	path={`/blog/${post.slug}`}
	title={`${post.title} — Editmamei`}
	description={post.description}
	article={{ published: post.date, modified: post.updated }}
/>

<svelte:head>
	{#if post.draft}
		<!-- Drafts never reach production builds; this is belt and braces for dev previews. -->
		<meta name="robots" content="noindex" />
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- local frontmatter-built JSON-LD, '<' escaped above -->
	{@html jsonLd}
</svelte:head>

<main class="mx-auto max-w-3xl px-4 py-12">
	<a href="/blog" class="text-sm text-neutral-500 hover:text-neutral-800">&larr; All posts</a>

	<article class="mt-6">
		<header class="mb-8">
			<p class="text-sm text-neutral-500">
				<time datetime={post.date}>{formatDate(post.date)}</time>
				{#if post.updated}
					<span class="ml-2"
						>Updated <time datetime={post.updated}>{formatDate(post.updated)}</time></span
					>
				{/if}
				{#if post.draft}
					<span
						class="ml-2 rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-600"
						>Draft</span
					>
				{/if}
			</p>
			<h1 class="mt-1 text-3xl font-bold tracking-tight text-neutral-900">{post.title}</h1>
			<p class="mt-3 text-lg text-neutral-600">{post.description}</p>
		</header>

		<div class="prose max-w-none prose-neutral">
			<Content />
		</div>
	</article>
</main>
