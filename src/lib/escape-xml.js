/**
 * Escape a string for use in XML text or attribute content (RSS, sitemap).
 * Plain JS (not TS) so the node:test suite can unit-test it directly
 * without a transpile step. `&` must be replaced first.
 *
 * @param {string} value
 * @returns {string}
 */
export function escapeXml(value) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}
