<script lang="ts">
	import { changelogEntries, fullChangelogUrl } from '$lib/content/changelog';
	import { track } from '$lib/analytics/clarity';
</script>

<section id="changelog" class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
			<div class="max-w-2xl">
				<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
					Changelog
				</p>
				<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
					What's been landing.
				</h2>
				<p class="mt-3 text-base leading-relaxed text-neutral-700">
					Active work on the way to v1.0. Full history in the public changelog.
				</p>
			</div>
			<a
				href={fullChangelogUrl}
				onclick={() => track('changelog-full-outbound')}
				class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-neutral-700 hover:text-neutral-950"
			>
				Full changelog <span aria-hidden="true">→</span>
			</a>
		</div>

		<ol class="grid gap-4 md:grid-cols-2">
			{#each changelogEntries as entry, i (i)}
				<li class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
					<div class="mb-2 flex items-baseline justify-between gap-3">
						<p class="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">
							{entry.label}
						</p>
						<p class="text-[10px] font-medium tracking-wider text-neutral-500 uppercase">
							{entry.date}
						</p>
					</div>
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{entry.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{entry.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>
