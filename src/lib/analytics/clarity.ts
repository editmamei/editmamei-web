/**
 * Microsoft Clarity event-tracking helper.
 *
 * Wraps the global `clarity` callable installed by the Clarity snippet in
 * src/app.html so the rest of the codebase doesn't reach for `window.clarity`
 * directly. Three safety guarantees:
 *
 * 1. SSR-safe — every entry-point bails when `window` is undefined, so
 *    these can be called from any Svelte component lifecycle without a
 *    SvelteKit prerender error.
 * 2. Adblocker-safe — `window.clarity` is optional. If the snippet was
 *    blocked (Brave shields, uBlock Origin, Pi-hole, Safari ITP, etc.)
 *    the call quietly no-ops rather than throwing.
 * 3. Pre-load-safe — Clarity uses an async script; if our event fires
 *    before the script has finished evaluating, the snippet's own
 *    queue (`clarity.q = clarity.q || []`) buffers the call. We don't
 *    have to wait or guard for "loaded yet" state.
 *
 * Marketing infrastructure per editmamei-web/CLAUDE.md "Marketing
 * infrastructure" section — these events don't reconcile into the
 * product's privacy framing.
 */

type ClarityFn = (
	cmd: 'event' | 'set' | 'upgrade' | 'consent' | 'identify',
	...args: unknown[]
) => void;

declare global {
	interface Window {
		clarity?: ClarityFn;
	}
}

/**
 * Fire a discrete user-action event. Shows up in the Clarity dashboard's
 * Events tab and is filterable in Watchlists. Use for things that happen
 * at a point in time ("user clicked install").
 *
 * @param name - Event identifier. Use kebab-case verbs ("install-cta-clicked",
 *   "demo-slider-used"). Keep stable: renaming an event creates a new event
 *   and loses historical filtering.
 */
export function track(name: string): void {
	if (typeof window === 'undefined') return;
	try {
		window.clarity?.('event', name);
	} catch {
		// Clarity errors must never break the page. Swallow.
	}
}

/**
 * Tag the current session with a key/value pair. Persists for the rest
 * of the session and is filterable in Watchlists. Use for categorical
 * context that's true for the whole visit ("entry-page": "/pricing").
 */
export function tag(key: string, value: string): void {
	if (typeof window === 'undefined') return;
	try {
		window.clarity?.('set', key, value);
	} catch {
		// see above
	}
}

/**
 * Mark the current session as important so Clarity prioritizes its
 * replay in storage. Use sparingly — only for sessions that contain
 * high-signal events (e.g. install-snippet-selected).
 *
 * @param reason - Short human-readable reason. Shown in the Clarity UI
 *   next to the upgraded session.
 */
export function upgradeSession(reason: string): void {
	if (typeof window === 'undefined') return;
	try {
		window.clarity?.('upgrade', reason);
	} catch {
		// see above
	}
}

/**
 * One-shot guard for events that should only fire once per page load.
 * Tracks fired event names in a module-scoped Set; subsequent calls with
 * the same name no-op. Used for events like demo-slider-used where we
 * want to know "did this visitor engage at all" not "how many micro-drags
 * did they do" (which would drown the dashboard in noise).
 *
 * The Set is module-scoped, so it survives client-side navigation. The root
 * layout clears it per navigation via `resetOnceGuards()` — without that, a
 * visitor who moves between pages would silently stop reporting these events
 * everywhere after the first page.
 */
const firedOnce = new Set<string>();
export function trackOnce(name: string): void {
	if (firedOnce.has(name)) return;
	firedOnce.add(name);
	track(name);
}

/** Clear the `trackOnce` guards. Called on every navigation by the root layout. */
export function resetOnceGuards(): void {
	firedOnce.clear();
}

/**
 * Stable per-tab ID used to stitch page views into a single Clarity session.
 *
 * Clarity's cookieless mode (pinned in src/app.html) cannot set `_clsk`, the
 * cookie that ties page views together, so every navigation was arriving in the
 * dashboard as a fresh session belonging to a fresh user. Multi-page journeys
 * were invisible: a home → /pricing visit on 2026-08-13 recorded as two
 * separate one-page sessions a minute apart, under two different user IDs.
 *
 * `sessionStorage`, not `localStorage`, deliberately: the ID dies with the tab,
 * so this is not a persistent identifier and it matches what /privacy already
 * describes ("session storage to correlate page views within a single tab").
 */
const TAB_ID_KEY = 'editmamei-clarity-tab';

function tabSessionId(): string | null {
	if (typeof window === 'undefined') return null;
	try {
		let id = sessionStorage.getItem(TAB_ID_KEY);
		if (!id) {
			id =
				typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
					? crypto.randomUUID()
					: `t${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
			sessionStorage.setItem(TAB_ID_KEY, id);
		}
		return id;
	} catch {
		// Storage blocked (private mode, hardened settings). Stitching is a
		// nice-to-have; never let it break the page.
		return null;
	}
}

/**
 * Tell Clarity which session and page this view belongs to, so consecutive
 * views stitch into one journey. Safe to call on every navigation.
 *
 * @param path - Pathname of the page being viewed, used as the custom page ID.
 */
export function identifyPage(path: string): void {
	if (typeof window === 'undefined') return;
	const id = tabSessionId();
	if (!id) return;
	try {
		// (custom-id, custom-session-id, custom-page-id)
		window.clarity?.('identify', id, id, path);
	} catch {
		// see track()
	}
}

/**
 * Grant or deny Clarity's cookie consent at runtime.
 *
 * Call with `true` when the user accepts cookies — Clarity will switch from
 * its cookieless mode to full cookie-backed sessions. Deny is a no-op here
 * because `clarity('consent', false)` is already set as the hard default in
 * src/app.html; Clarity never upgrades to cookies without an explicit grant.
 */
export function setConsent(granted: boolean): void {
	if (typeof window === 'undefined') return;
	try {
		if (granted) {
			window.clarity?.('consent');
		}
	} catch {
		// Clarity errors must never break the page.
	}
}
