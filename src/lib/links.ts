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
