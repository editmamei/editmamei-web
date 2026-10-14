import type { Handle } from '@sveltejs/kit';

/**
 * The security headers `_headers` gives every file the site serves, given here to the pages the Worker renders
 * on request (the gallery's two routes and the 404 page), which `_headers` does not reach.
 */
const SECURITY_HEADERS: Record<string, string> = {
	'strict-transport-security': 'max-age=31536000',
	'x-content-type-options': 'nosniff',
	'referrer-policy': 'strict-origin-when-cross-origin',
	'x-frame-options': 'DENY'
};

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
		if (!response.headers.has(name)) response.headers.set(name, value);
	}
	return response;
};
