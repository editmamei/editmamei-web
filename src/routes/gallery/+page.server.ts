import { loadGallery } from '$lib/server/gallery';
import { pickFeatured } from '$lib/gallery/feed.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const entries = await loadGallery();
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
