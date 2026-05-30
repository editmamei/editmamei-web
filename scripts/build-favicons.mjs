// Generates the favicon kit from design/Editmamei-icon.png.
//
// Reads the 1024×1024 master, downsizes to the standard favicon sizes,
// and bundles the 16/32/48 PNGs into a multi-resolution favicon.ico.
//
// Re-run any time the master changes:  npm run build:favicons
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/**
 * Builds a multi-resolution ICO file from a list of square PNG buffers.
 * The ICO format is a 6-byte header + a 16-byte directory entry per image
 * + the concatenated PNG bytes. Each entry holds the image's width/height,
 * data size, and the offset into the file where its PNG bytes start.
 *
 * Replaces `to-ico` (npm), which pulled in a long-deprecated request →
 * jimp → form-data chain with 14 CVEs we never actually trigger. ICO is
 * a simple enough format to encode inline.
 *
 * Spec: https://en.wikipedia.org/wiki/ICO_(file_format)
 */
function buildIco(images) {
	const headerSize = 6;
	const entrySize = 16;
	const directorySize = images.length * entrySize;
	let dataOffset = headerSize + directorySize;

	const header = Buffer.alloc(headerSize);
	header.writeUInt16LE(0, 0); // reserved, must be 0
	header.writeUInt16LE(1, 2); // type: 1 = ICO (2 would be CUR)
	header.writeUInt16LE(images.length, 4);

	const directory = Buffer.alloc(directorySize);
	for (let i = 0; i < images.length; i++) {
		const { size, png } = images[i];
		const e = i * entrySize;
		// Width / height: 0 stands for 256 in the ICO header. Anything we
		// ship is well under 256, so this branch never fires today, but it
		// keeps the encoder honest if someone adds a 256px size later.
		directory.writeUInt8(size >= 256 ? 0 : size, e + 0);
		directory.writeUInt8(size >= 256 ? 0 : size, e + 1);
		directory.writeUInt8(0, e + 2); // palette size — 0 for non-paletted
		directory.writeUInt8(0, e + 3); // reserved
		directory.writeUInt16LE(1, e + 4); // color planes
		directory.writeUInt16LE(32, e + 6); // bits per pixel (RGBA)
		directory.writeUInt32LE(png.length, e + 8);
		directory.writeUInt32LE(dataOffset, e + 12);
		dataOffset += png.length;
	}

	return Buffer.concat([header, directory, ...images.map((i) => i.png)]);
}

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const src = resolve(repoRoot, 'design/Editmamei-icon.png');
const outDir = resolve(repoRoot, 'static/icons');

// One entry per PNG to emit. `kind` doesn't affect output, just the log line.
const pngTargets = [
	{ size: 16, name: 'favicon-16.png', kind: 'browser tab' },
	{ size: 32, name: 'favicon-32.png', kind: 'browser tab' },
	{ size: 48, name: 'favicon-48.png', kind: 'browser tab / ICO' },
	{ size: 64, name: 'icon-64.png', kind: 'header lockup (2x of 32px display)' },
	{ size: 180, name: 'apple-touch-icon.png', kind: 'iOS home screen' },
	{ size: 192, name: 'icon-192.png', kind: 'Android / PWA' },
	{ size: 512, name: 'icon-512.png', kind: 'Android / PWA splash' }
];

await mkdir(outDir, { recursive: true });

console.log(`reading master: ${src}`);
const master = sharp(src);
const { width, height } = await master.metadata();
console.log(`master is ${width}×${height}`);

// Cache one Buffer per size so we don't re-encode for the ICO step.
const buffersBySize = new Map();
for (const { size, name, kind } of pngTargets) {
	const buf = await sharp(src).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer();
	buffersBySize.set(size, buf);
	const out = resolve(outDir, name);
	await writeFile(out, buf);
	console.log(`  wrote ${name.padEnd(22)} (${size}×${size}, ${kind})`);
}

// favicon.ico: standard multi-resolution bundle of 16, 32, 48.
const ico = buildIco([
	{ size: 16, png: buffersBySize.get(16) },
	{ size: 32, png: buffersBySize.get(32) },
	{ size: 48, png: buffersBySize.get(48) }
]);
const icoPath = resolve(outDir, 'favicon.ico');
await writeFile(icoPath, ico);
console.log(`  wrote favicon.ico          (multi-res 16/32/48, legacy browsers)`);

console.log('done.');
