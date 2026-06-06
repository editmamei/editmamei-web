// One-off: prep the Hawaii Coast Wall Art template's preview images for the
// landing demo slider. Goal — make the crop+rotate the template performs
// VISIBLE in the slider rather than hidden.
//
// Source:  before.jpg 500x375 (4:3, full original frame)
//          after.jpg  500x281 (16:9, post-crop + rotation)
//
// Output:  before.jpg 500x375 verbatim (full frame)
//          after.jpg  500x375 — the 281-tall image centered in a 375-tall
//                              canvas with white bands top+bottom showing
//                              exactly where the template's crop took.
//
// The before-and-after slider now compares the same canvas size, and the
// white bands visually demonstrate the crop step at the bottom of the recipe.

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const HOME = process.env.USERPROFILE || process.env.HOME;
const SRC_BEFORE = resolve(HOME, '.editmamei/templates/hawaii-coast-wall-art/before.jpg');
const SRC_AFTER = resolve(HOME, '.editmamei/templates/hawaii-coast-wall-art/after.jpg');
const DST_BEFORE = resolve(repoRoot, 'static/demos/hawaii-coast-wall-art/before.jpg');
const DST_AFTER = resolve(repoRoot, 'static/demos/hawaii-coast-wall-art/after.jpg');

// Before: copy at full 500x375 (just re-encode for consistent JPEG quality).
await sharp(SRC_BEFORE).jpeg({ quality: 88 }).toFile(DST_BEFORE);

// After: pad the 500x281 into a 500x375 white canvas — 47px white top, 47px
// white bottom, leaves the cropped 16:9 image centered exactly where it was
// inside the original frame.
await sharp(SRC_AFTER)
	.extend({ top: 47, bottom: 47, left: 0, right: 0, background: { r: 255, g: 255, b: 255 } })
	.jpeg({ quality: 88 })
	.toFile(DST_AFTER);

console.log('Wrote', DST_BEFORE);
console.log('Wrote', DST_AFTER);
