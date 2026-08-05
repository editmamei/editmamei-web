// Pins the blog authoring contract without needing Vite/mdsvex at test
// time: posts are parsed as raw text and checked against the same
// invariants src/lib/blog.ts enforces at build time. A violation here
// fails fast in `npm test`; the build would also fail, but later and
// with a noisier error. Build-output invariants (draft leaks, published
// presence) live in blog-build-artifacts.test.mjs.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { escapeXml } from '../src/lib/escape-xml.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const POSTS_DIR = join(REPO_ROOT, 'src', 'lib', 'content', 'posts');
const DRAFTS_DIR = join(POSTS_DIR, 'drafts');
const BLOG_ROUTE = join(REPO_ROOT, 'src', 'routes', 'blog');
const BLOG_LOADER = join(REPO_ROOT, 'src', 'lib', 'blog.ts');

// Duplicated from src/lib/blog.ts on purpose (node:test can't import TS);
// the "loader regexes match" test below pins the two copies together.
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/** [dir, file] pairs for every post and draft (loader-ignored `_` files excluded). */
function allPostFiles() {
	const collect = (dir) =>
		existsSync(dir)
			? readdirSync(dir)
					.filter((f) => f.endsWith('.md') && !f.startsWith('_'))
					.map((f) => [dir, f])
			: [];
	return [...collect(POSTS_DIR), ...collect(DRAFTS_DIR)];
}

function frontmatter(dir, file) {
	const source = readFileSync(join(dir, file), 'utf8');
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	assert.ok(match, `${file}: missing frontmatter block`);
	const fields = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
		if (kv) fields[kv[1]] = kv[2].trim();
	}
	return fields;
}

test('the post/draft sweep is not vacuous (at least one file exists)', () => {
	assert.ok(
		allPostFiles().length > 0,
		'no posts or drafts found — the frontmatter tests below would pass vacuously'
	);
});

test('these tests use the same slug/date rules as the loader', () => {
	const source = readFileSync(BLOG_LOADER, 'utf8');
	assert.ok(
		source.includes(String(SLUG_RE).slice(1, -1)),
		'SLUG_RE here no longer matches src/lib/blog.ts — update both together'
	);
	assert.ok(
		source.includes(String(DATE_RE).slice(1, -1)),
		'DATE_RE here no longer matches src/lib/blog.ts — update both together'
	);
});

test('every post/draft filename is a lowercase ASCII kebab-case slug', () => {
	for (const [, file] of allPostFiles()) {
		const slug = file.replace(/\.md$/, '');
		assert.ok(
			SLUG_RE.test(slug),
			`${file}: filename becomes the public URL /blog/${slug} and must be lowercase ASCII kebab-case`
		);
	}
});

test('every post/draft has title, description, and a YYYY-MM-DD date', () => {
	for (const [dir, file] of allPostFiles()) {
		const meta = frontmatter(dir, file);
		for (const key of ['title', 'description']) {
			assert.ok(meta[key], `${file}: frontmatter "${key}" is required`);
		}
		assert.ok(DATE_RE.test(meta.date ?? ''), `${file}: frontmatter "date" must be YYYY-MM-DD`);
		if (meta.updated !== undefined) {
			assert.ok(DATE_RE.test(meta.updated), `${file}: frontmatter "updated" must be YYYY-MM-DD`);
		}
		assert.equal(
			meta.draft,
			undefined,
			`${file}: there is no draft frontmatter flag — the drafts/ folder is the publish state`
		);
	}
});

test('the [slug] route declares prerender entries from the posts loader', () => {
	const source = readFileSync(join(BLOG_ROUTE, '[slug]', '+page.ts'), 'utf8');
	assert.match(
		source,
		/export const entries/,
		'entries export missing — the static adapter needs it'
	);
	assert.match(source, /from '\$lib\/blog'/, 'entries must derive from the posts loader');
});

test('the RSS endpoint exists and is prerendered', () => {
	const source = readFileSync(join(BLOG_ROUTE, 'rss.xml', '+server.ts'), 'utf8');
	assert.match(source, /export const prerender = true/);
});

test('the sitemap appends blog post URLs from the posts loader', () => {
	const source = readFileSync(
		join(REPO_ROOT, 'src', 'routes', 'sitemap.xml', '+server.ts'),
		'utf8'
	);
	assert.match(source, /from '\$lib\/blog'/, 'sitemap must import the posts loader');
	assert.match(source, /\$\{ORIGIN\}\/blog\/\$\{post\.slug\}/, 'sitemap must emit per-post URLs');
});

test('the unseen-routes carve-out exempts exactly /blog/[slug] and nothing else', () => {
	const source = readFileSync(join(REPO_ROOT, 'svelte.config.js'), 'utf8');
	const exemptions = Array.from(source.matchAll(/id !== '([^']+)'/g), (m) => m[1]);
	assert.deepEqual(
		exemptions,
		['/blog/[slug]'],
		'handleUnseenRoutes must exempt only /blog/[slug]; other unseen routes must stay hard failures'
	);
});

test('escapeXml escapes all five XML metacharacters, ampersand first', () => {
	assert.equal(
		escapeXml(`Tone & "curves" <should> stay 'text'`),
		'Tone &amp; &quot;curves&quot; &lt;should&gt; stay &apos;text&apos;'
	);
	assert.equal(escapeXml('&amp;'), '&amp;amp;', 'pre-escaped input must not be double-unescaped');
	assert.equal(escapeXml(''), '');
});
