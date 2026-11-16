// Pins the cache rules for SvelteKit's files in the built _headers (.svelte-kit/cloudflare). The adapter appends
// /_app/* (no-cache) and then /_app/immutable/* (a year, with `! Cache-Control` to drop the no-cache). If the site's
// own _headers has an /_app/immutable/* block, the adapter merges its rules into that block instead, ahead of /_app/*,
// and the hashed files get Cache-Control set twice. `wrangler dev` adds the no-cache to hashed files whatever the
// order (production does not), so check caching on the deployed site, not locally. Like the other artifact tests
// this SKIPS when the build is absent.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const BUILT_HEADERS = join(REPO_ROOT, '.svelte-kit', 'cloudflare', '_headers');

const skip = existsSync(BUILT_HEADERS)
	? false
	: 'the build is absent — run npm run build first to enable artifact checks';

/** The rule blocks of a _headers file: path -> its header lines, in file order. */
function blocks(text) {
	const out = [];
	for (const line of text.split('\n')) {
		if (!line.trim() || line.trimStart().startsWith('#')) continue;
		if (/^\S/.test(line)) out.push({ path: line.trim(), lines: [] });
		else out.at(-1)?.lines.push(line.trim());
	}
	return out;
}

test('the source _headers leaves /_app/immutable/* to the adapter', () => {
	const source = readFileSync(join(REPO_ROOT, '_headers'), 'utf8');
	assert.ok(
		!blocks(source).some((b) => b.path === '/_app/immutable/*'),
		'an /_app/immutable/* block here makes the adapter merge its rules into it, ahead of /_app/*'
	);
});

test('hashed files are cached for a year, after the /_app/* no-cache rule', { skip }, () => {
	const built = blocks(readFileSync(BUILT_HEADERS, 'utf8'));
	const app = built.findIndex((b) => b.path === '/_app/*');
	const immutable = built.findIndex((b) => b.path === '/_app/immutable/*');
	assert.ok(app >= 0, '/_app/* rule missing');
	assert.ok(immutable > app, '/_app/immutable/* must come after /_app/*');
	assert.deepEqual(built[immutable].lines, [
		'! Cache-Control',
		'Cache-Control: public, immutable, max-age=31536000'
	]);
});
