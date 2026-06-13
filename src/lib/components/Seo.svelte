<script lang="ts">
	// Per-page SEO head. Every indexable page renders this exactly once so
	// each route declares its own self-referencing canonical, title, and
	// social metadata. Site-wide tags must NOT live in app.html — a shared
	// canonical pointing at "/" marked /product and /pricing as duplicates
	// of the home page, the same sitemap-contradiction class that caused
	// the "Crawled — currently not indexed" suppression (see
	// src/routes/sitemap.xml/+server.ts).
	let {
		title,
		description,
		path,
		image = '/og-image.png'
	}: {
		title: string;
		description: string;
		/** Route path starting with '/', e.g. '/pricing'. */
		path: string;
		/** Root-relative social-share image; defaults to the site-wide card. */
		image?: string;
	} = $props();

	const ORIGIN = 'https://editmamei.com';
	const url = $derived(path === '/' ? `${ORIGIN}/` : `${ORIGIN}${path}`);
	const imageUrl = $derived(`${ORIGIN}${image}`);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />

	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content="Editmamei" />
	<meta property="og:image" content={imageUrl} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Editmamei — Unlock Photoshop with natural-language photo editing"
	/>

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={imageUrl} />
</svelte:head>
