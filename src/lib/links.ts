// External account links.
//
// PRODUCTION customer portal (Polar org `editmamei`). Customers reach it by
// entering their purchase email (passwordless) to manage their subscription,
// payment method, invoices, and activated devices.
export const CUSTOMER_PORTAL_URL = 'https://polar.sh/editmamei/portal';

// Release artifacts.
//
// `latest` resolves server-side, so a new version never needs a site edit — the
// only thing that ever changes here is WHICH repository publishes releases.
//
// Moved to the public source repository for the 1.0.0 release (2026-08-07).
// Editmamei's Community source now lives at `editmamei/editmamei`, and that
// repository's release workflow attaches artifacts to its own releases page. The
// wiki's `latest` freezes at the last pre-split version, so leaving these pointed
// there would have kept serving an old build — resolving fine, looking healthy,
// and quietly wrong.
//
// ORDERING: this change must go live no earlier than the 1.0.0 release itself,
// because the target has no releases before it and `latest` 404s. That happens
// on its own — the site is promoted by the release pipeline's finalize stage,
// which runs after npm and the GitHub Release exist. Do not promote the site
// ahead of the release to get this out sooner.
export const MCPB_DOWNLOAD_URL =
	'https://github.com/editmamei/editmamei/releases/latest/download/editmamei.mcpb';
export const RELEASES_URL = 'https://github.com/editmamei/editmamei/releases/latest';

// Signup capture (the `editmamei-subscribe` Worker).
//
// A workers.dev hostname rather than a custom domain because editmamei.com's
// zone is on Google Cloud DNS via Squarespace, not Cloudflare, so Worker custom
// domains are unavailable — the same blocker the telemetry Worker has.
//
// This URL is only ever called by our own JavaScript and never shown to anyone:
// the link in the confirmation email points at /confirm on this site, which
// calls the endpoint below. If the zone moves and this becomes a real
// subdomain, links already sitting in inboxes keep working.
export const SUBSCRIBE_API_URL = 'https://editmamei-subscribe.editmamei.workers.dev';

// Public source repository (Editmamei CE, source-available under FSL-1.1-MIT).
// Default branch is `dev`, so deep links into docs/ or a specific file use
// /blob/dev/. The wiki repo (editmamei/editmamei-wiki) is frozen post-split;
// its docs are migrating here, so new links should point at this repo, not
// the wiki.
export const GITHUB_REPO_URL = 'https://github.com/editmamei/editmamei';
export const GITHUB_README_URL = `${GITHUB_REPO_URL}#readme`;
export const GITHUB_ISSUES_URL = `${GITHUB_REPO_URL}/issues`;
export const GITHUB_LICENSE_URL = `${GITHUB_REPO_URL}/blob/dev/LICENSE.md`;
export const GITHUB_CHANGELOG_URL = `${GITHUB_REPO_URL}/blob/dev/CHANGELOG.md`;
export const GITHUB_SECURITY_POLICY_URL = `${GITHUB_REPO_URL}/blob/dev/SECURITY.md`;
export const GITHUB_SECURITY_ADVISORY_URL = `${GITHUB_REPO_URL}/security/advisories/new`;
export const GITHUB_FAQ_DOCS_URL = `${GITHUB_REPO_URL}/blob/dev/docs/faq.md`;
export const GITHUB_AI_CLIENT_FAQ_URL = `${GITHUB_FAQ_DOCS_URL}#which-ai-client-should-i-use`;
export const GITHUB_GETTING_STARTED_DOCS_URL = `${GITHUB_REPO_URL}/blob/dev/docs/getting-started.md`;
export const GITHUB_INSTALLATION_DOCS_URL = `${GITHUB_REPO_URL}/blob/dev/docs/installation.md`;
export const GITHUB_CLAUDE_CODE_INSTALL_URL = `${GITHUB_INSTALLATION_DOCS_URL}#claude-code`;
