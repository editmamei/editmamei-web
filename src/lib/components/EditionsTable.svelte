<script lang="ts">
	import { onMount } from 'svelte';
	import { editionGroups } from '$lib/content/landing';
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

<section bind:this={sectionEl} id="editions" class="bg-sage py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Editions
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Community covers the everyday editing surface. Pro adds the production toolkit.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Community installs free. Pro is a license: when you activate it, Editmamei downloads the
				signed Pro module and loads it next to Community after a restart, with nothing to reinstall.
			</p>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Pro's features are for Photoshop, so GIMP support is the same in both editions.
			</p>
		</div>

		<div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
			<table class="w-full text-left text-sm">
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
	</div>
</section>
