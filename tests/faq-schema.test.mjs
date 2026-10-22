// Pins the FAQ data contract: the three section arrays on /faq (general,
// desktop, connect) feed both the visible lists (keyed by question text in
// the {#each}) and one flattened FAQPage JSON-LD injected via {@html}.
// Invariants: question keys are unique (a duplicate throws at runtime in the
// keyed {#each} and blanks the page), no '<' appears in any question or
// answer (the escape guard exists, but content should never rely on it), the
// JSON-LD built from the arrays round-trips as valid JSON, and the Desktop and
// Connect answers can't contradict each other once the JSON-LD drops the
// section headings.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FAQ_PAGE = resolve(__dirname, '..', 'src', 'routes', 'faq', '+page.svelte');
const PRO_FEATURES = resolve(__dirname, '..', 'src', 'lib', 'content', 'pro-features.ts');

function proFeaturesSentence() {
	const source = readFileSync(PRO_FEATURES, 'utf8');
	const literal = source.match(/export const PRO_FEATURES_SENTENCE =\s*('(?:[^'\\]|\\.)*');/);
	assert.ok(literal, 'PRO_FEATURES_SENTENCE not found in pro-features.ts');
	return new Function(`return ${literal[1]};`)();
}

// Identifiers the arrays reference. Answer text gets the real value; the URLs
// only feed link hrefs, which these tests don't read.
const SCOPE = {
	PRO_FEATURES_SENTENCE: proFeaturesSentence(),
	GITHUB_GIMP_DOCS_URL: 'https://example.invalid/gimp.md',
	CONNECT_TOOLS_URL: 'https://example.invalid/tools',
	CONNECT_PRIVACY_URL: 'https://example.invalid/privacy'
};

const SECTIONS = ['general', 'desktop', 'connect'];

function section(name) {
	const source = readFileSync(FAQ_PAGE, 'utf8');
	const block = source.match(new RegExp(`const ${name}: Faq\\[\\] = (\\[[\\s\\S]*?\\n\\t\\]);`));
	assert.ok(block, `${name} array not found in faq/+page.svelte`);
	return new Function(...Object.keys(SCOPE), `return ${block[1]};`)(...Object.values(SCOPE));
}

function faqs() {
	return SECTIONS.flatMap(section);
}

test('every section array is rendered and feeds the JSON-LD', () => {
	const source = readFileSync(FAQ_PAGE, 'utf8');
	for (const name of SECTIONS) {
		assert.ok(source.includes(`faqs: ${name}`), `${name} is not listed in sections`);
	}
	assert.ok(
		/mainEntity:\s*sections\s*\.flatMap\(\(s\) => s\.faqs\)/.test(source),
		'JSON-LD is not built from every section'
	);
});

test('no answer denies that a hosted option exists', () => {
	for (const { q, a } of faqs()) {
		assert.ok(!/no hosted editor/i.test(a), `"${q}" says there is no hosted editor`);
	}
});

test('no answer qualifies support with what has been tested', () => {
	for (const { q, a } of faqs()) {
		assert.ok(!/\btested\b/i.test(a), `"${q}" carries a tested-with disclaimer`);
	}
});

test('every Connect question names Connect, so it reads right outside its section', () => {
	for (const { q } of section('connect')) {
		assert.ok(q.includes('Connect'), `Connect question doesn't name Connect: ${q}`);
	}
});

test('faq questions are unique — a duplicate breaks the keyed {#each}', () => {
	const qs = faqs().map((f) => f.q);
	assert.equal(new Set(qs).size, qs.length, `duplicate question among: ${qs.join(' | ')}`);
});

test('no faq question or answer contains a raw "<"', () => {
	for (const { q, a } of faqs()) {
		assert.ok(!q.includes('<') && !a.includes('<'), `"<" found in FAQ entry: ${q}`);
	}
});

test('the "Is Editmamei free?" answer carries the shared Pro features sentence', () => {
	const free = faqs().find((f) => f.q === 'Is Editmamei free?');
	assert.ok(free, '"Is Editmamei free?" entry not found');
	assert.ok(free.a.includes(SCOPE.PRO_FEATURES_SENTENCE), 'Pro features sentence missing');
});

test('the FAQPage JSON-LD built from the array round-trips as valid JSON', () => {
	const entries = faqs();
	const schema = {
		'@context': 'https://schema.org',
		'@type': 'FAQPage',
		mainEntity: entries.map(({ q, a }) => ({
			'@type': 'Question',
			name: q,
			acceptedAnswer: { '@type': 'Answer', text: a }
		}))
	};
	const parsed = JSON.parse(JSON.stringify(schema).replace(/</g, '\\u003c'));
	assert.equal(parsed.mainEntity.length, entries.length);
	assert.ok(parsed.mainEntity.every((e) => e.name && e.acceptedAnswer.text));
});
