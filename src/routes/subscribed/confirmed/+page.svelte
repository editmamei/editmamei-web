<!-- See ../+page.svelte for why these states are paths, not query strings. -->
<script lang="ts">
	import StatusPage from '$lib/components/StatusPage.svelte';
</script>

<svelte:head>
	<title>You're on the list · Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<StatusPage eyebrow="Email updates" title="You're on the list">
	<p>New releases and new posts will arrive here. Every one of them has an unsubscribe link.</p>
	<p class="mt-6"><a href="/blog">Read the blog</a></p>
</StatusPage>
