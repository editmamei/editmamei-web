// Site navigation. The header's two product menus, the mobile menu and the
// footer render from these arrays, so adding a page to the menus is a data
// change here, not a layout change.
//
// The site has two products, each a section of its own: Desktop (Photoshop or
// GIMP on your computer) under /desktop, and Connect (hosted) under /connect,
// whose sign-up, setup, tool list and account live on connect.editmamei.com.
// "Editmamei Desktop" is a site label set against Connect; the installed
// product is still called Editmamei, so the name stays out of install steps,
// READMEs and listings.

import { CONNECT_TOOLS_URL, CONNECT_URL } from '$lib/links';

export interface NavLink {
	label: string;
	href: string;
	/** Short line under the label in a product menu. */
	description?: string;
	/** Opens connect.editmamei.com rather than a page on this site. */
	external?: boolean;
}

export interface ProductNav {
	id: 'desktop' | 'connect';
	/** The menu button's label. */
	menu: string;
	/** The product's page, shown first in its menu with a description. */
	overview: NavLink;
	links: NavLink[];
}

export const desktopNav: ProductNav = {
	id: 'desktop',
	menu: 'Desktop',
	overview: {
		label: 'Editmamei Desktop',
		href: '/desktop',
		description: 'Edit in Photoshop or GIMP, on your computer.'
	},
	links: [
		{ label: 'Tools', href: '/desktop/tools' },
		{ label: 'Pricing', href: '/desktop/pricing' },
		{ label: 'Download', href: '/desktop/download' },
		{ label: 'Docs', href: '/desktop/docs' }
	]
};

export const connectNav: ProductNav = {
	id: 'connect',
	menu: 'Connect',
	overview: {
		label: 'Editmamei Connect',
		href: '/connect',
		description: 'Edit from any device, with nothing to install.'
	},
	links: [
		{ label: 'Pricing', href: '/connect/pricing' },
		{ label: 'Open Connect', href: CONNECT_URL, external: true },
		{ label: 'All Connect tools', href: CONNECT_TOOLS_URL, external: true }
	]
};

export const productNavs: ProductNav[] = [desktopNav, connectNav];

/** Top-level nav items after the two product menus, in order. */
export const primaryNav: NavLink[] = [
	{ label: 'Pricing', href: '/pricing' },
	{ label: 'Gallery', href: '/gallery' },
	{ label: 'Blog', href: '/blog' }
];
