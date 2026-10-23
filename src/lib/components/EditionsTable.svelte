<script lang="ts">
	import { onMount } from 'svelte';
	import { editionGroups } from '$lib/content/editions';
	import { trackOnce } from '$lib/analytics/clarity';

	// Scroll-depth engagement: made it to the feature-comparison section.
	// Strong "evaluating purchase" signal vs visitors who bounced earlier.
	let sectionEl: HTMLElement;
	onMount(() => {
		if (typeof IntersectionObserver === 'undefined' || !sectionEl) return;
		const obs = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					trackOnce('scroll-editions-reached');
					obs.disconnect();
				}
			},
			{ threshold: 0.3 }
		);
		obs.observe(sectionEl);
		return () => obs.disconnect();
	});
</script>

<section
	bind:this={sectionEl}
	id="editions"
	class="scroll-mt-20 bg-sage px-4 py-20 md:py-24"
	aria-labelledby="editions-title"
>
	<div class="mx-auto max-w-5xl">
		<div class="mb-10 max-w-[42rem]">
			<p class="lp-eyebrow text-terracotta-ink">Editions</p>
			<h2 id="editions-title" class="lp-h2 mt-4 text-brand">
				Community edits any photo. Pro is for raw files and whole shoots.
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-neutral-700">
				Pro is a license, not a second install: activate it and Editmamei loads the Pro tools next
				to Community after a restart. Pro's features are for Photoshop, so <a
					href="/desktop#gimp"
					class="font-semibold text-brand underline underline-offset-2">GIMP support</a
				> is the same in both editions.
			</p>
		</div>

		<div class="overflow-hidden rounded-[22px] bg-white ring-1 ring-brand/10">
			<table class="w-full text-left text-[15px]">
				<thead>
					<tr class="border-b border-neutral-200 bg-neutral-50">
						<th
							scope="col"
							class="px-3 py-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase md:px-5"
						>
							Feature
						</th>
						<th
							scope="col"
							class="w-20 px-1 py-3 text-center text-xs font-semibold tracking-normal text-neutral-500 uppercase md:w-32 md:px-5 md:tracking-wider"
						>
							Community
						</th>
						<th
							scope="col"
							class="w-20 px-1 py-3 text-center text-xs font-semibold tracking-normal text-neutral-500 uppercase md:w-32 md:px-5 md:tracking-wider"
						>
							Pro
						</th>
					</tr>
				</thead>
				{#each editionGroups as group (group.title)}
					<tbody>
						<tr class="border-b border-neutral-200 bg-cream/60">
							<th
								scope="rowgroup"
								colspan="3"
								class="px-3 pt-5 pb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase md:px-5"
							>
								{group.title}
							</th>
						</tr>
						{#each group.rows as row (row.feature)}
							<tr class="border-b border-neutral-100 last:border-b-0">
								<th scope="row" class="px-3 py-3 align-top font-normal md:px-5">
									<span class="block font-medium text-neutral-900">{row.feature}</span>
									{#if row.detail}
										<span class="mt-0.5 block text-xs leading-snug text-neutral-600"
											>{row.detail}</span
										>
									{/if}
								</th>
								<td class="px-1 py-3 text-center align-top md:px-5">
									{#if row.community}
										<span aria-hidden="true" class="text-emerald-600">✓</span>
										<span class="sr-only">Included in Community</span>
									{:else}
										<span aria-hidden="true" class="text-neutral-400">–</span>
										<span class="sr-only">Not in Community</span>
									{/if}
								</td>
								<td class="px-1 py-3 text-center align-top md:px-5">
									{#if row.pro}
										<span aria-hidden="true" class="text-emerald-600">✓</span>
										<span class="sr-only">Included in Pro</span>
									{:else}
										<span aria-hidden="true" class="text-neutral-400">–</span>
										<span class="sr-only">Not in Pro</span>
									{/if}
								</td>
							</tr>
						{/each}
					</tbody>
				{/each}
			</table>
		</div>
		<p class="mt-6 text-[15px]">
			<a href="/desktop/tools" class="font-semibold text-brand underline underline-offset-2">
				See every tool and the edition it is in <span aria-hidden="true">→</span>
			</a>
		</p>
	</div>
</section>
