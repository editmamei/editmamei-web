import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// Dev server only (no effect on the static build). 5173 is taken by another
	// Vite instance; strictPort keeps the port predictable so the Polar sandbox
	// checkout success_url (localhost:5264/activate) always matches.
	server: { port: 5264, strictPort: true }
});
