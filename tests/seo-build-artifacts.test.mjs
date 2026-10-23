// Search and answer-engine metadata, checked on the built site
// (.svelte-kit/cloudflare) the way a crawler reads it. Every indexable page
// needs a title that fits a results page, a description, one h1, a canonical,
// structured data that parses, and a social image that exists; no two pages
// may share a title or description; and each product's entity appears only
// on its own pages. Skips when the build is absent (see
// blog-build-artifacts.test.mjs for why web-release.yml builds first).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = join(resolve(__dirname, '..'), '.svelte-kit', 'cloudflare');
const built = existsSync(join(BUILD_DIR, 'index.html'));
const skip = built ? false : 'the build is absent: run npm run build first to enable these checks';

const decode = (s) =>
	s
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;|&#x27;/g, "'")
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>');
const meta = (html, key) =>
	html.match(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`))?.[1];

/** Every prerendered page as { path, html }, the 404 shell excluded. */
function pages() {
	const out = [];
	const walk = (dir) => {
		for (const entry of readdirSync(dir)) {
			const full = join(dir, entry);
			if (statSync(full).isDirectory()) {
				if (entry !== '_app') walk(full);
			} else if (entry.endsWith('.html')) {
				const rel = relative(BUILD_DIR, full)
					.split('\\')
					.join('/')
					.replace(/\.html$/, '');
				if (rel === '404') continue;
				out.push({ path: rel === 'index' ? '/' : `/${rel}`, html: readFileSync(full, 'utf8') });
			}
		}
	};
	walk(BUILD_DIR);
	return out;
}
const indexable = () => pages().filter((p) => !p.html.includes('content="noindex"'));

test('every indexable page has a title of 60 characters or fewer', { skip }, () => {
	for (const { path, html } of indexable()) {
		const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
		assert.ok(title, `${path} has no <title>`);
		assert.ok(title.length <= 60, `${path} title is ${title.length} characters: "${title}"`);
		assert.ok(
			title.split('Editmamei').length - 1 <= 2,
			`${path} title repeats the brand: "${title}"`
		);
	}
});

test('every indexable page has a description of 50 to 160 characters', { skip }, () => {
	for (const { path, html } of indexable()) {
		const d = decode(meta(html, 'description') ?? '');
		assert.ok(d.length >= 50 && d.length <= 160, `${path} description is ${d.length}: "${d}"`);
	}
});

test('titles and descriptions are unique across indexable pages', { skip }, () => {
	const seen = new Map();
	for (const { path, html } of indexable()) {
		for (const key of [html.match(/<title>([^<]*)<\/title>/)?.[1], meta(html, 'description')]) {
			assert.ok(!seen.has(key), `${path} shares "${key}" with ${seen.get(key)}`);
			seen.set(key, path);
		}
	}
});

test('every indexable page has one h1 and a self-referencing canonical', { skip }, () => {
	for (const { path, html } of indexable()) {
		const h1s = html.match(/<h1[\s>]/g) ?? [];
		assert.equal(h1s.length, 1, `${path} has ${h1s.length} h1 elements`);
		const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
		const want = path === '/' ? 'https://editmamei.com/' : `https://editmamei.com${path}`;
		assert.equal(canonical, want, `${path} canonical`);
	}
});

test('all structured data parses, and each product stays on its own pages', { skip }, () => {
	for (const { path, html } of pages()) {
		const blocks = [
			...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)
		].map((m) => m[1]);
		const types = blocks.flatMap((b) => {
			let json;
			assert.doesNotThrow(() => (json = JSON.parse(b)), `${path} has JSON-LD that won't parse`);
			return (json['@graph'] ?? [json]).map((n) => n['@type']);
		});
		if (path.startsWith('/connect')) {
			assert.ok(!types.includes('SoftwareApplication'), `${path} carries the Desktop entity`);
		}
		if (path.startsWith('/desktop')) {
			assert.ok(!types.includes('WebApplication'), `${path} carries the Connect entity`);
		}
		// Each product's own page and pricing page describe it.
		if (path === '/desktop' || path === '/desktop/pricing') {
			assert.ok(types.includes('SoftwareApplication'), `${path} lacks the Desktop entity`);
		}
		if (path === '/connect' || path === '/connect/pricing') {
			assert.ok(types.includes('WebApplication'), `${path} lacks the Connect entity`);
		}
	}
});

test("every page's own social image exists in the build", { skip }, () => {
	for (const { path, html } of pages()) {
		const image = meta(html, 'og:image');
		if (!image?.startsWith('https://editmamei.com/')) continue;
		const file = join(BUILD_DIR, image.slice('https://editmamei.com/'.length));
		assert.ok(existsSync(file), `${path} points og:image at a missing file: ${image}`);
	}
});
