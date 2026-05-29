<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
</div>
