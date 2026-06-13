<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
	title="Contact — Editmamei"
	description="Get support for Editmamei or report a security issue. Reach the team by email or open a public issue on GitHub."
	path="/contact"
/>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Contact</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">Get in touch</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-600">
			Editmamei is an independent product, not affiliated with Adobe. Use the channels below for
			support questions and security disclosures.
		</p>

		<dl class="mt-12 space-y-10">
			<div>
				<dt class="text-base font-semibold text-neutral-950">Support</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					For installation help, bug reports, and general questions, open a public issue on GitHub
					first — the answer will help others too. For private matters, email
					<a href="mailto:support@editmamei.com" class="underline hover:text-neutral-950"
						>support@editmamei.com</a
					>.
				</dd>
				<dd class="mt-3">
					<a
						href="https://github.com/editmamei/editmamei-ce/issues"
						class="inline-flex items-center gap-1.5 rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
					>
						Open an issue on GitHub ↗
					</a>
				</dd>
			</div>

			<div>
				<dt class="text-base font-semibold text-neutral-950">Security disclosures</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					If you have found a security vulnerability, please report it privately rather than opening
					a public issue. Email
					<a href="mailto:security@editmamei.com" class="underline hover:text-neutral-950"
						>security@editmamei.com</a
					>
					with a description of the issue and steps to reproduce. We will respond within 72 hours.
				</dd>
				<dd class="mt-3">
					<a href="/security" class="text-sm text-neutral-600 underline hover:text-neutral-950">
						Security policy ↗
					</a>
				</dd>
			</div>

			<div>
				<dt class="text-base font-semibold text-neutral-950">Documentation and community</dt>
				<dd class="mt-2 text-sm leading-relaxed text-neutral-700">
					The
					<a
						href="https://github.com/editmamei/editmamei-ce#readme"
						class="underline hover:text-neutral-950">README on GitHub</a
					>
					covers installation, configuration, and all available tools. Common setup questions are also
					answered in the <a href="/faq" class="underline hover:text-neutral-950">FAQ</a>.
				</dd>
			</div>
		</dl>

		<div class="mt-16 rounded-lg border border-neutral-200 bg-neutral-50 p-6">
			<p class="text-sm font-semibold text-neutral-950">About Editmamei</p>
			<p class="mt-2 text-sm leading-relaxed text-neutral-600">
				Editmamei is a command-line package that drives Adobe Photoshop with natural-language
				instructions from an AI client. It runs entirely on your computer — your files never leave
				your machine. It is not a web app, not a cloud editor, and not affiliated with Adobe.
			</p>
		</div>
	</div>
</section>
