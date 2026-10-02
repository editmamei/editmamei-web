// Pins the FAQ data contract: the faqs array on /faq feeds both the visible
// list (keyed by question text in the {#each}) and the FAQPage JSON-LD
// injected via {@html}. Three invariants: question keys are unique (a
// duplicate throws at runtime in the keyed {#each} and blanks the page), no
// '<' appears in any question or answer (the escape guard exists, but
// content should never rely on it), and the JSON-LD built from the array
// round-trips as valid JSON.

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

// Identifiers the faqs array references. Answer text gets the real value;
// GITHUB_GIMP_DOCS_URL only feeds a link href, which these tests don't read.
const SCOPE = {
	PRO_FEATURES_SENTENCE: proFeaturesSentence(),
	GITHUB_GIMP_DOCS_URL: 'https://example.invalid/gimp.md'
};

function faqs() {
	const source = readFileSync(FAQ_PAGE, 'utf8');
	const block = source.match(/const faqs = (\[[\s\S]*?\n\t\]);/);
	assert.ok(block, 'faqs array not found in faq/+page.svelte');
	return new Function(...Object.keys(SCOPE), `return ${block[1]};`)(...Object.values(SCOPE));
}

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
