<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { track } from '$lib/analytics/clarity';
	import {
		CONNECT_PRIVACY_URL,
		CONNECT_TERMS_URL,
		CONNECT_TOOLS_URL,
		CONNECT_URL
	} from '$lib/links';

	// The highlights page for Editmamei Connect. connect.editmamei.com has the
	// sign-in, setup steps, the full tool list and Connect's own Terms and
	// Privacy Policy; this page describes it and hands off. Claims follow what
	// production Connect offers. Connect never names the editor underneath, and
	// neither does this page.

	const steps = [
		{
			title: 'Add it to Claude.',
			body: 'Add Connect as a connector and sign up with your email address. The Connect site walks you through it, and after that it’s there in every conversation.'
		},
		{
			title: 'Send a photo.',
			body: 'Add a photo to the conversation, from your camera roll on a phone or from your files on a laptop. Several at once is fine.'
		},
		{
			title: 'Say what you want.',
			body: 'Describe the edit in plain words. Claude picks the tools, checks each result in a preview, and hands back a download link that lasts 24 hours.'
		}
	] as const;

	const highlights = [
		{
			title: 'Clean it up',
			body: 'Remove an object by naming it, heal dust spots and small blemishes, and fix brightness and color.'
		},
		{
			title: 'Product photos',
			body: 'Pure white or a soft studio backdrop, a transparent cutout, the same item in other colors, and a check against Amazon, Etsy, Shopify and eBay image guidelines.'
		},
		{
			title: 'Portraits',
			body: 'Portrait-mode background blur, light skin smoothing that keeps some texture, and a new sky from a second photo.'
		},
		{
			title: 'Looks',
			body: 'Cinematic, black and white, a warm look for social posts and more, each applied in one step. Save a look you like and use it again on the next photo.'
		},
		{
			title: 'Posts and memes',
			body: 'Crops for each platform, a wide photo split into carousel slides that join up when you swipe, story frames with the caption kept clear of the app’s buttons, photo grids, memes and stickers.'
		},
		{
			title: 'Batches',
			body: 'Run the same product edit, look, story frame or sticker over up to ten photos at once.'
		}
	] as const;

	// Verbatim from Connect's own starter prompts (the /tools page there).
	const prompts = [
		'Remove the trash can on the left side of the photo.',
		'Turn this into a product photo for my Etsy shop, on a pure white background.',
		'Show me this shirt in navy, olive and burgundy.',
		'Blur the background like portrait mode.',
		'Make it black and white with a dramatic sky.',
		'Is this photo ready for an Amazon listing?'
	] as const;

	const linkClass =
		'font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700';
	const darkLinkClass =
		'font-semibold text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent';
	const primaryButton =
		'inline-flex items-center justify-center rounded-md bg-brand px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light';
</script>

<Seo
	title="Editmamei Connect: photo editing in Claude, nothing to install · Editmamei"
	description="Editmamei Connect edits photos on Editmamei's server, driven by Claude. Send a photo from your phone or laptop, describe the edit, and download the finished photo."
	path="/connect"
/>

<section class="bg-white pt-12 pb-12 md:pt-16 md:pb-16">
	<div class="mx-auto max-w-6xl px-4">
		<div class="max-w-3xl">
			<nav aria-label="Breadcrumb" class="mb-3 hidden text-xs text-neutral-500 sm:block">
				<ol class="flex items-center gap-1.5">
					<li><a href="/product" class="hover:text-neutral-900">Product</a></li>
					<li aria-hidden="true">/</li>
					<li aria-current="page" class="text-neutral-700">Connect</li>
				</ol>
			</nav>
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Editmamei Connect · Remote MCP server
			</p>
			<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
				Photo editing from the chat, with nothing to install.
			</h1>
			<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
				Connect is Editmamei running on our server instead of your computer. Add it to Claude once,
				then send a photo from your phone or laptop, describe the edit the way you’d brief another
				editor, and download the finished photo.
			</p>
			<div class="mt-7 flex flex-wrap items-center gap-3">
				<a href={CONNECT_URL} onclick={() => track('connect-open-hero')} class={primaryButton}>
					Open Connect <span aria-hidden="true" class="ml-1">→</span>
				</a>
				<a
					href="#highlights"
					class="inline-flex items-center justify-center rounded-md border border-neutral-300 px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-500"
				>
					What it does
				</a>
			</div>
			<p class="mt-4 text-sm text-neutral-600">
				Works in Claude, including on your phone. New accounts start with 150 free credits, plus up
				to 50 more each month. After that, credits come in packs from $7 or monthly plans from $10.
			</p>
		</div>

		<!-- The launch film has a soundtrack, so it waits for a click instead of autoplaying. -->
		<figure class="mt-10 md:mt-12">
			<video
				class="aspect-video w-full rounded-2xl border border-neutral-200 bg-neutral-950 shadow-xl"
				controls
				playsinline
				preload="none"
				poster="/connect/connect-launch-poster.webp"
				width="1920"
				height="1080"
				onplay={() => track('connect-video-play')}
				aria-label="The Editmamei Connect launch film: adding Connect to Claude, sending a photo from a phone, the edit steps, and the download link."
			>
				<source src="/connect/connect-launch-720.mp4" type="video/mp4" media="(max-width: 640px)" />
				<source src="/connect/connect-launch-1080.mp4" type="video/mp4" />
			</video>
			<figcaption class="mt-3 text-xs text-neutral-500">
				Edits from a real Connect session, from adding the connector to the download link. 70
				seconds, with sound.
			</figcaption>
		</figure>
	</div>
</section>

<section id="how-it-works" class="scroll-mt-20 border-y border-neutral-200 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				How it works
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Three steps, all in the conversation.
			</h2>
		</div>
		<ol class="grid gap-6 md:grid-cols-3">
			{#each steps as step, i (step.title)}
				<li class="rounded-xl border border-neutral-200 bg-white p-6">
					<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
						Step {i + 1}
					</p>
					<h3 class="mt-2 text-lg font-semibold tracking-tight text-neutral-950">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{step.body}</p>
				</li>
			{/each}
		</ol>
	</div>
</section>

<section id="highlights" class="scroll-mt-20 bg-white py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				What it does
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				From a quick cleanup to a week of posts.
			</h2>
		</div>
		<ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
			{#each highlights as group (group.title)}
				<li class="rounded-xl border border-neutral-200 bg-neutral-50/50 p-5">
					<h3 class="text-base font-semibold tracking-tight text-neutral-950">{group.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{group.body}</p>
				</li>
			{/each}
		</ul>
		<p class="mt-6 text-sm">
			<a href={CONNECT_TOOLS_URL} onclick={() => track('connect-open-tools')} class={linkClass}>
				See everything Connect can do <span aria-hidden="true">→</span>
			</a>
		</p>
	</div>
</section>

<section id="prompts" class="scroll-mt-20 border-y border-neutral-200 bg-cream py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				What you say to it
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Plain requests, with a photo attached.
			</h2>
		</div>
		<ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each prompts as prompt (prompt)}
				<li
					class="rounded-lg border border-prompt-border bg-prompt p-4 text-sm leading-relaxed text-neutral-800 italic"
				>
					“{prompt}”
				</li>
			{/each}
		</ul>
	</div>
</section>

<section id="which" class="scroll-mt-20 bg-paper py-16 md:py-20">
	<div class="mx-auto max-w-6xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Connect or the desktop app
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Same idea, two places to run it.
			</h2>
		</div>
		<div class="grid gap-6 md:grid-cols-2">
			<div class="rounded-xl border border-neutral-200 bg-white p-6">
				<h3 class="text-lg font-semibold tracking-tight text-neutral-950">Editmamei Connect</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Runs on our server. Nothing to install, it works from any device you use Claude on, and
					the finished photo comes back as a download. Editing time is paid for in credits.
				</p>
			</div>
			<div class="rounded-xl border border-neutral-200 bg-white p-6">
				<h3 class="text-lg font-semibold tracking-tight text-neutral-950">Editmamei Desktop</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Runs on your computer and edits in Photoshop or GIMP there. You keep the layered file,
					with every adjustment still editable, and the photo file stays on your computer.
					<a href="/product" class={linkClass}>See the desktop app</a>.
				</p>
			</div>
		</div>
	</div>
</section>

<section id="start" class="scroll-mt-20 bg-brand py-16 text-neutral-100 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-accent uppercase">Get started</p>
			<h2 class="text-2xl font-bold tracking-tight text-white md:text-3xl">
				Set up Connect at connect.editmamei.com.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-300">
				Sign up with your email address, then follow the setup steps to add Connect to Claude. You
				get an email when your account is approved.
			</p>
			<div class="mt-7">
				<a
					href={CONNECT_URL}
					onclick={() => track('connect-open-footer')}
					class="inline-flex items-center justify-center rounded-md bg-accent px-5 py-3 text-sm font-semibold text-brand shadow-sm transition-opacity hover:opacity-90"
				>
					Open Connect <span aria-hidden="true" class="ml-1">→</span>
				</a>
			</div>
			<p class="mt-8 text-sm text-neutral-400">
				Connect has its own <a href={CONNECT_TERMS_URL} class={darkLinkClass}>Terms of Service</a>
				and <a href={CONNECT_PRIVACY_URL} class={darkLinkClass}>Privacy Policy</a>, separate from
				this site’s.
			</p>
		</div>
	</div>
</section>
