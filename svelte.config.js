import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// .md is for blog posts under src/lib/content/posts/ (mdsvex compiles
	// them to Svelte components with a `metadata` export from frontmatter).
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extensions: ['.md'] })],
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: true
		}),
		prerender: {
			// A blog with zero published posts leaves /blog/[slug] with no
			// pages to generate, which is valid (its entries() returned []).
			// Every OTHER unseen route keeps the default hard failure —
			// unreachable-route drift is the bug class the sitemap tests pin.
			handleUnseenRoutes: ({ routes }) => {
				const unexpected = routes.filter((id) => id !== '/blog/[slug]');
				if (unexpected.length > 0) {
					throw new Error(
						`The following routes were marked as prerenderable, but were not prerendered: ${unexpected.join(', ')}`
					);
				}
			}
		}
	}
};

export default config;
