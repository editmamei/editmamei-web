<script lang="ts">
	import { fade } from 'svelte/transition';
	import BeforeAfterSlider from '$lib/components/BeforeAfterSlider.svelte';
	import LayerAccordion from '$lib/components/LayerAccordion.svelte';
	import PromptDisplay from '$lib/components/PromptDisplay.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import HowItWorks from '$lib/components/HowItWorks.svelte';
	import ThreePillars from '$lib/components/ThreePillars.svelte';
	import CapabilitySurface from '$lib/components/CapabilitySurface.svelte';
	import WorkflowExamples from '$lib/components/WorkflowExamples.svelte';
	import EditionsTable from '$lib/components/EditionsTable.svelte';
	import VerifiableSection from '$lib/components/VerifiableSection.svelte';
	import InstallSection from '$lib/components/InstallSection.svelte';
	import { demoExamples } from '$lib/demos/examples';

	let demoIndex = $state(0);
	const prompts = demoExamples.map((e) => e.prompt);
	const activeDemo = $derived(demoExamples[demoIndex].demo);

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

<Hero />

<section id="demo" class="border-y border-neutral-200 bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div
			role="group"
			aria-roledescription="carousel"
			aria-label="Demo carousel — swipe to switch demos"
			ontouchstart={onTouchStart}
			ontouchend={onTouchEnd}
		>
			<header class="mb-8 max-w-2xl">
				{#key demoIndex}
					<div in:fade={{ duration: 450 }}>
						<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
							The demo · {activeDemo.title}
						</p>
						<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
							{activeDemo.headline}
						</h2>
						<p
							class="mt-3 min-h-[10rem] text-base leading-relaxed text-neutral-700 sm:min-h-[7rem] md:min-h-[5rem]"
						>
							{activeDemo.summary}
						</p>
					</div>
				{/key}
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

		<div class="grid gap-8 md:grid-cols-[1fr_360px] md:items-start lg:grid-cols-[1fr_400px]">
			<div>
				{#key demoIndex}
					<div in:fade={{ duration: 450 }}>
						<BeforeAfterSlider
							beforeSrc={activeDemo.before}
							afterSrc={activeDemo.after}
							beforeAlt={activeDemo.beforeAlt}
							afterAlt={activeDemo.afterAlt}
						/>
					</div>
				{/key}
				<p class="mt-3 text-xs text-neutral-500">
					Drag the bar — or use ← → on the keyboard — to compare. Left of the line is the finished
					edit; right is the original.
				</p>
			</div>

			<aside>
				<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
					Layer stack — built non-destructively
				</p>
				{#key demoIndex}
					<div in:fade={{ duration: 450 }}>
						<LayerAccordion layers={activeDemo.layers} />
					</div>
				{/key}
				<p class="mt-4 text-xs leading-relaxed text-neutral-500">
					Every layer above is editable, maskable, removable. Saved as a template, the AI replays
					the same recipe on a new photo and self-judges the result.
				</p>
			</aside>
		</div>
	</div>
</section>

<HowItWorks />
<ThreePillars />
<CapabilitySurface />
<WorkflowExamples />
<EditionsTable />
<VerifiableSection />
<InstallSection />
