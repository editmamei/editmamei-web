// Structured data (schema.org JSON-LD) for the two products. Organization and
// WebSite ship on every page from app.html; each product's entity ships only
// on its own pages, so /connect never describes Desktop and the reverse. The
// @ids let any page point at an entity without repeating it.

import { snapshot } from '$lib/content/tools';
import { mediaUrl } from '$lib/media';
import { CONNECT_URL, GITHUB_REPO_URL } from '$lib/links';

export const ORIGIN = 'https://editmamei.com';
export const ORG_ID = `${ORIGIN}/#org`;
export const DESKTOP_ID = `${ORIGIN}/desktop#app`;
export const CONNECT_ID = `${ORIGIN}/connect#app`;

type Json = Record<string, unknown>;

const offer = (name: string, price: number, url: string, extra: Json = {}): Json => ({
	'@type': 'Offer',
	name,
	price: String(price),
	priceCurrency: 'USD',
	url: `${ORIGIN}${url}`,
	availability: 'https://schema.org/InStock',
	...extra
});
const every = (price: number, duration: string): Json => ({
	priceSpecification: {
		'@type': 'UnitPriceSpecification',
		price: String(price),
		priceCurrency: 'USD',
		billingDuration: duration
	}
});

export const desktopApp: Json = {
	'@type': 'SoftwareApplication',
	'@id': DESKTOP_ID,
	name: 'Editmamei Desktop',
	alternateName: 'Editmamei',
	description:
		'An MCP server that lets AI apps such as Claude Desktop, Claude Code and Cursor edit photos in Adobe Photoshop or GIMP on your computer, in layers and masks you can keep editing.',
	url: `${ORIGIN}/desktop`,
	image: `${ORIGIN}/icons/icon-512.png`,
	applicationCategory: 'DesignApplication',
	operatingSystem: 'Windows 10/11, macOS 13+, Linux (with GIMP)',
	softwareRequirements: 'Adobe Photoshop 2026 or GIMP 3.2, and an AI app that supports MCP',
	softwareVersion: snapshot.version,
	isAccessibleForFree: true,
	downloadUrl: 'https://www.npmjs.com/package/editmamei',
	codeRepository: GITHUB_REPO_URL,
	publisher: { '@id': ORG_ID },
	offers: [
		offer('Community', 0, '/desktop/pricing'),
		offer('Pro monthly', 9, '/desktop/pricing', every(9, 'P1M')),
		offer('Pro yearly', 79, '/desktop/pricing', every(79, 'P1Y')),
		offer('Pro perpetual', 199, '/desktop/pricing')
	]
};

export const connectApp: Json = {
	'@type': 'WebApplication',
	'@id': CONNECT_ID,
	name: 'Editmamei Connect',
	description:
		'A hosted MCP connector for AI apps such as Claude and ChatGPT: send a photo from your phone or computer, say what you want, and it is edited with real editing tools on Editmamei’s server, not redrawn.',
	url: `${ORIGIN}/connect`,
	image: `${ORIGIN}/icons/icon-512.png`,
	applicationCategory: 'DesignApplication',
	operatingSystem: 'Any, inside an AI app on the web, desktop or phone',
	isAccessibleForFree: true,
	installUrl: CONNECT_URL,
	publisher: { '@id': ORG_ID },
	offers: [
		offer('Free credits', 0, '/connect/pricing'),
		offer('750 credits', 7, '/connect/pricing'),
		offer('2,000 credits', 15, '/connect/pricing'),
		offer('1,500 credits a month', 10, '/connect/pricing', every(10, 'P1M')),
		offer('7,500 credits a month', 35, '/connect/pricing', every(35, 'P1M'))
	]
};

export const desktopHeroVideo: Json = {
	'@type': 'VideoObject',
	name: 'Editmamei Desktop: an AI app replaces a sky in Photoshop',
	description:
		'A real session in Claude Desktop and Photoshop, sped up: the AI app replaces the sky over a waterfall, about 8 minutes of work.',
	thumbnailUrl: `${ORIGIN}/desktop/hero-poster.webp`,
	contentUrl: mediaUrl('desktop/desktop-hero-1280.mp4'),
	uploadDate: '2026-10-22',
	duration: 'PT12S',
	about: { '@id': DESKTOP_ID }
};

export const connectFilmVideo: Json = {
	'@type': 'VideoObject',
	name: 'Editmamei Connect launch film',
	description:
		'A real Connect session: adding the connector, sending a photo from a phone, the edit steps, and the download link.',
	thumbnailUrl: `${ORIGIN}/connect/connect-launch-poster.webp`,
	contentUrl: mediaUrl('connect/connect-launch-1080.mp4'),
	uploadDate: '2026-10-11',
	duration: 'PT1M10S',
	about: { '@id': CONNECT_ID }
};

/** FAQPage from plain question/answer pairs (answers as plain text). */
export function faqPage(items: { q: string; a: string }[]): Json {
	return {
		'@type': 'FAQPage',
		mainEntity: items.map((f) => ({
			'@type': 'Question',
			name: f.q,
			acceptedAnswer: { '@type': 'Answer', text: f.a }
		}))
	};
}

/**
 * One <script type="application/ld+json"> tag for {@html}. '<' is escaped so
 * no text can close the tag early, and the closing tag is split so the
 * Svelte and ESLint parsers don't end the surrounding script block on it.
 */
export function ldScript(...nodes: Json[]): string {
	const body = nodes.length === 1 ? nodes[0] : { '@graph': nodes };
	const json = JSON.stringify({ '@context': 'https://schema.org', ...body }).replace(
		/</g,
		'\\u003c'
	);
	return `<script type="application/ld+json">${json}${'<'}/script>`;
}
