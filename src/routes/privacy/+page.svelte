<script lang="ts">
	import { cookieConsent } from '$lib/stores/cookieConsent';
</script>

<svelte:head>
	<title>Privacy — Editmamei</title>
	<meta
		name="description"
		content="What Editmamei does with your data: your photos aren't uploaded to us — the only thing sent to our servers is content-free, anonymous usage you can audit and switch off. A downscaled preview goes to the AI assistant you chose when it needs to see an edit."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Privacy</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			What Editmamei does with your data.
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Editmamei runs on your own computer and edits inside the Photoshop you already have. The
			honest version is short: your photos aren't uploaded to us, and the only thing Editmamei sends
			to its own servers is content-free usage you can audit and turn off. When your AI assistant
			needs to see an edit, a downscaled preview goes to that assistant — covered below. A formal
			legal policy lands with the v1.0 launch; this page describes how the product behaves today.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">
			What Editmamei never sends to us
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			There is one line we don't cross, on any setting:
		</p>
		<ul class="mt-3 space-y-2 text-sm leading-relaxed text-neutral-700">
			<li>
				<strong class="font-semibold text-neutral-900">Your image and document content.</strong>
				No photos, previews, thumbnails, layer renders, or Photoshop document data are ever sent to Editmamei.
			</li>
			<li>
				<strong class="font-semibold text-neutral-900">Your file paths.</strong>
				Full paths stay local; nothing identifies where your work lives on disk.
			</li>
			<li>
				<strong class="font-semibold text-neutral-900">Your metadata.</strong>
				Camera info, GPS, and author fields are never part of what the product transmits.
			</li>
		</ul>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">
			What Editmamei does send
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			Editmamei is built by a small team, so it sends a thin stream of content-free signals that
			show what's working and what's breaking. The earlier "no telemetry at all" promise is retired:
			a licensed product that phones home should say so plainly rather than claim a purity it can't
			keep. Everything below is anonymous, modelled on how editors like VS Code handle telemetry,
			and documented field by field.
		</p>
		<ul class="mt-4 space-y-3 text-sm leading-relaxed text-neutral-700">
			<li>
				<strong class="font-semibold text-neutral-900"
					>Usage and reliability (on by default).</strong
				>
				Per edit: which tool ran, whether it succeeded, an error category if it didn't, and how long it
				took. Per session: the Editmamei version, your Photoshop version, your operating system, and a
				random install ID that counts installs without identifying you. No prompts, no arguments, no content.
			</li>
			<li>
				<strong class="font-semibold text-neutral-900"
					>Diagnostics (off until you turn it on).</strong
				>
				When you opt in, a sanitized error message and the name of the step that failed, so a bug can
				be traced without you mailing a log by hand. File paths are reduced to bare names; still no image
				content.
			</li>
		</ul>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			This data goes to our own infrastructure, not a third-party analytics company. You can see the
			current settings, and switch usage data off entirely, by editing
			<code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs"
				>~/.editmamei/settings.json</code
			>
			or running
			<code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs">editmamei config</code>.
			The file is plain text and yours to inspect at any time.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">
			Your AI assistant is a cloud service
		</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			The AI assistant you drive Editmamei with is a cloud service. When you ask it to look at an
			image (for example, the visual-verification preview), a downscaled JPEG goes to
			<em>that AI provider</em>, exactly as if you'd dropped the file into a chat with it. That's a
			property of using a cloud AI, and a function of which assistant you choose. Not a hop
			Editmamei adds.
		</p>

		<div class="mt-12 border-t border-neutral-200 pt-6">
			<a
				href="/#how-it-works"
				class="text-sm font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
			>
				See how this fits together in How It Works →
			</a>
		</div>
	</div>
</section>

<section id="cookies" class="border-t border-neutral-200 bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-2xl px-4">
		<h2 class="text-xl font-bold tracking-tight text-neutral-950">This website</h2>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			Everything above is about the Editmamei software. This marketing site is a separate system
			with its own, ordinary analytics.
		</p>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			It uses <a
				href="https://clarity.microsoft.com"
				rel="noopener noreferrer"
				class="underline hover:text-neutral-950">Microsoft Clarity</a
			> for analytics — session recordings and heatmaps that help us understand how visitors use the site.
			Clarity operates in two modes depending on your consent:
		</p>
		<ul class="mt-4 space-y-2 text-sm leading-relaxed text-neutral-700">
			<li>
				<strong class="font-semibold text-neutral-900">No cookies (default).</strong> If you decline or
				haven't yet made a choice, Clarity runs without setting any cookies. No cookies are persisted
				to your device; Clarity may use session storage to correlate page views within a single tab, which
				is cleared when the tab closes.
			</li>
			<li>
				<strong class="font-semibold text-neutral-900">With cookies (if you accept).</strong>
				Clarity sets two first-party cookies:
				<code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs">_clck</code> (persists a
				user ID across sessions, expires in 1 year) and
				<code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs">_clsk</code> (ties page
				views within a session, expires in 30 minutes). Both are set by
				<code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs">editmamei.com</code> and
				processed by Microsoft per their
				<a
					href="https://privacy.microsoft.com/en-us/privacystatement"
					rel="noopener noreferrer"
					class="underline hover:text-neutral-950">privacy statement</a
				>.
			</li>
		</ul>
		<p class="mt-6 text-sm leading-relaxed text-neutral-700">
			You can change your choice at any time using the
			<button
				onclick={() => cookieConsent.reopen()}
				class="cursor-pointer underline hover:text-neutral-950"
			>
				Cookie preferences
			</button>
			link in the site footer.
		</p>
	</div>
</section>
