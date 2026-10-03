// Pins the /tools directory data without Vite: the generated snapshot is read
// as JSON and the TypeScript copy files are parsed as text, then checked
// against the same rules src/lib/content/tools/index.ts enforces at build
// time. Also unit-tests the generator (scripts/sync-tools.mjs).

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	NOT_REGISTERED,
	buildTools,
	editorOf,
	parseTable,
	serialize
} from '../scripts/sync-tools.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const TOOLS_DIR = join(REPO_ROOT, 'src', 'lib', 'content', 'tools');

const snapshot = JSON.parse(readFileSync(join(TOOLS_DIR, 'tools.generated.json'), 'utf8'));
const copySource = readFileSync(join(TOOLS_DIR, 'tool-copy.ts'), 'utf8');
const categoriesSource = readFileSync(join(TOOLS_DIR, 'categories.ts'), 'utf8');
const indexSource = readFileSync(join(TOOLS_DIR, 'index.ts'), 'utf8');

/** Tool ids keyed in TOOL_COPY (one tab of indentation, unquoted key). */
const copyIds = Array.from(copySource.matchAll(/^\t((?:ps|gimp)_[a-z0-9_]+): \{/gm), (m) => m[1]);

/** The block of text for one TOOL_COPY entry. */
function copyEntry(id) {
	const start = copySource.indexOf(`\t${id}: {`);
	const end = copySource.indexOf('\n\t}', start);
	return copySource.slice(start, end);
}

const categoryIds = Array.from(categoriesSource.matchAll(/^\t\tid: '([a-z]+)',$/gm), (m) => m[1]);
const groupBlock = categoriesSource.match(/GROUP_TO_CATEGORY[\s\S]*?\n\};/);
const groupToCategory = new Map(
	Array.from(groupBlock[0].matchAll(/^\t([a-z_]+): '([a-z]+)',?$/gm), (m) => [m[1], m[2]])
);

/** dev/none names from the leak guard's generated BLOCKED list. */
const blocked = (() => {
	const src = readFileSync(join(REPO_ROOT, 'scripts', 'check-leak-guard.mjs'), 'utf8');
	const m = src.match(/const BLOCKED = \[([^\]]*)\]/);
	assert.ok(m, 'BLOCKED list not found in scripts/check-leak-guard.mjs');
	return Array.from(m[1].matchAll(/'([^']+)'/g), (x) => x[1]);
})();

// Mirrors slugFor() in src/lib/content/tools/index.ts; the test below pins the two.
const slugFor = (id) => (id.startsWith('ps_') ? id.slice(3) : id).replaceAll('_', '-');

test('snapshot holds only community and pro tools, with known editors', () => {
	assert.ok(snapshot.tools.length > 0);
	for (const t of snapshot.tools) {
		assert.ok(['community', 'pro'].includes(t.edition), `${t.id}: edition ${t.edition}`);
		assert.equal(t.editor, editorOf(t.id), `${t.id}: editor does not match its prefix`);
	}
});

test('no dev or none tool appears in the snapshot or the copy', () => {
	assert.ok(blocked.length > 0, 'BLOCKED list is empty; the check would prove nothing');
	const ids = new Set(snapshot.tools.map((t) => t.id));
	for (const name of blocked) {
		assert.ok(!ids.has(name), `${name} is dev/none but is in tools.generated.json`);
		assert.ok(!copySource.includes(name), `${name} is dev/none but is named in tool-copy.ts`);
	}
});

test('unregistered table rows never reach the snapshot', () => {
	const ids = new Set(snapshot.tools.map((t) => t.id));
	for (const name of NOT_REGISTERED) assert.ok(!ids.has(name), `${name} is in the snapshot`);
});

test('every generated tool has copy, and every copy entry is a generated tool', () => {
	const generated = new Set(snapshot.tools.map((t) => t.id));
	const written = new Set(copyIds);
	assert.equal(written.size, copyIds.length, 'duplicate key in tool-copy.ts');
	for (const id of generated) assert.ok(written.has(id), `${id} has no entry in tool-copy.ts`);
	for (const id of written) assert.ok(generated.has(id), `tool-copy.ts has stale entry ${id}`);
});

test('every tool lands in a known category', () => {
	for (const t of snapshot.tools) {
		const override = copyEntry(t.id).match(/category: '([a-z]+)'/)?.[1];
		const category = override ?? groupToCategory.get(t.group);
		assert.ok(category, `${t.id}: group ${t.group} has no category`);
		assert.ok(categoryIds.includes(category), `${t.id}: unknown category ${category}`);
	}
});

test('every copy entry has a task and a summary of about 120 characters at most', () => {
	for (const id of copyIds) {
		const entry = copyEntry(id);
		assert.match(entry, /task: ['"].+['"]/, `${id}: no task`);
		const summary = entry.match(/summary:\s*(['"])(.+?)\1,?(?:\n|$)/s)?.[2];
		assert.ok(summary, `${id}: no summary`);
		assert.ok(summary.length <= 125, `${id}: summary is ${summary.length} characters`);
	}
});

test('copy uses no em-dashes', () => {
	for (const [name, src] of [
		['tool-copy.ts', copySource],
		['categories.ts', categoriesSource]
	]) {
		assert.ok(!src.includes('—'), `${name} contains an em-dash`);
	}
});

test('counts per editor and per edition add up to the total', () => {
	const by = (key) =>
		snapshot.tools.reduce((acc, t) => ({ ...acc, [t[key]]: (acc[t[key]] ?? 0) + 1 }), {});
	const sum = (o) => Object.values(o).reduce((a, b) => a + b, 0);
	assert.equal(sum(by('editor')), snapshot.tools.length);
	assert.equal(sum(by('edition')), snapshot.tools.length);
	const gimpPro = snapshot.tools.filter((t) => t.editor === 'gimp' && t.edition === 'pro');
	assert.equal(gimpPro.length, 0, 'the GIMP + Pro empty state assumes no GIMP Pro tools');
});

test('snapshot metadata is well formed and the list is sorted', () => {
	assert.match(snapshot.snapshotDate, /^\d{4}-\d{2}-\d{2}$/);
	assert.ok(!Number.isNaN(Date.parse(snapshot.snapshotDate)));
	assert.match(snapshot.source.version, /^\d+\.\d+\.\d+/);
	const ids = snapshot.tools.map((t) => t.id);
	assert.deepEqual(ids, [...ids].sort());
});

test('slugs are unique and kebab-case', () => {
	assert.ok(indexSource.includes(`(id.startsWith('ps_') ? id.slice(3) : id).replaceAll('_', '-')`));
	const slugs = snapshot.tools.map((t) => slugFor(t.id));
	assert.equal(new Set(slugs).size, slugs.length, 'duplicate slug');
	for (const s of slugs) assert.match(s, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

// Generator

const TIERS_TS = `
export const TOOL_TIERS: Record<string, Tier> = {
  // a comment line: ps_commented: 'community',
  ps_b: 'community',
  ps_a: 'pro',
  ps_dev_thing: 'dev',
  ps_gone_thing: 'none',
${NOT_REGISTERED.map((id) => `  ${id}: 'pro',`).join('\n')}
  gimp_c: 'community',
};
`;
const GROUPS_TS = `
export const TOOL_GROUPS: Record<string, ToolGroup> = {
  ps_b: 'core',
  ps_a: 'filter',
  ps_dev_thing: 'retouch',
  ps_gone_thing: 'retouch',
${NOT_REGISTERED.map((id) => `  ${id}: 'layers',`).join('\n')}
  gimp_c: 'document',
};
`;

test('generator keeps community and pro rows only, and drops unregistered rows', () => {
	const tools = buildTools({
		tiers: parseTable(TIERS_TS, 'TOOL_TIERS'),
		groups: parseTable(GROUPS_TS, 'TOOL_GROUPS')
	});
	assert.deepEqual(tools, [
		{ id: 'gimp_c', editor: 'gimp', edition: 'community', group: 'document' },
		{ id: 'ps_a', editor: 'photoshop', edition: 'pro', group: 'filter' },
		{ id: 'ps_b', editor: 'photoshop', edition: 'community', group: 'core' }
	]);
});

test('generator output is deterministic regardless of table order', () => {
	const tiers = parseTable(TIERS_TS, 'TOOL_TIERS');
	const groups = parseTable(GROUPS_TS, 'TOOL_GROUPS');
	const reversed = new Map([...tiers].reverse());
	const a = serialize({ tools: buildTools({ tiers, groups }) });
	const b = serialize({ tools: buildTools({ tiers: reversed, groups }) });
	assert.equal(a, b);
	assert.ok(a.endsWith('}\n'));
});

test('generator fails loudly on drift', () => {
	const tiers = parseTable(TIERS_TS, 'TOOL_TIERS');
	const groups = parseTable(GROUPS_TS, 'TOOL_GROUPS');

	const withoutRow = new Map(tiers);
	withoutRow.delete(NOT_REGISTERED[0]);
	assert.throws(() => buildTools({ tiers: withoutRow, groups }), /NOT_REGISTERED/);

	const ungrouped = new Map(groups);
	ungrouped.delete('ps_b');
	assert.throws(() => buildTools({ tiers, groups: ungrouped }), /no capability group/);

	assert.throws(
		() => buildTools({ tiers, groups, hasImplementation: (id) => id !== 'ps_b' }),
		/no source file/
	);

	const foreign = new Map(tiers).set('lr_x', 'community');
	assert.throws(
		() => buildTools({ tiers: foreign, groups: new Map(groups).set('lr_x', 'core') }),
		/unknown editor prefix/
	);

	assert.throws(
		() => parseTable(`${TIERS_TS}\n`.replace('ps_a:', 'ps_b:'), 'TOOL_TIERS'),
		/duplicate/
	);
});

test('parser reads trailing comments and double-quoted values', () => {
	const src = `
export const TOOL_TIERS: Record<string, Tier> = {
  ps_a: 'pro', // shipped in 1.0
  ps_b: "community",
  "ps_c": 'community',  // quoted key
  /* block: 'ignored' */
};
`;
	assert.deepEqual(
		[...parseTable(src, 'TOOL_TIERS')],
		[
			['ps_a', 'pro'],
			['ps_b', 'community'],
			['ps_c', 'community']
		]
	);
});

test('parser throws when a key line in the table cannot be read', () => {
	const src = `
export const TOOL_TIERS: Record<string, Tier> = {
  ps_a: 'pro',
  ps_b: TIER_COMMUNITY,
};
`;
	assert.throws(() => parseTable(src, 'TOOL_TIERS'), /parsed 1 rows but the table has 2 key lines/);
});
