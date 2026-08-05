import type { Component } from 'svelte';

/**
 * Blog post loader.
 *
 * Layout (the folder IS the publish state — there is no `draft` frontmatter):
 *   src/lib/content/posts/*.md         published posts (public)
 *   src/lib/content/posts/drafts/*.md  drafts — visible in `npm run dev` ONLY
 *
 * Files starting with `_` (e.g. _TEMPLATE.md) are excluded by the glob
 * pattern itself. Publishing a draft = moving the file up one level.
 *
 * Why the split matters: an eager glob compiles every matched file into the
 * client bundle, so a frontmatter-based draft flag would ship unpublished
 * text to production anyway. Drafts therefore live in a folder the
 * production globs never match — the draft glob below sits behind an
 * import.meta.env.DEV conditional that is dead-code-eliminated from
 * production builds, so no draft chunk is ever emitted.
 * tests/blog-build-artifacts.test.mjs verifies that against build output.
 *
 * Frontmatter contract (validated here at build time — a bad post fails
 * `npm run build`): `title`, `description`, `date` (YYYY-MM-DD) required;
 * `updated` (YYYY-MM-DD) optional. Filenames are the URL slug and must be
 * lowercase ASCII kebab-case.
 */

export interface PostSummary {
	slug: string;
	title: string;
	description: string;
	date: string;
	updated?: string;
	/** True only for posts under drafts/ — which exist only in dev. */
	draft: boolean;
}

interface PostModule {
	default: Component;
	metadata?: Record<string, unknown>;
}

type LazyModules = Record<string, () => Promise<PostModule>>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// Published posts: frontmatter eagerly (index/sitemap need it at
// build time), components lazily (each post becomes its own chunk, loaded
// only on its own page).
const publishedMeta = import.meta.glob('/src/lib/content/posts/[!_]*.md', {
	eager: true,
	import: 'metadata'
}) as Record<string, Record<string, unknown>>;

const publishedComponents = import.meta.glob('/src/lib/content/posts/[!_]*.md') as LazyModules;

// Drafts: dev-server only. In production this ternary is statically false,
// the glob is eliminated with the dead branch, and no chunks are emitted.
const draftModules: LazyModules = import.meta.env.DEV
	? (import.meta.glob('/src/lib/content/posts/drafts/[!_]*.md') as LazyModules)
	: {};

function requireString(path: string, meta: Record<string, unknown>, key: string): string {
	const value = meta[key];
	if (typeof value !== 'string' || value.trim() === '') {
		throw new Error(`Blog post ${path}: frontmatter "${key}" must be a non-empty string`);
	}
	return value;
}

/**
 * Frontmatter date fields arrive in whatever shape the YAML layer chose:
 * a plain YYYY-MM-DD string, a Date object, or (mdsvex today) a Date that
 * was re-serialized into the module as an ISO datetime string like
 * "2026-08-05T00:00:00.000Z". Accept all three; always return YYYY-MM-DD.
 */
function requireDate(path: string, meta: Record<string, unknown>, key: string): string {
	const value = meta[key];
	if (value instanceof Date && !Number.isNaN(value.getTime())) {
		return value.toISOString().slice(0, 10);
	}
	if (typeof value === 'string' && DATE_RE.test(value)) return value;
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/.test(value)) {
		return value.slice(0, 10);
	}
	throw new Error(`Blog post ${path}: frontmatter "${key}" must be YYYY-MM-DD`);
}

function slugOf(path: string): string {
	const slug = path.split('/').pop()!.replace(/\.md$/, '');
	if (!SLUG_RE.test(slug)) {
		throw new Error(
			`Blog post ${path}: filename must be lowercase ASCII kebab-case (it becomes the URL)`
		);
	}
	return slug;
}

function toSummary(path: string, meta: Record<string, unknown>, draft: boolean): PostSummary {
	return {
		slug: slugOf(path),
		title: requireString(path, meta, 'title'),
		description: requireString(path, meta, 'description'),
		date: requireDate(path, meta, 'date'),
		updated: meta.updated === undefined ? undefined : requireDate(path, meta, 'updated'),
		draft
	};
}

function byDateDesc(a: PostSummary, b: PostSummary): number {
	return a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1;
}

/** Published posts, newest first. This is all production surfaces see. */
export const posts: PostSummary[] = Object.entries(publishedMeta)
	.map(([path, meta]) => toSummary(path, meta, false))
	.sort(byDateDesc);

/** Published posts + drafts (dev server only; equals `posts` in builds). */
export async function allSummaries(): Promise<PostSummary[]> {
	const drafts = await Promise.all(
		Object.entries(draftModules).map(async ([path, load]) => {
			const mod = await load();
			return toSummary(path, mod.metadata ?? {}, true);
		})
	);
	return [...posts, ...drafts].sort(byDateDesc);
}

/** Resolve one post (published first, then dev-only drafts) or null. */
export async function loadPost(
	slug: string
): Promise<{ summary: PostSummary; content: Component } | null> {
	for (const [modules, draft] of [
		[publishedComponents, false],
		[draftModules, true]
	] as const) {
		const entry = Object.entries(modules).find(([path]) => slugOf(path) === slug);
		if (entry) {
			const mod = await entry[1]();
			return { summary: toSummary(entry[0], mod.metadata ?? {}, draft), content: mod.default };
		}
	}
	return null;
}

/** "2026-08-05" rendered for humans, pinned to UTC so the date never shifts. */
export function formatDate(iso: string): string {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		timeZone: 'UTC'
	});
}
