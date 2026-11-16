// The one export of the Workers runtime module the site uses (src/lib/server/connect.ts). The adapter stubs the
// module while building and under `vite dev`, and rewrites the import to the real one in the Worker. Kept to this
// export rather than the full @cloudflare/workers-types, whose globals clash with the DOM's.
declare module 'cloudflare:workers' {
	export function waitUntil(promise: Promise<unknown>): void;
}
