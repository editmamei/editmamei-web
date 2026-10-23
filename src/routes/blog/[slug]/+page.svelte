<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { formatDate } from '$lib/blog';
	import { ORG_ID, ORIGIN, ldScript } from '$lib/seo/schema';

	let { data } = $props();
	const post = $derived(data.post);
	const Content = $derived(data.content);

	// The post's own title stays on the page; search gets seoTitle when a post
	// sets one, with the brand added only if it isn't already in it.
	const title = $derived(
		post.seoTitle
			? post.seoTitle.includes('Editmamei')
				? post.seoTitle
				: `${post.seoTitle} · Editmamei`
			: `${post.title} · Editmamei`
	);
	const description = $derived(post.seoDescription ?? post.description);

	// BlogPosting schema so engines get the post's dates and authorship
	// (dates in SERPs, AI-citation grounding). ldScript escapes '<' so no
	// frontmatter text can close the tag early.
	const jsonLd = $derived(
		ldScript({
			'@type': 'BlogPosting',
			headline: post.title,
			description,
			url: `${ORIGIN}/blog/${post.slug}`,
			mainEntityOfPage: `${ORIGIN}/blog/${post.slug}`,
			datePublished: post.date,
			dateModified: post.updated ?? post.date,
			inLanguage: 'en-US',
			image: `${ORIGIN}/og-card.jpg`,
			author: { '@type': 'Person', name: 'Alex', worksFor: { '@id': ORG_ID } },
			publisher: { '@id': ORG_ID }
		})
	);
</script>

<Seo
	path={`/blog/${post.slug}`}
	{title}
	{description}
	article={{ published: post.date, modified: post.updated }}
/>

<svelte:head>
	{#if post.draft}
		<!-- Drafts never reach production builds; this is belt and braces for dev previews. -->
		<meta name="robots" content="noindex" />
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own schema object, '<' escaped in ldScript -->
	{@html jsonLd}
</svelte:head>

<PageHero
	crumbs={[{ label: 'Blog', href: '/blog' }, { label: post.title }]}
	title={post.title}
	lede={post.description}
>
	<p class="text-[14px] text-[#9fb5ac]">
		By Alex · <time datetime={post.date}>{formatDate(post.date)}</time>
		{#if post.updated}
			· Updated <time datetime={post.updated}>{formatDate(post.updated)}</time>
		{/if}
		{#if post.draft}
			<span class="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-xs font-medium text-white"
				>Draft</span
			>
		{/if}
	</p>
</PageHero>

<div class="bg-paper px-4 py-12 md:py-16">
	<article class="mx-auto max-w-3xl">
		<div class="prose prose-lg max-w-none prose-neutral">
			<Content />
		</div>
		<p class="mt-14 border-t border-[#ddd6c4] pt-6 text-[15px]">
			<a href="/blog" class="font-semibold text-brand underline underline-offset-2"
				><span aria-hidden="true">←</span> All posts</a
			>
		</p>
	</article>
</div>
