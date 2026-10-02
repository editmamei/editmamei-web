<script lang="ts">
	import './layout.css';
	import { afterNavigate } from '$app/navigation';
	import SiteHeader from '$lib/components/SiteHeader.svelte';
	import SiteFooter from '$lib/components/SiteFooter.svelte';
	import ConsentBanner from '$lib/components/ConsentBanner.svelte';
	import { identifyPage, resetOnceGuards } from '$lib/analytics/clarity';

	let { children } = $props();

	// Two things have to happen on every navigation, including the initial one.
	// Clarity files each page view as its own session unless we hand it a session
	// ID (cookieless mode has no `_clsk` to do that for us), and the trackOnce
	// guards are module-scoped, so they would suppress engagement events on every
	// page after the first.
	afterNavigate((nav) => {
		resetOnceGuards();
		identifyPage(nav.to?.url.pathname ?? '/');
	});
</script>

<div class="flex min-h-screen flex-col bg-white text-neutral-900 antialiased">
	<a
		href="#main"
		class="sr-only rounded-md bg-white px-4 py-2 text-sm font-semibold text-neutral-950 shadow-lg ring-2 ring-brand focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
		>Skip to content</a
	>
	<SiteHeader />
	<main id="main" tabindex="-1" class="flex-1 focus:outline-none">
		{@render children()}
	</main>
	<SiteFooter />
	<ConsentBanner />
</div>
