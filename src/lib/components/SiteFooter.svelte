<script lang="ts">
	import { track } from '$lib/analytics/clarity';
	import { cookieConsent } from '$lib/stores/cookieConsent';
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-200 bg-paper">
	<div class="mx-auto max-w-6xl px-4 py-12 md:py-16">
		<div class="grid gap-8 md:grid-cols-4">
			<div class="md:col-span-2">
				<p class="text-base font-semibold tracking-tight text-neutral-900">Editmamei</p>
				<p class="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
					Unlock Photoshop with natural-language photo editing. AI orchestration, not generation.
					Your AI plans the edit; your Photoshop carries it out.
				</p>
				<p class="mt-4 text-sm text-neutral-500 italic">
					Pairs well with: a layered PSD, a willing AI, and a small bowl of edamame.
				</p>
			</div>

			<div>
				<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Product</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li><a href="/product" class="hover:text-neutral-950">Features</a></li>
					<li><a href="/pricing" class="hover:text-neutral-950">Pricing</a></li>
					<li><a href="/faq" class="hover:text-neutral-950">FAQ</a></li>
					<li><a href="/contact" class="hover:text-neutral-950">Contact</a></li>
					<li>
						<a
							href="https://github.com/editmamei/editmamei-ce/blob/main/CHANGELOG.md"
							onclick={() => track('footer-outbound-changelog')}
							class="hover:text-neutral-950">Changelog</a
						>
					</li>
					<li><a href="/#demo" class="hover:text-neutral-950">Demo</a></li>
				</ul>
			</div>

			<div>
				<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Resources</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li>
						<a
							href="https://github.com/editmamei/editmamei-ce#readme"
							onclick={() => track('footer-outbound-docs')}
							class="hover:text-neutral-950">Docs</a
						>
					</li>
					<li>
						<a
							href="https://github.com/editmamei/editmamei-ce/issues"
							onclick={() => track('footer-outbound-issues')}
							class="hover:text-neutral-950">Report a bug</a
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
							href="https://github.com/editmamei"
							onclick={() => track('footer-outbound-github')}
							class="hover:text-neutral-950">GitHub</a
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
