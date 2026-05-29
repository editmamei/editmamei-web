<script lang="ts">
	import { pillars } from '$lib/content/landing';
</script>

<section class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">What it is</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Photoshop, but the AI does the menus.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Editmamei exposes around 80 Photoshop operations as MCP tools — each with structured input,
				structured output, and context awareness. Your AI calls them as building blocks in service
				of what you actually want done.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			{#each pillars as pillar, i (i)}
				<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
					<p
						class="mb-3 inline-flex size-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white"
					>
						{i + 1}
					</p>
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{pillar.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{pillar.body}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
