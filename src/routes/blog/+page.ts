import { allSummaries } from '$lib/blog';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => ({ posts: await allSummaries() });
