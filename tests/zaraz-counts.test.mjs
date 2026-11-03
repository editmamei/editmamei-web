import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { track } = await import('../src/lib/analytics/clarity.ts');

function run(href, fetchImpl) {
	const url = new URL(href);
	const calls = [];
	globalThis.window = { location: url };
	globalThis.fetch = (path, init) => {
		calls.push({ path, init });
		return fetchImpl ? fetchImpl() : Promise.resolve();
	};
	track('install-npm-clicked');
	return calls;
}

test('sends the event name and the page without its query string', () => {
	const [call] = run('https://editmamei.com/desktop/activate?customer_session_token=abc');
	assert.equal(call.path, '/z/c7f3a9');
	assert.equal(call.init.method, 'POST');
	assert.equal(call.init.credentials, 'omit');
	assert.equal(call.init.keepalive, true);
	assert.equal(call.init.referrerPolicy, 'no-referrer');
	assert.deepEqual(JSON.parse(call.init.body), {
		events: [
			{
				client: { __zarazTrack: 'install-npm-clicked' },
				system: { page: { url: 'https://editmamei.com/desktop/activate' } }
			}
		]
	});
});

test('counts nothing on previews or local dev', () => {
	assert.deepEqual(run('https://staging-editmamei-web.example.workers.dev/'), []);
	assert.deepEqual(run('http://localhost:5173/'), []);
});

test('a failed request never breaks the page', () => {
	assert.doesNotThrow(() => run('https://editmamei.com/', () => Promise.reject(new Error('down'))));
	assert.doesNotThrow(() =>
		run('https://editmamei.com/', () => {
			throw new Error('blocked');
		})
	);
});

test('the Zaraz script stays off the page, because it sets a cookie before any choice', () => {
	const html = readFileSync(new URL('../src/app.html', import.meta.url), 'utf8');
	assert.ok(!html.includes('cdn-cgi/zaraz'));
});
