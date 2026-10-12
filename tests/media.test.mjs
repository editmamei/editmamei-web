// Pins how the site's videos are hosted: never in static/ (the host ignores
// byte-range requests, which Safari on iPhone needs), and the committed URL
// map always matches the files under media/. Also unit-tests the key scheme
// in scripts/upload-media.mjs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	BASE_URL,
	MEDIA_TYPES,
	OUTPUT_PATH,
	buildManifest,
	hashedKey,
	listMedia,
	serialize
} from '../scripts/upload-media.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const STATIC_DIR = resolve(__dirname, '..', 'static');
const VIDEO_EXTENSIONS = new Set([...Object.keys(MEDIA_TYPES), '.mov', '.m4v']);

function filesUnder(dir) {
	return readdirSync(dir, { withFileTypes: true, recursive: true })
		.filter((e) => e.isFile())
		.map((e) => join(e.parentPath, e.name));
}

test('no video is served from static/', () => {
	const videos = filesUnder(STATIC_DIR).filter((f) =>
		VIDEO_EXTENSIONS.has(extname(f).toLowerCase())
	);
	assert.deepEqual(videos, [], 'move videos to media/ and run node scripts/upload-media.mjs');
});

test('the committed media map matches the files under media/', () => {
	const files = listMedia();
	assert.ok(files.length > 0, 'media/ is empty');
	assert.equal(
		readFileSync(OUTPUT_PATH, 'utf8'),
		serialize(buildManifest(files)),
		'run node scripts/upload-media.mjs'
	);
});

test('every URL is on the media domain with a content hash in its name', () => {
	const manifest = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8'));
	for (const [path, url] of Object.entries(manifest)) {
		const stem = path.slice(0, -extname(path).length);
		assert.match(url, new RegExp(`^${BASE_URL}/${stem}\\.[0-9a-f]{12}\\${extname(path)}$`));
	}
});

test('hashedKey puts the first 12 hex digits of the SHA-256 before the extension', () => {
	// sha256("abc") = ba7816bf8f01cfea414140de5dae2223...
	assert.equal(hashedKey('hero/clip.mp4', Buffer.from('abc')), 'hero/clip.ba7816bf8f01.mp4');
	assert.equal(hashedKey('a.b/c.d.webm', Buffer.from('abc')), 'a.b/c.d.ba7816bf8f01.webm');
});

test('listMedia finds media files only, sorted, as posix paths', () => {
	const dir = mkdtempSync(join(tmpdir(), 'media-'));
	mkdirSync(join(dir, 'b'));
	writeFileSync(join(dir, 'b', 'two.MP4'), 'x');
	writeFileSync(join(dir, 'one.webm'), 'x');
	writeFileSync(join(dir, 'notes.txt'), 'x');
	assert.deepEqual(listMedia(dir), ['b/two.MP4', 'one.webm']);
});
