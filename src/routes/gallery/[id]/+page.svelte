<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { CONNECT_ID, ORG_ID, ORIGIN } from '$lib/seo/schema';
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import GalleryPlayer from '$lib/components/GalleryPlayer.svelte';
	import { formatDate } from '$lib/gallery/feed.js';
	import { CONNECT_URL } from '$lib/links';
	import { CONNECT_ORIGIN } from '$lib/gallery/connect-origin';

	let { data } = $props();
	const share = $derived(data.share);
	const ratio = $derived(share.width / share.height);
	const day = $derived(share.date.slice(0, 10));
	// Credits from Connect link an Instagram profile; it reads as the handle.
	const handle = $derived(
		share.link
			? (/^https:\/\/www\.instagram\.com\/([A-Za-z0-9._]{1,30})\/$/.exec(share.link)?.[1] ?? null)
			: null
	);
	const steps = $derived(share.steps.length);
	const stepWord = $derived(steps === 1 ? 'step' : 'steps');
	const callWord = (n: number) => `${n} tool call${n === 1 ? '' : 's'}`;
	const lead = $derived(share.chapters[0]?.text || share.chapters[0]?.title || '');

	// Search snippet: the first step's story as a sentence, then the count,
	// cut on a word boundary to fit a results page.
	function clip(text: string, max = 155): string {
		if (text.length <= max) return text;
		const cut = text.slice(0, max - 1);
		return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:.]+$/, '')}…`;
	}
	const sentence = (text: string) => {
		const t = text.trim().replace(/[\s,;:]+$/, '');
		return /[.!?…]$/.test(t) ? t : `${t}.`;
	};
	const description = $derived(
		clip(
			`${lead ? `${sentence(lead)} ` : ''}${
				steps > 0
					? `Edited in ${steps} ${stepWord} with Editmamei Connect.`
					: 'Edited with Editmamei Connect.'
			}`
		)
	);
	const title = $derived(
		`${share.title}: before and after · Editmamei`.length <= 60
			? `${share.title}: before and after · Editmamei`
			: `${share.title} · Editmamei`
	);
	const schema = $derived([
		{
			'@type': 'ImageObject',
			name: share.title,
			description: lead || share.title,
			contentUrl: share.after,
			url: `${ORIGIN}/gallery/${share.id}`,
			...(day !== '1970-01-01' ? { datePublished: day } : {}),
			creator: { '@type': 'Person', name: share.by, ...(share.link ? { url: share.link } : {}) },
			...(share.before ? { isBasedOn: { '@type': 'ImageObject', contentUrl: share.before } } : {}),
			isPartOf: { '@type': 'CollectionPage', url: `${ORIGIN}/gallery` },
			publisher: { '@id': ORG_ID },
			about: { '@id': CONNECT_ID }
		}
	]);
</script>

<Seo
	path={`/gallery/${share.id}`}
	{title}
	{description}
	image={share.after}
	imageAlt={`${share.title}, after the edit`}
	noindex={!share.listed}
	schema={share.listed ? schema : undefined}
/>

<PageHero
	crumbs={[{ label: 'Gallery', href: '/gallery' }, { label: share.title }]}
	eyebrow="Edited with Editmamei Connect"
	title={share.title}
>
	<p class="text-[15px] text-[#c3d2cb]">
		{#if handle}
			<span class="font-semibold text-[#f4f1e8]">{share.by}</span>
			<span aria-hidden="true"> · </span>
			<a href={share.link} rel="ugc nofollow noopener" class="underline hover:no-underline"
				>@{handle}</a
			>
		{:else if share.link}
			<a
				href={share.link}
				rel="ugc nofollow noopener"
				class="font-semibold text-[#f4f1e8] underline hover:no-underline">{share.by}</a
			>
		{:else}
			<span class="font-semibold text-[#f4f1e8]">{share.by}</span>
		{/if}
		{#if day !== '1970-01-01'}
			<span aria-hidden="true"> · </span>
			<time datetime={day}>{formatDate(day)}</time>
		{/if}
	</p>
</PageHero>

<div class="mx-auto max-w-6xl px-4 py-10 md:py-14">
	{#if share.before === null}
		<div class="mx-auto w-full" style="max-width: min(100%, calc(74vh * {ratio}))">
			<img
				src={share.after}
				alt={share.title}
				width={share.width}
				height={share.height}
				class="block h-auto w-full rounded-xl"
			/>
		</div>
	{:else if share.aligned}
		<div class="mx-auto w-full" style="max-width: min(100%, calc(74vh * {ratio}))">
			<BeforeAfterSlider
				beforeSrc={share.before}
				afterSrc={share.after}
				beforeAlt={`${share.title}, before the edit`}
				afterAlt={`${share.title}, after the edit`}
			/>
		</div>
		<p class="mt-2 text-center text-sm text-neutral-500">Drag to compare</p>
	{:else}
		<!-- The edit changed the photo's shape, so the two sit side by side. -->
		<div class="grid gap-3.5 sm:grid-cols-2">
			{#each [{ src: share.before, name: 'Before', alt: `${share.title}, before the edit` }, { src: share.after, name: 'After', alt: `${share.title}, after the edit` }] as p (p.name)}
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
		class="mt-11 mb-8 grid items-start gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] md:gap-12"
	>
		<section>
			<h2 class="mb-4 text-xl font-bold tracking-tight text-neutral-900">How it was made</h2>
			{#if share.chapters.length > 0}
				<ol class="m-0 grid list-none gap-6 p-0">
					{#each share.chapters as chapter, i (i)}
						{@const calls = share.steps.slice(chapter.from, chapter.to + 1)}
						<li class="grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3">
							<span
								class="grid h-8 w-8 place-items-center rounded-full bg-brand-deep text-sm font-bold text-accent tabular-nums"
								>{i + 1}</span
							>
							<div>
								<p class="text-lg font-bold tracking-tight text-neutral-900">{chapter.title}</p>
								{#if chapter.text}
									<p class="mt-1 text-neutral-700">{chapter.text}</p>
								{/if}
								<details class="group mt-2">
									<summary
										class="cursor-pointer text-sm font-semibold text-neutral-500 hover:text-neutral-800"
									>
										{callWord(calls.length)}
									</summary>
									<ol class="mt-2 grid list-none gap-2 border-l-2 border-neutral-200 p-0 pl-4">
										{#each calls as step, k (k)}
											<li>
												<p class="text-[15px] font-semibold text-neutral-800">
													{step.title}{#if step.detail}<span class="font-normal text-neutral-600">
															· {step.detail}</span
														>{/if}
												</p>
												{#if step.call}
													<code
														class="mt-0.5 block text-[13px] break-words whitespace-normal text-neutral-500"
														>{step.call}</code
													>
												{/if}
											</li>
										{/each}
									</ol>
								</details>
							</div>
						</li>
					{/each}
				</ol>
			{:else if steps > 0}
				<ol class="m-0 list-none border-t border-neutral-200 p-0">
					{#each share.steps as step, i (i)}
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
			{:else}
				<p class="text-neutral-600">The steps for this edit weren't shared.</p>
			{/if}
			{#if steps > 0}
				<p class="mt-5 text-sm text-neutral-600">
					{steps}
					{stepWord} in one conversation, with
					<a href="/connect" class="font-semibold text-brand underline underline-offset-2"
						>Editmamei Connect</a
					>.
				</p>
			{/if}
		</section>

		<aside class="grid gap-6">
			<section>
				<h2 class="mb-3 text-xl font-bold tracking-tight text-neutral-900">Watch the edit</h2>
				{#key share.id}
					<GalleryPlayer {share} />
				{/key}
			</section>
			<a
				href={CONNECT_URL}
				class="inline-flex min-h-12 w-fit items-center rounded-2xl border-[1.5px] border-accent/50 bg-brand px-6 text-[16px] font-bold text-white transition-colors hover:bg-brand-light"
				>Try this on your photo <span aria-hidden="true" class="ml-1.5">→</span></a
			>
		</aside>
	</div>

	{#if data.more.length > 0}
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
		</section>
	{/if}

	<details class="mt-6 text-sm text-neutral-500">
		<summary class="cursor-pointer hover:text-neutral-800">Report this page</summary>
		<form
			method="POST"
			action={`${CONNECT_ORIGIN}/g/${share.id}/report`}
			class="mt-3 grid max-w-md gap-2"
		>
			<label for="reason">What is wrong? (optional, at most 300 characters)</label>
			<textarea
				id="reason"
				name="reason"
				maxlength="300"
				rows="3"
				class="rounded-lg border border-neutral-300 p-2 text-neutral-800"
			></textarea>
			<button
				type="submit"
				class="w-fit rounded-full border border-neutral-300 px-4 py-2 font-semibold text-neutral-800 hover:border-neutral-500"
			>
				Report
			</button>
			<p>A reported page is hidden while we look at it.</p>
		</form>
	</details>
</div>
