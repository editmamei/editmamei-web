<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { SUBSCRIBE_API_URL } from '$lib/links';

	// This page exists so the link in a confirmation email is on editmamei.com
	// rather than a workers.dev hostname nobody recognizes. It carries the token
	// straight through to the Worker and reports what came back.

	// Not named `state`: that collides with the $state rune, which also reads as
	// store-subscription syntax.
	let status = $state<'working' | 'done' | 'failed'>('working');
	let reason = $state('');

	// Built once so the no-JavaScript fallback below has somewhere to point.
	const workerUrl = $derived(`${SUBSCRIBE_API_URL}/v1/confirm?${page.url.searchParams.toString()}`);

	onMount(async () => {
		try {
			const response = await fetch(workerUrl, { headers: { Accept: 'application/json' } });
			const body = (await response.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
			if (response.ok && body.ok) {
				status = 'done';
			} else {
				status = 'failed';
				reason = body.reason ?? 'failed';
			}
		} catch {
			status = 'failed';
			reason = 'network';
		}
	});
</script>

<svelte:head>
	<title>Confirming your email — Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto max-w-xl px-4 py-20 text-center">
	{#if status === 'working'}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">Confirming</h1>
		<p class="mt-3 text-neutral-600">One moment.</p>
		<noscript>
			<p class="mt-3 text-neutral-600">
				<a href={workerUrl} class="underline">Finish confirming</a>
			</p>
		</noscript>
	{:else if status === 'done'}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">You're on the list</h1>
		<p class="mt-3 text-neutral-600">
			New releases and new posts will arrive here. Every one of them has an unsubscribe link.
		</p>
		<p class="mt-6">
			<a href="/blog" class="underline">Read the blog</a>
		</p>
	{:else if reason === 'expired'}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">That link has expired</h1>
		<p class="mt-3 text-neutral-600">
			Confirmation links work for 48 hours. Sign up again and a fresh one is on its way.
		</p>
		<p class="mt-6"><a href="/blog" class="underline">Back to the blog</a></p>
	{:else}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">That link didn't work</h1>
		<p class="mt-3 text-neutral-600">
			It may have been copied incompletely. Try clicking it again from the email, or sign up once
			more.
		</p>
		<p class="mt-6"><a href="/blog" class="underline">Back to the blog</a></p>
	{/if}
</main>
