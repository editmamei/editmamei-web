<script lang="ts">
	import { onMount } from 'svelte';
	import { cookieConsent } from '$lib/stores/cookieConsent';
	import { setConsent } from '$lib/analytics/clarity';

	let mounted = $state(false);

	onMount(() => {
		cookieConsent.init();
		mounted = true;
	});

	function accept() {
		cookieConsent.grant();
		setConsent(true);
	}

	function decline() {
		cookieConsent.deny();
	}
</script>

{#if mounted && $cookieConsent === null}
	<div
		role="dialog"
		aria-label="Cookie consent"
		aria-modal="false"
		class="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white px-4 py-4 shadow-[0_-2px_12px_0_rgba(0,0,0,0.06)]"
	>
		<div
			class="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
		>
			<p class="text-sm text-neutral-700">
				We use analytics cookies to understand how this site is used. See our <a
					href="/privacy#cookies"
					class="underline hover:text-neutral-950">cookie policy</a
				>.
			</p>
			<div class="flex shrink-0 gap-2">
				<button
					onclick={decline}
					class="rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
				>
					Decline
				</button>
				<button
					onclick={accept}
					class="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
				>
					Accept cookies
				</button>
			</div>
		</div>
	</div>
{/if}
