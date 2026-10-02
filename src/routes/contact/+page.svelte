<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import {
		CUSTOMER_PORTAL_URL,
		GITHUB_ISSUES_URL,
		GITHUB_README_URL,
		GITHUB_SECURITY_ADVISORY_URL
	} from '$lib/links';
</script>

<Seo
	title="Contact: support, billing and bug reports · Editmamei"
	description="Get help with Editmamei: open a GitHub issue for bugs and setup questions, email support for billing and license questions, and report security issues privately."
	path="/contact"
/>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Contact</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">Get in touch</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-600">
			Editmamei is an independent product, not affiliated with Adobe. The channels below cover
			support, billing and security reports.
		</p>

		<dl class="mt-12 space-y-10">
			<div>
				<dt class="text-base font-semibold text-neutral-950">Support</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					For installation help, bug reports, and general questions, open a public issue on GitHub
					first, since the answer will help others too. For anything private, email
					<a href="mailto:support@editmamei.com" class="underline hover:text-neutral-950"
						>support@editmamei.com</a
					>.
				</dd>
				<dd class="mt-3">
					<a
						href={GITHUB_ISSUES_URL}
						class="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
					>
						Open an issue on GitHub ↗
					</a>
				</dd>
			</div>

			<div>
				<dt class="text-base font-semibold text-neutral-950">Billing and licenses</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					For billing, license or account questions, email
					<a href="mailto:support@editmamei.com" class="underline hover:text-neutral-950"
						>support@editmamei.com</a
					>. Please don't raise them in the public GitHub tracker, where invoice details would be
					visible to everyone. To update payment, cancel, view invoices or remove a device yourself,
					use your
					<a href={CUSTOMER_PORTAL_URL} rel="noopener" class="underline hover:text-neutral-950"
						>account portal</a
					>.
				</dd>
			</div>

			<div>
				<dt class="text-base font-semibold text-neutral-950">Security disclosures</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					If you have found a vulnerability in the Editmamei software, report it privately rather
					than opening a public issue: through a
					<a
						href={GITHUB_SECURITY_ADVISORY_URL}
						rel="noopener noreferrer"
						class="underline hover:text-neutral-950">GitHub security advisory</a
					>
					(preferred), or by email to
					<a href="mailto:security@editmamei.com" class="underline hover:text-neutral-950"
						>security@editmamei.com</a
					>. You'll get an acknowledgment within a few business days.
				</dd>
				<dd class="mt-3">
					<a href="/security" class="text-sm text-neutral-600 underline hover:text-neutral-950">
						Security policy
					</a>
				</dd>
			</div>

			<div>
				<dt class="text-base font-semibold text-neutral-950">Documentation and community</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					The
					<a href={GITHUB_README_URL} class="underline hover:text-neutral-950">README on GitHub</a>
					covers installation, configuration, and all available tools. Common setup questions are also
					answered in the <a href="/faq" class="underline hover:text-neutral-950">FAQ</a>.
				</dd>
			</div>
		</dl>
	</div>
</section>
