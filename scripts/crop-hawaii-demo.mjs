// One-off: crop the Hawaii Coast Wall Art template's before.jpg from 500x375
// down to the same 16:9 framing as the after.jpg (500x281), so the
// BeforeAfterSlider on /#demo compares same-sized images.
//
// Approximates the template's actual rotation+crop on the small preview:
// - chop a small inset from each side (matches the template's safe inset)
// - chop top + bottom to land 16:9
// - resize back to 500x281 to match the after exactly

import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

const SRC = resolve(
	process.env.USERPROFILE || process.env.HOME,
	'.editmamei/templates/hawaii-coast-wall-art/before.jpg'
);
const DST_BEFORE = resolve(repoRoot, 'static/demos/hawaii-coast-wall-art/before.jpg');
const DST_AFTER = resolve(repoRoot, 'static/demos/hawaii-coast-wall-art/after.jpg');
const SRC_AFTER = resolve(
	process.env.USERPROFILE || process.env.HOME,
	'.editmamei/templates/hawaii-coast-wall-art/after.jpg'
);

// Source: 500x375. Template applies a ~3% left/right inset and a vertical
// crop that shifts the framing slightly down (more bottom trim than top).
// Replicating proportionally: left 14, top 34, width 472, height 266.
// That's already 16:9; resize to 500x281 to match after.jpg exactly.
await sharp(SRC)
	.extract({ left: 14, top: 34, width: 472, height: 266 })
	.resize(500, 281, { fit: 'fill' })
	.jpeg({ quality: 88 })
	.toFile(DST_BEFORE);

// After is already 500x281 from the template — copy verbatim with re-encode
// to normalize the JPEG quality alongside the cropped before.
await sharp(SRC_AFTER).jpeg({ quality: 88 }).toFile(DST_AFTER);

console.log('Wrote', DST_BEFORE);
console.log('Wrote', DST_AFTER);
