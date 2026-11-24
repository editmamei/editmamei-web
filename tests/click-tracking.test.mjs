// Click tracking: the pure event-name function, and the static rule that keeps the global listener
// from double counting elements that carry their own track() handler.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { clickEventName } from '../src/lib/analytics/click-name.js';

const ORIGIN = 'https://editmamei.com';
const name = (pathname, extra) => clickEventName({ pathname, origin: ORIGIN, ...extra });

test('home page and nested pages', () => {
	assert.equal(name('/', { href: '/pricing' }), 'click-home-to-pricing');
	assert.equal(name('/desktop/download', { href: '/' }), 'click-desktop-download-to-home');
});

test('blog posts', () => {
	assert.equal(name('/blog/My_First-Post', { href: '/blog' }), 'click-blog-my-first-post-to-blog');
});

test('internal link, query and fragment stripped', () => {
	assert.equal(
		name('/', { href: '/desktop/pricing?token=abc#plans' }),
		'click-home-to-desktop-pricing'
	);
	assert.equal(name('/', { href: 'https://editmamei.com/faq?x=1' }), 'click-home-to-faq');
});

test('external links, github with the first path segment', () => {
	assert.equal(
		name('/', { href: 'https://www.npmjs.com/package/editmamei?a=1' }),
		'click-home-ext-npmjs-com'
	);
	assert.equal(
		name('/', { href: 'https://github.com/editmamei/editmamei/releases' }),
		'click-home-ext-github-com-editmamei'
	);
});

test('mailto never carries the address', () => {
	const n = name('/contact', { href: 'mailto:support@editmamei.com' });
	assert.equal(n, 'click-contact-mailto');
});

test('button text, aria-label wins over text', () => {
	assert.equal(name('/faq', { text: 'Copy the URL' }), 'click-faq-copy-the-url');
	assert.equal(name('/faq', { text: 'x', ariaLabel: 'Next slide' }), 'click-faq-next-slide');
	assert.equal(name('/faq', { text: '' }), 'click-faq-button');
});

test('data-track overrides everything', () => {
	assert.equal(
		name('/desktop/download', {
			href: 'https://github.com/editmamei/editmamei/releases/latest/download/editmamei.mcpb',
			dataTrack: 'download-page-mcpb-clicked'
		}),
		'download-page-mcpb-clicked'
	);
});

test('long text is cut to 30 characters', () => {
	const n = name('/', { text: 'a'.repeat(100) });
	assert.equal(n, `click-home-${'a'.repeat(30)}`);
});

test('an email-looking text and long numbers never reach the name', () => {
	const n = name('/contact', { text: 'Email me at someone@example.com' });
	assert.ok(!n.includes('example') && !n.includes('someone'), n);
	assert.equal(name('/contact', { text: 'someone@example.com' }), 'click-contact-button');
	assert.ok(!/\d{7,}/.test(name('/', { text: 'Order 12345678901' })));
});

test('the whole name is capped at 80 characters', () => {
	const n = name('/blog/' + 'word-'.repeat(30), { href: '/x'.repeat(50) });
	assert.ok(n.length <= 80, `${n.length}`);
	assert.ok(!n.endsWith('-'));
});

// The double-count rule: an element whose own handler calls track()/trackOnce() must carry
// `data-tracked`, or the global listener reports the click a second time under a generated name.

const SRC = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src');

function svelteFiles(dir) {
	return readdirSync(dir).flatMap((entry) => {
		const p = join(dir, entry);
		return statSync(p).isDirectory() ? svelteFiles(p) : p.endsWith('.svelte') ? [p] : [];
	});
}

/** End of the `{...}` expression that starts at `open` (index of the `{`), skipping strings. */
function braceEnd(s, open) {
	let depth = 0;
	let quote = null;
	for (let i = open; i < s.length; i++) {
		const c = s[i];
		if (quote) {
			if (c === '\\') i++;
			else if (c === quote) quote = null;
		} else if (c === "'" || c === '"' || c === '`') quote = c;
		else if (c === '{') depth++;
		else if (c === '}' && --depth === 0) return i;
	}
	return s.length;
}

/** Names of the functions in a component's script whose body calls track()/trackOnce(). */
function trackingFunctions(source) {
	const script = /<script[^>]*>([\s\S]*?)<\/script>/.exec(source)?.[1] ?? '';
	const names = new Set();
	const decl = /(?:^|\n)\t(?:async\s+)?(?:function\s+(\w+)|const\s+(\w+)\s*=)/g;
	const starts = [...script.matchAll(decl)];
	starts.forEach((m, i) => {
		const body = script.slice(m.index, starts[i + 1]?.index ?? script.length);
		if (/\btrack(?:Once)?\(/.test(body)) names.add(m[1] ?? m[2]);
	});
	return names;
}

test('every element whose click handler calls track() carries data-tracked', () => {
	const offenders = [];
	let checked = 0;
	for (const file of svelteFiles(SRC)) {
		const source = readFileSync(file, 'utf8');
		const fns = trackingFunctions(source);
		for (const m of source.matchAll(/\sonclick=\{/g)) {
			const open = m.index + m[0].length - 1;
			const expr = source.slice(open + 1, braceEnd(source, open));
			const calls =
				/\btrack(?:Once)?\(/.test(expr) ||
				[...fns].some((f) => new RegExp(`\\b${f}\\b`).test(expr));
			if (!calls) continue;
			checked++;
			const tagStart = source.lastIndexOf('<', m.index);
			// The tag ends at the first `>` outside braces.
			let end = tagStart;
			for (let i = tagStart; i < source.length; i++) {
				if (source[i] === '{') i = braceEnd(source, i);
				else if (source[i] === '>') {
					end = i;
					break;
				}
			}
			const tag = source.slice(tagStart, end);
			if (!/\sdata-tracked(\s|=|$)/.test(tag)) {
				const line = source.slice(0, m.index).split('\n').length;
				offenders.push(`${file.slice(SRC.length + 1)}:${line}`);
			}
		}
	}
	assert.ok(checked > 40, `scanner found only ${checked} tracked handlers`);
	assert.deepEqual(offenders, []);
});
