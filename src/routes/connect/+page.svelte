<script lang="ts">
	import '$lib/components/landing/landing.css';
	import ConnectFlow from '$lib/components/connect/ConnectFlow.svelte';
	import ConnectHero from '$lib/components/connect/ConnectHero.svelte';
	import UseCases from '$lib/components/connect/UseCases.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { reveal } from '$lib/actions/reveal';
	import { track } from '$lib/analytics/clarity';
	import { mediaUrl } from '$lib/media';
	import {
		CONNECT_PRIVACY_URL,
		CONNECT_TERMS_URL,
		CONNECT_TOOLS_URL,
		CONNECT_URL
	} from '$lib/links';

	// The page for Editmamei Connect, the hosted product. connect.editmamei.com
	// has the sign-up, setup, the tool list and Connect's own Terms and Privacy
	// Policy; this page shows it and hands off. Two rules: the editor running
	// underneath is never named, and a credit is never defined in public copy.

	const MCP_URL = 'https://connect.editmamei.com/mcp';
	let copied = $state(false);
	async function copyUrl() {
		try {
			await navigator.clipboard.writeText(MCP_URL);
			copied = true;
			track('connect-copy-url');
			setTimeout(() => (copied = false), 2000);
		} catch {
			/* no clipboard access; the URL is on screen to select */
		}
	}

	// What happens to the photo. Checked against Connect's privacy policy and
	// the product facts (AI is used to select, and to fill where something is
	// removed; everything else is ordinary editing).
	const facts = [
		{
			title: 'Edited, not redrawn.',
			body: 'Selections, masks, adjustments and retouching, on the photo you sent. AI finds things in the photo and fills in where you remove something; the rest is ordinary editing.'
		},
		{
			title: 'Kept for a day.',
			body: 'Uploaded photos are deleted 24 hours after upload, and download links stop working after 24 hours.'
		},
		{
			title: 'Your AI sees small previews.',
			body: 'So it can check each step before it moves on, the same as looking at a photo in any chat.'
		}
	];

	// Verbatim from Connect's own starter prompts (its tools page).
	const prompts = [
		'Remove the trash can on the left side of the photo.',
		'Turn this into a product photo for my Etsy shop, on a pure white background.',
		'Show me this shirt in navy, olive and burgundy.',
		'Blur the background like portrait mode.',
		'Make it black and white with a dramatic sky.',
		'Is this photo ready for an Amazon listing?'
	];

	const goodToKnow = [
		{
			title: 'What you get back',
			body: 'The finished photo as JPG, PNG, WebP or TIFF, or a layered PSD to keep working on.'
		},
		{
			title: 'Up to ten at a time',
			body: 'Send up to ten photos on one upload link, and run the same edit across up to ten at once.'
		},
		{
			title: 'RAW files',
			body: 'RAW photos work on the larger workspace, which you can switch to in your Connect account.'
		},
		{
			title: 'Which AI apps',
			body: "Claude on the web, desktop and phone, ChatGPT where your plan allows connectors, and other apps that add connectors with a sign-in. Claude's free plan allows one custom connector."
		}
	];
</script>

<Seo
	title="Editmamei Connect · Send a photo, get it back edited"
	description="A hosted MCP connector for Claude, ChatGPT and other AI apps. Send a photo from your phone, say what you want, and it's edited with real tools on Editmamei's server. Nothing to install; 150 free credits to start."
	path="/connect"
/>

<ConnectHero startHref={CONNECT_URL} />

<!-- How it works. `how-it-works` stays as an alias for older links. -->
<section
	id="how"
	class="relative scroll-mt-16 overflow-hidden bg-brand-deep px-4 py-20 text-paper md:py-28"
	aria-labelledby="how-title"
>
	<span id="how-it-works" class="block"></span>
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[42rem]">
			<p class="lp-eyebrow text-accent">How it works</p>
			<h2 id="how-title" class="lp-h2 lp-rise mt-4" use:reveal>
				<span><span>To our server,</span></span>
				<span><span>and back, edited.</span></span>
			</h2>
			<p class="mt-6 text-lg leading-relaxed text-[#c9d8d1]">
				Your AI plans the edit in the chat. Editmamei's server does each step on your photo and
				shows your AI a small preview, so it can check its work. The finished photo comes back as a
				download.
			</p>
		</div>

		<div class="lp-fade mt-14" use:reveal>
			<ConnectFlow />
			<p class="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#a9bcb4]">
				<span class="flex items-center gap-2"
					><span class="inline-block w-8 border-t-[3px] border-accent"></span>Your photo, to and
					from Editmamei</span
				>
				<span class="flex items-center gap-2"
					><span class="inline-block w-8 border-t-[3px] border-dashed border-[#ff9b70]"></span>The
					conversation with your AI</span
				>
			</p>
		</div>

		<div class="mt-14 grid gap-8 md:grid-cols-3">
			{#each facts as f (f.title)}
				<div>
					<h3 class="text-lg font-bold text-[#f4f1e8]">{f.title}</h3>
					<p class="mt-2 text-[15px] leading-relaxed text-[#b9c9c2]">{f.body}</p>
				</div>
			{/each}
		</div>
		<p class="mt-8 text-[14px] text-[#a9bcb4]">
			The details are in Connect's
			<a href={CONNECT_PRIVACY_URL} class="font-semibold text-accent underline underline-offset-2"
				>Privacy Policy</a
			>.
		</p>
	</div>
</section>

<UseCases />

<!-- Things to ask -->
<section class="bg-cream px-4 py-16 md:py-20" aria-labelledby="ask-title">
	<div class="mx-auto max-w-6xl">
		<h2 id="ask-title" class="text-2xl font-bold tracking-tight text-brand md:text-3xl">
			Things to ask for.
		</h2>
		<ul class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
			{#each prompts as p (p)}
				<li
					class="rounded-2xl border border-prompt-border bg-prompt p-4 text-[15px] leading-relaxed text-neutral-800"
				>
					“{p}”
				</li>
			{/each}
		</ul>
		<p class="mt-6 text-[14px]">
			<a
				href={CONNECT_TOOLS_URL}
				onclick={() => track('connect-open-tools')}
				class="font-semibold text-brand underline underline-offset-2"
				>See everything Connect can do <span aria-hidden="true">→</span></a
			>
		</p>
	</div>
</section>

<!-- Set up once -->
<section
	id="start"
	class="lp-stage lp-grain scroll-mt-16 overflow-hidden px-4 py-20 md:py-28"
	aria-labelledby="setup-title"
>
	<div class="mx-auto max-w-6xl">
		<div class="max-w-[42rem]">
			<p class="lp-eyebrow text-accent">Set up</p>
			<h2 id="setup-title" class="lp-h2 lp-rise mt-4 text-[#f7f4ec]" use:reveal>
				<span><span>Set it up once.</span></span>
				<span><span>Then it's on your phone.</span></span>
			</h2>
		</div>

		<ol class="mt-12 grid gap-5 lg:grid-cols-3">
			<li class="lp-glass flex min-w-0 flex-col rounded-[22px] p-6">
				<p class="text-sm font-bold text-accent">1 · Add the connector</p>
				<p class="mt-3 text-[15.5px] leading-relaxed text-[#dfe8e3]">
					In Claude, open Settings, then Connectors, and add a custom connector with this URL. Other
					AI apps have a similar setting.
				</p>
				<div
					class="mt-5 flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 p-1.5 pl-3"
				>
					<code class="min-w-0 flex-1 truncate font-mono text-[13.5px] text-accent">{MCP_URL}</code>
					<button
						type="button"
						onclick={copyUrl}
						class="min-h-9 flex-none rounded-lg bg-accent px-3 text-[13px] font-bold text-brand-deep"
						>{copied ? 'Copied' : 'Copy'}</button
					>
				</div>
			</li>
			<li class="lp-glass flex min-w-0 flex-col rounded-[22px] p-6">
				<p class="text-sm font-bold text-accent">2 · Sign up with your email</p>
				<p class="mt-3 text-[15.5px] leading-relaxed text-[#dfe8e3]">
					Your AI app opens Connect's sign-in. Confirm your email and you're in, with 150 free
					credits to start.
				</p>
			</li>
			<li class="lp-glass flex min-w-0 flex-col rounded-[22px] p-6">
				<p class="text-sm font-bold text-accent">3 · Edit from your phone</p>
				<p class="mt-3 text-[15.5px] leading-relaxed text-[#dfe8e3]">
					A connector you add in Claude comes with you to the Claude app on your phone. Ask for an
					edit and Connect sends you a link to upload the photo.
				</p>
			</li>
		</ol>

		<div class="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
			<a
				href={CONNECT_URL}
				onclick={() => track('connect-start-setup')}
				class="inline-flex min-h-13 items-center gap-2 rounded-2xl border-[1.5px] border-accent/50 bg-brand px-7 text-[17px] font-bold text-white shadow-[0_10px_40px_-14px_rgba(206,255,140,0.4)] transition-transform hover:-translate-y-0.5 hover:bg-brand-light motion-reduce:transition-none"
				>Start free <span aria-hidden="true">→</span></a
			>
			<span class="text-[14px] text-[#a9bcb4]"
				>The full setup steps are at connect.editmamei.com.</span
			>
		</div>

		<!-- The launch film has a soundtrack, so it waits for a click instead of autoplaying. -->
		<figure class="m-0 mt-16">
			<video
				class="aspect-video w-full rounded-[20px] bg-black shadow-[0_40px_90px_-30px_rgba(0,0,0,0.85)]"
				controls
				playsinline
				preload="none"
				poster="/connect/connect-launch-poster.webp"
				width="1920"
				height="1080"
				onplay={() => track('connect-video-play')}
				aria-label="The Editmamei Connect launch film: adding Connect to Claude, sending a photo from a phone, the edit steps, and the download link."
			>
				<source
					src={mediaUrl('connect/connect-launch-720.mp4')}
					type="video/mp4"
					media="(max-width: 640px)"
				/>
				<source src={mediaUrl('connect/connect-launch-1080.mp4')} type="video/mp4" />
			</video>
			<figcaption class="mt-3 text-[13px] text-[#8fa59c]">
				The launch film: a real Connect session, from adding the connector to the download link. 70
				seconds, with sound.
			</figcaption>
		</figure>
	</div>
</section>

<!-- Credits -->
<section class="bg-white px-4 py-20 md:py-28" aria-labelledby="credits-title">
	<div class="mx-auto max-w-6xl">
		<p class="lp-eyebrow text-terracotta-ink">What it costs</p>
		<h2 id="credits-title" class="lp-h2 lp-rise mt-4 text-brand" use:reveal>
			<span><span>Free to start.</span></span>
			<span><span>Pay as you go after that.</span></span>
		</h2>
		<div class="mt-12 grid gap-5 lg:grid-cols-3">
			<div class="rounded-[22px] bg-paper p-7 ring-1 ring-brand/10">
				<h3 class="text-xl font-bold text-brand">Free</h3>
				<p class="mt-3 text-[16px] leading-relaxed text-neutral-800">
					150 credits when you sign up, plus a top-up of up to 50 more each month.
				</p>
			</div>
			<div class="rounded-[22px] bg-paper p-7 ring-1 ring-brand/10">
				<h3 class="text-xl font-bold text-brand">Packs</h3>
				<p class="mt-3 text-[16px] leading-relaxed text-neutral-800">
					750 credits for $7, or 2,000 for $15. Pack credits never expire.
				</p>
			</div>
			<div class="rounded-[22px] bg-brand p-7 text-white">
				<h3 class="text-xl font-bold">Monthly</h3>
				<p class="mt-3 text-[16px] leading-relaxed text-white/85">
					1,500 credits a month for $10, or 7,500 for $35. Unused monthly credits expire when the
					plan renews.
				</p>
			</div>
		</div>
		<p class="mt-6 text-[14px] text-neutral-600">
			You can see your balance, and buy more, in your Connect account.
		</p>
	</div>
</section>

<!-- Good to know, then the way to Desktop -->
<section class="bg-paper px-4 py-16 md:py-20" aria-labelledby="know-title">
	<div class="mx-auto max-w-6xl">
		<h2 id="know-title" class="text-2xl font-bold tracking-tight text-brand md:text-3xl">
			Good to know.
		</h2>
		<ul class="mt-8 grid gap-4 sm:grid-cols-2">
			{#each goodToKnow as item (item.title)}
				<li class="rounded-xl bg-white p-5 ring-1 ring-brand/10">
					<h3 class="text-sm font-semibold tracking-tight text-neutral-950">{item.title}</h3>
					<p class="mt-1.5 text-sm leading-relaxed text-neutral-700">{item.body}</p>
				</li>
			{/each}
		</ul>

		<a
			href="/photoshop"
			onclick={() => track('connect-xlink-desktop')}
			class="group mt-14 flex items-center justify-between gap-4 rounded-[22px] bg-white p-6 ring-1 ring-brand/10 transition-shadow hover:shadow-lg"
		>
			<span>
				<span class="block text-lg font-bold text-brand">Have Photoshop or GIMP?</span>
				<span class="mt-1 block text-[15px] text-neutral-700"
					>Editmamei Desktop edits on your own computer, in layers you keep. Free.</span
				>
			</span>
			<span
				aria-hidden="true"
				class="text-xl text-brand transition-transform group-hover:translate-x-1">→</span
			>
		</a>

		<p class="mt-8 text-[13px] text-neutral-500">
			Connect has its own
			<a href={CONNECT_TERMS_URL} class="font-semibold text-brand underline underline-offset-2"
				>Terms of Service</a
			>
			and
			<a href={CONNECT_PRIVACY_URL} class="font-semibold text-brand underline underline-offset-2"
				>Privacy Policy</a
			>, separate from this site's.
		</p>
	</div>
</section>
