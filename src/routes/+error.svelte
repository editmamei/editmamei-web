<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>Page not found · Editmamei</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
			{page.status}
		</p>
		{#if page.status === 404}
			<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">Page not found</h1>
			<p class="mt-4 text-base leading-relaxed text-neutral-700">
				That page doesn't exist. Try <a
					href="/"
					class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
					>home</a
				>.
			</p>
		{:else}
			<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
				Something went wrong
			</h1>
			<p class="mt-4 text-base leading-relaxed text-neutral-700">
				Try <a
					href="/"
					class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
					>home</a
				>.
			</p>
		{/if}
	</div>
</section>
