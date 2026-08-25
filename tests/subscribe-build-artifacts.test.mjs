// Behavioral pins on the signup surfaces in the built site (build/). The
// invariant these protect: a NO-JAVASCRIPT visitor must land on real content
// at every step of the signup flow. A previous revision used ssr=false pages
// that read the query string client-side — the prerendered HTML was an empty
// shell, and the whole advertised no-JS path dead-ended on blank pages
// (QA finding D2). These tests read the artifact, so like the blog artifact
// tests they SKIP when build/ is absent; web-release.yml and the local verify
// checklist run build before test to arm them.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');
const BUILD_DIR = join(REPO_ROOT, 'build');

const built = existsSync(BUILD_DIR);
const skip = built ? false : 'build/ absent — run npm run build first to enable artifact checks';

function page(relPath) {
	return readFileSync(join(BUILD_DIR, relPath), 'utf8');
}

// The static result pages the subscribe Worker redirects to. Each must exist
// in the artifact AND carry its content in the prerendered HTML itself — not
// arrive by hydration. Path and phrase are the contract with the Worker's
// CONFIRM_REDIRECT config; change either only in both places.
const RESULT_PAGES = [
	['subscribed.html', 'Check your inbox'],
	[join('subscribed', 'confirmed.html'), 'on the list'],
	[join('subscribed', 'expired.html'), 'expired'],
	[join('subscribed', 'error.html'), "didn't work"]
];

test('every Worker redirect target is prerendered with its content in the HTML', { skip }, () => {
	for (const [relPath, phrase] of RESULT_PAGES) {
		assert.ok(existsSync(join(BUILD_DIR, relPath)), `${relPath} missing from build output`);
		assert.ok(
			page(relPath).includes(phrase),
			`${relPath} does not contain "${phrase}" in its prerendered HTML — ` +
				`a no-JS visitor redirected here would see nothing`
		);
	}
});

test('/confirm is prerendered with the no-script fallback instruction', { skip }, () => {
	const html = page('confirm.html');
	assert.ok(html.includes('Confirming'), 'missing the confirming state');
	assert.ok(html.includes('<noscript>'), 'missing the noscript block');
	assert.ok(
		html.includes('confirms directly'),
		'noscript block must point at the email link that works without scripts'
	);
});

test('the signup form posts natively: method, action, and honeypot in the HTML', { skip }, () => {
	// Footer form is on every page; the blog index carries the fuller block too.
	for (const relPath of ['index.html', 'blog.html']) {
		const html = page(relPath);
		assert.ok(/method="POST"/i.test(html), `${relPath}: form lost its method attribute`);
		assert.ok(
			html.includes('/v1/subscribe'),
			`${relPath}: form action no longer points at the subscribe endpoint`
		);
		assert.ok(
			html.includes('name="website"'),
			`${relPath}: honeypot field missing from prerendered form`
		);
	}
});
