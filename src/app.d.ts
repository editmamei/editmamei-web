// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		/** What the Cloudflare Worker passes to the gallery's server routes (src/lib/server/connect.ts). Absent while prerendering. */
		interface Platform {
			context?: { waitUntil(promise: Promise<unknown>): void };
			caches?: { default: Cache };
		}
	}
}

declare module '*.md' {
	import type { Component } from 'svelte';

	export const metadata: Record<string, unknown>;
	const content: Component;
	export default content;
}

export {};
