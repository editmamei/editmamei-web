<!-- See ../+page.svelte for why these states are paths, not query strings. -->
<script lang="ts">
	import StatusPage from '$lib/components/StatusPage.svelte';
</script>

<svelte:head>
	<title>That didn't work · Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<StatusPage eyebrow="Email updates" title="That didn't work">
	<p>
		Try the link in your email again, or sign up once more with the form in the footer of any page
		and we'll send a new one.
	</p>
	<p class="mt-6"><a href="/blog">Back to the blog</a></p>
</StatusPage>
