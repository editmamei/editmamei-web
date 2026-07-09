<script lang="ts">
	import { track } from '$lib/analytics/clarity';
</script>

<section class="relative overflow-hidden bg-white">
	<div
		class="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] bg-gradient-to-b from-emerald-50/80 via-white to-white"
		aria-hidden="true"
	></div>

	<div class="relative z-10 mx-auto max-w-5xl px-4 pt-16 pb-12 text-center md:pt-24 md:pb-16">
		<h1 class="text-4xl font-bold tracking-tight text-neutral-950 md:text-6xl md:leading-[1.05]">
			Unlock Photoshop with<br />
			natural-language photo editing.
		</h1>

		<p
			class="mx-auto mt-5 max-w-2xl text-lg font-medium tracking-tight text-neutral-700 md:text-xl"
		>
			AI orchestration, not generation.
		</p>

		<p class="mt-4 text-sm text-neutral-500 italic md:text-base">
			(It's <span class="font-medium text-neutral-700 not-italic">edit</span> plus the tail of
			<span class="font-medium text-neutral-700 not-italic">edamame</span>. Yes, the snack.)
		</p>

		<p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-700 md:text-xl">
			You describe the edit. The AI plans the steps. Your own copy of Photoshop carries them out,
			using its standard adjustment layers, masks, selections, and filters. The AI directs;
			Photoshop edits.
		</p>

		<div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="#install"
				onclick={() => track('hero-install-cta-clicked')}
				class="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				Install Editmamei
			</a>
			<a
				href="#demo"
				onclick={() => track('hero-demo-cta-clicked')}
				class="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
			>
				See it work ↓
			</a>
		</div>

		<p class="mt-5 text-xs text-neutral-500">
			Not a web app. Not a cloud editor. Runs on your computer with the Photoshop you already have
			installed.
		</p>
	</div>
</section>
