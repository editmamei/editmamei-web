// Pins the sitemap/noindex invariant that previously drifted and caused
// the "Crawled — currently not indexed" suppression (see the comment block
// in src/routes/sitemap.xml/+server.ts): every top-level route is either
//   (a) listed in the ROUTES array of the dynamic sitemap, or
//   (b) marked <meta name="robots" content="noindex"> in its <svelte:head>
// — never neither, never both. Also pins the per-page SEO contract: every
// indexable route renders <Seo> with its own path so the canonical is
// self-referencing (the shell-level canonical bug class).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const ROUTES_DIR = join(REPO_ROOT, 'src', 'routes');
const SITEMAP_SERVER = join(ROUTES_DIR, 'sitemap.xml', '+server.ts');

/** Paths declared in the sitemap's hand-maintained ROUTES array. */
function sitemapPaths() {
	const source = readFileSync(SITEMAP_SERVER, 'utf8');
	const block = source.match(/const ROUTES[\s\S]*?\n\];/);
	assert.ok(block, 'ROUTES array not found in sitemap.xml/+server.ts');
	return Array.from(block[0].matchAll(/path:\s*'([^']+)'/g), (m) => m[1]);
}

/** Top-level page routes on disk: '/' plus each child dir with +page.svelte. */
function diskRoutes() {
	const routes = [];
	if (existsSync(join(ROUTES_DIR, '+page.svelte'))) routes.push('/');
	for (const entry of readdirSync(ROUTES_DIR)) {
		const full = join(ROUTES_DIR, entry);
		if (!statSync(full).isDirectory()) continue;
		if (existsSync(join(full, '+page.svelte'))) routes.push(`/${entry}`);
	}
	return routes;
}

function pageSource(route) {
	const file =
		route === '/'
			? join(ROUTES_DIR, '+page.svelte')
			: join(ROUTES_DIR, route.slice(1), '+page.svelte');
	return readFileSync(file, 'utf8');
}

test('every route is either in the sitemap ROUTES or noindexed — never neither', () => {
	const inSitemap = new Set(sitemapPaths());
	for (const route of diskRoutes()) {
		const noindexed = pageSource(route).includes('content="noindex"');
		assert.ok(
			inSitemap.has(route) || noindexed,
			`${route} is neither in the sitemap ROUTES array nor marked noindex — ` +
				`add it to ROUTES (indexable) or add <meta name="robots" content="noindex"> (stub)`
		);
	}
});

test('no route is both in the sitemap and noindexed — the two contradict', () => {
	for (const route of sitemapPaths()) {
		assert.ok(
			!pageSource(route).includes('content="noindex"'),
			`${route} is listed in the sitemap ROUTES array but its page carries noindex`
		);
	}
});

test('every sitemap route exists on disk', () => {
	const onDisk = new Set(diskRoutes());
	for (const route of sitemapPaths()) {
		assert.ok(onDisk.has(route), `${route} is in ROUTES but has no +page.svelte`);
	}
});

test('every indexable route renders <Seo> with its own self-referencing path', () => {
	for (const route of sitemapPaths()) {
		const source = pageSource(route);
		assert.match(source, /<Seo\b/, `${route} is indexable but does not render the <Seo> component`);
		assert.ok(
			source.includes(`path="${route}"`),
			`${route}'s <Seo> must pass path="${route}" so the canonical is self-referencing`
		);
	}
});
