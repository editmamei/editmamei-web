import { CONNECT_ORIGIN } from '$lib/gallery/connect-origin';
import {
	validateEntries,
	validateShare,
	type GalleryEntry,
	type GalleryShare
} from '$lib/gallery/feed.js';

/**
 * The gallery's data, read from Editmamei Connect when a gallery page is rendered (on the Worker, at request
 * time): one share's page data, and the wall of approved entries. Each answer is kept for a minute in the
 * Worker's cache, so a busy page costs Connect at most one read a minute, and a share that is hidden, deleted or
 * changed shows within a minute.
 */

const KEEP_SECONDS = 60;
const MAX_BYTES = 2_000_000;
const SHARE_ID_RE = /^[a-f0-9]{16}$/;

type Platform = App.Platform | undefined;

/** JSON from Connect: the cached copy when there is one, else a fresh read; null for a 404. Throws on anything else. */
async function connectJson(path: string, platform: Platform): Promise<unknown | null> {
	const url = `${CONNECT_ORIGIN}${path}`;
	const cache = platform?.caches?.default;
	const key = new Request(url);
	let res = cache ? await cache.match(key) : undefined;
	if (!res) {
		const fresh = await fetch(url, {
			headers: { accept: 'application/json' },
			signal: AbortSignal.timeout(8000)
		});
		if (fresh.status !== 200 && fresh.status !== 404)
			throw new Error(`Connect answered ${fresh.status}`);
		const body = await fresh.text();
		if (body.length > MAX_BYTES) throw new Error('Connect sent too much');
		// Only an answer that reads is kept: a broken one must not be served for the next minute.
		if (fresh.status === 200) JSON.parse(body);
		res = new Response(body, {
			status: fresh.status,
			headers: {
				'content-type': 'application/json',
				'cache-control': `public, max-age=${KEEP_SECONDS}`
			}
		});
		if (cache) platform?.context?.waitUntil(cache.put(key, res.clone()));
	}
	if (res.status === 404) return null;
	return JSON.parse(await res.text());
}

/** A share's page data, or null when there is no live share by that id (never asked about an id that is not one). */
export async function loadShare(id: string, platform: Platform): Promise<GalleryShare | null> {
	if (!SHARE_ID_RE.test(id)) return null;
	const raw = await connectJson(`/g/${id}.json`, platform);
	return raw === null ? null : validateShare(raw);
}

/** The approved entries for the wall, newest first; empty when Connect cannot be read just now. */
export async function loadWall(platform: Platform): Promise<GalleryEntry[]> {
	try {
		const raw = (await connectJson('/gallery.json', platform)) as {
			v?: unknown;
			entries?: unknown;
		} | null;
		if (!raw || raw.v !== 1) return [];
		return validateEntries(raw.entries, (m) => console.warn(`[gallery] ${m}`)).sort((a, b) =>
			a.date === b.date ? a.id.localeCompare(b.id) : a.date < b.date ? 1 : -1
		);
	} catch (error) {
		console.warn(
			`[gallery] the wall could not be read: ${error instanceof Error ? error.message : error}`
		);
		return [];
	}
}
