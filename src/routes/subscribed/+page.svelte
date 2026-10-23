<!--
	Result pages are PATHS, not query-string states: /subscribed (this page,
	check your inbox), /subscribed/confirmed, /subscribed/expired,
	/subscribed/error. The site is prerendered HTML, so each state must be a
	real page a no-JavaScript visitor can land on. Reading the state from the
	query string would need client-side script and leave those visitors a
	blank page.
	The subscribe Worker's redirects target these paths.
-->
<script lang="ts">
	import StatusPage from '$lib/components/StatusPage.svelte';
</script>

<svelte:head>
	<title>Check your inbox · Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<StatusPage eyebrow="Email updates" title="Check your inbox">
	<p>
		There's a confirmation link waiting. It works for 48 hours, and you are not on the list until
		you confirm.
	</p>
	<p class="mt-6"><a href="/blog">Back to the blog</a></p>
</StatusPage>
