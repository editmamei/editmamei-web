<script lang="ts">
	import { page } from '$app/state';
	import StatusPage from '$lib/components/StatusPage.svelte';
</script>

<svelte:head>
	<title>{page.status === 404 ? 'Page not found' : 'Something went wrong'} · Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if page.status === 404}
	<StatusPage eyebrow="404" title="Page not found">
		<p>That page doesn't exist. These are good places to start:</p>
		<p class="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
			<a href="/">Home</a>
			<a href="/desktop">Editmamei Desktop</a>
			<a href="/connect">Editmamei Connect</a>
			<a href="/faq">FAQ</a>
		</p>
	</StatusPage>
{:else}
	<StatusPage eyebrow={String(page.status)} title="Something went wrong">
		<p>Try <a href="/">home</a>.</p>
	</StatusPage>
{/if}
