import type { RequestHandler } from './$types';
import { posts } from '$lib/blog';
import { escapeXml } from '$lib/escape-xml.js';

/**
 * RSS 2.0 feed for the blog. Prerendered at build time (same pattern as
 * sitemap.xml) so it ships as a static file at build/blog/rss.xml.
 * `posts` contains published posts only — drafts live in a dev-only
 * folder the production glob never matches.
 */

export const prerender = true;

const ORIGIN = 'https://editmamei.com';

export const GET: RequestHandler = () => {
	const items = posts
		.map(
			(post) => `		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${ORIGIN}/blog/${post.slug}</link>
			<guid isPermaLink="true">${ORIGIN}/blog/${post.slug}</guid>
			<description>${escapeXml(post.description)}</description>
			<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>
		</item>`
		)
		.join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Editmamei blog</title>
		<link>${ORIGIN}/blog</link>
		<atom:link href="${ORIGIN}/blog/rss.xml" rel="self" type="application/rss+xml" />
		<description>Feature announcements, tutorials, and example edits from Editmamei.</description>
		<language>en-us</language>
${items}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
};
