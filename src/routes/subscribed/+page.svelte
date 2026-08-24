<script lang="ts">
	import { page } from '$app/state';

	// Where the Worker sends a browser that posted the form natively (no
	// JavaScript), and where a directly-opened confirmation link lands.

	const pending = $derived(page.url.searchParams.get('pending') === '1');
	const confirmed = $derived(page.url.searchParams.get('confirmed') === '1');
	const error = $derived(page.url.searchParams.get('error'));
</script>

<svelte:head>
	<title>Email updates — Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="mx-auto max-w-xl px-4 py-20 text-center">
	{#if confirmed}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">You're on the list</h1>
		<p class="mt-3 text-neutral-600">
			New releases and new posts will arrive here. Every one of them has an unsubscribe link.
		</p>
	{:else if pending}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">Check your inbox</h1>
		<p class="mt-3 text-neutral-600">
			There's a confirmation link waiting. It works for 48 hours, and you are not on the list until
			you click it.
		</p>
	{:else if error === 'expired'}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">That link has expired</h1>
		<p class="mt-3 text-neutral-600">
			Confirmation links work for 48 hours. Sign up again and a fresh one is on its way.
		</p>
	{:else if error}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">That didn't work</h1>
		<p class="mt-3 text-neutral-600">
			Try the link in your email again, or sign up once more and we'll send a new one.
		</p>
	{:else}
		<h1 class="text-2xl font-bold tracking-tight text-neutral-900">Email updates</h1>
		<p class="mt-3 text-neutral-600">
			New releases and new posts. The signup form is in the footer of every page.
		</p>
	{/if}

	<p class="mt-6"><a href="/blog" class="underline">Back to the blog</a></p>
</main>
