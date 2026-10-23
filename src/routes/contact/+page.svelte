<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import {
		CONNECT_URL,
		CUSTOMER_PORTAL_URL,
		GITHUB_ISSUES_URL,
		GITHUB_README_URL,
		GITHUB_SECURITY_ADVISORY_URL
	} from '$lib/links';

	const link = 'font-semibold text-brand underline underline-offset-2';
</script>

<Seo
	title="Contact Editmamei: support, billing and bug reports"
	description="Bugs and setup questions go to GitHub issues; billing, licenses, Connect accounts and anything private to support@editmamei.com; vulnerabilities privately."
	path="/contact"
/>

<PageHero
	eyebrow="Contact"
	title="Get in touch"
	lede="Bugs and setup questions go to GitHub, where the answer helps the next person too. Billing, accounts and anything private go to support@editmamei.com."
/>

<section class="bg-paper px-4 py-14 md:py-20">
	<div class="mx-auto max-w-3xl">
		<dl class="divide-y divide-[#ddd6c4] border-y border-[#ddd6c4] text-[16px] leading-relaxed">
			<div class="py-7">
				<dt class="text-xl font-bold text-brand">Support</dt>
				<dd class="mt-2 text-neutral-700">
					For installation help, bug reports and general questions about Editmamei Desktop, open a
					public issue on GitHub first, since the answer will help others too. For anything private,
					email
					<a href="mailto:support@editmamei.com" class={link}>support@editmamei.com</a>.
				</dd>
				<dd class="mt-4">
					<a
						href={GITHUB_ISSUES_URL}
						class="inline-flex min-h-12 items-center rounded-2xl bg-brand px-6 text-[16px] font-bold text-white transition-colors hover:bg-brand-light"
						>Open an issue on GitHub <span aria-hidden="true" class="ml-1.5">↗</span></a
					>
				</dd>
			</div>

			<div class="py-7">
				<dt class="text-xl font-bold text-brand">Editmamei Connect</dt>
				<dd class="mt-2 text-neutral-700">
					Your credit balance and purchases are in your account at
					<a href={CONNECT_URL} class={link}>connect.editmamei.com</a>. For anything else about your
					Connect account, including deleting it, email
					<a href="mailto:support@editmamei.com" class={link}>support@editmamei.com</a> from the address
					on the account.
				</dd>
			</div>

			<div class="py-7">
				<dt class="text-xl font-bold text-brand">Billing and Pro licenses</dt>
				<dd class="mt-2 text-neutral-700">
					For billing, license or account questions, email
					<a href="mailto:support@editmamei.com" class={link}>support@editmamei.com</a>. Please
					don't raise them in the public GitHub tracker, where invoice details would be visible to
					everyone. To update payment, cancel, view invoices or remove a device yourself, use your
					<a href={CUSTOMER_PORTAL_URL} rel="noopener" class={link}>Pro account portal</a>.
				</dd>
			</div>

			<div class="py-7">
				<dt class="text-xl font-bold text-brand">Security disclosures</dt>
				<dd class="mt-2 text-neutral-700">
					Found a vulnerability in the Editmamei software? Report it privately rather than in a
					public issue: through a
					<a href={GITHUB_SECURITY_ADVISORY_URL} rel="noopener noreferrer" class={link}
						>GitHub security advisory</a
					>
					(preferred), or by email to
					<a href="mailto:security@editmamei.com" class={link}>security@editmamei.com</a>, which
					also takes reports about Editmamei Connect and this website. You'll get an acknowledgment
					within a few business days. More on the
					<a href="/security" class={link}>security page</a>.
				</dd>
			</div>

			<div class="py-7">
				<dt class="text-xl font-bold text-brand">Documentation</dt>
				<dd class="mt-2 text-neutral-700">
					The
					<a href={GITHUB_README_URL} class={link}>README on GitHub</a>
					covers installation, configuration and every tool, and the
					<a href="/desktop/docs" class={link}>docs page</a> links each guide. Common questions are
					answered in the <a href="/faq" class={link}>FAQ</a>.
				</dd>
			</div>
		</dl>
		<p class="mt-8 text-[14px] text-neutral-500">
			Editmamei is an independent product, not affiliated with Adobe.
		</p>
	</div>
</section>
