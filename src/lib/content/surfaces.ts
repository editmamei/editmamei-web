// Site navigation and the list of editor surfaces.
//
// The header's Product menu, the mobile menu, the footer's Product column and
// the editor chooser on /product all render from these arrays, so adding a
// surface or a nav item is a data change here, not a layout change in four
// components.

export interface NavLink {
	label: string;
	href: string;
	/** Short line under the label in the desktop Product menu. */
	description?: string;
}

export interface Surface {
	id: string;
	name: string;
	/** Where the surface's page lives. A full URL marks it as off-site. */
	href: string;
	/** One line on what the surface is and where it runs. */
	descriptor: string;
	/** Label for the call to action on the /product chooser card. */
	cta: string;
	beta?: boolean;
}

export const GIMP_GUIDE_URL = 'https://github.com/editmamei/editmamei/blob/main/docs/gimp.md';

export const surfaces: Surface[] = [
	{
		id: 'photoshop',
		name: 'Photoshop',
		href: '/photoshop',
		descriptor: 'Desktop Photoshop 2026, on Windows and macOS.',
		cta: 'Explore Photoshop'
	},
	{
		id: 'gimp',
		name: 'GIMP',
		href: GIMP_GUIDE_URL,
		descriptor: 'GIMP 3.2, running in the background on Windows, macOS and Linux.',
		cta: 'Read the GIMP guide',
		beta: true
	}
];

/** True for surfaces whose page is on this site. */
export const isOnSite = (s: Surface) => s.href.startsWith('/');

/** The Product menu's first entry. */
export const productOverview: NavLink = {
	label: 'Overview',
	href: '/product',
	description: 'How Editmamei works, and which editor to use it with.'
};

/** Product menu entries after the surfaces. */
export const productExtras: NavLink[] = [];

/** Top-level nav items after the Product menu, in order. */
export const primaryNav: NavLink[] = [
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'Blog', href: '/blog' }
];
