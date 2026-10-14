import { error } from '@sveltejs/kit';
import { loadGallery } from '$lib/server/gallery';
import type { EntryGenerator, PageServerLoad } from './$types';

export const entries: EntryGenerator = async () => (await loadGallery()).map(({ id }) => ({ id }));

export const load: PageServerLoad = async ({ params }) => {
	const all = await loadGallery();
	const entry = all.find((e) => e.id === params.id);
	if (!entry) error(404, `No such gallery entry: ${params.id}`);
	// The next three after this one, wrapping, so every entry links onward.
	const at = all.indexOf(entry);
	const more = all
		.map((_, k) => all[(at + 1 + k) % all.length])
		.filter((e) => e.id !== entry.id)
		.slice(0, 3)
		.map((e) => ({ id: e.id, title: e.title, after: e.after }));
	return { entry, more };
};
