<script lang="ts">
	import { onMount } from 'svelte';
	import { editionRows } from '$lib/content/landing';
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
				Community installs free from npm. Pro is the same <code class="text-[0.85em]"
					>editmamei</code
				> package delivered as its own build with your license — install it over Community, restart your
				AI client, and the Pro tools appear.
			</p>
		</div>

		<div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-neutral-200 bg-neutral-50">
						<th
							scope="col"
							class="px-5 py-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase"
						>
							Feature
						</th>
						<th
							scope="col"
							class="w-32 px-5 py-3 text-center text-xs font-semibold tracking-wider text-neutral-500 uppercase"
						>
							Community
						</th>
						<th
							scope="col"
							class="w-32 px-5 py-3 text-center text-xs font-semibold tracking-wider text-neutral-500 uppercase"
						>
							Pro
						</th>
					</tr>
				</thead>
				<tbody>
					{#each editionRows as row, i (i)}
						<tr class="border-b border-neutral-100 last:border-b-0">
							<td class="px-5 py-3 text-neutral-800">{row.feature}</td>
							<td class="px-5 py-3 text-center">
								{#if row.community}
									<span aria-label="Included in Community" class="text-emerald-600">✓</span>
								{:else}
									<span aria-hidden="true" class="text-neutral-400">—</span>
									<span class="sr-only">Not in Community</span>
								{/if}
							</td>
							<td class="px-5 py-3 text-center">
								{#if row.pro}
									<span aria-label="Included in Pro" class="text-emerald-600">✓</span>
								{:else}
									<span aria-hidden="true" class="text-neutral-400">—</span>
									<span class="sr-only">Not in Pro</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
</section>
