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
 * per build. Build-time only: the site is fully static, so a feed outage can
 * only ever mean "build without the feed", never a failed build. The fetch
 * result is memoized so every page and the sitemap see the same list.
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
		const feed = await fetchFeed(url, { warn });
		return mergeEntries(feed, seed);
	})();
	return cached;
}
