import { DEFAULT_FEED_URL, fetchFeed, type GalleryEntry } from '$lib/gallery/feed.js';

/**
 * The approved gallery entries as they are at build time, for the sitemap (the gallery's own pages read
 * Connect when they are requested: src/lib/server/connect.ts). A feed outage means "build without the feed",
 * unless GALLERY_FEED_REQUIRED=1, in which case a missing or broken feed fails the build. Memoized, so the
 * sitemap reads it once.
 */
let cached: Promise<GalleryEntry[]> | undefined;

export function loadGallery(): Promise<GalleryEntry[]> {
	cached ??= (async () => {
		const warn = (msg: string) => console.warn(`[gallery] ${msg}`);
		// process.env, not $env/dynamic/*: dynamic env is unavailable while prerendering.
		const url = process.env.PUBLIC_GALLERY_FEED || DEFAULT_FEED_URL;
		const feed = await fetchFeed(url, {
			warn,
			required: process.env.GALLERY_FEED_REQUIRED === '1'
		});
		return feed.sort((a, b) =>
			a.date === b.date ? a.id.localeCompare(b.id) : a.date < b.date ? 1 : -1
		);
	})();
	return cached;
}
