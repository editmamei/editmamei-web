// Pins the permanent redirects in _redirects (served by Workers static assets
// before any file): every target is a real page, no source shadows a real
// page, and every source is covered with and without its trailing slash.
// svelte.config.js lets prerender follow links to these sources, so a typo
// here would otherwise ship a 301 to a 404 with nothing failing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const ROUTES_DIR = join(REPO_ROOT, 'src', 'routes');

/** Static page routes on disk, nested ones included ([param] dirs skipped). */
function diskRoutes() {
	const routes = new Set();
	if (existsSync(join(ROUTES_DIR, '+page.svelte'))) routes.add('/');
	const walk = (dir, prefix) => {
		for (const entry of readdirSync(dir)) {
			const full = join(dir, entry);
			if (!statSync(full).isDirectory() || entry.startsWith('[')) continue;
			const route = `${prefix}/${entry}`;
			if (existsSync(join(full, '+page.svelte'))) routes.add(route);
			walk(full, route);
		}
	};
	walk(ROUTES_DIR, '');
	return routes;
}

/** The rules in _redirects as { from, to, status }. */
function rules() {
	return readFileSync(join(REPO_ROOT, '_redirects'), 'utf8')
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line && !line.startsWith('#'))
		.map((line) => {
			const [from, to, status] = line.split(/\s+/);
			return { from, to, status };
		});
}

const bare = (path) => path.replace(/(.)\/$/, '$1');

test('_redirects has rules, each a permanent 301 between site paths', () => {
	const list = rules();
	assert.ok(list.length > 0, '_redirects is empty');
	for (const { from, to, status } of list) {
		assert.equal(status, '301', `${from} should be a permanent 301`);
		assert.ok(from.startsWith('/') && to.startsWith('/'), `${from} -> ${to} must be site paths`);
	}
});

test('every redirect target is a real page', () => {
	const pages = diskRoutes();
	for (const { from, to } of rules()) {
		const path = bare(to.split('#')[0].split('?')[0]);
		assert.ok(pages.has(path), `${from} redirects to ${to}, but ${path} has no +page.svelte`);
	}
});

test("a redirect target's #fragment exists on its page", () => {
	for (const { from, to } of rules()) {
		const [path, fragment] = to.split('#');
		if (!fragment) continue;
		const page = bare(path) === '/' ? '' : bare(path).slice(1);
		const source = readFileSync(join(ROUTES_DIR, page, '+page.svelte'), 'utf8');
		assert.ok(
			source.includes(`id="${fragment}"`),
			`${from} redirects to ${to}, but that page has no id="${fragment}"`
		);
	}
});

test('no redirect source is a real page it would shadow', () => {
	const pages = diskRoutes();
	for (const { from } of rules()) {
		assert.ok(!pages.has(bare(from)), `${from} redirects away, but it is also a page on disk`);
	}
});

test('every redirect source is covered with and without its trailing slash', () => {
	const sources = new Set(rules().map((r) => r.from));
	for (const from of sources) {
		const twin = from.endsWith('/') ? bare(from) : `${from}/`;
		assert.ok(sources.has(twin), `${from} has no ${twin} twin in _redirects`);
	}
});
