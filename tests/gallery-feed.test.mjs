// Gallery feed parsing and validation (src/lib/gallery/feed.js). The feed is
// user-submitted, so these pin what is dropped, what is kept verbatim as text,
// and that a dead or hostile feed degrades to "seed only" instead of failing.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
	fetchFeed,
	mergeEntries,
	parseFeed,
	pickFeatured,
	replayPlan,
	tileSpan,
	validateEntry
} from '../src/lib/gallery/feed.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const seed = JSON.parse(
	readFileSync(join(REPO_ROOT, 'src', 'lib', 'content', 'gallery-seed.json'), 'utf8')
);

const IMG = 'https://connect.editmamei.com/g/abc/after.jpg';
const good = (over = {}) => ({
	id: 'sunset-1',
	title: 'Sunset',
	by: '@someone',
	link: 'https://example.com/me',
	date: '2026-10-14',
	featured: false,
	width: 1000,
	height: 800,
	aligned: true,
	before: 'https://connect.editmamei.com/g/abc/before.jpg',
	after: IMG,
	frames: [IMG],
	steps: [{ title: 'Tone', detail: 'Curve', frame: 0 }],
	...over
});
const feed = (entries) => JSON.stringify({ v: 1, updated: '2026-10-14T00:00:00Z', entries });
const quiet = () => {};

test('a well-formed entry is accepted', () => {
	const e = validateEntry(good());
	assert.equal(e?.id, 'sunset-1');
	assert.equal(e?.steps[0].frame, 0);
});

test('bad ids are dropped', () => {
	for (const id of ['Upper', 'has space', 'a/b', '..', '', 'x'.repeat(41), 'ünï', '<b>']) {
		assert.equal(validateEntry(good({ id })), null, id);
	}
});

test('images from foreign hosts or odd paths are dropped', () => {
	const bad = [
		'https://evil.example/g/a.jpg',
		'http://connect.editmamei.com/g/a.jpg',
		'https://connect.editmamei.com.evil.example/g/a.jpg',
		'https://connect.editmamei.com/other/a.jpg',
		'https://connect.editmamei.com/g/../x.jpg',
		'https://connect.editmamei.com/g/a.jpg?x=1',
		'https://user@connect.editmamei.com/g/a.jpg',
		'//evil.example/a.jpg',
		'/gallery/seed/../../secret.jpg',
		'/gallery/other/a.jpg',
		'javascript:alert(1)',
		'data:image/png;base64,AAAA'
	];
	for (const u of bad) {
		assert.equal(validateEntry(good({ after: u })), null, `after ${u}`);
		assert.equal(validateEntry(good({ before: u })), null, `before ${u}`);
		assert.equal(validateEntry(good({ frames: [u] })), null, `frame ${u}`);
	}
	assert.ok(validateEntry(good({ after: '/gallery/seed/car-after.jpg' })));
});

test('links must be https; others drop the entry', () => {
	const bad = [
		'http://example.com',
		'javascript:alert(1)',
		'ftp://x.example',
		'https://u:p@x.example/',
		'//x',
		'not a url'
	];
	for (const link of bad) assert.equal(validateEntry(good({ link })), null, link);
	assert.equal(validateEntry(good({ link: null }))?.link, null);
	assert.ok(validateEntry(good({ link: 'https://example.com/a?b=1' })));
});

test('oversize or control-character text drops the entry', () => {
	const step = (detail) => [{ title: 't', detail, frame: null }];
	assert.equal(validateEntry(good({ title: 'x'.repeat(81) })), null);
	assert.equal(validateEntry(good({ title: '' })), null);
	assert.equal(validateEntry(good({ by: 'y'.repeat(41) })), null);
	assert.equal(validateEntry(good({ credit: 'c'.repeat(121) })), null);
	assert.equal(validateEntry(good({ steps: step('d'.repeat(301)) })), null);
	assert.ok(validateEntry(good({ steps: Array(40).fill(step('')[0]) })));
	assert.equal(validateEntry(good({ steps: Array(41).fill(step('')[0]) })), null);
	assert.equal(validateEntry(good({ frames: Array(25).fill(IMG) })), null);
	assert.equal(validateEntry(good({ title: 'a\u0000b' })), null);
	assert.equal(validateEntry(good({ title: 'a‮b' })), null);
});

test('injection strings are kept verbatim as text, never altered or executed', () => {
	const payloads = [
		'<script>alert(1)</script>',
		'"><img src=x onerror=alert(1)>',
		'{@html "<b>x</b>"}',
		"'; DROP TABLE x; --"
	];
	for (const p of payloads) {
		const steps = [{ title: p, detail: p, frame: null }];
		const e = validateEntry(good({ title: p, by: p.slice(0, 40), steps }));
		assert.equal(e?.title, p);
		assert.equal(e?.steps[0].detail, p);
	}
});

test('unusable step frame pointers become null instead of dropping the entry', () => {
	const steps = [
		{ title: 'a', detail: '', frame: 9 },
		{ title: 'b', detail: '', frame: IMG },
		{ title: 'c', detail: '', frame: 'x' }
	];
	const e = validateEntry(good({ steps }));
	assert.deepEqual(
		e?.steps.map((s) => s.frame),
		[null, 0, null]
	);
});

test('invalid entries are dropped while valid ones survive, with a warning', () => {
	const warnings = [];
	const raw = feed([good(), good({ id: 'BAD' }), good({ id: 'sunset-1' }), 5, null]);
	const out = parseFeed(raw, (m) => warnings.push(m));
	assert.deepEqual(
		out.map((e) => e.id),
		['sunset-1']
	);
	assert.equal(warnings.length, 1);
});

test('non-JSON, wrong version or wrong shape yields an empty list', () => {
	assert.deepEqual(parseFeed('<html>', quiet), []);
	assert.deepEqual(parseFeed('{"v":2,"entries":[]}', quiet), []);
	assert.deepEqual(parseFeed('[]', quiet), []);
	assert.deepEqual(parseFeed('{"v":1,"entries":"x"}', quiet), []);
});

test('fetchFeed: failures, non-200 and oversize all give an empty list and never throw', async () => {
	const warnings = [];
	const warn = (m) => warnings.push(m);
	const res =
		(status, body = '') =>
		async () =>
			new Response(body, { status });
	const down = async () => {
		throw new TypeError('network down');
	};
	assert.deepEqual(await fetchFeed('https://x', { fetch: res(404), warn }), []);
	assert.deepEqual(await fetchFeed('https://x', { fetch: res(500), warn }), []);
	assert.deepEqual(await fetchFeed('https://x', { fetch: res(200, 'nope'), warn }), []);
	const huge = res(200, ' '.repeat(2_000_001));
	assert.deepEqual(await fetchFeed('https://x', { fetch: huge, warn }), []);
	assert.deepEqual(await fetchFeed('https://x', { fetch: down, warn }), []);
	assert.equal(warnings.length, 5);
	const ok = await fetchFeed('https://x', { fetch: res(200, feed([good()])), warn });
	assert.equal(ok.length, 1);
});

test('seed-only: an empty feed leaves exactly the committed seed', () => {
	const seeded = parseFeed(JSON.stringify({ v: 1, entries: seed }), quiet);
	assert.equal(seeded.length, seed.length, 'every committed seed entry must validate');
	assert.equal(mergeEntries([], seeded).length, 5);
});

test('merge: seed wins an id clash, newest first', () => {
	const seeded = parseFeed(JSON.stringify({ v: 1, entries: seed }), quiet);
	const impostor = validateEntry(good({ id: seeded[0].id, title: 'Replaced' }));
	const newer = validateEntry(good({ id: 'brand-new', date: '2030-01-01' }));
	const merged = mergeEntries([impostor, newer], seeded);
	assert.equal(merged[0].id, 'brand-new');
	assert.ok(!merged.some((e) => e.title === 'Replaced'));
	assert.equal(merged.length, seeded.length + 1);
});

test('pickFeatured: flagged first, topped up to 3, capped at 5', () => {
	const mk = (id, featured) => ({ id, featured });
	const ids = (list) => pickFeatured(list).map((e) => e.id);
	assert.deepEqual(ids([mk('a', false), mk('b', false), mk('c', false), mk('d', false)]), [
		'a',
		'b',
		'c'
	]);
	assert.deepEqual(ids([mk('a', false), mk('b', true), mk('c', false), mk('d', false)]), [
		'b',
		'a',
		'c'
	]);
	const many = ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((id) => mk(id, true));
	assert.equal(pickFeatured(many).length, 5);
	assert.deepEqual(pickFeatured([]), []);
});

test('tileSpan follows aspect ratio', () => {
	assert.equal(tileSpan(1600, 1000, false), 'w');
	assert.equal(tileSpan(1600, 1000, true), 'bw');
	assert.equal(tileSpan(600, 1080, false), 't');
	assert.equal(tileSpan(1000, 1000, false), '');
	assert.equal(tileSpan(1000, 1000, true), 'b');
});

test('every seed image exists under static/', () => {
	for (const e of seed) {
		for (const u of [e.before, e.after]) {
			assert.ok(existsSync(join(REPO_ROOT, 'static', u)), `${u} is missing`);
		}
	}
});

test('gallery sources never render with {@html}', () => {
	const files = [];
	const walk = (dir) => {
		for (const name of readdirSync(dir)) {
			const full = join(dir, name);
			if (statSync(full).isDirectory()) walk(full);
			else if (/\.svelte$/.test(name)) files.push(full);
		}
	};
	walk(join(REPO_ROOT, 'src', 'routes', 'gallery'));
	const components = join(REPO_ROOT, 'src', 'lib', 'components');
	for (const f of readdirSync(components)) {
		if (f.startsWith('Gallery')) files.push(join(components, f));
	}
	assert.ok(files.length >= 5);
	for (const f of files)
		assert.ok(!readFileSync(f, 'utf8').includes('{@html'), `${f} uses {@html}`);
});

test('links render with rel="ugc nofollow noopener"', () => {
	const page = readFileSync(
		join(REPO_ROOT, 'src', 'routes', 'gallery', '[id]', '+page.svelte'),
		'utf8'
	);
	assert.match(page, /href=\{entry\.link\}\s+rel="ugc nofollow noopener"/);
});

test('a max-size entry as Connect writes it is accepted whole', () => {
	const fixture = JSON.parse(
		readFileSync(join(REPO_ROOT, 'tests', 'fixtures', 'connect-feed-entry-max.json'), 'utf8')
	);
	assert.equal(fixture.steps.length, 40);
	assert.equal(fixture.frames.length, 12);
	const e = validateEntry(fixture);
	assert.ok(e, 'validateEntry must accept the Connect fixture');
	assert.deepEqual(e.steps, fixture.steps);
	assert.deepEqual(e.frames, fixture.frames);
	assert.equal(e.before, fixture.before);
	assert.equal(e.link, fixture.link);
});

test('replay order is before, each frame, after, with the last mapped step as the label', () => {
	const fixture = JSON.parse(
		readFileSync(join(REPO_ROOT, 'tests', 'fixtures', 'connect-feed-entry-max.json'), 'utf8')
	);
	const plan = replayPlan(validateEntry(fixture));
	assert.deepEqual(plan.urls, [fixture.before, ...fixture.frames, fixture.after]);
	assert.equal(plan.labels.length, plan.urls.length);
	assert.equal(plan.labels[0], 'Before');
	assert.equal(plan.labels.at(-1), 'After');
	fixture.frames.forEach((_, i) => {
		const mapped = fixture.steps.filter((s) => s.frame === i);
		assert.equal(plan.labels[i + 1], mapped.at(-1).title, `frame ${i}`);
	});
	assert.equal(plan.mode, 'fade');

	const small = validateEntry(
		good({
			frames: [IMG, IMG],
			steps: [
				{ title: 'Cropped', detail: '', frame: null },
				{ title: 'Warmer', detail: '', frame: 0 },
				{ title: 'Glow', detail: '', frame: 0 }
			]
		})
	);
	assert.deepEqual(replayPlan(small).labels, ['Before', 'Glow', 'Step 2', 'After']);
});

test('replay without frames is before then after, wiping when aligned', () => {
	const e = validateEntry(good({ frames: [], steps: [] }));
	const plan = replayPlan(e);
	assert.deepEqual(plan.urls, [e.before, e.after]);
	assert.deepEqual(plan.labels, ['Before', 'After']);
	assert.equal(plan.mode, 'wipe');
	assert.equal(replayPlan(validateEntry(good({ frames: [], aligned: false }))).mode, 'fade');
});

test('an entry with no before picture is kept, unaligned and without frames', () => {
	const e = validateEntry(good({ before: null, frames: [], aligned: true, steps: [] }));
	assert.equal(e?.before, null);
	assert.equal(e?.aligned, false);
	assert.deepEqual(replayPlan(e).urls, [e.after]);
	assert.equal(validateEntry(good({ before: null })), null, 'frames need a before');
	assert.equal(validateEntry(good({ before: 'https://evil.example/a.jpg' })), null);
});

test('GALLERY_FEED_REQUIRED: a failed, non-200, oversized or malformed feed throws', async () => {
	const res =
		(status, body = '') =>
		async () =>
			new Response(body, { status });
	const down = async () => {
		throw new TypeError('network down');
	};
	const required = { required: true, warn: quiet };
	await assert.rejects(fetchFeed('https://x', { ...required, fetch: res(404) }), /answered 404/);
	await assert.rejects(fetchFeed('https://x', { ...required, fetch: res(503) }), /answered 503/);
	await assert.rejects(fetchFeed('https://x', { ...required, fetch: down }), /network down/);
	await assert.rejects(
		fetchFeed('https://x', { ...required, fetch: res(200, ' '.repeat(2_000_001)) }),
		/size cap/
	);
	for (const body of ['nope', '{"v":2,"entries":[]}', '[]', '{"v":1,"entries":"x"}']) {
		await assert.rejects(fetchFeed('https://x', { ...required, fetch: res(200, body) }), body);
	}
	// An empty but well-formed feed is fine, and so is one entry dropped for being invalid.
	assert.deepEqual(await fetchFeed('https://x', { ...required, fetch: res(200, feed([])) }), []);
	const mixed = await fetchFeed('https://x', {
		...required,
		fetch: res(200, feed([good(), good({ id: 'BAD' })]))
	});
	assert.equal(mixed.length, 1);
	// Not required: the same failures stay a warning.
	assert.deepEqual(await fetchFeed('https://x', { fetch: res(404), warn: quiet }), []);
});
