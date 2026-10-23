#!/usr/bin/env node
// Rebuilds static/llms-full.txt: Editmamei Desktop's user docs bundled as one
// plain-text file for AI assistants and crawlers. Each section is copied from
// the public repository's docs, with relative links rewritten to GitHub URLs.
//
//   node scripts/build-llms-full.mjs --source <path to a clone of editmamei/editmamei>
//
// Run it at a release cut (or after a docs change lands), from a clone checked
// out at the released docs, then commit the regenerated file.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, '..', 'static', 'llms-full.txt');
const BLOB = 'https://github.com/editmamei/editmamei/blob/main';

const SECTIONS = [
	['Getting started', 'docs/getting-started.md'],
	['Installation', 'docs/installation.md'],
	['AI apps', 'docs/clients.md'],
	['FAQ', 'docs/faq.md'],
	['Pro features', 'docs/pro-features.md'],
	['GIMP', 'docs/gimp.md'],
	['Troubleshooting', 'docs/troubleshooting.md'],
	['Privacy and data handling', 'docs/privacy.md']
];

const arg = process.argv.indexOf('--source');
if (arg === -1 || !process.argv[arg + 1]) {
	console.error('usage: node scripts/build-llms-full.mjs --source <editmamei clone>');
	process.exit(1);
}
const source = resolve(process.argv[arg + 1]);
const pkg = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'));

/** Relative markdown links in a doc at `path` become absolute GitHub links. */
function absolutize(text, path) {
	const base = dirname(path);
	return text.replace(/\]\((?!https?:|mailto:|#)([^)\s]+)\)/g, (_, target) => {
		const url = new URL(target, `https://x/${base}/`);
		return `](${BLOB}/${url.pathname.slice(1)}${url.hash})`;
	});
}

const rule = '='.repeat(80);
const parts = [
	'# Editmamei Desktop: full user documentation',
	'',
	`This file bundles the user docs for Editmamei Desktop, the MCP server that lets AI apps edit photos in Adobe Photoshop or GIMP on your computer, as plain text for AI assistants and crawlers. Each section is copied from the public repository's docs for the ${pkg.version} release, at the path shown in its header, with relative links rewritten to GitHub URLs (on the repository's main branch). The short overview of both Editmamei products is at https://editmamei.com/llms.txt, and Editmamei Connect, the hosted product, describes itself at https://connect.editmamei.com/llms.txt.`,
	'',
	`Contents: ${SECTIONS.map(([title]) => title).join(', ')}.`,
	''
];
for (const [title, path] of SECTIONS) {
	const body = readFileSync(join(source, path), 'utf8').replace(/\r\n/g, '\n').trim();
	parts.push(
		'',
		rule,
		`SECTION: ${title}`,
		`SOURCE: ${BLOB}/${path}`,
		rule,
		'',
		absolutize(body, path),
		''
	);
}
writeFileSync(OUT, parts.join('\n'));
console.log(`wrote ${OUT} from ${pkg.name}@${pkg.version}, ${SECTIONS.length} sections`);
