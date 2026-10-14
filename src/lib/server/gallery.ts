import seedJson from '$lib/content/gallery-seed.json';
import {
	DEFAULT_FEED_URL,
	fetchFeed,
	mergeEntries,
	validateEntries,
	type GalleryEntry
} from '$lib/gallery/feed.js';

/**
 * The merged gallery (committed seed + Connect's public feed), fetched once
 * per build. Build-time only: the site is fully static. A feed outage means
 * "build without the feed", unless GALLERY_FEED_REQUIRED=1, in which case a
 * missing or broken feed fails the build so a blip never publishes an empty
 * gallery. The fetch result is memoized so every page and the sitemap see the
 * same list.
 */
let cached: Promise<GalleryEntry[]> | undefined;

export function loadGallery(): Promise<GalleryEntry[]> {
	cached ??= (async () => {
		const warn = (msg: string) => console.warn(`[gallery] ${msg}`);
		const seed = validateEntries(seedJson, (m) => {
			// A broken committed seed is a bug, not a feed hiccup.
			throw new Error(`gallery seed is invalid: ${m}`);
		});
		// process.env, not $env/dynamic/*: dynamic env is unavailable while prerendering.
		const url = process.env.PUBLIC_GALLERY_FEED || DEFAULT_FEED_URL;
		const feed = await fetchFeed(url, {
			warn,
			required: process.env.GALLERY_FEED_REQUIRED === '1'
		});
		return mergeEntries(feed, seed);
	})();
	return cached;
}
