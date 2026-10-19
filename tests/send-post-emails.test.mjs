// Post-email script: selection, idempotency, escaping, unsubscribe, key
// hygiene. fetch is mocked; nothing touches the network.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
	EMAIL_POSTS_SINCE,
	AUDIENCE_ID,
	FROM,
	loadPosts,
	selectPosts,
	decide,
	emailHtml,
	emailText,
	escapeHtml,
	run
} from '../scripts/send-post-emails.mjs';

const KEY = 're_SECRET_key_123';

function post(slug, date, title = 'T', description = 'D') {
	return `---\ntitle: ${title}\ndescription: ${description}\ndate: ${date}\n---\n\nBody\n`;
}

function postsDir(files) {
	const dir = mkdtempSync(join(tmpdir(), 'posts-'));
	for (const [name, content] of Object.entries(files)) {
		const full = join(dir, name);
		mkdirSync(join(full, '..'), { recursive: true });
		writeFileSync(full, content);
	}
	return dir;
}

/** A fake Resend: `broadcasts` is what the list returns; calls are recorded. */
function fakeFetch({ broadcasts = [], pages, failOn } = {}) {
	const calls = [];
	const impl = async (url, init = {}) => {
		const method = init.method ?? 'GET';
		calls.push({ url, method, body: init.body ? JSON.parse(init.body) : undefined, init });
		const json = (status, obj) => ({
			ok: status < 400,
			status,
			text: async () => JSON.stringify(obj)
		});
		if (failOn && failOn(method, url)) return json(500, { message: `boom ${KEY}` });
		if (method === 'GET') {
			if (pages) {
				const after = new URL(url).searchParams.get('after');
				return json(200, pages[after ?? 'first']);
			}
			return json(200, { data: broadcasts, has_more: false });
		}
		if (url.endsWith('/broadcasts')) return json(200, { id: 'new-id' });
		return json(200, { id: 'sent' });
	};
	return { impl, calls };
}

const opts = (dir, extra = {}) => ({
	postsDir: dir,
	env: { RESEND_BROADCAST_KEY: KEY },
	argv: [],
	log: () => {},
	logError: () => {},
	pauseMs: 0,
	...extra
});

test('selection: since-date cutoff, drafts and _ files excluded, slug from filename', () => {
	const dir = postsDir({
		'old-post.md': post('x', '2026-10-17'),
		'new-post.md': post('x', '2026-10-18'),
		'newer-post.md': post('x', '2026-11-02'),
		'_TEMPLATE.md': post('x', '2026-12-01'),
		'drafts/secret.md': post('x', '2026-12-01'),
		'notes.txt': 'nope'
	});
	const slugs = selectPosts(loadPosts(dir)).map((p) => p.slug);
	assert.deepEqual(slugs, ['new-post', 'newer-post']);
	assert.equal(EMAIL_POSTS_SINCE, '2026-10-18');
});

test('selection: quoted frontmatter values are unquoted', () => {
	const dir = postsDir({ 'a.md': post('a', "'2026-10-20'", '"Quoted: title"', "'It''s fine'") });
	const [p] = loadPosts(dir);
	assert.equal(p.title, 'Quoted: title');
	assert.equal(p.description, "It's fine");
	assert.equal(p.date, '2026-10-20');
});

test('decide: sent and queued are skipped, draft is sent, missing is created', () => {
	const p = { slug: 'hello' };
	const b = (status, name = 'post:hello') => ({ id: `id-${status}`, name, status });
	assert.equal(decide(p, [b('sent')]).action, 'skip');
	assert.equal(decide(p, [b('queued')]).action, 'skip');
	assert.equal(decide(p, [b('scheduled')]).action, 'skip');
	assert.equal(decide(p, [b('draft'), b('sent')]).action, 'skip');
	assert.deepEqual(decide(p, [b('draft')]), { action: 'send', id: 'id-draft' });
	assert.equal(decide(p, [b('sent', 'post:other')]).action, 'create');
	assert.equal(decide(p, []).action, 'create');
});

test('run: creates then sends a missing broadcast with the agreed fields', async () => {
	const dir = postsDir({ 'hello.md': post('x', '2026-10-20', 'Hello world', 'A note') });
	const { impl, calls } = fakeFetch();
	const code = await run(opts(dir, { fetchImpl: impl }));
	assert.equal(code, 0);
	assert.deepEqual(
		calls.map((c) => `${c.method} ${new URL(c.url).pathname}`),
		['GET /broadcasts', 'POST /broadcasts', 'POST /broadcasts/new-id/send']
	);
	const create = calls[1].body;
	assert.equal(create.audience_id, AUDIENCE_ID);
	assert.equal(create.from, FROM);
	assert.equal(create.subject, 'Hello world');
	assert.equal(create.name, 'post:hello');
	assert.ok(create.html.includes('https://editmamei.com/blog/hello'));
	assert.ok(create.text.includes('https://editmamei.com/blog/hello'));
});

test('run: an existing draft is sent, not recreated; a sent one does nothing', async () => {
	const dir = postsDir({
		'drafty.md': post('x', '2026-10-20'),
		'done.md': post('x', '2026-10-21')
	});
	const { impl, calls } = fakeFetch({
		broadcasts: [
			{ id: 'd1', name: 'post:drafty', status: 'draft' },
			{ id: 's1', name: 'post:done', status: 'sent' }
		]
	});
	assert.equal(await run(opts(dir, { fetchImpl: impl })), 0);
	assert.deepEqual(
		calls.map((c) => `${c.method} ${new URL(c.url).pathname}`),
		['GET /broadcasts', 'POST /broadcasts/d1/send']
	);
});

test('run: follows list pagination before deciding', async () => {
	const dir = postsDir({ 'late.md': post('x', '2026-10-20') });
	const { impl, calls } = fakeFetch({
		pages: {
			first: { data: [{ id: 'a', name: 'other', status: 'sent' }], has_more: true },
			a: { data: [{ id: 'b', name: 'post:late', status: 'sent' }], has_more: false }
		}
	});
	assert.equal(await run(opts(dir, { fetchImpl: impl })), 0);
	assert.equal(calls.filter((c) => c.method === 'POST').length, 0);
	assert.equal(calls.filter((c) => c.method === 'GET').length, 2);
});

test('run: --dry-run calls only the list endpoint', async () => {
	const dir = postsDir({ 'hello.md': post('x', '2026-10-20') });
	const { impl, calls } = fakeFetch();
	const lines = [];
	const code = await run(
		opts(dir, { fetchImpl: impl, argv: ['--dry-run'], log: (l) => lines.push(l) })
	);
	assert.equal(code, 0);
	assert.deepEqual(
		calls.map((c) => c.method),
		['GET']
	);
	assert.ok(lines.some((l) => l.includes('[dry-run] would create')));
});

test('run: missing key skips with exit 0 and makes no calls', async () => {
	const dir = postsDir({ 'hello.md': post('x', '2026-10-20') });
	const { impl, calls } = fakeFetch();
	const lines = [];
	const code = await run(opts(dir, { fetchImpl: impl, env: {}, log: (l) => lines.push(l) }));
	assert.equal(code, 0);
	assert.equal(calls.length, 0);
	assert.equal(lines.length, 1);
	assert.match(lines[0], /skipping/);
});

test('run: an API error exits non-zero and never prints the key', async () => {
	const dir = postsDir({ 'hello.md': post('x', '2026-10-20') });
	const { impl } = fakeFetch({ failOn: (m) => m === 'POST' });
	const errors = [];
	const code = await run(opts(dir, { fetchImpl: impl, logError: (l) => errors.push(l) }));
	assert.equal(code, 1);
	assert.ok(errors.length > 0);
	assert.ok(!errors.join('\n').includes(KEY));
});

test('run: a network failure that echoes the key is scrubbed', async () => {
	const dir = postsDir({ 'hello.md': post('x', '2026-10-20') });
	const errors = [];
	const code = await run(
		opts(dir, {
			fetchImpl: async () => {
				throw new Error(`connect failed with ${KEY}`);
			},
			logError: (l) => errors.push(l)
		})
	);
	assert.equal(code, 1);
	assert.ok(!errors.join('\n').includes(KEY));
});

test('email: title and description are HTML-escaped, subject stays raw in the API call', () => {
	const p = { slug: 's', title: '<b>"Hi" & bye</b>', description: `x <script>alert('1')</script>` };
	const html = emailHtml(p);
	assert.ok(!html.includes('<script>'));
	assert.ok(!html.includes('<b>"Hi"'));
	assert.ok(html.includes('&lt;b&gt;&quot;Hi&quot; &amp; bye&lt;/b&gt;'));
	assert.equal(escapeHtml(`<>&"'`), '&lt;&gt;&amp;&quot;&#39;');
});

test('email: unsubscribe placeholder, signup note and post link are in both parts', () => {
	const p = { slug: 'my-post', title: 'T', description: 'D' };
	for (const body of [emailHtml(p), emailText(p)]) {
		assert.ok(body.includes('{{{RESEND_UNSUBSCRIBE_URL}}}'));
		assert.ok(body.includes('You signed up for Editmamei updates at editmamei.com.'));
		assert.ok(body.includes('https://editmamei.com/blog/my-post'));
	}
	assert.ok(emailHtml(p).includes('Read the post'));
	assert.ok(!emailHtml(p).includes('—') && !emailText(p).includes('—'));
});
