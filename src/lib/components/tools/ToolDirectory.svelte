<script lang="ts">
	// The /tools directory body: filters, results and empty states.
	//
	// The prerendered HTML holds every tool, unfiltered. Filters live in the
	// query string (?editor=&edition=&category=&q=), which is read only in the
	// browser after mount, because reading it during prerender throws. Changes
	// are written back with replaceState, so filtering adds no history entries.
	import { onMount, tick } from 'svelte';
	import { replaceState } from '$app/navigation';
	import { page } from '$app/state';
	import { trackOnce } from '$lib/analytics/clarity';
	import { categories, tools, type CategoryId, type Tool } from '$lib/content/tools';
	import ToolRow from './ToolRow.svelte';

	type EditorFilter = 'all' | 'photoshop' | 'gimp';
	type EditionFilter = 'all' | 'community' | 'pro';
	type CategoryFilter = 'all' | CategoryId;
	type Facet = 'editor' | 'edition' | 'category';

	interface Filters {
		editor: EditorFilter;
		edition: EditionFilter;
		category: CategoryFilter;
		q: string;
	}

	const EDITOR_OPTIONS: { value: EditorFilter; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'photoshop', label: 'Photoshop' },
		{ value: 'gimp', label: 'GIMP (beta)' }
	];
	const EDITION_OPTIONS: { value: EditionFilter; label: string }[] = [
		{ value: 'all', label: 'All' },
		{ value: 'community', label: 'Community' },
		{ value: 'pro', label: 'Pro' }
	];
	const CATEGORY_IDS = new Set<string>(categories.map((c) => c.id));

	let editor = $state<EditorFilter>('all');
	let edition = $state<EditionFilter>('all');
	let category = $state<CategoryFilter>('all');
	let q = $state('');
	let ready = $state(false);

	const filters: Filters = $derived({ editor, edition, category, q });

	/** Lowercased text each tool is searched against. */
	const haystack = new Map(
		tools.map((t) => [
			t.id,
			[t.task, t.summary, t.id, t.id.replaceAll('_', ' '), ...t.keywords].join(' ').toLowerCase()
		])
	);

	function matches(t: Tool, f: Filters, ignore?: Facet): boolean {
		if (ignore !== 'editor' && f.editor !== 'all' && t.editor !== f.editor) return false;
		if (ignore !== 'edition' && f.edition !== 'all' && t.edition !== f.edition) return false;
		if (ignore !== 'category' && f.category !== 'all' && t.category !== f.category) return false;
		const terms = f.q.toLowerCase().split(/\s+/).filter(Boolean);
		if (terms.length === 0) return true;
		const text = haystack.get(t.id) ?? '';
		return terms.every((term) => text.includes(term));
	}

	function countFor(facet: Facet, value: string): number {
		return tools.filter(
			(t) => matches(t, filters, facet) && (value === 'all' || t[facet] === value)
		).length;
	}

	const visible = $derived(tools.filter((t) => matches(t, filters)));
	const sections = $derived(
		categories
			.map((c) => ({ ...c, rows: visible.filter((t) => t.category === c.id) }))
			.filter((s) => s.rows.length > 0)
	);
	const gimpPro = $derived(editor === 'gimp' && edition === 'pro');
	const anyFilter = $derived(
		editor !== 'all' || edition !== 'all' || category !== 'all' || q.trim() !== ''
	);

	function clearFilters() {
		editor = 'all';
		edition = 'all';
		category = 'all';
		q = '';
	}

	function readQuery(params: URLSearchParams) {
		const e = params.get('editor');
		if (e === 'photoshop' || e === 'gimp') editor = e;
		const ed = params.get('edition');
		if (ed === 'community' || ed === 'pro') edition = ed;
		const c = params.get('category');
		if (c && CATEGORY_IDS.has(c)) category = c as CategoryId;
		q = (params.get('q') ?? '').slice(0, 100);
	}

	onMount(async () => {
		readQuery(new URLSearchParams(window.location.search));
		let hashId = '';
		try {
			hashId = decodeURIComponent(window.location.hash.slice(1));
		} catch {
			// A malformed hash names no tool; the filters still load and mirror to the URL.
		}
		const target = tools.find((t) => t.id === hashId);
		if (target && !matches(target, filters)) clearFilters();
		ready = true;
		if (target) {
			await tick();
			document.getElementById(target.id)?.scrollIntoView();
		}
	});

	// Mirror the filters into the URL once the initial query has been read.
	$effect(() => {
		if (!ready) return;
		const search = new URLSearchParams(
			[
				['editor', editor === 'all' ? '' : editor],
				['edition', edition === 'all' ? '' : edition],
				['category', category === 'all' ? '' : category],
				['q', q.trim()]
			].filter(([, v]) => v !== '')
		).toString();
		const next = `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`;
		if (next !== `${window.location.pathname}${window.location.search}${window.location.hash}`) {
			replaceState(next, page.state);
		}
	});

	function onFacetChange() {
		trackOnce('tools-filter-changed');
	}

	function onSearchInput() {
		if (q.trim() !== '') trackOnce('tools-search-used');
	}

	const segment =
		'cursor-pointer rounded-full border px-3 py-1 text-sm transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand';
</script>

<div class="mx-auto max-w-6xl px-4 pb-16">
	<div class="space-y-4">
		<div>
			<label for="tool-search" class="mb-1 block text-sm font-medium text-neutral-800">
				Search tasks or tool names
			</label>
			<input
				id="tool-search"
				type="search"
				bind:value={q}
				oninput={onSearchInput}
				maxlength="100"
				autocomplete="off"
				placeholder="sky, crop, curves, ps_select_subject"
				class="w-full max-w-xl rounded-lg border border-neutral-300 px-3 py-2 text-base focus:border-brand focus:outline-2 focus:outline-brand/30"
			/>
		</div>
		<div class="flex flex-col gap-3 md:flex-row md:flex-wrap md:gap-8">
			<fieldset>
				<legend class="mb-1.5 text-sm font-medium text-neutral-800">Editor</legend>
				<div class="flex flex-wrap gap-1.5">
					{#each EDITOR_OPTIONS as opt (opt.value)}
						<label
							class="{segment} {editor === opt.value
								? ''
								: 'border-neutral-300 text-neutral-700 hover:border-neutral-500'}"
						>
							<input
								type="radio"
								name="editor"
								value={opt.value}
								bind:group={editor}
								onchange={onFacetChange}
								class="sr-only"
							/>
							{opt.label}
							<span class="ml-0.5 tabular-nums opacity-70">{countFor('editor', opt.value)}</span>
						</label>
					{/each}
				</div>
			</fieldset>
			<fieldset>
				<legend class="mb-1.5 text-sm font-medium text-neutral-800">Edition</legend>
				<div class="flex flex-wrap gap-1.5">
					{#each EDITION_OPTIONS as opt (opt.value)}
						<label
							class="{segment} {edition === opt.value
								? ''
								: 'border-neutral-300 text-neutral-700 hover:border-neutral-500'}"
						>
							<input
								type="radio"
								name="edition"
								value={opt.value}
								bind:group={edition}
								onchange={onFacetChange}
								class="sr-only"
							/>
							{opt.label}
							<span class="ml-0.5 tabular-nums opacity-70">{countFor('edition', opt.value)}</span>
						</label>
					{/each}
				</div>
			</fieldset>
		</div>
	</div>

	<div class="mt-8 grid gap-8 md:grid-cols-[13rem_1fr]">
		<fieldset class="md:sticky md:top-20 md:self-start">
			<legend class="mb-1.5 text-sm font-medium text-neutral-800">Category</legend>
			<div class="flex flex-wrap gap-1.5 md:flex-col md:gap-0.5">
				{#each [{ id: 'all', label: 'All' }, ...categories] as c (c.id)}
					{@const n = countFor('category', c.id)}
					<label
						class="flex cursor-pointer items-center justify-between gap-2 rounded-full border px-3 py-1 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand md:rounded-md md:border-transparent {category ===
						c.id
							? 'border-brand bg-brand text-white'
							: 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'} {n === 0 &&
						category !== c.id
							? 'opacity-50'
							: ''}"
					>
						<input
							type="radio"
							name="category"
							value={c.id}
							bind:group={category}
							onchange={onFacetChange}
							class="sr-only"
						/>
						<span>{c.label}</span>
						<span class="tabular-nums opacity-70">{n}</span>
					</label>
				{/each}
			</div>
		</fieldset>

		<div class="min-w-0">
			<p class="text-sm text-neutral-600">
				<span aria-live="polite"
					>Showing {gimpPro ? 0 : visible.length} of {tools.length} tools</span
				>
				{#if anyFilter}
					<button
						type="button"
						onclick={clearFilters}
						class="ml-2 text-brand underline underline-offset-2 hover:no-underline"
					>
						Clear filters
					</button>
				{/if}
			</p>

			{#if gimpPro}
				<div class="mt-6 rounded-xl border border-neutral-200 bg-paper px-5 py-4 text-neutral-800">
					<p class="font-medium">Pro is for Photoshop only, so it adds no GIMP tools.</p>
					<p class="mt-1 text-sm text-neutral-700">Every GIMP tool is in the Community edition.</p>
				</div>
			{:else}
				{#if edition === 'pro'}
					<p
						class="mt-4 rounded-xl border border-neutral-200 bg-paper px-5 py-3 text-sm text-neutral-700"
					>
						Pro tools unlock with a license, and Pro is for Photoshop only.
						<a href="/pricing" class="text-brand underline underline-offset-2 hover:no-underline"
							>See pricing</a
						>
					</p>
				{/if}

				{#if sections.length === 0}
					<div
						class="mt-6 rounded-xl border border-neutral-200 bg-paper px-5 py-4 text-neutral-800"
					>
						<p class="font-medium">No tool matches that.</p>
						<p class="mt-1 text-sm text-neutral-700">
							Try a plainer word, like sky, crop or curves.
						</p>
					</div>
				{/if}

				{#each sections as s (s.id)}
					<section aria-labelledby="cat-{s.id}" class="mt-8 first-of-type:mt-6">
						<h2
							id="cat-{s.id}"
							class="scroll-mt-20 text-lg font-bold tracking-tight text-neutral-950"
						>
							{s.label}
							<span class="font-normal text-neutral-500 tabular-nums">({s.rows.length})</span>
						</h2>
						<p class="mt-1 text-sm text-neutral-600">{s.blurb}</p>
						<ul class="mt-3">
							{#each s.rows as tool (tool.id)}
								<ToolRow {tool} showEditor={editor === 'all'} />
							{/each}
						</ul>
					</section>
				{/each}
			{/if}
		</div>
	</div>
</div>
