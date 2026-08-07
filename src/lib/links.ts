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
// ⚠ THESE MOVE AT THE FIRST RELEASE CUT FROM THE PUBLIC SOURCE REPO.
// Editmamei's Community source moved to `editmamei/editmamei` in the 2026-08-07
// split, and that repo's release workflow attaches its artifacts to its OWN
// releases page. From its first release, the wiki's `latest` freezes at the last
// pre-split version — so these links would keep serving an old build, silently,
// while looking like they resolve to the newest.
//
// Change them in that same release, not before: the public repo has no releases
// yet, so pointing at it early gives a 404 instead of a stale download. Swap
// `editmamei-wiki` for `editmamei` in both constants and the whole site follows,
// which is why they live here rather than beside their two call sites.
export const MCPB_DOWNLOAD_URL =
	'https://github.com/editmamei/editmamei-wiki/releases/latest/download/editmamei.mcpb';
export const RELEASES_URL = 'https://github.com/editmamei/editmamei-wiki/releases/latest';
