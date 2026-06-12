<script lang="ts">
	import './layout.css';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import ConsentBanner from '$lib/components/ConsentBanner.svelte';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
	<SiteHeader />
	<main class="flex-1">
		{@render children()}
	</main>
	<SiteFooter />
	<ConsentBanner />
</div>
