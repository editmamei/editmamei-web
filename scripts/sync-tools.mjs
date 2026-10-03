#!/usr/bin/env node
/**
 * Writes src/lib/content/tools/tools.generated.json, the list of shipped
 * tools behind the /tools directory, from the public editmamei repo's tool
 * tables (src/core/tool-tiers.ts and src/core/tool-groups.ts).
 *
 * Usage:
 *   node scripts/sync-tools.mjs [--source <editmamei checkout>] [--date YYYY-MM-DD] [--check]
 *
 * --source  Path to a checkout of github.com/editmamei/editmamei. Defaults to
 *           the EDITMAMEI_SRC environment variable, then ../Editmamei.
 * --date    The snapshot date to record. By default the existing date is kept
 *           when the tool list and version are unchanged, and today's date is
 *           used otherwise.
 * --check   Compare only. Exits 1 if the committed file is out of date.
 *
 * Only tools at tier 'community' or 'pro' are written. Rows at any other
 * tier never reach the output. The output is sorted by id so reruns are
 * byte-identical.
 */

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
export const OUTPUT_PATH = join(
	REPO_ROOT,
	'src',
	'lib',
	'content',
	'tools',
	'tools.generated.json'
);

export const SHIPPED_TIERS = new Set(['community', 'pro']);

/**
 * Rows the tier table still classifies as 'pro' that the current Pro module
 * does not register. The table keeps them so a host can boot against an
 * older module; they are not tools anyone can call today. The Pro module's
 * registration list is not public, so this list is kept by hand. The sync
 * fails if a name here disappears from the table, so the list can only
 * shrink on purpose.
 */
export const NOT_REGISTERED = [
	'ps_warp_layer_mesh',
	'ps_warp_layer_along',
	'ps_warp_layer_region',
	'ps_warp_layer_to'
];

const EDITOR_PREFIXES = [
	['ps_', 'photoshop'],
	['gimp_', 'gimp']
];

/** One table row: `key: 'value',` with optional quotes on either side and an optional trailing `// comment`. */
const ROW = /^\s*(['"]?)([a-z][a-z0-9_]*)\1\s*:\s*(['"])([a-z_]+)\3\s*,?\s*(?:\/\/.*)?$/;

/** Any line that starts with a property key, parseable or not. */
const KEY_LINE = /^\s*(['"]?)[A-Za-z_$][\w$]*\1\s*:/;

/**
 * Parses `export const <name> ... = { key: 'value', ... };` from TypeScript
 * source into a Map. Comment lines are skipped. A duplicate key throws, and
 * so does any key line in the table that the row pattern cannot read, so a
 * new row shape fails the sync instead of silently dropping the tool.
 */
export function parseTable(source, name) {
	const header = new RegExp(`export const ${name}\\b[^=]*=\\s*\\{`).exec(source);
	if (!header) throw new Error(`${name} not found`);
	const bodyStart = header.index + header[0].length;
	const end = source.indexOf('\n};', bodyStart);
	if (end < 0) throw new Error(`${name}: closing "};" not found`);
	const body = source.slice(bodyStart, end).replace(/\/\*[\s\S]*?\*\//g, '');
	const table = new Map();
	const keyLines = [];
	const unparsed = [];
	for (const line of body.split('\n')) {
		if (line.trimStart().startsWith('//') || !KEY_LINE.test(line)) continue;
		keyLines.push(line);
		const m = ROW.exec(line);
		if (!m) {
			unparsed.push(line.trim());
			continue;
		}
		if (table.has(m[2])) throw new Error(`${name}: duplicate key ${m[2]}`);
		table.set(m[2], m[4]);
	}
	if (table.size === 0) throw new Error(`${name}: no rows parsed`);
	if (table.size !== keyLines.length) {
		throw new Error(
			`${name}: parsed ${table.size} rows but the table has ${keyLines.length} key lines` +
				(unparsed.length ? ` (unparsed: ${unparsed.join(' | ')})` : '')
		);
	}
	return table;
}

export function editorOf(id) {
	for (const [prefix, editor] of EDITOR_PREFIXES) if (id.startsWith(prefix)) return editor;
	throw new Error(`${id}: unknown editor prefix (expected ps_ or gimp_)`);
}

/**
 * Builds the sorted tool list.
 *
 * @param {object} input
 * @param {Map<string, string>} input.tiers   tool id -> tier
 * @param {Map<string, string>} input.groups  tool id -> capability group
 * @param {(id: string) => boolean} [input.hasImplementation]
 *   Optional check that a 'community' row has source behind it.
 */
export function buildTools({ tiers, groups, hasImplementation }) {
	for (const id of NOT_REGISTERED) {
		if (!tiers.has(id)) {
			throw new Error(
				`${id} is no longer in the tier table. Remove it from NOT_REGISTERED in scripts/sync-tools.mjs.`
			);
		}
	}
	const skip = new Set(NOT_REGISTERED);
	const tools = [];
	for (const [id, tier] of tiers) {
		if (!SHIPPED_TIERS.has(tier) || skip.has(id)) continue;
		const group = groups.get(id);
		if (!group) throw new Error(`${id} has no capability group in tool-groups.ts`);
		if (tier === 'community' && hasImplementation && !hasImplementation(id)) {
			throw new Error(`${id} is 'community' but no source file under src/ names it`);
		}
		tools.push({ id, editor: editorOf(id), edition: tier, group });
	}
	tools.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
	return tools;
}

function* walkTs(dir) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) yield* walkTs(full);
		else if (full.endsWith('.ts')) yield full;
	}
}

/** Returns a predicate: does any src/ file other than the two tables quote this id? */
function implementationIndex(sourceRoot) {
	const srcDir = join(sourceRoot, 'src');
	const tables = new Set(['core/tool-tiers.ts', 'core/tool-groups.ts']);
	let text = '';
	for (const file of walkTs(srcDir)) {
		if (tables.has(relative(srcDir, file).replaceAll('\\', '/'))) continue;
		text += readFileSync(file, 'utf8');
	}
	return (id) => text.includes(`'${id}'`);
}

export function serialize(snapshot) {
	return `${JSON.stringify(snapshot, null, '\t')}\n`;
}

function today() {
	const d = new Date();
	const pad = (n) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseArgs(argv) {
	const args = { source: null, date: null, check: false };
	for (let i = 0; i < argv.length; i++) {
		const a = argv[i];
		if (a === '--check') args.check = true;
		else if (a === '--source') args.source = argv[++i];
		else if (a === '--date') args.date = argv[++i];
		else throw new Error(`unknown argument: ${a}`);
	}
	if (args.date && !/^\d{4}-\d{2}-\d{2}$/.test(args.date)) {
		throw new Error(`--date must be YYYY-MM-DD, got ${args.date}`);
	}
	return args;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const sourceRoot = resolve(
		args.source ?? process.env.EDITMAMEI_SRC ?? join(REPO_ROOT, '..', 'Editmamei')
	);
	const tiersFile = join(sourceRoot, 'src', 'core', 'tool-tiers.ts');
	if (!existsSync(tiersFile)) {
		throw new Error(
			`No tool-tiers.ts under ${sourceRoot}. Pass --source <editmamei checkout> or set EDITMAMEI_SRC.`
		);
	}
	const tiers = parseTable(readFileSync(tiersFile, 'utf8'), 'TOOL_TIERS');
	const groups = parseTable(
		readFileSync(join(sourceRoot, 'src', 'core', 'tool-groups.ts'), 'utf8'),
		'TOOL_GROUPS'
	);
	const pkg = JSON.parse(readFileSync(join(sourceRoot, 'package.json'), 'utf8'));
	const tools = buildTools({ tiers, groups, hasImplementation: implementationIndex(sourceRoot) });

	const previous = existsSync(OUTPUT_PATH) ? JSON.parse(readFileSync(OUTPUT_PATH, 'utf8')) : null;
	const unchanged =
		previous &&
		previous.source?.version === pkg.version &&
		JSON.stringify(previous.tools) === JSON.stringify(tools);
	const snapshotDate = args.date ?? (unchanged ? previous.snapshotDate : today());

	const snapshot = {
		_generated: 'Do not edit. Regenerate with `node scripts/sync-tools.mjs --source <editmamei>`.',
		source: { package: pkg.name, version: pkg.version },
		snapshotDate,
		tools
	};
	const next = serialize(snapshot);
	const current = existsSync(OUTPUT_PATH) ? readFileSync(OUTPUT_PATH, 'utf8') : '';

	const counts = tools.reduce((acc, t) => {
		const key = `${t.editor}/${t.edition}`;
		acc[key] = (acc[key] ?? 0) + 1;
		return acc;
	}, {});
	const summary = Object.entries(counts)
		.map(([k, v]) => `${k} ${v}`)
		.join(', ');

	if (args.check) {
		if (next !== current) {
			console.error(`tools.generated.json is out of date (${tools.length} tools: ${summary}).`);
			process.exit(1);
		}
		console.log(`tools.generated.json is current (${tools.length} tools: ${summary}).`);
		return;
	}
	if (next === current) {
		console.log(`No change (${tools.length} tools: ${summary}).`);
		return;
	}
	writeFileSync(OUTPUT_PATH, next);
	console.log(`Wrote ${relative(REPO_ROOT, OUTPUT_PATH)} (${tools.length} tools: ${summary}).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
	try {
		main();
	} catch (err) {
		console.error(`sync-tools: ${err.message}`);
		process.exit(1);
	}
}
