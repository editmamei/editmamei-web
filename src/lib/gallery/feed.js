// Gallery feed parsing and validation. Plain JS (JSDoc-typed) so the node
// test runner can import it without a TypeScript step.
//
// The feed is user-submitted content from Editmamei Connect, so every field
// is untrusted: entries are checked field by field and an entry that fails
// any check is dropped whole. Nothing here sanitizes text, because nothing
// downstream renders it as markup: pages interpolate it as plain text and
// never use {@html}.

/**
 * @typedef {{ title: string, detail: string, frame: number | null }} GalleryStep
 * @typedef {{
 *   id: string, title: string, by: string, link: string | null, date: string,
 *   featured: boolean, width: number, height: number, aligned: boolean,
 *   before: string | null, after: string, frames: string[], steps: GalleryStep[],
 *   credit?: string
 * }} GalleryEntry
 */

export const DEFAULT_FEED_URL = 'https://connect.editmamei.com/gallery.json';

export const LIMITS = {
	entries: 1000,
	title: 80,
	by: 40,
	link: 300,
	credit: 120,
	stepTitle: 80,
	stepDetail: 300,
	steps: 40,
	frames: 24,
	dimension: 20000,
	feedBytes: 2_000_000
};

const ID_RE = /^[a-z0-9-]{1,40}$/;
const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})(?:T[\d:.]+(?:Z|[+-]\d{2}:\d{2})?)?$/;
// Only these two image sources are allowed: Connect's public share bucket and
// the seed images committed to this site. No query strings, no `..` segments.
const REMOTE_IMAGE_RE = /^https:\/\/connect\.editmamei\.com\/g\/[A-Za-z0-9._~/-]{1,200}$/;
const SEED_IMAGE_RE = /^\/gallery\/seed\/[A-Za-z0-9._-]{1,100}$/;
// C0/C1 controls and the bidi override/isolate characters, which can reorder
// displayed text.
// eslint-disable-next-line no-control-regex
const BAD_TEXT_RE = /[\u0000-\u001f\u007f-\u009f‪-‮⁦-⁩]/;

/** @param {unknown} v @param {number} min @param {number} max @returns {v is string} */
function text(v, min, max) {
	return typeof v === 'string' && v.length >= min && v.length <= max && !BAD_TEXT_RE.test(v);
}

/** @param {unknown} v @returns {v is string} */
export function isImageUrl(v) {
	if (typeof v !== 'string') return false;
	if (SEED_IMAGE_RE.test(v)) return !v.split('/').some((p) => p === '..' || p === '.');
	return REMOTE_IMAGE_RE.test(v) && !v.split('/').some((p) => p === '..' || p === '.');
}

/** An https URL with a host and no credentials, or null. @param {unknown} v */
export function safeLink(v) {
	if (typeof v !== 'string' || v.length > LIMITS.link || BAD_TEXT_RE.test(v)) return null;
	try {
		const u = new URL(v);
		if (u.protocol !== 'https:' || !u.hostname || u.username || u.password) return null;
		return u.href;
	} catch {
		return null;
	}
}

/** @param {unknown} v @returns {string | null} YYYY-MM-DD or null */
function normDate(v) {
	if (typeof v !== 'string') return null;
	const m = DATE_RE.exec(v);
	if (!m) return null;
	const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
	const dt = new Date(Date.UTC(y, mo - 1, d));
	if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d)
		return null;
	return `${m[1]}-${m[2]}-${m[3]}`;
}

/** @param {unknown} v @returns {v is number} */
const dim = (v) => typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= LIMITS.dimension;

/**
 * Validate one raw entry. Returns the normalized entry, or null to drop it.
 * @param {unknown} raw
 * @returns {GalleryEntry | null}
 */
export function validateEntry(raw) {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
	const e = /** @type {Record<string, unknown>} */ (raw);

	if (typeof e.id !== 'string' || !ID_RE.test(e.id)) return null;
	if (!text(e.title, 1, LIMITS.title) || !text(e.by, 1, LIMITS.by)) return null;
	const date = normDate(e.date);
	if (!date) return null;
	if (!dim(e.width) || !dim(e.height)) return null;
	if (!isImageUrl(e.after)) return null;
	// A maker may leave the before picture out: then there is no before, no
	// frames and nothing to align.
	const hasBefore = e.before !== null && e.before !== undefined;
	if (hasBefore && !isImageUrl(e.before)) return null;

	let link = null;
	if (e.link !== null && e.link !== undefined) {
		link = safeLink(e.link);
		if (!link) return null;
	}

	let credit;
	if (e.credit !== undefined) {
		if (!text(e.credit, 1, LIMITS.credit)) return null;
		credit = e.credit;
	}

	const framesRaw = e.frames === undefined ? [] : e.frames;
	if (!Array.isArray(framesRaw) || framesRaw.length > LIMITS.frames) return null;
	if (!framesRaw.every(isImageUrl)) return null;
	if (!hasBefore && framesRaw.length > 0) return null;
	const frames = /** @type {string[]} */ (framesRaw);

	const stepsRaw = e.steps === undefined ? [] : e.steps;
	if (!Array.isArray(stepsRaw) || stepsRaw.length > LIMITS.steps) return null;
	/** @type {GalleryStep[]} */
	const steps = [];
	for (const s of stepsRaw) {
		if (!s || typeof s !== 'object') return null;
		const st = /** @type {Record<string, unknown>} */ (s);
		if (!text(st.title, 1, LIMITS.stepTitle)) return null;
		const detail = st.detail === undefined || st.detail === null ? '' : st.detail;
		if (!text(detail, 0, LIMITS.stepDetail)) return null;
		// `frame` points a step at a replay frame: an index, or the URL of one
		// of the entry's frames. Anything else just means "no frame".
		let frame = null;
		if (typeof st.frame === 'number' && Number.isInteger(st.frame)) {
			if (st.frame >= 0 && st.frame < frames.length) frame = st.frame;
		} else if (typeof st.frame === 'string') {
			const at = frames.indexOf(st.frame);
			if (at >= 0) frame = at;
		}
		steps.push({ title: st.title, detail, frame });
	}

	/** @type {GalleryEntry} */
	const entry = {
		id: e.id,
		title: e.title,
		by: e.by,
		link,
		date,
		featured: e.featured === true,
		width: e.width,
		height: e.height,
		aligned: hasBefore && e.aligned === true,
		before: hasBefore ? /** @type {string} */ (e.before) : null,
		after: e.after,
		frames,
		steps
	};
	if (credit !== undefined) entry.credit = credit;
	return entry;
}

/**
 * Validate a list of raw entries, dropping the invalid ones.
 * @param {unknown} raw
 * @param {(msg: string) => void} [warn]
 * @returns {GalleryEntry[]}
 */
export function validateEntries(raw, warn = () => {}) {
	if (!Array.isArray(raw)) return [];
	/** @type {GalleryEntry[]} */
	const out = [];
	const seen = new Set();
	let dropped = 0;
	for (const item of raw.slice(0, LIMITS.entries)) {
		const entry = validateEntry(item);
		if (!entry || seen.has(entry.id)) {
			dropped++;
			continue;
		}
		seen.add(entry.id);
		out.push(entry);
	}
	if (dropped > 0)
		warn(`gallery: dropped ${dropped} invalid or duplicate entr${dropped === 1 ? 'y' : 'ies'}`);
	return out;
}

/**
 * Parse feed JSON text: `{v: 1, entries: [...]}`. Anything else is an empty
 * list, or an error when `strict` (the build requires the feed).
 * @param {string} body
 * @param {(msg: string) => void} [warn]
 * @param {{ strict?: boolean }} [opts]
 * @returns {GalleryEntry[]}
 */
export function parseFeed(body, warn = () => {}, opts = {}) {
	const bad = (/** @type {string} */ msg) => {
		if (opts.strict) throw new Error(msg);
		warn(`gallery: ${msg}`);
		return /** @type {GalleryEntry[]} */ ([]);
	};
	/** @type {unknown} */
	let json;
	try {
		json = JSON.parse(body);
	} catch {
		return bad('feed is not valid JSON');
	}
	if (!json || typeof json !== 'object' || /** @type {{ v?: unknown }} */ (json).v !== 1)
		return bad('feed has an unsupported shape or version');
	const entries = /** @type {{ entries?: unknown }} */ (json).entries;
	if (opts.strict && !Array.isArray(entries)) return bad('feed has no entries list');
	return validateEntries(entries, warn);
}

/**
 * Fetch the feed. By default it never throws: any failure yields an empty list
 * and a warning. With `required`, a failed fetch, a non-200 answer, an
 * oversized body or a body of the wrong shape throws instead, so a build never
 * publishes an empty gallery over a feed that was only briefly unreachable.
 * @param {string} url
 * @param {{ fetch?: typeof fetch, warn?: (msg: string) => void, timeoutMs?: number, required?: boolean }} [opts]
 * @returns {Promise<GalleryEntry[]>}
 */
export async function fetchFeed(url, opts = {}) {
	const { fetch: doFetch = globalThis.fetch, warn = () => {}, timeoutMs = 10000 } = opts;
	const required = opts.required === true;
	/** @param {string} why @returns {GalleryEntry[]} */
	const give = (why) => {
		if (required) throw new Error(`gallery: ${why} (GALLERY_FEED_REQUIRED is set)`);
		warn(`gallery: ${why}, building without it`);
		return [];
	};
	/** @type {string} */
	let body;
	try {
		const res = await doFetch(url, {
			headers: { accept: 'application/json' },
			signal: AbortSignal.timeout(timeoutMs)
		});
		if (res.status !== 200) return give(`feed answered ${res.status}`);
		body = await res.text();
	} catch (err) {
		return give(`feed fetch failed (${err instanceof Error ? err.message : String(err)})`);
	}
	if (body.length > LIMITS.feedBytes) return give('feed is larger than the size cap');
	try {
		return parseFeed(body, warn, { strict: required });
	} catch (err) {
		return give(err instanceof Error ? err.message : String(err));
	}
}

/**
 * What the replay plays: `[before, ...frames, after]` when the entry has
 * frames, `[before, after]` when it has none, `[after]` alone when the maker
 * left the before out. Each picture's label is "Before", the last step mapped
 * to that frame (else "Step N"), then "After".
 * @param {GalleryEntry} entry
 * @returns {{ urls: string[], labels: string[], mode: 'fade' | 'wipe' }}
 */
export function replayPlan(entry) {
	if (entry.before === null) return { urls: [entry.after], labels: ['After'], mode: 'fade' };
	const labels = entry.frames.map((_, i) => {
		let last = null;
		for (const s of entry.steps) if (s.frame === i) last = s;
		return last ? last.title : `Step ${i + 1}`;
	});
	return {
		urls: [entry.before, ...entry.frames, entry.after],
		labels: ['Before', ...labels, 'After'],
		mode: entry.frames.length === 0 && entry.aligned ? 'wipe' : 'fade'
	};
}

/**
 * Seed entries win an id clash, so the feed can never replace a committed
 * entry. Newest first, id as the tiebreaker.
 * @param {GalleryEntry[]} feed
 * @param {GalleryEntry[]} seed
 * @returns {GalleryEntry[]}
 */
export function mergeEntries(feed, seed) {
	const ids = new Set(seed.map((e) => e.id));
	return [...seed, ...feed.filter((e) => !ids.has(e.id))].sort((a, b) =>
		a.date === b.date ? a.id.localeCompare(b.id) : a.date < b.date ? 1 : -1
	);
}

/**
 * The carousel set: feed-flagged `featured` first (newest first), topped up
 * with the newest others to at least 3, never more than 5.
 * @param {GalleryEntry[]} sorted newest first
 * @returns {GalleryEntry[]}
 */
export function pickFeatured(sorted) {
	const featured = sorted.filter((e) => e.featured).slice(0, 5);
	if (featured.length >= 3) return featured;
	const rest = sorted.filter((e) => !e.featured);
	return [...featured, ...rest.slice(0, 3 - featured.length)];
}

/**
 * Tile span class for the wall, by aspect ratio; `big` picks a larger span.
 * @param {number} width
 * @param {number} height
 * @param {boolean} big
 */
export function tileSpan(width, height, big) {
	const r = width / height;
	if (r > 1.3) return big ? 'bw' : 'w';
	if (r < 0.85) return big ? 'b' : 't';
	return big ? 'b' : '';
}

/** Stable 0..1 value from an id, so the prerendered wall order never changes. @param {string} s */
export function idHash(s) {
	let h = 5381;
	for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
	return (h % 1000) / 1000;
}

/** "2026-10-13" rendered for humans, pinned to UTC so the date never shifts. @param {string} iso */
export function formatDate(iso) {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
