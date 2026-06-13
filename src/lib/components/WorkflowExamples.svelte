<script lang="ts">
	import { workflowExamples } from '$lib/content/landing';
</script>

<section class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				What you say to it
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Three prompts that work today.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				The AI reasons about intent. Editmamei handles the choreography.
			</p>
		</div>

		<ol class="space-y-6">
			{#each workflowExamples as ex, i (i)}
				<li
					class="grid gap-5 rounded-xl border border-neutral-200 bg-neutral-50/50 p-5 md:grid-cols-[1fr_1fr] md:items-start md:gap-7 md:p-7"
				>
					<div>
						<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
							Example {i + 1} · {ex.title}
						</p>
						<blockquote
							class="rounded-lg border border-neutral-200 bg-white p-4 text-sm leading-relaxed text-neutral-800 italic shadow-sm"
						>
							"{ex.prompt}"
						</blockquote>
					</div>
					<div>
						<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
							What happens
						</p>
						<p class="text-sm leading-relaxed text-neutral-700">{ex.outcome}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>
