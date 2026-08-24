// Rendered in the browser, not prerendered into HTML. The whole page is a
// function of the token in the query string, which does not exist at build
// time — reading `url.searchParams` during prerender is an error, and rightly
// so, since there is no single correct page to bake.
export const ssr = false;
