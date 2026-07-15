<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { CUSTOMER_PORTAL_URL } from '$lib/links';
</script>

<Seo
	title="Activate Pro: enter your license key and restart — Editmamei"
	description="Activate your Editmamei Pro license: run editmamei activate <key> (Claude Code / npm) or paste your key into the Claude Desktop extension settings. Then restart and your Pro tools appear."
	path="/activate"
/>

<section class="bg-white pt-12 pb-4 md:pt-16 md:pb-6">
	<div class="mx-auto max-w-3xl px-4">
		<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
			Editmamei Pro
		</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Activate your Pro license
		</h1>
		<p class="mt-4 max-w-2xl text-base leading-relaxed text-neutral-700">
			Thanks for going Pro. Activation takes about a minute. Find your key, enter it the way that
			matches how you run Editmamei, and restart. Your Pro tools then appear in your AI client.
		</p>

		<div
			class="mt-6 rounded-xl border border-neutral-200 bg-cream px-5 py-4 text-sm text-neutral-700"
		>
			Already subscribed and just need to manage it?
			<a
				href={CUSTOMER_PORTAL_URL}
				rel="noopener"
				class="font-semibold text-brand underline underline-offset-2 hover:text-brand-light"
				>Open your account portal →</a
			>
			to update payment, cancel, view invoices, or remove a device. Sign in with the email you purchased
			with, no password needed.
		</div>
	</div>
</section>

<!-- Step 1 -->
<section class="bg-white py-8">
	<div class="mx-auto max-w-3xl px-4">
		<div class="flex items-start gap-4">
			<span
				class="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
				>1</span
			>
			<div>
				<h2 class="text-xl font-semibold tracking-tight text-neutral-950">Find your license key</h2>
				<p class="mt-2 text-base leading-relaxed text-neutral-700">
					Your key is in your <strong>purchase confirmation email</strong>, and any time in your
					<a
						href={CUSTOMER_PORTAL_URL}
						rel="noopener"
						class="font-medium text-brand underline underline-offset-2 hover:text-brand-light"
						>account portal</a
					>
					(sign in with your purchase email). It looks like
					<code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm">XXXX-XXXX-…</code>.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Step 2 -->
<section class="bg-cream py-12 md:py-16">
	<div class="mx-auto max-w-3xl px-4">
		<div class="flex items-start gap-4">
			<span
				class="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
				>2</span
			>
			<div class="w-full">
				<h2 class="text-xl font-semibold tracking-tight text-neutral-950">Enter your key</h2>
				<p class="mt-2 text-base leading-relaxed text-neutral-700">
					Pick the one that matches how you installed Editmamei.
				</p>

				<div class="mt-6 grid gap-5 md:grid-cols-2">
					<!-- Claude Code / npm -->
					<div class="rounded-xl border border-neutral-200 bg-paper p-5">
						<h3 class="text-base font-semibold tracking-tight text-neutral-950">
							Claude Code / npm
						</h3>
						<p class="mt-2 text-sm leading-relaxed text-neutral-700">Run this in your terminal:</p>
						<pre
							class="mt-3 overflow-x-auto rounded-lg bg-brand-deep px-4 py-3 text-sm text-paper"><code
								>editmamei activate YOUR-KEY</code
							></pre>
						<p class="mt-3 text-sm leading-relaxed text-neutral-600">
							Then restart your AI client. Check anytime with
							<code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs"
								>editmamei license</code
							>.
						</p>
					</div>

					<!-- Claude Desktop / .mcpb -->
					<div class="rounded-xl border border-neutral-200 bg-paper p-5">
						<h3 class="text-base font-semibold tracking-tight text-neutral-950">Claude Desktop</h3>
						<p class="mt-2 text-sm leading-relaxed text-neutral-700">
							No terminal needed. In Claude Desktop, open
							<strong>Settings → Extensions → Editmamei</strong>, paste your key into the
							<strong>“Pro license key”</strong> field, and save.
						</p>
						<p class="mt-3 text-sm leading-relaxed text-neutral-600">
							Then quit and reopen Claude Desktop so it picks up the key.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Step 3 -->
<section class="bg-white py-12 md:py-16">
	<div class="mx-auto max-w-3xl px-4">
		<div class="flex items-start gap-4">
			<span
				class="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-brand text-sm font-bold text-white"
				>3</span
			>
			<div>
				<h2 class="text-xl font-semibold tracking-tight text-neutral-950">Confirm Pro is on</h2>
				<p class="mt-2 text-base leading-relaxed text-neutral-700">
					After the restart, the Pro tools appear in your AI client: Camera Raw develop, precision
					placement, named-object masks and face-feature selections, warp, the reproducible-template
					system, and Photoshop Actions and scripting. If they're not there yet, double-check the
					key and that you fully restarted the client.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Good to know -->
<section class="bg-paper py-12 md:py-16">
	<div class="mx-auto max-w-3xl px-4">
		<h2 class="text-lg font-semibold tracking-tight text-neutral-950">Good to know</h2>
		<ul class="mt-4 space-y-3 text-base leading-relaxed text-neutral-700">
			<li class="flex gap-3">
				<span class="text-brand">•</span><span
					><strong>Two devices per license.</strong> Activate on a second machine the same way;
					switch a device free with
					<code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-sm"
						>editmamei deactivate</code
					>
					on the old one, or remove it from your
					<a
						href={CUSTOMER_PORTAL_URL}
						rel="noopener"
						class="font-medium text-brand underline underline-offset-2 hover:text-brand-light"
						>account portal</a
					> if you no longer have it.</span
				>
			</li>
			<li class="flex gap-3">
				<span class="text-brand">•</span><span
					><strong>Works offline.</strong> Pro keeps running between check-ins; it only needs to reach
					the internet briefly every so often.</span
				>
			</li>
			<li class="flex gap-3">
				<span class="text-brand">•</span><span
					><strong>It never locks you out.</strong> If a subscription lapses, Editmamei keeps running
					as free Community, and your work and settings are untouched. Renew and Pro switches back on.</span
				>
			</li>
		</ul>
		<p class="mt-8 text-base leading-relaxed text-neutral-700">
			Stuck? <a
				href="/contact"
				class="font-medium text-brand underline underline-offset-2 hover:text-brand-light"
				>Get in touch</a
			> and we'll sort it out.
		</p>
	</div>
</section>
