/**
 * Local-currency prices, shared by the Worker (worker/index.js) and the pages (price.ts).
 *
 * Polar charges a buyer in the euro area in EUR and one in the UK in GBP, from where it places their address, and
 * everyone else in USD. The site shows the same: the pages are built in US dollars; for a visitor Cloudflare places in
 * the euro area or the UK, the Worker marks the page with `data-currency` on <html> and, on the pages that show prices,
 * swaps each dollar amount in the page's text for the local one. In the browser, price() reads that mark, so what the
 * page renders again matches what the Worker sent. Page titles, descriptions and structured data are sent in US
 * dollars (a page reached by a link inside the site may render its structured data in the visitor's currency).
 * Prices come from prices.json (scripts/sync-prices.mjs).
 */

/** @typedef {'usd' | 'eur' | 'gbp'} Currency */
/** @typedef {Record<Currency, number>} Amounts */

/** @type {readonly Currency[]} */
export const CURRENCIES = ['usd', 'eur', 'gbp'];

/** The euro-area members (Bulgaria joined on 2026-01-01). */
const EURO = new Set([
	'AT',
	'BE',
	'BG',
	'CY',
	'DE',
	'EE',
	'ES',
	'FI',
	'FR',
	'GR',
	'HR',
	'IE',
	'IT',
	'LT',
	'LU',
	'LV',
	'MT',
	'NL',
	'PT',
	'SI',
	'SK'
]);

/**
 * The currency a visitor in this country is shown.
 * @param {string | null | undefined} country Cloudflare's two-letter code
 * @returns {Currency}
 */
export function currencyFor(country) {
	if (!country) return 'usd';
	if (EURO.has(country)) return 'eur';
	if (country === 'GB') return 'gbp';
	return 'usd';
}

/** @param {unknown} v @returns {v is Currency} */
export const isCurrency = (v) =>
	typeof v === 'string' && /** @type {readonly string[]} */ (CURRENCIES).includes(v);

const SYMBOL = { usd: '$', eur: '€', gbp: '£' };

/**
 * `$9`, `€10`, `£8`: the form both the pages and the Worker write.
 * @param {number} amount
 * @param {Currency} currency
 */
export function formatPrice(amount, currency) {
	return `${SYMBOL[currency]}${Number.isInteger(amount) ? amount : amount.toFixed(2)}`;
}

/**
 * Each US-dollar amount the site shows, with its amount in every currency. Throws when two prices share a dollar
 * amount but differ in another currency, since the Worker could not tell them apart.
 * @param {Record<string, Amounts>} prices
 * @returns {Map<number, Amounts>}
 */
export function amountMap(prices) {
	const map = new Map();
	for (const [id, amounts] of Object.entries(prices)) {
		const seen = map.get(amounts.usd);
		if (seen && CURRENCIES.some((c) => seen[c] !== amounts[c]))
			throw new Error(
				`two prices are $${amounts.usd} but differ in another currency (one is ${id})`
			);
		map.set(amounts.usd, amounts);
	}
	return map;
}

/** A dollar amount in text: `$9`, `$199`, not `$9.50` or `$1,000` (the site shows neither). */
const DOLLARS = /\$(\d+)(?![\d]|[.,]\d)/g;
const SCRIPT = /<script\b[\s\S]*?<\/script>/gi;

/**
 * The page for a visitor shown `currency`: `data-currency` on <html>, and, when `swap` is set, each dollar amount in the
 * body's text and attributes replaced from `map` (amounts not in it, and everything in <head> and in scripts, kept).
 * @param {string} html
 * @param {Currency} currency
 * @param {{ swap: boolean, map: Map<number, Amounts> }} opts
 */
export function localizeHtml(html, currency, opts) {
	const marked = html.replace(/<html\b/i, `<html data-currency="${currency}"`);
	if (!opts.swap) return marked;
	const start = marked.search(/<body\b/i);
	if (start < 0) return marked;
	const swapText = (/** @type {string} */ text) =>
		text.replace(DOLLARS, (whole, digits) => {
			const amounts = opts.map.get(Number(digits));
			return amounts ? formatPrice(amounts[currency], currency) : whole;
		});
	const body = marked.slice(start);
	let out = '';
	let last = 0;
	for (const m of body.matchAll(SCRIPT)) {
		out += swapText(body.slice(last, m.index)) + m[0];
		last = /** @type {number} */ (m.index) + m[0].length;
	}
	out += swapText(body.slice(last));
	return marked.slice(0, start) + out;
}

/** The pages whose text shows prices: the Worker swaps amounts only on these. */
export const PRICE_PAGES = new Set([
	'/',
	'/pricing',
	'/desktop',
	'/desktop/pricing',
	'/connect',
	'/connect/pricing'
]);

/**
 * The Worker's answer for one request: the SvelteKit Worker's, localized for a visitor shown EUR or GBP. A USD visitor,
 * a request that is not GET, and a response that is not an HTML page (200, or the 404 page, which is only marked) pass
 * through untouched.
 * @param {Request} request
 * @param {(request: Request) => Promise<Response>} next the SvelteKit Worker
 * @param {Map<number, Amounts>} map
 * @returns {Promise<Response>}
 */
export async function localizeResponse(request, next, map) {
	// Cloudflare's CF-IPCountry header first (Cloudflare sets it, over any a visitor sends; wrangler dev passes one
	// a test sends), else request.cf. A visitor who forged it would only see their own page in another currency:
	// Polar still charges by where it places their address.
	const cf = /** @type {{ cf?: { country?: unknown } }} */ (/** @type {unknown} */ (request)).cf;
	const country =
		request.headers.get('cf-ipcountry') ?? (typeof cf?.country === 'string' ? cf.country : null);
	const currency = currencyFor(country);
	if (currency === 'usd' || request.method !== 'GET') return next(request);
	// A revalidation of a copy saved in another currency must get the whole page, not a 304.
	const headers = new Headers(request.headers);
	headers.delete('if-none-match');
	headers.delete('if-modified-since');
	const res = await next(new Request(request, { headers }));
	const page = res.status === 200 || res.status === 404;
	if (!page || !(res.headers.get('content-type') ?? '').includes('text/html')) return res;
	const path = new URL(request.url).pathname.replace(/(.)\/$/, '$1');
	const swap = res.status === 200 && PRICE_PAGES.has(path);
	const html = localizeHtml(await res.text(), currency, { swap, map });
	const out = new Headers(res.headers);
	out.delete('etag');
	out.delete('last-modified');
	out.delete('content-length');
	// Never kept by a shared cache; a page already private (the gallery's minute) keeps its own lifetime.
	if (!/\bprivate\b/i.test(out.get('cache-control') ?? ''))
		out.set('cache-control', 'private, no-cache');
	out.append('vary', 'cf-ipcountry');
	return new Response(html, { status: res.status, headers: out });
}
