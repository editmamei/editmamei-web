# editmamei-web

The marketing site for [Editmamei](https://editmamei.com) — natural-language photo editing that drives your own Adobe Photoshop through an MCP server. This repo is the landing page only; the product source is private, and the public docs + changelog live at [editmamei/editmamei-wiki](https://github.com/editmamei/editmamei-wiki).

SvelteKit 5 + Vite + Tailwind v4 + TypeScript, fully static (`@sveltejs/adapter-static`), deployed to GitHub Pages on push to `main`.

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
- Every indexable page renders the `<Seo>` component with a self-referencing canonical; the sitemap's `ROUTES` array and per-page `noindex` tags must stay complementary (enforced by `tests/sitemap-routes.test.mjs`).
