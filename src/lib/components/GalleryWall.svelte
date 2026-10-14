<script lang="ts">
	import { onMount } from 'svelte';
	import { idHash, tileSpan } from '$lib/gallery/feed.js';

	interface Tile {
		id: string;
		title: string;
		after: string;
		width: number;
		height: number;
	}

	let { tiles }: { tiles: Tile[] } = $props();

	// Prerendered in a stable order, with the "large" tiles picked from a hash
	// of the id so the HTML never changes between builds. On a visit the order
	// and the large picks are redrawn at random.
	type Placed = Tile & { span: string };
	const stable = $derived<Placed[]>(
		tiles.map((t) => ({ ...t, span: tileSpan(t.width, t.height, idHash(t.id) < 0.22) }))
	);
	let shuffled = $state<Placed[] | null>(null);
	const placed = $derived(shuffled ?? stable);

	function shuffle() {
		const a = tiles.map((t) => ({ ...t, span: tileSpan(t.width, t.height, Math.random() < 0.22) }));
		for (let i = a.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[a[i], a[j]] = [a[j], a[i]];
		}
		shuffled = a;
	}

	onMount(shuffle);
</script>

<div class="wall">
	{#each placed as t (t.id)}
		<a class="tile {t.span}" href="/gallery/{t.id}" aria-label={t.title}>
			<img src={t.after} alt="" loading="lazy" decoding="async" />
		</a>
	{/each}
</div>

<style>
	/* A tight wall of small, mixed-size tiles; dense packing fills the gaps. */
	.wall {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
		grid-auto-rows: 104px;
		grid-auto-flow: dense;
		gap: 8px;
	}
	.tile {
		display: block;
		overflow: hidden;
		border-radius: 6px;
		background: var(--color-cream);
	}
	.tile.w {
		grid-column: span 2;
	}
	.tile.t {
		grid-row: span 2;
	}
	.tile.b {
		grid-column: span 2;
		grid-row: span 2;
	}
	.tile.bw {
		grid-column: span 3;
		grid-row: span 2;
	}
	.tile img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.5s ease;
	}
	.tile:hover img,
	.tile:focus-visible img {
		transform: scale(1.03);
	}
	.tile:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}
	@media (max-width: 560px) {
		.wall {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			grid-auto-rows: 92px;
		}
		.tile.bw {
			grid-column: span 3;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tile img {
			transition: none;
		}
	}
</style>
