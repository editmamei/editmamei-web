// Behavioral pins on the built site (build/): drafts must never reach
// production output, every published post must actually be in it, and the
// generated XML must be well-escaped. These run against the artifact, so
// they SKIP when build/ is absent (plain `npm test` before a build).
// deploy.yml runs test before build, so there they skip; web-release.yml
// deliberately runs build before test so the publish path enforces them,
// and the local verify checklist (build, then test) does too.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const BUILD_DIR = join(REPO_ROOT, 'build');
const POSTS_DIR = join(REPO_ROOT, 'src', 'lib', 'content', 'posts');
const DRAFTS_DIR = join(POSTS_DIR, 'drafts');

const built = existsSync(BUILD_DIR);
const skip = built ? false : 'build/ absent — run npm run build first to enable artifact checks';

function mdSlugs(dir) {
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => f.endsWith('.md') && !f.startsWith('_'))
		.map((f) => f.replace(/\.md$/, ''));
}

/** Recursively collect text-ish build files (html/js/xml/json/css). */
function buildTextFiles(dir = BUILD_DIR, out = []) {
	for (const entry of readdirSync(dir)) {
		const full = join(dir, entry);
		if (statSync(full).isDirectory()) buildTextFiles(full, out);
		else if (/\.(html|js|xml|json|css|txt)$/.test(entry)) out.push(full);
	}
	return out;
}

test('no draft slug or draft title appears anywhere in the build output', { skip }, () => {
	const draftSlugs = mdSlugs(DRAFTS_DIR);
	if (draftSlugs.length === 0) return;
	const needles = draftSlugs.flatMap((slug) => {
		const source = readFileSync(join(DRAFTS_DIR, `${slug}.md`), 'utf8');
		const title = source.match(/^title:\s*(.+)$/m)?.[1]?.trim();
		return title ? [slug, title] : [slug];
	});
	for (const file of buildTextFiles()) {
		const content = readFileSync(file, 'utf8');
		for (const needle of needles) {
			assert.ok(
				!content.includes(needle),
				`draft content "${needle}" leaked into ${file.slice(BUILD_DIR.length + 1)} — ` +
					'drafts must be dead-code-eliminated from production builds'
			);
		}
	}
});

test('every published post is prerendered and in the sitemap', { skip }, () => {
	const sitemap = built ? readFileSync(join(BUILD_DIR, 'sitemap.xml'), 'utf8') : '';
	for (const slug of mdSlugs(POSTS_DIR)) {
		assert.ok(
			existsSync(join(BUILD_DIR, 'blog', `${slug}.html`)),
			`published post ${slug} has no prerendered page — loader or entries regression`
		);
		assert.ok(
			sitemap.includes(`/blog/${slug}</loc>`),
			`published post ${slug} missing from sitemap.xml`
		);
	}
});

test('the blog index page is prerendered', { skip }, () => {
	assert.ok(existsSync(join(BUILD_DIR, 'blog.html')), 'build/blog.html missing');
});

test('generated XML contains no unescaped ampersands', { skip }, () => {
	for (const name of ['sitemap.xml', join('blog', 'rss.xml')]) {
		const xml = readFileSync(join(BUILD_DIR, name), 'utf8');
		const bad = xml.match(/&(?!(amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/);
		assert.equal(bad, null, `${name}: raw & not part of an entity`);
	}
});
