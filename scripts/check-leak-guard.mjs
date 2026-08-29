#!/usr/bin/env node
/**
 * Leak guard for editmamei-web (marketing site).
 *
 * Fails if any 'dev' or 'none'-tier tool name from Editmamei's public
 * source repo (editmamei/editmamei's src/core/tool-tiers.ts) appears in
 * this site's source. Catches the case where a code example, configuration
 * snippet, or API-name reference would tip a tool that is not actually
 * shipping in the CE / Pro bundles yet.
 *
 * The BLOCKED list below is AUTO-GENERATED from
 * editmamei/editmamei's src/core/tool-tiers.ts by the private
 * editmamei-pro repo's scripts/sync-leak-guard.ts.
 * Do NOT hand-edit the fenced region — when a tier flips, run
 * `npm run sync:leak-guard` from editmamei-pro to regenerate this
 * file's region.
 *
 * Run locally: `node scripts/check-leak-guard.mjs`
 * Runs in CI via .github/workflows/leak-guard.yml on every push / PR.
 * Unit tests: tests/leak-guard.test.mjs (`npm test`).
 *
 * Narrow-scope check by design: only matches the literal `ps_*`
 * tool identifiers. Marketing copy uses human-facing feature names
 * (e.g. "Color Range", "High Pass") that overlap with legitimate PS UI
 * concepts the site can reasonably discuss. Marketing-copy leakage is
 * gated by manual review at tier-flip time per
 * Editmamei/docs/20260603-tool-tier-process.md.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const SELF_PATH = fileURLToPath(import.meta.url);

// === BEGIN AUTO-GENERATED BLOCKED (sync-leak-guard.ts) ===
// Auto-generated from Editmamei/src/core/tool-tiers.ts (entries
// classified 'dev' or 'none'). Do NOT hand-edit — re-run
// `npm run sync:leak-guard` from Editmamei to refresh.
// Source: 4 dev/none tier names at sync time.
const BLOCKED = [
	'ps_apply_brush_stroke',
	'ps_portrait_touchup',
	'ps_select_focus_area',
	'ps_stroke_face_contour'
];
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

function* walk(repoRoot, start) {
	const fullStart = resolve(repoRoot, start);
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
		yield* walk(repoRoot, join(fullStart, entry));
	}
}

/**
 * Scan `scanRoots` (relative to `repoRoot`) for lines containing any of the
 * blocked names. Returns { leaks, scannedFiles, emptyRoots }:
 *   - leaks: [{ file, line, tool }] with file relative to repoRoot
 *   - scannedFiles: count of text files actually read
 *   - emptyRoots: scan roots that yielded zero files (missing or unreadable
 *     — a guard that scans nothing must not report success)
 *
 * Exported for tests; main() below drives it with the repo's real config.
 */
export function scan({ repoRoot, blocked, scanRoots, selfPath = SELF_PATH }) {
	const leaks = [];
	let scannedFiles = 0;
	const emptyRoots = [];
	for (const root of scanRoots) {
		let rootFiles = 0;
		for (const file of walk(repoRoot, root)) {
			if (file === selfPath) continue;
			if (EXCLUDED_EXTS.has(extname(file).toLowerCase())) continue;
			let content;
			try {
				content = readFileSync(file, 'utf8');
			} catch {
				continue;
			}
			rootFiles++;
			const lines = content.split(/\r?\n/);
			for (let i = 0; i < lines.length; i++) {
				for (const tool of blocked) {
					if (lines[i].includes(tool)) {
						leaks.push({ file: relative(repoRoot, file), line: i + 1, tool });
					}
				}
			}
		}
		if (rootFiles === 0) emptyRoots.push(root);
		scannedFiles += rootFiles;
	}
	return { leaks, scannedFiles, emptyRoots };
}

function main() {
	const { leaks, scannedFiles, emptyRoots } = scan({
		repoRoot: REPO_ROOT,
		blocked: BLOCKED,
		scanRoots: SCAN_ROOTS
	});

	if (emptyRoots.length > 0) {
		console.error(
			`LEAK GUARD ERROR — scan root(s) yielded no readable files: ${emptyRoots.join(', ')}.\n` +
				`A guard that scans nothing must not report success. Check SCAN_ROOTS ` +
				`against the repo layout.`
		);
		process.exit(2);
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

	console.log(
		`Leak guard OK — none of ${BLOCKED.length} blocked names found in ` +
			`${scannedFiles} scanned files.`
	);
}

const isDirect =
	process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isDirect) {
	main();
}
