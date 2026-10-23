<!-- See ../+page.svelte for why these states are paths, not query strings. -->
<script lang="ts">
	import StatusPage from '$lib/components/StatusPage.svelte';
</script>

<svelte:head>
	<title>That link has expired · Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<StatusPage eyebrow="Email updates" title="That link has expired">
	<p>
		Confirmation links work for 48 hours. Sign up again with the form in the footer of any page, and
		we'll send a fresh link.
	</p>
	<p class="mt-6"><a href="/blog">Back to the blog</a></p>
</StatusPage>
