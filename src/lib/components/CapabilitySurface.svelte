<script lang="ts">
	import { capabilities } from '$lib/content/landing';
	import CapabilityDemo from './CapabilityDemo.svelte';
</script>

<section id="capabilities" class="bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				What it does
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				The full editing surface, exposed as tools.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Eight categories, each shown as one real Photoshop tool run on the same photo — so the AI
				plans accurately and you can audit what it ran. Hover or tap a result to see the original.
			</p>
		</div>

		<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each capabilities as cap (cap.title)}
				<div
					class="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm"
				>
					<CapabilityDemo demo={cap.demo} title={cap.title} />
					<div class="flex flex-1 flex-col p-5">
						<h3 class="text-sm font-semibold tracking-tight text-neutral-950">{cap.title}</h3>
						<p class="mt-2 text-xs leading-relaxed text-neutral-600">{cap.body}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
