<script lang="ts">
	import { cookieConsent } from '$lib/stores/cookieConsent';
</script>

<svelte:head>
	<title>Privacy — Editmamei</title>
	<meta
		name="description"
		content="Editmamei privacy policy — coming soon. The short version is on the home page in How It Works."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4 text-center">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Coming soon</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">Privacy policy</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			The full privacy policy is being drafted for the v1.0 launch. The short version — what
			Editmamei does with your files, and the AI-cloud caveat — is on the home page in the "Your
			files, your machine" section under How It Works.
		</p>
		<div class="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
			<a
				href="/#how-it-works"
				class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
			>
				See the short version
			</a>
			<a
				href="/"
				class="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
			>
				Back to home
			</a>
		</div>
	</div>
</section>

<section id="cookies" class="border-t border-neutral-200 bg-neutral-50 py-16 md:py-20">
	<div class="mx-auto max-w-2xl px-4">
		<h2 class="text-xl font-bold tracking-tight text-neutral-950">Cookies</h2>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			This site uses <a
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
