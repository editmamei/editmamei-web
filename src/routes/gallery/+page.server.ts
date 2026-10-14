import { loadWall } from '$lib/server/connect';
import { pickFeatured } from '$lib/gallery/feed.js';
import type { PageServerLoad } from './$types';

// Rendered on request (the Worker), so an approval shows within a minute, with no redeploy.
export const prerender = false;

export const load: PageServerLoad = async ({ platform, setHeaders }) => {
	const entries = await loadWall(platform);
	// private: kept a minute by the viewer's browser only. A public page would be held by the zone's 4-hour browser cache rule,
	// and a share that is taken down must go within the minute (Connect's data is cached for the minute in connect.ts instead).
	setHeaders({ 'cache-control': 'private, max-age=60' });
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
