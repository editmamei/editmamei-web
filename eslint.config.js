import prettier from 'eslint-config-prettier';
import path from 'node:path';
import { includeIgnoreFile } from '@eslint/compat';
import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';

const gitignorePath = path.resolve(import.meta.dirname, '.gitignore');

export default defineConfig(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	ts.configs.recommended,
	svelte.configs.recommended,
	prettier,
	svelte.configs.prettier,
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			// typescript-eslint strongly recommend that you do not use the no-undef lint rule on TypeScript projects.
			// see: https://typescript-eslint.io/troubleshooting/faqs/eslint/#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
			'no-undef': 'off'
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	{
		// Override or add rule settings here, such as:
		// 'svelte/button-has-type': 'error'
		rules: {
			// `svelte/no-navigation-without-resolve` is part of the recommended
			// svelte-eslint-plugin config and demands every internal href flow
			// through `resolve()` from `$app/paths`. The rule's safety net is
			// for SvelteKit apps deployed at a base path (e.g.
			// `editmamei.com/sub-path`) — `resolve('/foo')` then renders the
			// correct `/sub-path/foo`. This site is configured with NO base
			// path (see the `kit` block in svelte.config.js), so `href="/"`
			// is always correct today and stays correct as long as we deploy
			// at root. The rule was off-by-default before the 2026 upgrade
			// of the recommended preset; disabling it here documents the
			// trade rather than rewriting ~20 hrefs across 6 route files for
			// no runtime gain.
			//
			// If we ever deploy under a base path, re-enable this rule and
			// the resulting errors will be the audit list for the wrap pass.
			'svelte/no-navigation-without-resolve': 'off'
		}
	}
);
