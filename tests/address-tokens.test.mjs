import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const html = readFileSync(new URL('../src/app.html', import.meta.url), 'utf8');
const scripts = [...html.matchAll(/<script type="text\/javascript">([\s\S]*?)<\/script>/g)].map(
	(m) => m[1]
);
const scrub = scripts.find((s) => s.includes('customer_session_token'));

function run(href) {
	const calls = [];
	vm.runInNewContext(scrub, {
		URL,
		location: { href },
		history: { state: null, replaceState: (...args) => calls.push(args[2]) }
	});
	return calls;
}

test('the tokens come off before any script that could send the address', () => {
	assert.ok(scrub, 'the scrub script is in app.html');
	const firstScriptTag = html.search(/<script(?![^>]*application\/ld\+json)/);
	assert.equal(html.indexOf(scrub), html.indexOf('>', firstScriptTag) + 1);
	assert.ok(html.indexOf(scrub) < html.indexOf('clarity.ms'));
	assert.ok(html.indexOf(scrub) < html.indexOf('%sveltekit.head%'));
});

test('removes the tokens and keeps the rest of the address', () => {
	const base = 'https://editmamei.com/desktop/activate';
	assert.deepEqual(run(`${base}?customer_session_token=abc`), [base]);
	assert.deepEqual(run(`${base}?member_session_token=abc`), [base]);
	assert.deepEqual(run(`${base}?customer_session_token=a&member_session_token=b`), [base]);
	assert.deepEqual(run(`${base}?checkout_id=1&customer_session_token=abc&utm_source=x#steps`), [
		`${base}?checkout_id=1&utm_source=x#steps`
	]);
	assert.deepEqual(run('https://editmamei.com//desktop/activate?customer_session_token=abc'), [
		'https://editmamei.com//desktop/activate'
	]);
});

test('leaves every other address alone', () => {
	assert.deepEqual(run('https://editmamei.com/connect?utm_source=reddit'), []);
	assert.deepEqual(run('https://editmamei.com/'), []);
});
