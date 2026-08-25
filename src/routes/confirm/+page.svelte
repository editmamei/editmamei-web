<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { SUBSCRIBE_API_URL } from '$lib/links';

	// This page exists so the link in a confirmation email is on editmamei.com
	// rather than a workers.dev hostname nobody recognizes. It relays the token
	// to the Worker and forwards to the matching static result page.
	//
	// It is PRERENDERED, so nothing here may read the query string during
	// render — the token is only touched inside onMount, in the browser. The
	// prerendered HTML is the "confirming" state plus a noscript block: with
	// scripts off this page cannot relay anything, and the honest fallback is
	// the email's direct link, which completes at the Worker with no script.

	let failed = $state(false);

	onMount(async () => {
		const query = window.location.search.replace(/^\?/, '');
		try {
			const response = await fetch(`${SUBSCRIBE_API_URL}/v1/confirm?${query}`, {
				headers: { Accept: 'application/json' }
			});
			const body = (await response.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
			if (response.ok && body.ok) {
				goto('/subscribed/confirmed');
			} else if (body.reason === 'expired') {
				goto('/subscribed/expired');
			} else {
				goto('/subscribed/error');
			}
		} catch {
			failed = true;
		}
	});
</script>

<svelte:head>
	<title>Confirming your email — Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto max-w-xl px-4 py-20 text-center">
	{#if failed}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">That didn't go through</h1>
		<p class="mt-3 text-neutral-600">
			The confirmation service couldn't be reached. Try this link again in a moment, or use the
			second link in the email, which confirms directly.
		</p>
		<p class="mt-6"><a href="/blog" class="underline">Back to the blog</a></p>
	{:else}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">Confirming</h1>
		<p class="mt-3 text-neutral-600">One moment.</p>
	{/if}
	<noscript>
		<p class="mt-6 text-neutral-600">
			JavaScript is off in this browser, so this page can't finish the confirmation. Use the second
			link in the email, the one that says it confirms directly. It works without scripts.
		</p>
	</noscript>
</main>
