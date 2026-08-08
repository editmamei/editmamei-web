<script lang="ts">
	import { GITHUB_SECURITY_ADVISORY_URL, GITHUB_SECURITY_POLICY_URL } from '$lib/links';
</script>

<svelte:head>
	<title>Security: how to report a vulnerability — Editmamei</title>
	<meta
		name="description"
		content="How to report a security issue in Editmamei. Software vulnerabilities go through the GitHub security policy; website issues by email."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">Security</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">
			Reporting a security issue
		</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			We take security reports seriously and want them easy to send. Where a report goes depends on
			what it's about.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">The Editmamei software</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			For a vulnerability in the <code class="rounded bg-neutral-200 px-1 py-0.5 font-mono text-xs"
				>editmamei</code
			>
			npm package (the CLI and the MCP server you install), the full policy lives on GitHub: scope, what
			to include, and our response timelines. The preferred channel is a private security advisory, which
			keeps your report confidential while we work on a fix.
		</p>
		<ul class="mt-4 space-y-2 text-sm leading-relaxed text-neutral-700">
			<li>
				<a
					href={GITHUB_SECURITY_ADVISORY_URL}
					rel="noopener noreferrer"
					class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
					>Report a vulnerability privately</a
				>
				(preferred)
			</li>
			<li>
				Read the
				<a
					href={GITHUB_SECURITY_POLICY_URL}
					rel="noopener noreferrer"
					class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
					>security policy</a
				>
				on GitHub.
			</li>
		</ul>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			Please don't open a public GitHub issue for a security bug. The tracker is public, so the
			report would be too.
		</p>

		<h2 class="mt-12 text-xl font-bold tracking-tight text-neutral-950">This website</h2>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			For an issue in editmamei.com itself or its hosting, email
			<a
				href="mailto:security@editmamei.com"
				class="font-semibold text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700"
				>security@editmamei.com</a
			>. A PGP key is available on request.
		</p>

		<div class="mt-12 border-t border-neutral-200 pt-6">
			<a
				href="/"
				class="text-sm font-semibold text-neutral-900 underline underline-offset-2 hover:text-neutral-700"
			>
				Back to home →
			</a>
		</div>
	</div>
</section>
