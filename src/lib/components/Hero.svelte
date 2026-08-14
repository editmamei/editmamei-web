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

		<p class="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-neutral-700 md:text-xl">
			Open a chat. Direct the changes, or describe a look. Photoshop does the work, hands-free, one
			layer at a time. Real photo editing, with the power of Photoshop, automated with AI.
		</p>

		<!-- The demo is the primary ask, not install. A top-of-page install CTA drew
		     one click in 28 sessions (2026-08-14) — it asks for commitment before any
		     proof has landed. See docs/20260814-home-page-restructure.md. -->
		<div class="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="#process"
				onclick={() => track('hero-demo-cta-clicked')}
				class="inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				See it work ↓
			</a>
			<a
				href="#install"
				onclick={() => track('hero-install-cta-clicked')}
				class="text-sm font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-900 hover:decoration-neutral-500"
			>
				or install it free
			</a>
		</div>

		<p class="mt-5 text-xs text-neutral-500">Installs on your desktop, runs next to Photoshop.</p>
	</div>
</section>
