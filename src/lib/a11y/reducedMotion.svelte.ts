/**
 * Reactive `prefers-reduced-motion` tracker. Call during component init and
 * read `.current` — it stays live if the OS setting changes mid-session, and
 * cleans up its media-query listener on teardown.
 *
 * SSR-safe: `.current` is `false` on the server (no window), and the effect
 * only runs in the browser.
 */
export function prefersReducedMotion() {
	let reduced = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
		reduced = mq.matches;
		const onChange = (e: MediaQueryListEvent) => (reduced = e.matches);
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	return {
		get current() {
			return reduced;
		}
	};
}
