import { allSummaries } from '#lib/blog.ts';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => ({ posts: await allSummaries() });
