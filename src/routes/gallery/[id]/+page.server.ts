import { error } from '@sveltejs/kit';
import { loadShare, loadWall } from '$lib/server/connect';
import type { PageServerLoad } from './$types';

// A share's one public page. Rendered on request (the Worker) from Connect's data for it, so a share works the
// moment its maker confirms it (unlisted until approved), and an edited, hidden or deleted one changes at once.
export const prerender = false;

export const load: PageServerLoad = async ({ params, platform, setHeaders }) => {
	let share;
	try {
		share = await loadShare(params.id, platform);
	} catch {
		error(503, 'The gallery cannot be reached just now. Try again in a minute.');
	}
	if (!share) error(404, 'There is no shared edit at this address.');
	setHeaders({ 'cache-control': 'public, max-age=60' });
	if (!share.listed) setHeaders({ 'x-robots-tag': 'noindex' });
	// Three from the wall to go on to (never this one).
	const more = (await loadWall(platform))
		.filter((e) => e.id !== share.id)
		.slice(0, 3)
		.map((e) => ({ id: e.id, title: e.title, after: e.after }));
	return { share, more };
};
