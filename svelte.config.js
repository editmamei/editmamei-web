import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
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
			// /privacy, /security, /license are intentional placeholder
			// links to routes that ship later. Anything else 404ing is a bug.
			handleHttpError: ({ path, message }) => {
				const pending = ['/privacy', '/security', '/license'];
				if (pending.includes(path)) return;
				throw new Error(message);
			}
		}
	}
};

export default config;
