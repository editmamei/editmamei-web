<script lang="ts">
	import { track } from '$lib/analytics/clarity';
	import { cookieConsent } from '$lib/stores/cookieConsent';
	import { CUSTOMER_PORTAL_URL } from '$lib/links';
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-200 bg-paper">
	<div class="mx-auto max-w-6xl px-4 py-12 md:py-16">
		<div class="grid gap-8 sm:grid-cols-2 md:grid-cols-5">
			<!-- Brand + where to find us -->
			<div class="sm:col-span-2">
				<p class="text-base font-semibold tracking-tight text-neutral-900">Editmamei</p>
				<p class="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
					Unlock Photoshop with natural-language photo editing. AI orchestration, not generation.
					Your AI plans the edit; your Photoshop carries it out.
				</p>
				<p class="mt-4 text-sm text-neutral-500 italic">
					Pairs well with: a layered PSD, a willing AI, and a small bowl of edamame.
				</p>
				<ul class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
					<li>
						<a
							href="https://github.com/editmamei"
							onclick={() => track('footer-outbound-github')}
							class="hover:text-neutral-950">GitHub</a
						>
					</li>
					<li>
						<a
							href="https://www.npmjs.com/package/editmamei"
							onclick={() => track('footer-outbound-npm')}
							class="hover:text-neutral-950">npm</a
						>
					</li>
					<li>
						<a
							href="https://peerpush.com/p/editmamei"
							onclick={() => track('footer-outbound-peerpush')}
							class="hover:text-neutral-950">Featured on PeerPush</a
						>
					</li>
					<li>
						<a
							href="https://www.instagram.com/editmamei/"
							onclick={() => track('footer-outbound-instagram')}
							rel="me noopener"
							class="inline-flex items-center gap-1.5 hover:text-neutral-950"
						>
							<svg
								viewBox="0 0 24 24"
								class="size-4"
								fill="none"
								stroke="currentColor"
								stroke-width="1.8"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true"
							>
								<rect x="3" y="3" width="18" height="18" rx="5" />
								<circle cx="12" cy="12" r="4" />
								<circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
							</svg>
							Instagram
						</a>
					</li>
				</ul>
			</div>

			<!-- Explore: the marketing pages -->
			<div>
				<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Explore</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li><a href="/product" class="hover:text-neutral-950">Product</a></li>
					<li><a href="/pricing" class="hover:text-neutral-950">Plans</a></li>
					<li><a href="/#demo" class="hover:text-neutral-950">Demo</a></li>
				</ul>
			</div>

			<!-- Resources: read and learn -->
			<div>
				<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Resources</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li>
						<a
							href="https://github.com/editmamei/editmamei-wiki#readme"
							onclick={() => track('footer-outbound-docs')}
							class="hover:text-neutral-950">Docs</a
						>
					</li>
					<li><a href="/faq" class="hover:text-neutral-950">FAQ</a></li>
					<li>
						<a
							href="https://github.com/editmamei/editmamei-wiki/blob/main/CHANGELOG.md"
							onclick={() => track('footer-outbound-changelog')}
							class="hover:text-neutral-950">Changelog</a
						>
					</li>
				</ul>
			</div>

			<!-- Account & support: licenses and help -->
			<div>
				<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
					Account &amp; support
				</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li><a href="/activate" class="hover:text-neutral-950">Activate Pro</a></li>
					<li>
						<a
							href={CUSTOMER_PORTAL_URL}
							onclick={() => track('footer-outbound-portal')}
							rel="noopener"
							class="hover:text-neutral-950">Manage subscription</a
						>
					</li>
					<li>
						<a
							href="https://github.com/editmamei/editmamei-wiki/issues"
							onclick={() => track('footer-outbound-issues')}
							class="hover:text-neutral-950">Report a bug</a
						>
					</li>
					<li><a href="/contact" class="hover:text-neutral-950">Contact</a></li>
				</ul>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="flex items-center gap-2">
				<img src="/icons/favicon-32.png" alt="" width="20" height="20" class="size-5 rounded-md" />
				<span>© {year} Editmamei</span>
			</p>
			<p class="flex items-center gap-4">
				<a href="/privacy" class="hover:text-neutral-800">Privacy</a>
				<button
					onclick={() => cookieConsent.reopen()}
					class="cursor-pointer hover:text-neutral-800"
				>
					Cookie preferences
				</button>
				<a href="/security" class="hover:text-neutral-800">Security</a>
				<a href="/license" class="hover:text-neutral-800">License</a>
			</p>
		</div>
	</div>
</footer>
