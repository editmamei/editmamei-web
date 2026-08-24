<script lang="ts">
	import { track } from '$lib/analytics/clarity';
	import { SUBSCRIBE_API_URL } from '$lib/links';

	// `compact` is the footer treatment: one line, no heading. The blog index
	// uses the fuller one, where someone has just finished reading a post.
	let { compact = false }: { compact?: boolean } = $props();

	let email = $state('');
	let website = $state(''); // honeypot — see the hidden field below
	// Not named `state`: a variable of that name collides with the $state rune,
	// because `$state` also reads as store-subscription syntax.
	let status = $state<'idle' | 'sending' | 'sent' | 'error'>('idle');
	let message = $state('');

	async function submit(event: SubmitEvent) {
		// Without JavaScript this handler never runs and the browser posts the
		// form natively to the same endpoint, which redirects to /subscribed.
		event.preventDefault();
		if (status === 'sending') return;

		status = 'sending';
		message = '';
		try {
			const response = await fetch(`${SUBSCRIBE_API_URL}/v1/subscribe`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, website })
			});
			if (response.ok) {
				status = 'sent';
				email = '';
				track('subscribe-submitted');
			} else {
				const body = (await response.json().catch(() => ({}))) as { error?: string };
				status = 'error';
				message = body.error ?? 'That did not go through. Try again in a moment.';
			}
		} catch {
			status = 'error';
			message = 'That did not go through. Try again in a moment.';
		}
	}
</script>

<form
	method="POST"
	action={`${SUBSCRIBE_API_URL}/v1/subscribe`}
	onsubmit={submit}
	class={compact ? '' : 'rounded-xl border border-neutral-200 bg-cream p-6'}
>
	{#if !compact}
		<p class="text-base font-semibold tracking-tight text-neutral-900">Get the updates</p>
		<p class="mt-2 text-sm leading-relaxed text-neutral-600">
			New releases and new posts. Nothing else, and you can leave whenever you want.
		</p>
	{:else}
		<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Updates</p>
		<p class="mt-3 text-sm text-neutral-600">New releases and new posts.</p>
	{/if}

	<div class="mt-3 flex flex-wrap gap-2">
		<label class="sr-only" for={compact ? 'subscribe-email-footer' : 'subscribe-email'}>
			Email address
		</label>
		<input
			id={compact ? 'subscribe-email-footer' : 'subscribe-email'}
			type="email"
			name="email"
			bind:value={email}
			required
			autocomplete="email"
			placeholder="you@example.com"
			class="min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none"
		/>
		<button
			type="submit"
			disabled={status === 'sending'}
			class="cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-default disabled:opacity-60"
		>
			{status === 'sending' ? 'Sending' : 'Subscribe'}
		</button>
	</div>

	<!--
		Honeypot. Hidden from people and from screen readers, left in the DOM for
		anything that fills in every field it finds. tabindex=-1 keeps it out of
		keyboard order, so a keyboard user never lands in it by accident.
	-->
	<div class="hidden" aria-hidden="true">
		<label for={compact ? 'subscribe-website-footer' : 'subscribe-website'}>
			Leave this empty
		</label>
		<input
			id={compact ? 'subscribe-website-footer' : 'subscribe-website'}
			type="text"
			name="website"
			bind:value={website}
			tabindex="-1"
			autocomplete="off"
		/>
	</div>

	<p class="mt-3 text-xs text-neutral-500" role="status" aria-live="polite">
		{#if status === 'sent'}
			Check your inbox and click the link to confirm. It works for 48 hours.
		{:else if status === 'error'}
			{message}
		{:else}
			Confirmed opt-in, one click to unsubscribe.
		{/if}
	</p>
</form>
