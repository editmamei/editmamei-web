// Names the click events the root layout's global listener reports. Plain JS with JSDoc so the
// `node --test` suite can import it. Pure: no DOM, no globals.
//
// Names are `click-<page>-<target>`, or exactly the element's `data-track` value. They never carry a
// query string, a fragment, an email address or a long number.

const MAX_NAME = 80;
const MAX_LABEL = 30;

/**
 * Lowercase, runs of anything but a-z0-9 become one `-`, trimmed. Emails and numbers longer than
 * 6 digits are dropped first so personal data cannot reach an event name.
 * @param {string} text
 * @returns {string}
 */
export function slug(text) {
	return String(text)
		.replace(/\S+@\S+/g, ' ')
		.replace(/\d{7,}/g, ' ')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

/**
 * @param {string} pathname
 * @returns {string}
 */
export function pageSlug(pathname) {
	return slug(String(pathname).split(/[?#]/)[0]) || 'home';
}

/**
 * @param {string} href
 * @param {string} origin
 * @returns {string}
 */
function linkTarget(href, origin) {
	let url;
	try {
		url = new URL(href, origin);
	} catch {
		return 'link';
	}
	if (url.protocol === 'mailto:') return 'mailto';
	if (url.protocol === 'tel:') return 'tel';
	if (url.protocol !== 'http:' && url.protocol !== 'https:') return 'link';
	if (url.origin === origin) return `to-${pageSlug(url.pathname)}`;
	const host = url.hostname.replace(/^www\./, '');
	const first = url.hostname === 'github.com' ? url.pathname.split('/')[1] : '';
	return `ext-${slug(host)}${first ? `-${slug(first)}` : ''}`;
}

/**
 * @typedef {object} ClickTarget
 * @property {string} pathname current page path
 * @property {string} origin current page origin, to tell internal links from external
 * @property {string | null} [href] the element's href, when it is a link
 * @property {string | null} [dataTrack] the element's `data-track` value
 * @property {string | null} [ariaLabel]
 * @property {string | null} [text] visible text
 */

/**
 * @param {ClickTarget} t
 * @returns {string}
 */
export function clickEventName(t) {
	const explicit = (t.dataTrack ?? '').trim();
	if (explicit) return explicit.slice(0, MAX_NAME);

	let target;
	if (t.href != null && t.href !== '') {
		target = linkTarget(t.href, t.origin);
	} else {
		const label = slug(t.ariaLabel || t.text || '')
			.slice(0, MAX_LABEL)
			.replace(/-+$/, '');
		target = label || 'button';
	}
	return `click-${pageSlug(t.pathname)}-${target}`.slice(0, MAX_NAME).replace(/-+$/, '');
}
