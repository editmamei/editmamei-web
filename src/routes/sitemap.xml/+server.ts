import type { RequestHandler } from './$types';

/**
 * Dynamic sitemap. Replaces the previous static/sitemap.xml which drifted
 * out of sync with the actual route list (it only declared `/` while
 * /product and /pricing were live and indexable). That mismatch suppressed
 * indexing: Google's URL Inspection reported "Crawled — currently not
 * indexed" with a blank google-selected canonical, a textbook quality-
 * classifier rejection.
 *
 * Indexable routes only. Stub routes (/privacy, /security, /license) carry
 * <meta name="robots" content="noindex"> at the page level and are
 * deliberately excluded here — including them would either signal noise
 * to Google or, worse, contradict the page-level directive.
 *
 * Prerendered at build time so it ships as a real static file at
 * build/sitemap.xml on GitHub Pages.
 */

export const prerender = true;

const ORIGIN = 'https://editmamei.com';

const ROUTES: Array<{ path: string; priority: string; changefreq: string }> = [
	{ path: '/', priority: '1.0', changefreq: 'weekly' },
	{ path: '/product', priority: '0.8', changefreq: 'weekly' },
	{ path: '/pricing', priority: '0.8', changefreq: 'monthly' },
	{ path: '/faq', priority: '0.7', changefreq: 'monthly' },
	{ path: '/contact', priority: '0.5', changefreq: 'yearly' },
	{ path: '/activate', priority: '0.5', changefreq: 'monthly' }
];

export const GET: RequestHandler = () => {
	// ISO date (YYYY-MM-DD), the format Google's sitemap docs recommend.
	const today = new Date().toISOString().slice(0, 10);

	const urls = ROUTES.map(
		({ path, priority, changefreq }) => `	<url>
		<loc>${ORIGIN}${path}</loc>
		<lastmod>${today}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`
	).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
