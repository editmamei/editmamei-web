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
import toIco from 'to-ico';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const src = resolve(repoRoot, 'design/Editmamei-icon.png');
const outDir = resolve(repoRoot, 'static/icons');

// One entry per PNG to emit. `kind` doesn't affect output, just the log line.
const pngTargets = [
	{ size: 16, name: 'favicon-16.png', kind: 'browser tab' },
	{ size: 32, name: 'favicon-32.png', kind: 'browser tab' },
	{ size: 48, name: 'favicon-48.png', kind: 'browser tab / ICO' },
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
const ico = await toIco([buffersBySize.get(16), buffersBySize.get(32), buffersBySize.get(48)]);
const icoPath = resolve(outDir, 'favicon.ico');
await writeFile(icoPath, ico);
console.log(`  wrote favicon.ico          (multi-res 16/32/48, legacy browsers)`);

console.log('done.');
