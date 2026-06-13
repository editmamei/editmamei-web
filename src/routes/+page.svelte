<script lang="ts">
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import LayerAccordion from '$lib/components/LayerAccordion.svelte';
	import PromptDisplay from '$lib/components/PromptDisplay.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import HowItWorks from '$lib/components/HowItWorks.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { demoExamples } from '$lib/demos/examples';

	let demoIndex = $state(0);
	const prompts = demoExamples.map((e) => e.prompt);

	function nextDemo() {
		demoIndex = (demoIndex + 1) % demoExamples.length;
	}
	function prevDemo() {
		demoIndex = (demoIndex - 1 + demoExamples.length) % demoExamples.length;
	}

	let touchStartX = 0;
	let touchStartY = 0;
	const SWIPE_MIN = 50;
	const VERTICAL_TOLERANCE = 40;

	function onTouchStart(e: TouchEvent) {
		if (e.touches.length !== 1) return;
		touchStartX = e.touches[0].clientX;
		touchStartY = e.touches[0].clientY;
	}
	function onTouchEnd(e: TouchEvent) {
		if (e.changedTouches.length !== 1) return;
		const dx = e.changedTouches[0].clientX - touchStartX;
		const dy = e.changedTouches[0].clientY - touchStartY;
		if (Math.abs(dy) > VERTICAL_TOLERANCE) return;
		if (Math.abs(dx) < SWIPE_MIN) return;
		if (dx < 0) nextDemo();
		else prevDemo();
	}
</script>

<Seo
	title="Editmamei — Unlock Photoshop with natural-language photo editing"
	description="Unlock Photoshop with natural-language photo editing. AI orchestration, not generation. Your AI plans the edit; your own Photoshop does it. Pronounced like edamame."
	path="/"
/>

<Hero />

<section id="demo" class="border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div
			role="group"
			aria-roledescription="carousel"
			aria-label="Demo carousel — swipe to switch demos"
			ontouchstart={onTouchStart}
			ontouchend={onTouchEnd}
		>
			<!--
				LAYOUT STABILITY: every cross-demo container below stacks all demo
				variants in the same grid cell (col-start-1 row-start-1). The cell
				auto-sizes to the tallest variant, so switching demos NEVER shifts
				the page vertically. Inactive variants get opacity-0 + aria-hidden
				+ inert. Do NOT replace this with hand-tuned min-h — see
				feedback_layout_stability_grid_stack.md in memory.
			-->
			<header class="mb-8 grid max-w-2xl">
				{#each demoExamples as { demo }, i (i)}
					<div
						class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
						class:opacity-0={i !== demoIndex}
						class:opacity-100={i === demoIndex}
						aria-hidden={i !== demoIndex}
						inert={i !== demoIndex}
					>
						<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
							The demo · {demo.title}
						</p>
						<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
							{demo.headline}
						</h2>
						<p class="mt-3 text-base leading-relaxed text-neutral-700">
							{demo.summary}
						</p>
					</div>
				{/each}
			</header>

			<div class="mb-8">
				<PromptDisplay
					{prompts}
					bind:currentIndex={demoIndex}
					onPrev={prevDemo}
					onNext={nextDemo}
				/>
			</div>
		</div>

		<div class="grid gap-8 md:grid-cols-[1fr_420px] md:items-start lg:grid-cols-[1fr_480px]">
			<div>
				<div class="grid">
					{#each demoExamples as { demo }, i (i)}
						<div
							class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
							class:opacity-0={i !== demoIndex}
							class:opacity-100={i === demoIndex}
							aria-hidden={i !== demoIndex}
							inert={i !== demoIndex}
						>
							<BeforeAfterSlider
								beforeSrc={demo.before}
								afterSrc={demo.after}
								beforeAlt={demo.beforeAlt}
								afterAlt={demo.afterAlt}
							/>
						</div>
					{/each}
				</div>
				<p class="mt-3 text-xs text-neutral-500">
					Drag the bar — or use ← → on the keyboard — to compare. Left of the line is the finished
					edit; right is the original.
				</p>
			</div>

			<aside>
				<div class="rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg md:p-5">
					<p class="mb-3 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
						Layer stack — built non-destructively
					</p>
					<div class="grid">
						{#each demoExamples as { demo }, i (i)}
							<div
								class="col-start-1 row-start-1 transition-opacity duration-500 motion-reduce:transition-none"
								class:opacity-0={i !== demoIndex}
								class:opacity-100={i === demoIndex}
								aria-hidden={i !== demoIndex}
								inert={i !== demoIndex}
							>
								<LayerAccordion layers={demo.layers} />
							</div>
						{/each}
					</div>
				</div>
				<p class="mt-4 text-xs leading-relaxed text-neutral-500">
					Every layer above is editable, maskable, removable. Saved as a template (a Pro feature),
					the AI recreates the same look on a new photo and self-judges the result.
				</p>
			</aside>
		</div>

		<div class="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
			<p class="text-sm text-neutral-600">Want the full capability surface and trust receipts?</p>
			<a
				href="/product"
				class="inline-flex items-center gap-1 text-sm font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
			>
				See the product page <span aria-hidden="true">→</span>
			</a>
		</div>
	</div>
</section>

<HowItWorks />
<InstallSection />
