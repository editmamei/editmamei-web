import { loadWall } from '$lib/server/connect';
import { pickFeatured } from '$lib/gallery/feed.js';
import type { PageServerLoad } from './$types';

// Rendered on request (the Worker), so an approval shows within a minute, with no redeploy.
export const prerender = false;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const entries = await loadWall(platform);
	setHeaders({ 'cache-control': 'public, max-age=60' });
	const pick = (e: (typeof entries)[number]) => ({
		id: e.id,
		title: e.title,
		after: e.after,
		width: e.width,
		height: e.height
	});
	return {
		featured: pickFeatured(entries).map(pick),
		// The wall gets every entry; the client reshuffles the order.
		wall: entries.map(pick)
	};
};
