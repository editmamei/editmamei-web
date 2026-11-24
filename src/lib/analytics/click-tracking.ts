import { track } from '#lib/analytics/clarity.ts';
import { clickEventName } from '#lib/analytics/click-name.js';

const CLICKABLE = 'a[href], button, [role="button"], summary, [data-track]';

function onClick(event: MouseEvent): void {
	try {
		if (!(event.target instanceof Element)) return;
		const el = event.target.closest(CLICKABLE);
		// An element with its own track() handler reports under its historical name.
		if (!el || el.hasAttribute('data-tracked')) return;
		track(
			clickEventName({
				pathname: window.location.pathname,
				origin: window.location.origin,
				href: el instanceof HTMLAnchorElement ? el.getAttribute('href') : null,
				dataTrack: el.getAttribute('data-track'),
				ariaLabel: el.getAttribute('aria-label'),
				text: (el.textContent ?? '').replace(/\s+/g, ' ').trim().slice(0, 100)
			})
		);
	} catch {
		// Analytics must never break a click.
	}
}

/** Report every link and button click. Returns the cleanup. Client only. */
export function startClickTracking(): () => void {
	document.addEventListener('click', onClick, true);
	return () => document.removeEventListener('click', onClick, true);
}
