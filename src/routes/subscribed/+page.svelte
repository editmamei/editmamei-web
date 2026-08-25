<!--
	Result pages are PATHS, not query-string states: /subscribed (this page,
	check your inbox), /subscribed/confirmed, /subscribed/expired,
	/subscribed/error. The site is prerendered HTML, so each state must be a
	real page a no-JavaScript visitor can land on — an earlier revision read
	the query string client-side and served script-less visitors a blank page.
	The subscribe Worker's redirects target these paths.
-->
<svelte:head>
	<title>Check your inbox — Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto max-w-xl px-4 py-20 text-center">
	<h1 class="text-2xl font-bold tracking-tight text-neutral-900">Check your inbox</h1>
	<p class="mt-3 text-neutral-600">
		There's a confirmation link waiting. It works for 48 hours, and you are not on the list until
		you confirm.
	</p>
	<p class="mt-6"><a href="/blog" class="underline">Back to the blog</a></p>
</main>
