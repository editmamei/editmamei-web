<script lang="ts">
	import '$lib/components/landing/landing.css';
	import BatchWall from '$lib/components/landing/BatchWall.svelte';
	import CompareLens from '$lib/components/landing/CompareLens.svelte';
	import ConversationBuild from '$lib/components/landing/ConversationBuild.svelte';
	import HeroStage from '$lib/components/landing/HeroStage.svelte';
	import LaptopMock from '$lib/components/landing/LaptopMock.svelte';
	import PhoneMock from '$lib/components/landing/PhoneMock.svelte';
	import RangeStrip from '$lib/components/landing/RangeStrip.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { track } from '$lib/analytics/clarity';

	// Every fork click is counted by product and by where on the page it was made,
	// so the split between Desktop and Connect interest can be read directly.
	const DESKTOP_HREF = '/desktop';
	const CONNECT_HREF = '/connect';
	const fork = (product: 'desktop' | 'connect', where: string) => () =>
		track(`fork-${product}-${where}`);

	const faqs = [
		{
			q: 'Do I need Photoshop?',
			a: 'No. Connect edits in the cloud, so all you need is an AI app that supports connectors. Desktop uses the editor on your own computer: Photoshop 2026, or GIMP 3.2 for free.'
		},
		{
			q: 'What does it cost?',
			a: 'Desktop is free. Pro adds raw development, templates and whole-folder batches for $9 a month (early-adopter rate), $79 a year, or $199 once. Connect starts you with 150 free credits, plus up to 50 more each month; after that, credit packs start at $7.'
		},
		{
			q: 'Which AI apps work?',
			a: 'Desktop works in apps that run tools on your computer, like Claude Desktop, Claude Code and Cursor. Connect works in apps that add connectors with a sign-in, like Claude and ChatGPT.'
		}
	];
</script>

<Seo
	title="Editmamei · Give your AI a real photo editor"
	description="A typical AI app redraws your photo. Editmamei lets your AI edit the real one with professional tools: an MCP server for Photoshop and GIMP, and a hosted MCP connector for AI apps."
	path="/"
/>

<HeroStage desktopHref={DESKTOP_HREF} connectHref={CONNECT_HREF} />

<CompareLens />

<ConversationBuild />

<RangeStrip />

<BatchWall />

<!-- The fork. `install` stays as an alias so older /#install links land here. -->
<section
	id="fork"
	class="relative isolate overflow-hidden bg-brand-deep px-4 pt-24 pb-28 text-paper md:pt-32 md:pb-36"
	aria-labelledby="fork-title"
>
	<span id="install" class="block"></span>
	<div
		class="pointer-events-none absolute inset-0 -z-10"
		style="background: radial-gradient(50% 40% at 50% 0%, rgba(206,255,140,0.14), transparent 70%), radial-gradient(40% 50% at 15% 80%, rgba(255,128,64,0.08), transparent 70%);"
		aria-hidden="true"
	></div>
	<div class="mx-auto max-w-6xl">
		<div class="text-center">
			<p class="lp-eyebrow text-accent">Two ways in</p>
			<h2 id="fork-title" class="lp-h2 lp-rise mt-4" use:reveal>
				<span><span>Pick where you edit.</span></span>
			</h2>
			<p class="mx-auto mt-5 max-w-[34em] text-lg text-[#c9d8d1] md:text-xl">
				Same idea in both: you ask, your AI does the edit with real tools. The difference is where
				the editing happens.
			</p>
		</div>

		<div class="mt-16 grid gap-20 md:mt-20 lg:grid-cols-2 lg:gap-12">
			<div class="flex min-w-0 flex-col items-center gap-8">
				<div class="text-center">
					<div class="text-[2rem] leading-tight font-bold tracking-[-0.025em]">
						On your computer
					</div>
					<div class="mt-1.5 text-[15px] font-semibold text-accent">Editmamei Desktop</div>
				</div>
				<div class="flex w-full items-center justify-center lg:h-[520px]"><LaptopMock /></div>
				<dl
					class="grid w-full max-w-[520px] grid-cols-[110px_1fr] gap-x-5 gap-y-3.5 text-base leading-snug"
				>
					<dt class="text-[#9fb5ac]">Edits in</dt>
					<dd>Photoshop or GIMP, on your computer</dd>
					<dt class="text-[#9fb5ac]">You get</dt>
					<dd>A layered file you can keep editing by hand</dd>
					<dt class="text-[#9fb5ac]">Works with</dt>
					<dd>Claude Desktop, Claude Code, Cursor and more</dd>
					<dt class="text-[#9fb5ac]">Price</dt>
					<dd>Free. Pro adds Camera Raw and whole-shoot tools.</dd>
				</dl>
				<a
					href={DESKTOP_HREF}
					onclick={fork('desktop', 'cards')}
					class="inline-flex min-h-13 items-center gap-2 rounded-2xl bg-accent px-7 text-[17px] font-bold text-brand-deep shadow-[0_10px_40px_-12px_rgba(206,255,140,0.55)] transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
					>See Editmamei Desktop <span aria-hidden="true">→</span></a
				>
			</div>

			<div class="flex min-w-0 flex-col items-center gap-8">
				<div class="text-center">
					<div class="text-[2rem] leading-tight font-bold tracking-[-0.025em]">From any device</div>
					<div class="mt-1.5 text-[15px] font-semibold text-accent">Editmamei Connect</div>
				</div>
				<div class="flex w-full items-center justify-center lg:h-[520px]"><PhoneMock /></div>
				<dl
					class="grid w-full max-w-[520px] grid-cols-[110px_1fr] gap-x-5 gap-y-3.5 text-base leading-snug"
				>
					<dt class="text-[#9fb5ac]">Edits in</dt>
					<dd>Editmamei's editor, in the cloud</dd>
					<dt class="text-[#9fb5ac]">You get</dt>
					<dd>The finished photo, or a layered PSD</dd>
					<dt class="text-[#9fb5ac]">Works with</dt>
					<dd>Claude, ChatGPT and other apps that add connectors</dd>
					<dt class="text-[#9fb5ac]">Price</dt>
					<dd>150 free credits to start, then packs from $7</dd>
				</dl>
				<a
					href={CONNECT_HREF}
					onclick={fork('connect', 'cards')}
					class="inline-flex min-h-13 items-center gap-2 rounded-2xl border-[1.5px] border-accent/50 bg-brand px-7 text-[17px] font-bold text-white shadow-[0_10px_40px_-14px_rgba(206,255,140,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-brand-light motion-reduce:transition-none"
					>See Editmamei Connect <span aria-hidden="true">→</span></a
				>
			</div>
		</div>
	</div>
</section>

<!-- First questions, then the fork once more. -->
<section class="bg-paper px-4 pt-24 pb-28" aria-labelledby="faq-title">
	<div class="mx-auto max-w-[860px]">
		<h2 id="faq-title" class="lp-h2 text-brand">Questions people ask first.</h2>
		<div class="mt-10 border-t border-[#ddd6c4]">
			{#each faqs as f, i (f.q)}
				<details class="group border-b border-[#ddd6c4] py-6" open={i === 0}>
					<summary
						class="flex cursor-pointer list-none items-center justify-between gap-4 text-xl font-semibold text-brand md:text-2xl [&::-webkit-details-marker]:hidden"
					>
						{f.q}
						<span
							aria-hidden="true"
							class="grid size-9 flex-none place-items-center rounded-full border border-brand/20 text-xl leading-none transition-transform group-open:rotate-45 motion-reduce:transition-none"
							>+</span
						>
					</summary>
					<p class="mt-4 max-w-[44em] text-[17px] leading-relaxed text-neutral-700">{f.a}</p>
				</details>
			{/each}
		</div>
		<p class="mt-6 text-[15px] text-neutral-600">
			More in the <a href="/faq" class="font-semibold text-brand underline underline-offset-2"
				>FAQ</a
			>
			and on the
			<a href="/pricing" class="font-semibold text-brand underline underline-offset-2"
				>pricing page</a
			>.
		</p>
	</div>

	<div
		class="lp-stage lp-grain mx-auto mt-24 max-w-6xl overflow-hidden rounded-[28px] px-6 py-16 text-center md:py-24"
	>
		<div
			class="pointer-events-none absolute inset-0 -z-[1]"
			style="background: radial-gradient(45% 70% at 50% 120%, rgba(206,255,140,0.22), transparent 70%);"
			aria-hidden="true"
		></div>
		<h2 class="lp-h2 lp-rise text-[#f7f4ec]" use:reveal>
			<span><span>Your photo deserves</span></span>
			<span><span>a real editor.</span></span>
		</h2>
		<div class="mt-10 flex flex-col-reverse justify-center gap-3 sm:flex-row">
			<a
				href={DESKTOP_HREF}
				onclick={fork('desktop', 'footer')}
				class="inline-flex min-h-13 items-center justify-center rounded-2xl bg-accent px-7 text-[17px] font-bold text-brand-deep transition-transform hover:-translate-y-0.5 motion-reduce:transition-none"
				>Edit on your computer →</a
			>
			<a
				href={CONNECT_HREF}
				onclick={fork('connect', 'footer')}
				class="inline-flex min-h-13 items-center justify-center rounded-2xl border-[1.5px] border-accent/50 bg-brand px-7 text-[17px] font-bold text-white shadow-[0_10px_40px_-14px_rgba(206,255,140,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-brand-light motion-reduce:transition-none"
				>Edit from any device →</a
			>
		</div>
	</div>
</section>
