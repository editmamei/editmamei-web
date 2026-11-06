import { formatPrice, isCurrency, type Currency } from './local-prices.js';
import table from './prices.json';

export type PriceId = keyof typeof table.prices;

/**
 * The currency the page is shown in: the Worker's `data-currency` mark in the browser, US dollars while the pages are
 * built. Read each time, so a page reached by a link inside the site uses the mark the first page carried.
 */
function shownCurrency(): Currency {
	if (typeof document === 'undefined') return 'usd';
	const mark = document.documentElement.dataset.currency;
	return isCurrency(mark) ? mark : 'usd';
}

/** A price as the page shows it, `$9` or `€10`: what the Worker writes for the same visitor. */
export function price(id: PriceId): string {
	const currency = shownCurrency();
	return formatPrice(table.prices[id][currency], currency);
}
