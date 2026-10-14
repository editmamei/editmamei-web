// Pins on the built gallery (build/). Skips when build/ is absent; run the
// build before the tests, as web-release.yml does. The build must contain the
// committed seed whatever the feed did, so a dead feed still gives a full
// gallery, and every entry must be in the sitemap.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const BUILD = join(REPO_ROOT, 'build');
const skip = existsSync(BUILD) ? false : 'build/ absent, run npm run build first';
const seed = JSON.parse(
	readFileSync(join(REPO_ROOT, 'src', 'lib', 'content', 'gallery-seed.json'), 'utf8')
);

test('/gallery and every seed entry page are prerendered', { skip }, () => {
	assert.ok(existsSync(join(BUILD, 'gallery.html')));
	for (const e of seed) assert.ok(existsSync(join(BUILD, 'gallery', `${e.id}.html`)), e.id);
});

test('seed entry pages are indexable with a self-referencing canonical', { skip }, () => {
	for (const e of seed) {
		const html = readFileSync(join(BUILD, 'gallery', `${e.id}.html`), 'utf8');
		const canonical = `<link rel="canonical" href="https://editmamei.com/gallery/${e.id}"`;
		assert.ok(html.includes(canonical), e.id);
		assert.ok(!html.includes('content="noindex"'), e.id);
	}
});

test('the sitemap lists /gallery and every entry page', { skip }, () => {
	const xml = readFileSync(join(BUILD, 'sitemap.xml'), 'utf8');
	assert.ok(xml.includes('<loc>https://editmamei.com/gallery</loc>'));
	for (const e of seed) {
		assert.ok(xml.includes(`<loc>https://editmamei.com/gallery/${e.id}</loc>`), e.id);
	}
});

test('the gallery index puts no titles or text on the photos', { skip }, () => {
	const html = readFileSync(join(BUILD, 'gallery.html'), 'utf8');
	assert.ok(html.includes('See how it was made'));
	// Tiles carry the title only as an aria-label, with an empty alt.
	assert.match(
		html,
		/<a class="tile[^"]*" href="\/gallery\/[a-z0-9-]+" aria-label="[^"]+"><img[^>]* alt=""/
	);
});
