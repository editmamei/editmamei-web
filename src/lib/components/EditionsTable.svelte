<script lang="ts">
	import { editionRows } from '$lib/content/landing';
</script>

<section id="editions" class="bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Editions</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Community is free. Pro adds the workflow surface.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Both editions ship from the same npm package. A Pro license unlocks the Pro tool surface on
				the next MCP-client restart.
			</p>
		</div>

		<div class="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
			<table class="w-full text-left text-sm">
				<thead>
					<tr class="border-b border-neutral-200 bg-neutral-50">
						<th scope="col" class="px-5 py-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
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
									<span aria-hidden="true" class="text-neutral-300">·</span>
									<span class="sr-only">Not in Community</span>
								{/if}
							</td>
							<td class="px-5 py-3 text-center">
								{#if row.pro}
									<span aria-label="Included in Pro" class="text-emerald-600">✓</span>
								{:else}
									<span aria-hidden="true" class="text-neutral-300">·</span>
									<span class="sr-only">Not in Pro</span>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<p class="mt-6 text-sm text-neutral-600">
			Detailed comparison and pricing at <a
				href="/pricing"
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700">editmamei.com/pricing</a
			>.
		</p>
	</div>
</section>
