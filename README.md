# editmamei-web

The marketing site for [Editmamei](https://editmamei.com) — natural-language photo editing that drives your own Adobe Photoshop through an MCP server. This repo is the landing page only; the Community Edition source is public under FSL-1.1-MIT at [editmamei/editmamei](https://github.com/editmamei/editmamei) (docs + changelog live there too), and the Pro half stays private.

SvelteKit 5 + Vite + Tailwind v4 + TypeScript, fully static (`@sveltejs/adapter-static`), served as a Cloudflare Worker with static assets (`wrangler.jsonc`). A push to `main` deploys `editmamei.com`; a push to `dev` uploads a private staging preview.

## Develop

```sh
npm install
npm run dev        # Vite dev server with HMR
```

## Verify

```sh
npm run check      # svelte-check
npm run lint       # prettier + eslint
npm test           # node --test (leak guard + sitemap invariants)
npm run build      # production build → build/
npm run preview    # serve the production build locally
node scripts/check-leak-guard.mjs   # policy gate, also runs in CI
```

## Notes for contributors

- The `BLOCKED` array in `scripts/check-leak-guard.mjs` is auto-generated from the private source repo's tool-tier table — don't hand-edit the fenced region.
- `design/` holds editable brand sources (never deployed); `static/` is served at the deploy root. See `CLAUDE.md` for the full conventions.
- Videos go in `media/`, not `static/`: `npm run upload:media` puts them on `media.editmamei.com` (which answers the byte-range requests Safari needs to play them) and updates `src/lib/content/media.generated.json`; pages use `mediaUrl()` from `$lib/media`.
- Every indexable page renders the `<Seo>` component with a self-referencing canonical; the sitemap's `ROUTES` array and per-page `noindex` tags must stay complementary (enforced by `tests/sitemap-routes.test.mjs`).
