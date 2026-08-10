import type { RequestHandler } from './$types';
import { posts } from '$lib/blog';

/**
 * Dynamic sitemap. Replaces the previous static/sitemap.xml which drifted
 * out of sync with the actual route list (it only declared `/` while
 * /product and /pricing were live and indexable). That mismatch suppressed
 * indexing: Google's URL Inspection reported "Crawled — currently not
 * indexed" with a blank google-selected canonical, a textbook quality-
 * classifier rejection.
 *
 * Indexable routes only. Stub routes (/privacy, /security) carry
 * <meta name="robots" content="noindex"> at the page level and are
 * deliberately excluded here — including them would either signal noise
 * to Google or, worse, contradict the page-level directive. /license lost
 * its noindex at the FSL-1.1-MIT split (2026-08-08) — the license terms are
 * real public-facing content now, not a stub — so it's listed below.
 *
 * Prerendered at build time so it ships as a real static file at
 * build/sitemap.xml on GitHub Pages.
 */

export const prerender = true;

const ORIGIN = 'https://editmamei.com';

// lastmod is hand-maintained (YYYY-MM-DD): bump it when a page's CONTENT
// meaningfully changes, not on refactors or restyles. Stamping the build
// date here instead ("everything changed today", every deploy) teaches
// crawlers the field is unreliable, which also devalues the accurate
// per-post dates below. /blog has no entry of its own — its lastmod is
// derived in GET from the newest post, since the index changes exactly
// when the post list does.
const ROUTES: Array<{ path: string; lastmod: string; priority: string; changefreq: string }> = [
	{ path: '/', lastmod: '2026-08-08', priority: '1.0', changefreq: 'weekly' },
	{ path: '/product', lastmod: '2026-08-04', priority: '0.8', changefreq: 'weekly' },
	{ path: '/pricing', lastmod: '2026-08-04', priority: '0.8', changefreq: 'monthly' },
	{ path: '/faq', lastmod: '2026-08-08', priority: '0.7', changefreq: 'monthly' },
	{ path: '/contact', lastmod: '2026-08-08', priority: '0.5', changefreq: 'yearly' },
	{ path: '/license', lastmod: '2026-08-08', priority: '0.4', changefreq: 'yearly' },
	{ path: '/activate', lastmod: '2026-07-15', priority: '0.5', changefreq: 'monthly' },
	{ path: '/blog', lastmod: 'NEWEST_POST', priority: '0.6', changefreq: 'weekly' }
];

export const GET: RequestHandler = () => {
	// The blog index's real modification date: the newest post date on it.
	// Falls back to the site launch date only while there are zero posts.
	const newestPost = posts
		.flatMap((p) => [p.date, p.updated ?? p.date])
		.reduce((a, b) => (a > b ? a : b), '2026-06-19');

	const urls = ROUTES.map(
		({ path, lastmod, priority, changefreq }) => `	<url>
		<loc>${ORIGIN}${path}</loc>
		<lastmod>${lastmod === 'NEWEST_POST' ? newestPost : lastmod}</lastmod>
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

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[urls, postUrls].filter(Boolean).join('\n')}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
