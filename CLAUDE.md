# CLAUDE.md — editmamei-web

The landing page for `editmamei.com`. SvelteKit 5 + Vite + Tailwind v4 + TypeScript.

General dev-sec-ops spine lives in the parent [CLAUDE.md](../CLAUDE.md). This file is the repo-specific extension.

## Layout

- `src/lib/` — components, utilities
- `src/routes/` — SvelteKit file-based routing
- `src/app.html` — root HTML shell
- `src/app.d.ts` — global type declarations
- `static/` — public assets (currently just `robots.txt`)
- `svelte.config.js` — adapter + preprocess config
- `vite.config.ts` — Vite config (Tailwind plugin, SvelteKit plugin)
- `eslint.config.js` — flat ESLint config

## Commands

All from this directory:

- `npm run dev` — Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run check` — `svelte-kit sync && svelte-check`
- `npm run check:watch` — watch mode
- `npm run lint` — `prettier --check . && eslint .`
- `npm run format` — `prettier --write .`
- `npm run prepare` — `svelte-kit sync` (postinstall)

## Hosting and deploy

- **Today**: GitHub Pages. DNS at Squarespace points `editmamei.com` here via CNAME.
- **Later** (Pro launch): migrate to **Cloudflare Pages** alongside the Cloudflare Worker license-server and R2 signed-URL bundles. Migration is a CNAME swap, not a re-registration. See [../Editmamei/docs/20260528-DISTRIBUTION_PLAN.md](../Editmamei/docs/20260528-DISTRIBUTION_PLAN.md) §3.5.1.
- Don't suggest Vercel / Netlify / self-hosting as alternatives — the decision is locked.

**Adapter implication**: GitHub Pages can only serve a fully static build. `@sveltejs/adapter-auto` is installed today and resolves to a static-friendly adapter in this context; if a future change adds a `+page.server.ts`, `+server.ts`, or any server-only feature, that's a signal to revisit the adapter choice **and** the hosting target together, not to swap adapters in isolation.

## Full-process triggers (in addition to the workspace-root list)

The full nine-step process is mandatory when:

- Editing pricing copy or the editions table (must stay in sync with [../editmamei-ce/docs/pro-features.md](../editmamei-ce/docs/pro-features.md) and [../Editmamei/src/core/tool-tiers.ts](../Editmamei/src/core/tool-tiers.ts) — pricing drift across these three is a user-visible bug).
- Adding any form, signup, analytics script, or third-party embed. The site currently claims "no cloud, no telemetry, no transmission of your content" (see Privacy in [../editmamei-ce/README.md](../editmamei-ce/README.md)); anything that violates that needs the privacy claim and the marketing copy reconciled first.
- Changing `svelte.config.js`, `vite.config.ts`, or the adapter — affects the build artifact GitHub Pages serves.

## Verify checklist

- `npm run check` — `svelte-check` clean
- `npm run lint` — prettier + eslint clean
- `npm run build` — production build succeeds and the output is static-serveable
- `npm run preview` and manually click through the changed pages — type-clean and lint-clean does not mean "the page works"

## QA subagent prompts (customize from the root template)

1. **Security** — "Scan the diff for: (a) third-party scripts injected into `src/app.html` or a layout (analytics, fonts, embeds — each is a potential privacy-claim violation per `../editmamei-ce/README.md`); (b) user-input forms without validation/sanitization; (c) hardcoded secrets/keys in `.env` or source; (d) dependency vulnerabilities in `package.json`. Severity low/med/high. Under 200 words."

2. **Content correctness** — "Verify any pricing or feature copy in the diff stays consistent with `../editmamei-ce/docs/pro-features.md` (canonical Pro feature list) and does not promise features absent from `../Editmamei/src/core/tool-tiers.ts`. Check that internal links to `editmamei.com/*` paths actually correspond to routes in `src/routes/`. Under 200 words."

3. **Static-build safety** — "Confirm the change is compatible with GitHub Pages static hosting: no server-only SvelteKit features (`+page.server.ts`, `+server.ts`), no `$env/dynamic/*` imports, no use of Node built-ins at request time. Confirm `npm run build` output is fully static. Under 200 words."
