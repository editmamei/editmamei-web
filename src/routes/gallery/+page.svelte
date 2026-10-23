<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import GalleryCarousel from '$lib/components/GalleryCarousel.svelte';
	import GalleryWall from '$lib/components/GalleryWall.svelte';
	import { track } from '$lib/analytics/clarity';
	import { CONNECT_URL } from '$lib/links';
	import { CONNECT_ID, ORIGIN } from '$lib/seo/schema';

	let { data } = $props();

	const schema = $derived([
		{
			'@type': 'CollectionPage',
			name: 'Editmamei gallery',
			url: `${ORIGIN}/gallery`,
			about: { '@id': CONNECT_ID },
			mainEntity: {
				'@type': 'ItemList',
				itemListElement: data.wall.map((t, i) => ({
					'@type': 'ListItem',
					position: i + 1,
					name: t.title,
					url: `${ORIGIN}/gallery/${t.id}`
				}))
			}
		}
	]);
</script>

<Seo
	path="/gallery"
	title="AI photo edits, before and after · Editmamei Gallery"
	description="Real photos edited by asking an AI app with Editmamei Connect. Open one for the before and after, every step it took, and a replay of the edit."
	{schema}
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

		<h2 class="mt-12 mb-4 text-2xl font-bold tracking-[-0.02em] text-brand">Every shared edit</h2>
		<GalleryWall tiles={data.wall} />
	{/if}

	<aside
		class="mt-10 flex flex-wrap items-center justify-between gap-x-7 gap-y-4 rounded-[22px] bg-white p-6 ring-1 ring-brand/10"
	>
		<div>
			<p class="text-xl font-bold tracking-[-0.02em] text-brand">Share your edit from Connect</p>
			<p class="mt-1 text-[16px] text-neutral-700">
				Made something you like in Connect? Ask your AI app to share it. Approved edits get a credit
				and a link to your page.
			</p>
		</div>
		<a
			href={CONNECT_URL}
			onclick={() => track('gallery-share-cta')}
			class="inline-flex min-h-12 items-center rounded-2xl border-[1.5px] border-accent/50 bg-brand px-6 text-[16px] font-bold whitespace-nowrap text-white transition-colors hover:bg-brand-light"
			>Start free <span aria-hidden="true" class="ml-1.5">→</span></a
		>
	</aside>
</div>
