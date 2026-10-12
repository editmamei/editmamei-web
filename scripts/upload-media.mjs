#!/usr/bin/env node
/**
 * Uploads the site's videos to the editmamei-web-media R2 bucket and writes
 * src/lib/content/media.generated.json, the map from each file under media/
 * to its public URL on media.editmamei.com.
 *
 * Videos are served from R2 rather than from the site's own static files
 * because Workers Static Assets ignores byte-range requests (it answers a
 * Range request with 200 and the whole file), and Safari on iPhone needs
 * ranges to play an MP4. R2 behind a custom domain answers 206.
 *
 * Usage:
 *   node scripts/upload-media.mjs [--check] [--no-verify]
 *
 * --check      Compare only, no network. Exits 1 if the committed map doesn't
 *              match the files under media/.
 * --no-verify  Skip the range-request check after uploading (for example
 *              before the custom domain is connected).
 *
 * Each object's key carries the first 12 hex digits of the file's SHA-256, so
 * a changed video gets a new URL and every object can be cached for a year.
 * An object already at its URL is not uploaded again. Uploads go through
 * wrangler: set WRANGLER to wrangler's bin/wrangler.js if it isn't installed
 * in this checkout.
 */

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, extname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

export const MEDIA_DIR = join(REPO_ROOT, 'media');
export const OUTPUT_PATH = join(REPO_ROOT, 'src', 'lib', 'content', 'media.generated.json');
export const BUCKET = 'editmamei-web-media';
export const BASE_URL = 'https://media.editmamei.com';
export const CACHE_CONTROL = 'public, max-age=31536000, immutable';

/** The file types that live in media/ and the Content-Type each is uploaded with. */
export const MEDIA_TYPES = {
	'.mp4': 'video/mp4',
	'.webm': 'video/webm'
};

/** Every media file under `dir`, as sorted posix paths relative to it. */
export function listMedia(dir = MEDIA_DIR) {
	const out = [];
	const walk = (d) => {
		for (const entry of readdirSync(d, { withFileTypes: true })) {
			const full = join(d, entry.name);
			if (entry.isDirectory()) walk(full);
			else if (extname(entry.name).toLowerCase() in MEDIA_TYPES)
				out.push(relative(dir, full).split(sep).join('/'));
		}
	};
	if (existsSync(dir)) walk(dir);
	return out.sort();
}

/** `hero/clip.mp4` + its bytes -> `hero/clip.<12 hex of sha256>.mp4`. */
export function hashedKey(path, bytes) {
	const hash = createHash('sha256').update(bytes).digest('hex').slice(0, 12);
	const ext = posix.extname(path);
	return `${path.slice(0, -ext.length)}.${hash}${ext}`;
}

/** The URL map for the given files, keys sorted. */
export function buildManifest(files, dir = MEDIA_DIR) {
	const manifest = {};
	for (const path of files) {
		manifest[path] = `${BASE_URL}/${hashedKey(path, readFileSync(join(dir, path)))}`;
	}
	return manifest;
}

export function serialize(manifest) {
	return JSON.stringify(manifest, null, '\t') + '\n';
}

function wranglerEntry() {
	if (process.env.WRANGLER) return process.env.WRANGLER;
	try {
		return createRequire(join(REPO_ROOT, 'package.json')).resolve('wrangler/bin/wrangler.js');
	} catch {
		throw new Error(
			'wrangler is not installed in this checkout. Run npm install, or set WRANGLER to the path of wrangler/bin/wrangler.js.'
		);
	}
}

async function isUploaded(url, size) {
	try {
		const res = await fetch(url, { method: 'HEAD' });
		return res.ok && Number(res.headers.get('content-length')) === size;
	} catch {
		return false; // not reachable yet, for example before the custom domain exists
	}
}

async function rangeWorks(url) {
	const res = await fetch(url, { headers: { Range: 'bytes=0-1023' } });
	await res.body?.cancel();
	return res.status === 206 && /^bytes 0-1023\//.test(res.headers.get('content-range') ?? '');
}

async function main(args) {
	const files = listMedia();
	const manifest = buildManifest(files);
	const committed = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, 'utf8') : '';

	if (args.includes('--check')) {
		if (committed === serialize(manifest)) {
			console.log(`media map up to date (${files.length} files)`);
			return 0;
		}
		console.error(
			'src/lib/content/media.generated.json does not match media/. Run node scripts/upload-media.mjs.'
		);
		return 1;
	}

	const wrangler = wranglerEntry();
	for (const path of files) {
		const url = manifest[path];
		const full = join(MEDIA_DIR, path);
		const size = readFileSync(full).length;
		if (await isUploaded(url, size)) {
			console.log(`already uploaded  ${path}`);
			continue;
		}
		const key = url.slice(BASE_URL.length + 1);
		const result = spawnSync(
			process.execPath,
			[
				wrangler,
				'r2',
				'object',
				'put',
				`${BUCKET}/${key}`,
				'--file',
				full,
				'--remote',
				'--content-type',
				MEDIA_TYPES[extname(path).toLowerCase()],
				'--cache-control',
				CACHE_CONTROL
			],
			{ cwd: REPO_ROOT, stdio: 'inherit' }
		);
		if (result.status !== 0) {
			console.error(`upload failed: ${path}`);
			return 1;
		}
		console.log(`uploaded          ${path} -> ${key}`);
	}

	writeFileSync(OUTPUT_PATH, serialize(manifest));
	console.log(`wrote ${relative(REPO_ROOT, OUTPUT_PATH)}`);

	if (!args.includes('--no-verify')) {
		for (const path of files) {
			if (!(await rangeWorks(manifest[path]))) {
				console.error(`range request did not return 206: ${manifest[path]}`);
				return 1;
			}
		}
		console.log('range requests answer 206');
	}
	return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
	main(process.argv.slice(2)).then(
		(code) => process.exit(code),
		(err) => {
			console.error(err.message);
			process.exit(1);
		}
	);
}
