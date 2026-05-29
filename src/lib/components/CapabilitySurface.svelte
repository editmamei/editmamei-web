<script lang="ts">
	import { capabilities } from '$lib/content/landing';
</script>

<section id="capabilities" class="bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
				What it does
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				The full editing surface, exposed as tools.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Eight categories. Specific tools, not abstractions — so the AI plans accurately and you can
				audit what it ran.
			</p>
		</div>

		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each capabilities as cap, i (i)}
				<div class="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
					<h3 class="text-sm font-semibold tracking-tight text-neutral-950">{cap.title}</h3>
					<p class="mt-2 text-xs leading-relaxed text-neutral-600">{cap.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
