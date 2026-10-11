<script lang="ts">
	import { track } from '$lib/analytics/clarity';
	import { connectLink } from '$lib/content/surfaces';
</script>

<!-- A compact hand-off to /connect, just before the install steps, for visitors
     with no editor on the machine they're reading this on. -->
<section
	aria-labelledby="connect-callout"
	class="border-y border-neutral-200 bg-cream py-10 md:py-12"
>
	<div
		class="mx-auto flex max-w-6xl flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between md:gap-10"
	>
		<div class="max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Editmamei Connect
			</p>
			<h2
				id="connect-callout"
				class="text-xl font-bold tracking-tight text-neutral-950 md:text-2xl"
			>
				No editor on this computer?
			</h2>
			<p class="mt-2 text-base leading-relaxed text-neutral-700">
				Connect does the editing on Editmamei's server instead. Send Claude a photo from your phone
				or laptop, say what you want, and download the finished photo, with nothing to install.
			</p>
		</div>
		<a
			href={connectLink.href}
			onclick={() => track('home-connect-callout')}
			class="inline-flex shrink-0 items-center justify-center self-start rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-900 transition-colors hover:border-neutral-500 md:self-center"
		>
			See what Connect does <span aria-hidden="true" class="ml-1">→</span>
		</a>
	</div>
</section>
