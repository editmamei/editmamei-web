#!/usr/bin/env node
/**
 * Leak guard for editmamei-web (marketing site).
 *
 * Fails if any 'dev' or 'none'-tier tool name from Editmamei (the
 * private source repo's src/core/tool-tiers.ts) appears in this site's
 * source. Catches the case where a code example, configuration
 * snippet, or API-name reference would tip a tool that is not actually
 * shipping in the CE / Pro bundles yet.
 *
 * The BLOCKED list below is HAND-MAINTAINED and must be kept in sync
 * with Editmamei/src/core/tool-tiers.ts (entries marked 'dev' or
 * 'none'). When you flip a tier in Editmamei, also update:
 *   - editmamei-web/scripts/check-leak-guard.mjs  (this file)
 *   - editmamei-ce/scripts/check-leak-guard.mjs
 *
 * Run locally: `node scripts/check-leak-guard.mjs`
 * Runs in CI via .github/workflows/leak-guard.yml on every push / PR.
 *
 * Narrow-scope check by design: only matches the literal `photoshop_*`
 * tool identifiers. Marketing copy uses human-facing feature names
 * (e.g. "Color Range", "High Pass") that overlap with legitimate PS UI
 * concepts the site can reasonably discuss. Marketing-copy leakage is
 * gated by manual review at tier-flip time per
 * Editmamei/docs/20260603-tool-tier-process.md.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SELF_PATH = fileURLToPath(import.meta.url);

// === BEGIN AUTO-GENERATED BLOCKED (sync-leak-guard.ts) ===
// Auto-generated from Editmamei/src/core/tool-tiers.ts (entries
// classified 'dev' or 'none'). Do NOT hand-edit — re-run
// `npm run sync:leak-guard` from Editmamei to refresh.
// Source: 7 dev/none tier names at sync time.
const BLOCKED = [
	'photoshop_apply_brush_stroke',
	'photoshop_apply_color_lookup',
	'photoshop_apply_lens_blur',
	'photoshop_create_clipping_mask',
	'photoshop_release_clipping_mask',
	'photoshop_select_color_range',
	'photoshop_template_verify',
]
// === END AUTO-GENERATED BLOCKED ===

const SCAN_ROOTS = ['src', 'static', 'README.md'];

const EXCLUDED_DIRS = new Set(['node_modules', 'build', '.svelte-kit', '.git', 'dist']);
const EXCLUDED_EXTS = new Set([
	'.png',
	'.jpg',
	'.jpeg',
	'.gif',
	'.svg',
	'.ico',
	'.webp',
	'.avif',
	'.woff',
	'.woff2',
	'.ttf',
	'.otf',
	'.pdf',
	'.zip',
	'.lock',
	'.map'
]);

function* walk(start) {
	const fullStart = resolve(REPO_ROOT, start);
	let s;
	try {
		s = statSync(fullStart);
	} catch {
		return;
	}
	if (s.isFile()) {
		yield fullStart;
		return;
	}
	if (!s.isDirectory()) return;
	for (const entry of readdirSync(fullStart)) {
		if (EXCLUDED_DIRS.has(entry)) continue;
		yield* walk(join(fullStart, entry));
	}
}

const leaks = [];
for (const root of SCAN_ROOTS) {
	for (const file of walk(root)) {
		if (file === SELF_PATH) continue;
		if (EXCLUDED_EXTS.has(extname(file).toLowerCase())) continue;
		let content;
		try {
			content = readFileSync(file, 'utf8');
		} catch {
			continue;
		}
		const lines = content.split(/\r?\n/);
		for (let i = 0; i < lines.length; i++) {
			for (const blocked of BLOCKED) {
				if (lines[i].includes(blocked)) {
					leaks.push({ file: relative(REPO_ROOT, file), line: i + 1, tool: blocked });
				}
			}
		}
	}
}

if (leaks.length > 0) {
	console.error(`\nLEAK GUARD FAILED — ${leaks.length} reference(s) to dev/none-tier tools:\n`);
	for (const l of leaks) {
		console.error(`  ${l.file}:${l.line}  →  ${l.tool}`);
	}
	console.error(
		`\nThese tool names are at tier 'dev' or 'none' in ` +
			`Editmamei/src/core/tool-tiers.ts and must NOT appear in this ` +
			`marketing-site source. Either:\n` +
			`  (a) promote the tool to 'community' / 'pro' in Editmamei (with ` +
			`live-verification evidence per docs/20260603-tool-tier-process.md), or\n` +
			`  (b) strip the mention from this repo until the tool is promoted.\n`
	);
	process.exit(1);
}

console.log(`Leak guard OK — none of ${BLOCKED.length} blocked names found in site source.`);
