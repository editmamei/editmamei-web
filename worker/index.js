// The site's Worker (wrangler.jsonc `main`): SvelteKit's Worker, built by @sveltejs/adapter-cloudflare to
// .svelte-kit/cloudflare/_worker.js (see wrangler.kit.jsonc), with the static-asset router's redirects kept
// (redirects.js) and prices shown in the visitor's currency (src/lib/pricing/local-prices.js). Runs first for
// every request but the hashed files under /_app/ (assets.run_worker_first).
import kit from '../.svelte-kit/cloudflare/_worker.js';
import { amountMap, localizeResponse } from '../src/lib/pricing/local-prices.js';
import table from '../src/lib/pricing/prices.json';
import { withAssetRedirects } from './redirects.js';

const map = amountMap(table.prices);

export default {
	/**
	 * @param {Request} request
	 * @param {{ ASSETS: { fetch: (request: Request) => Promise<Response> } }} env
	 * @param {ExecutionContext} ctx
	 */
	fetch(request, env, ctx) {
		return localizeResponse(
			request,
			(req) =>
				withAssetRedirects(
					req,
					(r) => kit.fetch(r, env, ctx),
					(r) => env.ASSETS.fetch(r)
				),
			map
		);
	}
};
