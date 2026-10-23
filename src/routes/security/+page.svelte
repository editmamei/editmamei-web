<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { GITHUB_SECURITY_ADVISORY_URL, GITHUB_SECURITY_POLICY_URL } from '$lib/links';

	const link = 'font-semibold text-brand underline underline-offset-2';
	const code = 'rounded bg-[#ece6d6] px-1.5 py-0.5 font-mono text-[14px]';
</script>

<Seo
	title="Report a security issue · Editmamei"
	description="How to report a vulnerability in Editmamei: a private GitHub security advisory for the software, or email for Editmamei Connect and this website."
	path="/security"
/>

<PageHero
	eyebrow="Security"
	title="Reporting a security issue"
	lede="Where a security report goes depends on what it's about. Whichever it is, please report it privately, not in a public issue."
/>

<section class="bg-paper px-4 py-14 md:py-20">
	<div class="mx-auto max-w-3xl text-[16px] leading-relaxed text-neutral-700">
		<h2 class="text-2xl font-bold tracking-[-0.02em] text-brand">Editmamei Desktop</h2>
		<p class="mt-3">
			For a vulnerability in the <code class={code}>editmamei</code> npm package (the CLI and the MCP
			server you install), the full policy lives on GitHub: scope, what to include, and our response timelines.
			The preferred channel is a private security advisory, which keeps your report confidential while
			we work on a fix. You'll get an acknowledgment within a few business days.
		</p>
		<ul class="mt-4 grid gap-2">
			<li>
				<a href={GITHUB_SECURITY_ADVISORY_URL} rel="noopener noreferrer" class={link}
					>Report a vulnerability privately</a
				>
				(preferred)
			</li>
			<li>
				Read the
				<a href={GITHUB_SECURITY_POLICY_URL} rel="noopener noreferrer" class={link}
					>security policy</a
				>
				on GitHub.
			</li>
		</ul>
		<p class="mt-4">
			Please don't open a public GitHub issue for a security bug. The tracker is public, so the
			report would be too.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-[-0.02em] text-brand">Editmamei Connect</h2>
		<p class="mt-3">
			For an issue in Editmamei Connect at connect.editmamei.com, its sign-in or the files it
			handles, email
			<a href="mailto:security@editmamei.com" class={link}>security@editmamei.com</a>.
		</p>

		<h2 class="mt-12 text-2xl font-bold tracking-[-0.02em] text-brand">This website</h2>
		<p class="mt-3">
			For an issue in editmamei.com itself or its hosting, email
			<a href="mailto:security@editmamei.com" class={link}>security@editmamei.com</a>. A PGP key is
			available on request.
		</p>
	</div>
</section>
