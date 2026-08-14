/**
 * Fetch-and-decode cache for images that are painted by an animation.
 *
 * The problem this solves: a component that swaps an image inside a keyed block
 * creates the new `<img>` at the instant its transition starts, so the browser
 * only *begins* fetching then. A mask or fade animating over an image whose
 * bytes have not arrived reveals nothing, and the image pops in un-animated
 * once it lands. On a cold cache the effect is never actually seen.
 *
 * `preloadImages` warms a set ahead of time and `imageReady` gates a paint on
 * one specific image being decoded, with a cap so a stalled or missing file
 * can't wedge the caller's sequence.
 *
 * Browser-only by construction (`Image` does not exist during SSR); every entry
 * point bails when `window` is undefined.
 */

/** Longest a caller will wait on a single image before painting regardless. */
export const DEFAULT_DECODE_CAP_MS = 4000;

const decoding = new Map<string, Promise<void>>();

/**
 * Start (or join) the fetch + decode for one image. The promise resolves when
 * the pixels are ready to paint, and is cached so repeat calls are free.
 *
 * Never rejects: a decode failure resolves like a success, because a frame we
 * could not load should still let the caller's sequence continue.
 */
export function preloadImage(src: string): Promise<void> {
	if (typeof window === 'undefined') return Promise.resolve();
	let pending = decoding.get(src);
	if (!pending) {
		pending = new Promise<void>((resolve) => {
			const img = new Image();
			img.src = src;
			// decode() rejects on a load failure, and on some browsers for images
			// that are already complete. Resolve either way.
			img.decode().then(
				() => resolve(),
				() => resolve()
			);
		});
		decoding.set(src, pending);
	}
	return pending;
}

/** Warm a whole set without waiting on any of them. */
export function preloadImages(srcs: readonly string[]): void {
	srcs.forEach((src) => void preloadImage(src));
}

/**
 * Resolve once `src` is decoded, or once `capMs` has elapsed, whichever is
 * first. Use this immediately before painting the image.
 */
export function imageReady(src: string, capMs: number = DEFAULT_DECODE_CAP_MS): Promise<void> {
	if (typeof window === 'undefined') return Promise.resolve();
	return Promise.race([
		preloadImage(src),
		new Promise<void>((resolve) => setTimeout(resolve, capMs))
	]);
}
