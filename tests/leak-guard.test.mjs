// Tests for scripts/check-leak-guard.mjs — the policy gate that keeps
// dev/none-tier tool names out of the public site source. A walker or
// matcher bug here makes CI green while leaking, so the scan logic gets
// real coverage: planted leaks are found, clean trees pass, and a scan
// that reads zero files is reported instead of silently passing.
//
// Fixtures are built in a temp directory with a fake blocked name so the
// repo's own leak guard never trips on this file.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { scan } from '../scripts/check-leak-guard.mjs';

const FAKE_BLOCKED = 'photoshop_test_blocked_tool';

function makeFixture(files) {
	const root = mkdtempSync(join(tmpdir(), 'leak-guard-test-'));
	for (const [rel, content] of Object.entries(files)) {
		const full = join(root, rel);
		mkdirSync(join(full, '..'), { recursive: true });
		writeFileSync(full, content, 'utf8');
	}
	return root;
}

test('finds a planted blocked name with file and line', () => {
	const root = makeFixture({
		'src/page.md': `line one\nthis line mentions ${FAKE_BLOCKED} in copy\nline three\n`
	});
	try {
		const { leaks, scannedFiles } = scan({
			repoRoot: root,
			blocked: [FAKE_BLOCKED],
			scanRoots: ['src']
		});
		assert.equal(leaks.length, 1);
		assert.equal(leaks[0].line, 2);
		assert.equal(leaks[0].tool, FAKE_BLOCKED);
		assert.match(leaks[0].file, /page\.md$/);
		assert.equal(scannedFiles, 1);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('clean tree reports zero leaks and a positive scan count', () => {
	const root = makeFixture({
		'src/a.md': 'nothing to see\n',
		'src/nested/b.ts': 'export const ok = true;\n',
		'README.md': 'hello\n'
	});
	try {
		const { leaks, scannedFiles, emptyRoots } = scan({
			repoRoot: root,
			blocked: [FAKE_BLOCKED],
			scanRoots: ['src', 'README.md']
		});
		assert.equal(leaks.length, 0);
		assert.equal(scannedFiles, 3);
		assert.deepEqual(emptyRoots, []);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('a missing scan root is surfaced via emptyRoots, not silently skipped', () => {
	const root = makeFixture({ 'src/a.md': 'fine\n' });
	try {
		const { emptyRoots } = scan({
			repoRoot: root,
			blocked: [FAKE_BLOCKED],
			scanRoots: ['src', 'does-not-exist']
		});
		assert.deepEqual(emptyRoots, ['does-not-exist']);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('binary/asset extensions are excluded from scanning', () => {
	const root = makeFixture({
		'src/image.png': `pretend binary containing ${FAKE_BLOCKED}`,
		'src/real.md': 'clean\n'
	});
	try {
		const { leaks, scannedFiles } = scan({
			repoRoot: root,
			blocked: [FAKE_BLOCKED],
			scanRoots: ['src']
		});
		assert.equal(leaks.length, 0);
		assert.equal(scannedFiles, 1);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});

test('multiple blocked names are all reported per line', () => {
	const second = 'photoshop_other_blocked_tool';
	const root = makeFixture({
		'src/a.md': `${FAKE_BLOCKED} and ${second} on one line\n${second} again\n`
	});
	try {
		const { leaks } = scan({
			repoRoot: root,
			blocked: [FAKE_BLOCKED, second],
			scanRoots: ['src']
		});
		assert.equal(leaks.length, 3);
		assert.deepEqual(
			leaks.map((l) => l.tool),
			[FAKE_BLOCKED, second, second]
		);
	} finally {
		rmSync(root, { recursive: true, force: true });
	}
});
