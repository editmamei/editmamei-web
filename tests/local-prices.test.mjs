// Prices in the visitor's currency (src/lib/pricing/local-prices.js, worker/index.js): the country mapping, the page
// rewrite the Worker does, the price table's shape, that the pages take their prices from it, and, on the built
// pages, that every dollar amount in a price page's text is one the Worker can swap.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	amountMap,
	currencyFor,
	formatPrice,
	localizeHtml,
	localizeResponse,
	PRICE_PAGES
} from '../src/lib/pricing/local-prices.js';
import { withAssetRedirects } from '../worker/redirects.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const table = JSON.parse(readFileSync(join(REPO_ROOT, 'src/lib/pricing/prices.json'), 'utf8'));
const map = amountMap(table.prices);
const BUILD = join(REPO_ROOT, '.svelte-kit', 'cloudflare');

test('the euro area sees EUR, the UK GBP, everyone else USD', () => {
	for (const c of ['DE', 'FR', 'NL', 'IE', 'FI', 'HR', 'BG'])
		assert.equal(currencyFor(c), 'eur', c);
	assert.equal(currencyFor('GB'), 'gbp');
	for (const c of ['US', 'CA', 'CH', 'SE', 'PL', 'XX', '', null, undefined])
		assert.equal(currencyFor(c), 'usd', String(c));
});

test('the price table has every currency for every price, and no dollar amount means two things', () => {
	for (const [id, amounts] of Object.entries(table.prices)) {
		for (const c of ['usd', 'eur', 'gbp']) assert.equal(typeof amounts[c], 'number', `${id} ${c}`);
	}
	assert.throws(
		() => amountMap({ a: { usd: 9, eur: 10, gbp: 8 }, b: { usd: 9, eur: 11, gbp: 8 } }),
		/two prices are \$9/
	);
	assert.doesNotThrow(() =>
		amountMap({ a: { usd: 9, eur: 10, gbp: 8 }, b: { usd: 9, eur: 10, gbp: 8 } })
	);
});

const PAGE = `<!doctype html><html lang="en"><head><title>Pro from $9</title><meta name="description" content="Packs from $7"><script type="application/ld+json">{"a":"$9"}</script></head><body><p>Pro for $9 a month, $79 a year, or $199 once. Packs from $7, and $10.</p><span aria-label="$35">$35</span><p>Not ours: $4, $9.50, $1,000.</p><script>const p = "$9";</script><p>Free: $0</p></body></html>`;

test('the rewrite marks the page and swaps the body text, leaving the head, scripts and other amounts alone', () => {
	const eur = localizeHtml(PAGE, 'eur', { swap: true, map });
	assert.match(eur, /<html data-currency="eur" lang="en">/);
	assert.ok(
		eur.includes('<title>Pro from $9</title>') &&
			eur.includes('content="Packs from $7"') &&
			eur.includes('{"a":"$9"}')
	);
	assert.ok(
		eur.includes('<p>Pro for €10 a month, €85 a year, or €215 once. Packs from €8, and €11.</p>')
	);
	assert.ok(eur.includes('<span aria-label="€38">€38</span>'));
	assert.ok(eur.includes('<p>Not ours: $4, $9.50, $1,000.</p>'));
	assert.ok(eur.includes('<script>const p = "$9";</script>'));
	assert.ok(eur.includes('<p>Free: €0</p>'));
	const gbp = localizeHtml(PAGE, 'gbp', { swap: true, map });
	assert.ok(
		gbp.includes('<p>Pro for £8 a month, £72 a year, or £179 once. Packs from £7, and £9.</p>')
	);
	// Off the price pages, only the mark.
	assert.equal(
		localizeHtml(PAGE, 'eur', { swap: false, map }),
		PAGE.replace('<html', '<html data-currency="eur"')
	);
});

test('the Worker leaves a USD visitor, a non-GET and a non-page untouched, and sends a localized page uncached', async () => {
	const page = (headers = {}) =>
		new Response(PAGE, {
			status: 200,
			headers: { 'content-type': 'text/html; charset=utf-8', etag: '"abc"', ...headers }
		});
	const asked = [];
	const next = async (req) => {
		asked.push(req);
		return page();
	};
	const req = (path, country, init = {}) => {
		const r = new Request(`https://editmamei.com${path}`, init);
		if (country) Object.defineProperty(r, 'cf', { value: { country } });
		return r;
	};
	const us = await localizeResponse(
		req('/pricing', 'US', { headers: { 'if-none-match': '"abc"' } }),
		next,
		map
	);
	assert.equal(await us.text(), PAGE);
	assert.equal(asked.at(-1).headers.get('if-none-match'), '"abc"');

	const de = await localizeResponse(
		req('/pricing', 'DE', { headers: { 'if-none-match': '"abc"' } }),
		next,
		map
	);
	const body = await de.text();
	assert.ok(body.includes('data-currency="eur"') && body.includes('€10 a month'));
	assert.equal(de.headers.get('etag'), null);
	assert.equal(de.headers.get('cache-control'), 'private, no-cache');
	assert.equal(
		asked.at(-1).headers.get('if-none-match'),
		null,
		'a saved copy in dollars must not be revalidated'
	);

	// The trailing-slash form is the same page; a blog post is marked but its amounts are kept.
	assert.ok(
		(await (await localizeResponse(req('/pricing/', 'GB'), next, map)).text()).includes(
			'£8 a month'
		)
	);
	const blog = await (await localizeResponse(req('/blog/some-post', 'FR'), next, map)).text();
	assert.ok(blog.includes('data-currency="eur"') && blog.includes('Pro for $9 a month'));

	// Cloudflare's header is read first (wrangler dev places every request in its own country in request.cf).
	assert.ok(
		(
			await (
				await localizeResponse(req('/', 'US', { headers: { 'cf-ipcountry': 'DE' } }), next, map)
			).text()
		).includes('€10')
	);

	// A HEAD passes through with the USD page's headers: it has no body to localize.
	const head = await localizeResponse(req('/pricing', 'DE', { method: 'HEAD' }), next, map);
	assert.equal(head.headers.get('etag'), '"abc"');
	// A page already private (the gallery's minute) keeps its lifetime; Vary is added to, not replaced.
	const gallery = await localizeResponse(
		req('/gallery', 'DE'),
		async () =>
			new Response(PAGE, {
				headers: {
					'content-type': 'text/html',
					'cache-control': 'private, max-age=60',
					vary: 'accept-encoding',
					'last-modified': 'Thu, 05 Nov 2026 10:00:00 GMT'
				}
			}),
		map
	);
	assert.equal(gallery.headers.get('cache-control'), 'private, max-age=60');
	assert.equal(gallery.headers.get('vary'), 'accept-encoding, cf-ipcountry');
	assert.equal(gallery.headers.get('last-modified'), null);
	const png = await localizeResponse(
		req('/icons/x.png', 'DE'),
		async () => new Response('png', { headers: { 'content-type': 'image/png' } }),
		map
	);
	assert.equal(await png.text(), 'png');
	const notFound = await localizeResponse(
		req('/nope', 'DE'),
		async () =>
			new Response('<html><body>$9</body></html>', {
				status: 404,
				headers: { 'content-type': 'text/html' }
			}),
		map
	);
	// The 404 page is marked, so a link from it renders local prices, but its text is kept.
	assert.equal(notFound.status, 404);
	assert.equal(await notFound.text(), '<html data-currency="eur"><body>$9</body></html>');
});

test("the router's redirects survive the Worker running first: a 404 from SvelteKit is asked of the router", async () => {
	const kit404 = async () => new Response('missing', { status: 404 });
	const router = (status, location) => async () =>
		new Response(null, { status, headers: location ? { location } : {} });
	const at = (path, method = 'GET') => new Request(`https://editmamei.com${path}`, { method });
	const moved = await withAssetRedirects(at('/photoshop'), kit404, router(301, '/desktop'));
	assert.equal(moved.status, 301);
	assert.equal(moved.headers.get('location'), '/desktop');
	assert.equal(
		(await withAssetRedirects(at('/gimp', 'HEAD'), kit404, router(301, '/desktop#gimp'))).status,
		301
	);
	// Not a redirect from the router: SvelteKit's 404 stands.
	const missing = await withAssetRedirects(at('/nope'), kit404, router(404));
	assert.equal(missing.status, 404);
	assert.equal(await missing.text(), 'missing');
	// Anything SvelteKit answers otherwise, and any other method, never reaches the router.
	let asked = 0;
	const counting = async () => {
		asked++;
		return new Response(null, { status: 301, headers: { location: '/x' } });
	};
	assert.equal(
		(await withAssetRedirects(at('/pricing'), async () => new Response('ok'), counting)).status,
		200
	);
	assert.equal((await withAssetRedirects(at('/photoshop', 'POST'), kit404, counting)).status, 404);
	assert.equal(asked, 0);
});

test('every moved address in _redirects is still a source the router redirects', () => {
	// The fallback above relies on the router answering these; the list is what wrangler dev was checked against.
	const sources = readFileSync(join(REPO_ROOT, '_redirects'), 'utf8')
		.split('\n')
		.map((l) => l.trim())
		.filter((l) => l && !l.startsWith('#'))
		.map((l) => l.split(/\s+/));
	assert.ok(sources.length >= 14);
	for (const [from, , status] of sources) assert.equal(status, '301', from);
	const deployed = JSON.parse(
		readFileSync(join(REPO_ROOT, 'wrangler.jsonc'), 'utf8').replace(/^\s*\/\/.*$/gm, '')
	);
	// The Worker must not be skipped for them either way: with run_worker_first on /*, the fallback is what serves them.
	assert.deepEqual(deployed.assets.run_worker_first, ['/*', '!/_app/*']);
});

test('the pages and price() write a price the same way', () => {
	assert.equal(formatPrice(9, 'usd'), '$9');
	assert.equal(formatPrice(10, 'eur'), '€10');
	assert.equal(formatPrice(7.5, 'gbp'), '£7.50');
});

const PAGE_FILES = {
	'/': 'src/routes/+page.svelte',
	'/pricing': 'src/routes/pricing/+page.svelte',
	'/desktop': 'src/routes/desktop/+page.svelte',
	'/desktop/pricing': 'src/routes/desktop/pricing/+page.svelte',
	'/connect': 'src/routes/connect/+page.svelte',
	'/connect/pricing': 'src/routes/connect/pricing/+page.svelte'
};

test('the price pages take every price from price(), except in their <Seo> tags', () => {
	assert.deepEqual([...PRICE_PAGES].sort(), Object.keys(PAGE_FILES).sort());
	for (const file of Object.values(PAGE_FILES)) {
		const source = readFileSync(join(REPO_ROOT, file), 'utf8')
			.replace(/<Seo\b[\s\S]*?\/>/, '')
			.replace(/\/\/.*$/gm, '')
			.replace(/<!--[\s\S]*?-->/g, '');
		// A literal amount would be swapped by the Worker but put back in dollars when the page runs in the browser.
		assert.doesNotMatch(source, /\$\d/, file);
	}
});

test('the two Wrangler configs agree on what the adapter needs', () => {
	const read = (f) =>
		JSON.parse(readFileSync(join(REPO_ROOT, f), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
	const deployed = read('wrangler.jsonc');
	const kit = read('wrangler.kit.jsonc');
	assert.equal(deployed.main, 'worker/index.js');
	assert.equal(kit.main, `${kit.assets.directory}/_worker.js`);
	for (const key of ['name', 'compatibility_date']) assert.equal(kit[key], deployed[key], key);
	assert.equal(kit.assets.directory, deployed.assets.directory);
	assert.equal(kit.assets.binding, deployed.assets.binding);
	assert.deepEqual(deployed.assets.run_worker_first, ['/*', '!/_app/*']);
});

const skip = existsSync(BUILD) ? false : 'the build is absent, run npm run build first';

test(
	'on the built price pages, every dollar amount in the text is one the Worker swaps',
	{ skip },
	() => {
		for (const path of PRICE_PAGES) {
			const file = path === '/' ? 'index.html' : `${path.slice(1)}.html`;
			const html = readFileSync(join(BUILD, file), 'utf8');
			const body = html.slice(html.search(/<body\b/i)).replace(/<script\b[\s\S]*?<\/script>/gi, '');
			const amounts = [...body.matchAll(/\$(\d+)(?![\d]|[.,]\d)/g)].map((m) => Number(m[1]));
			assert.ok(amounts.length > 0, `${path} shows no price`);
			for (const a of amounts)
				assert.ok(map.has(a), `${path} shows $${a}, which is not in prices.json`);
			assert.ok(
				!localizeHtml(html, 'eur', { swap: true, map })
					.slice(html.search(/<body\b/i))
					.replace(/<script\b[\s\S]*?<\/script>/gi, '')
					.match(/\$\d/),
				`${path} keeps a dollar amount for EUR`
			);
		}
	}
);
