/**
 * The redirects the static-asset router makes: `_redirects` (the 2026-10 moves) and `html_handling`
 * (`/pricing.html` to `/pricing`). The router applies them only to a request it serves itself, and the Worker runs
 * first for every page (assets.run_worker_first), where SvelteKit's Worker answers an address it has no page or file
 * for with its 404. So a GET or HEAD that SvelteKit answers 404 is asked of the router too, and its redirect, if it
 * makes one, is the answer.
 * @param {Request} request
 * @param {(request: Request) => Promise<Response>} kit SvelteKit's Worker
 * @param {(request: Request) => Promise<Response>} assets the ASSETS binding
 * @returns {Promise<Response>}
 */
export async function withAssetRedirects(request, kit, assets) {
	const res = await kit(request);
	if (res.status !== 404 || (request.method !== 'GET' && request.method !== 'HEAD')) return res;
	const moved = await assets(request);
	if (moved.status >= 300 && moved.status < 400 && moved.headers.has('location')) {
		await res.body?.cancel();
		return moved;
	}
	await moved.body?.cancel();
	return res;
}
