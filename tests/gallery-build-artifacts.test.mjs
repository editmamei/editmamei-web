// Pins on the built gallery (.svelte-kit/cloudflare). Skips when the build is
// absent; run the build before the tests, as web-release.yml does. The
// gallery's two routes are rendered by the Worker on request from Connect's
// data, so they must NOT be prerendered (a file would be served instead and go
// stale); the sitemap still lists the gallery and its approved entries.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(REPO_ROOT, '.svelte-kit', 'cloudflare');
const skip = existsSync(BUILD) ? false : 'the build is absent, run npm run build first';

test(
	'the gallery is rendered on request: no prerendered gallery page or entry, and no demo seed',
	{ skip },
	() => {
		assert.ok(
			!existsSync(join(BUILD, 'gallery.html')),
			'gallery.html would be served instead of the Worker'
		);
		assert.ok(
			!existsSync(join(BUILD, 'gallery')) || readdirSync(join(BUILD, 'gallery')).length === 0
		);
		assert.ok(existsSync(join(BUILD, '_worker.js')));
		assert.ok(
			readFileSync(join(BUILD, '.assetsignore'), 'utf8').includes('_worker.js'),
			'the Worker script must not be served'
		);
	}
);

test('the sitemap lists /gallery', { skip }, () => {
	const xml = readFileSync(join(BUILD, 'sitemap.xml'), 'utf8');
	assert.ok(xml.includes('<loc>https://editmamei.com/gallery</loc>'));
});

test('the wall puts no titles or text on the photos', () => {
	const wall = readFileSync(
		join(REPO_ROOT, 'src', 'lib', 'components', 'GalleryWall.svelte'),
		'utf8'
	);
	// A tile is a link around its photo and nothing else: the title rides only
	// on the image's alt text (read by screen readers and image search, never
	// drawn on the photo).
	const tile = wall.match(/<a class="tile[^>]*>([\s\S]*?)<\/a>/)?.[1] ?? '';
	assert.match(tile, /^\s*<img [^>]*alt=\{t\.title\}[^>]*\/>\s*$/);
});

test('an entry page offers no downloads and keeps an unlisted share out of search', () => {
	const page = readFileSync(
		join(REPO_ROOT, 'src', 'routes', 'gallery', '[id]', '+page.svelte'),
		'utf8'
	);
	assert.ok(!/download/i.test(page), 'downloads are for the maker, on Connect');
	assert.match(page, /noindex=\{!share\.listed\}/);
	const server = readFileSync(
		join(REPO_ROOT, 'src', 'routes', 'gallery', '[id]', '+page.server.ts'),
		'utf8'
	);
	assert.match(server, /export const prerender = false/);
	assert.match(server, /'x-robots-tag': 'noindex'/);
});
