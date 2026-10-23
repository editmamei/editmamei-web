import type { RequestHandler } from './$types';
import { posts } from '$lib/blog';
import { snapshot as toolsSnapshot } from '$lib/content/tools';
import { loadGallery } from '$lib/server/gallery';

/**
 * Dynamic sitemap, built from the route list below so it stays in step with
 * the pages that are live and indexable.
 *
 * Indexable routes only. Pages that carry <meta name="robots" content="noindex">
 * at the page level (for example /desktop/download and /desktop/docs) are deliberately
 * excluded here: including them would either signal noise to Google or,
 * worse, contradict the page-level directive. A route with real public
 * content, such as /license, is listed below.
 *
 * Prerendered at build time so it ships as a real static file at
 * build/sitemap.xml.
 */

export const prerender = true;

const ORIGIN = 'https://editmamei.com';

// lastmod is hand-maintained (YYYY-MM-DD): bump it when a page's CONTENT
// meaningfully changes, not on refactors or restyles. Stamping the build
// date here instead ("everything changed today", every deploy) teaches
// crawlers the field is unreliable, which also devalues the accurate
// per-post dates below. /blog has no fixed date of its own: its lastmod is
// derived in GET from the newest post, since the index changes exactly
// when the post list does. /desktop/tools uses the TOOLS_SNAPSHOT sentinel:
// its lastmod is the date of the generated tool snapshot it renders.
const ROUTES: Array<{ path: string; lastmod: string; priority: string; changefreq: string }> = [
	{ path: '/', lastmod: '2026-10-22', priority: '1.0', changefreq: 'weekly' },
	{ path: '/desktop', lastmod: '2026-10-23', priority: '0.9', changefreq: 'monthly' },
	{ path: '/desktop/tools', lastmod: 'TOOLS_SNAPSHOT', priority: '0.7', changefreq: 'monthly' },
	{ path: '/desktop/pricing', lastmod: '2026-10-23', priority: '0.8', changefreq: 'monthly' },
	{ path: '/desktop/activate', lastmod: '2026-10-02', priority: '0.5', changefreq: 'monthly' },
	{ path: '/connect', lastmod: '2026-10-23', priority: '0.9', changefreq: 'monthly' },
	{ path: '/connect/pricing', lastmod: '2026-10-23', priority: '0.8', changefreq: 'monthly' },
	{ path: '/pricing', lastmod: '2026-10-23', priority: '0.7', changefreq: 'monthly' },
	{ path: '/faq', lastmod: '2026-10-22', priority: '0.7', changefreq: 'monthly' },
	{ path: '/contact', lastmod: '2026-10-02', priority: '0.5', changefreq: 'yearly' },
	{ path: '/license', lastmod: '2026-10-02', priority: '0.4', changefreq: 'yearly' },
	{ path: '/privacy', lastmod: '2026-10-02', priority: '0.4', changefreq: 'yearly' },
	{ path: '/security', lastmod: '2026-10-02', priority: '0.3', changefreq: 'yearly' },
	{ path: '/blog', lastmod: 'NEWEST_POST', priority: '0.6', changefreq: 'weekly' },
	{ path: '/gallery', lastmod: 'NEWEST_ENTRY', priority: '0.6', changefreq: 'daily' }
];

export const GET: RequestHandler = async () => {
	const gallery = await loadGallery();
	// The gallery index changes exactly when its newest entry does.
	const newestEntry = gallery.reduce((a, e) => (e.date > a ? e.date : a), '2026-10-13');

	// The blog index's real modification date: the newest post date on it.
	// Falls back to the site launch date only while there are zero posts.
	const newestPost = posts
		.flatMap((p) => [p.date, p.updated ?? p.date])
		.reduce((a, b) => (a > b ? a : b), '2026-06-19');

	const resolveLastmod = (lastmod: string) =>
		lastmod === 'NEWEST_POST'
			? newestPost
			: lastmod === 'NEWEST_ENTRY'
				? newestEntry
				: lastmod === 'TOOLS_SNAPSHOT'
					? toolsSnapshot.date
					: lastmod;

	const urls = ROUTES.map(
		({ path, lastmod, priority, changefreq }) => `	<url>
		<loc>${ORIGIN}${path}</loc>
		<lastmod>${resolveLastmod(lastmod)}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`
	).join('\n');

	// Blog post URLs come from the posts loader, which contains published
	// posts only (drafts live in a dev-only folder). lastmod is the post's
	// own date rather than the build date, so unchanged posts don't churn.
	const postUrls = posts
		.map(
			(post) => `	<url>
		<loc>${ORIGIN}/blog/${post.slug}</loc>
		<lastmod>${post.updated ?? post.date}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`
		)
		.join('\n');

	// Gallery entries: ids are validated to [a-z0-9-] by the feed loader, so they
	// are safe to place in the XML as-is.
	const entryUrls = gallery
		.map(
			(e) => `	<url>
		<loc>${ORIGIN}/gallery/${e.id}</loc>
		<lastmod>${e.date}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.5</priority>
	</url>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[urls, postUrls, entryUrls].filter(Boolean).join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
