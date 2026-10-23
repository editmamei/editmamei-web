<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import GalleryCarousel from '$lib/components/GalleryCarousel.svelte';
	import GalleryWall from '$lib/components/GalleryWall.svelte';
	import { track } from '$lib/analytics/clarity';
	import { CONNECT_URL } from '$lib/links';

	let { data } = $props();
</script>

<Seo
	path="/gallery"
	title="Gallery: real photo edits made in conversation · Editmamei"
	description="Real edits people made by asking their AI app. Open one to see the before and after, the steps, and the edit as a short video."
/>

<PageHero
	eyebrow="Gallery"
	title="Real edits, made in a conversation."
	lede="Photos people edited by asking their AI app, shared from Editmamei Connect. Open one to see the before, the steps, and the edit as a video."
/>

<div class="mx-auto max-w-6xl px-4 py-10 md:py-14">
	{#if data.wall.length === 0}
		<p
			class="rounded-xl border border-neutral-200 bg-cream px-5 py-10 text-center text-neutral-700"
		>
			Nothing shared yet. Be the first.
		</p>
	{:else}
		<GalleryCarousel slides={data.featured} />

		<h2 class="mt-12 mb-4 text-2xl font-extrabold tracking-tight text-neutral-900">
			From the wall
		</h2>
		<GalleryWall tiles={data.wall} />
	{/if}

	<aside
		class="mt-10 flex flex-wrap items-center justify-between gap-x-7 gap-y-4 rounded-2xl border border-neutral-200 bg-white p-6"
	>
		<div>
			<p class="text-xl font-bold tracking-tight text-neutral-900">Share your edit from Connect</p>
			<p class="mt-1 text-neutral-600">
				Made something you like in Connect? Ask Claude to share it. Approved edits get a credit and
				a link to your page.
			</p>
		</div>
		<a
			href={CONNECT_URL}
			onclick={() => track('gallery-share-cta')}
			class="rounded-full bg-accent px-5 py-3 text-sm font-semibold whitespace-nowrap text-brand-deep transition-colors hover:brightness-95"
		>
			Open Connect
		</a>
	</aside>
</div>
