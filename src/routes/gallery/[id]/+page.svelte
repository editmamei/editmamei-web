<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import GalleryReplay from '$lib/components/GalleryReplay.svelte';
	import { formatDate } from '$lib/gallery/feed.js';
	import { CONNECT_URL } from '$lib/links';

	let { data } = $props();
	const entry = $derived(data.entry);
	const ratio = $derived(entry.width / entry.height);
	const stepWord = $derived(entry.steps.length === 1 ? 'step' : 'steps');
</script>

<Seo
	path={`/gallery/${entry.id}`}
	title={`${entry.title}: a real photo edit · Editmamei`}
	description={`${entry.title}, by ${entry.by}. See the before and after${
		entry.steps.length > 0 ? ` and the ${entry.steps.length} ${stepWord} it took` : ''
	}, made in conversation with Claude.`}
/>

<div class="mx-auto max-w-6xl px-4 py-8 md:py-12">
	<a href="/gallery" class="text-sm text-neutral-500 hover:text-neutral-800">&larr; Gallery</a>

	<div class="mt-4 mb-5 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
		<h1 class="text-3xl font-extrabold tracking-tight text-balance text-neutral-900 md:text-5xl">
			{entry.title}
		</h1>
		<p class="text-sm text-neutral-600">
			<span class="font-semibold text-neutral-900">
				{#if entry.link}
					<a href={entry.link} rel="ugc nofollow noopener" class="underline hover:no-underline"
						>{entry.by}</a
					>
				{:else}
					{entry.by}
				{/if}
			</span>
			<span aria-hidden="true"> · </span>
			<time datetime={entry.date}>{formatDate(entry.date)}</time>
			{#if entry.credit}
				<span aria-hidden="true"> · </span>{entry.credit}
			{/if}
		</p>
	</div>

	{#if entry.before === null}
		<div class="mx-auto w-full" style="max-width: min(100%, calc(74vh * {ratio}))">
			<img
				src={entry.after}
				alt={entry.title}
				width={entry.width}
				height={entry.height}
				class="block h-auto w-full rounded-xl"
			/>
		</div>
	{:else if entry.aligned}
		<div class="mx-auto w-full" style="max-width: min(100%, calc(74vh * {ratio}))">
			<BeforeAfterSlider
				beforeSrc={entry.before}
				afterSrc={entry.after}
				beforeAlt="Before"
				afterAlt={entry.title}
			/>
		</div>
		<p class="mt-2 text-center text-sm text-neutral-500">Drag to compare</p>
	{:else}
		<!-- The edit changed the photo's shape, so the two sit side by side. -->
		<div class="grid gap-3.5 sm:grid-cols-2">
			{#each [{ src: entry.before, name: 'Before', alt: 'Before' }, { src: entry.after, name: 'After', alt: entry.title }] as p (p.name)}
				<figure
					class="relative m-0 grid h-[min(70vh,620px)] place-items-center overflow-hidden rounded-xl border border-neutral-200 bg-cream max-sm:h-auto"
				>
					<img
						src={p.src}
						alt={p.alt}
						class="block max-h-full w-auto max-w-full object-contain max-sm:h-auto max-sm:w-full"
					/>
					<figcaption
						class="absolute top-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-semibold tracking-wide text-white"
					>
						{p.name}
					</figcaption>
				</figure>
			{/each}
		</div>
	{/if}

	<div
		class="mt-11 mb-8 grid items-start gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-11"
	>
		<section>
			<h2 class="mb-3 text-xl font-bold tracking-tight text-neutral-900">How it was made</h2>
			{#if entry.steps.length > 0}
				<ol class="m-0 list-none border-t border-neutral-200 p-0">
					{#each entry.steps as step, i (i)}
						<li
							class="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-neutral-200 py-3.5"
						>
							<span class="text-sm leading-6 font-bold text-neutral-500 tabular-nums">{i + 1}</span>
							<div>
								<p class="font-semibold text-neutral-900">{step.title}</p>
								{#if step.detail}
									<p class="text-[15px] text-neutral-600">{step.detail}</p>
								{/if}
							</div>
						</li>
					{/each}
				</ol>
				<p class="mt-3 text-sm text-neutral-600">
					{entry.steps.length}
					{stepWord} in one conversation with Claude.
				</p>
			{:else}
				<p class="text-neutral-600">The steps for this edit weren't shared.</p>
			{/if}
		</section>

		<aside class="grid gap-7">
			{#if entry.before !== null}
				{#key entry.id}
					<GalleryReplay {entry} />
				{/key}
			{:else}
				<a
					href={CONNECT_URL}
					class="inline-flex w-fit items-center rounded-full bg-accent px-5 py-3 text-sm font-semibold text-brand-deep transition-colors hover:brightness-95"
				>
					Try this on your photo
				</a>
			{/if}
		</aside>
	</div>

	<section class="border-t border-neutral-200 pt-8 pb-6">
		<h2 class="mb-4 text-xl font-bold tracking-tight text-neutral-900">More from the gallery</h2>
		<ul class="m-0 grid list-none grid-cols-2 gap-3.5 p-0 sm:grid-cols-3">
			{#each data.more as m, i (m.id)}
				<li class={i === 2 ? 'max-sm:hidden' : undefined}>
					<a
						href="/gallery/{m.id}"
						class="block overflow-hidden rounded-xl border border-neutral-200 bg-white hover:border-neutral-300"
					>
						<img
							src={m.after}
							alt=""
							loading="lazy"
							class="block aspect-[4/3] w-full object-cover"
						/>
						<span class="block px-3 py-2.5 text-[15px] font-semibold text-neutral-900"
							>{m.title}</span
						>
					</a>
				</li>
			{/each}
		</ul>
		{#if data.more.length === 0}
			<p class="text-neutral-600">This is the only edit so far.</p>
		{/if}
	</section>
</div>
