import { error } from '@sveltejs/kit';
import { loadPost, posts } from '$lib/blog';
import type { EntryGenerator, PageLoad } from './$types';

// Tells the static adapter every published post URL to prerender. An empty
// list (no posts yet) is valid: the route simply produces no pages. Drafts
// are dev-only and never appear here.
export const entries: EntryGenerator = () => posts.map(({ slug }) => ({ slug }));

export const load: PageLoad = async ({ params }) => {
	const post = await loadPost(params.slug);
	if (!post) error(404, `No such post: ${params.slug}`);
	return { post: post.summary, content: post.content };
};
