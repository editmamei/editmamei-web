<script lang="ts">
	// Per-page SEO head. Every indexable page renders this exactly once so
	// each route declares its own self-referencing canonical, title, and
	// social metadata. Site-wide tags must NOT live in app.html: a shared
	// canonical pointing at "/" would mark every other page as a duplicate
	// of the home page.
	import { ldScript } from '$lib/seo/schema';

	let {
		title,
		description,
		path,
		image = '/og-card.jpg',
		imageAlt,
		article,
		schema,
		noindex = false
	}: {
		title: string;
		description: string;
		/** Route path starting with '/', e.g. '/pricing'. */
		path: string;
		/**
		 * Social-share image: root-relative (the site-wide card by default), or an
		 * https address (a gallery entry's own picture, served by Connect).
		 */
		image?: string;
		/** Alt text for a page's own image; the site-wide card has its own. */
		imageAlt?: string;
		/** A page that may be linked to but is not for search (an unlisted gallery share). */
		noindex?: boolean;
		/**
		 * Blog posts only: switches og:type to "article" and emits the
		 * article:*_time tags. Dates are YYYY-MM-DD (valid ISO 8601).
		 */
		article?: { published: string; modified?: string };
		/** This page's own structured data (schema.org nodes, no @context). */
		schema?: Record<string, unknown>[];
	} = $props();

	const ORIGIN = 'https://editmamei.com';
	const url = $derived(path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`);
	const ownImage = $derived(image.startsWith('https://'));
	const imageUrl = $derived(ownImage ? image : `${ORIGIN}${image}`);
	const DEFAULT_ALT =
		'Editmamei: give your AI a real photo editor. A dark sunset photo beside the edited version, made from one request, in 8 layers that all stay editable.';
	const alt = $derived(ownImage || image !== '/og-card.jpg' ? (imageAlt ?? title) : DEFAULT_ALT);
	const ld = $derived(schema?.length ? ldScript(...schema) : '');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content={article ? 'article' : 'website'} />
	{#if article}
		<meta property="article:published_time" content={article.published} />
		{#if article.modified}
			<meta property="article:modified_time" content={article.modified} />
		{/if}
	{/if}
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content="Editmamei" />
	<meta property="og:image" content={imageUrl} />
	{#if !ownImage}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta property="og:image:alt" content={alt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@editmamei" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
	<meta name="twitter:image:alt" content={alt} />
	{#if ld}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- our own schema objects, '<' escaped in ldScript -->
		{@html ld}
	{/if}
</svelte:head>
