<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics/clarity';
	import { SUBSCRIBE_API_URL } from '$lib/links';

	// `compact` is the footer treatment: one line, no heading. The blog index
	// uses the fuller one, where someone has just finished reading a post.
	//
	// `tone` exists because this form is no longer only on cream: the install
	// reveal is a dark panel, and the light treatment is unreadable on it.
	//
	// `placement` names the surface explicitly. It used to be inferred from
	// `compact`, which stopped working the moment a third surface existed --
	// and it also keys the DOM ids below, so two instances on one page cannot
	// collide.
	// `showIntro` exists because the download dialog supplies its own heading (it
	// needs one anyway, to label the dialog for assistive tech). Without this the
	// heading and blurb render twice, once from the dialog and once from here.
	let {
		compact = false,
		tone = 'light',
		placement,
		showIntro = true
	}: {
		compact?: boolean;
		tone?: 'light' | 'dark';
		placement?: string;
		showIntro?: boolean;
	} = $props();

	const uid = $derived(placement ?? (compact ? 'footer' : 'blog'));
	const dark = $derived(tone === 'dark');

	// Which surface sent this signup. Defaults to the placement; a link that
	// arrives with ?src= (the CLI and the update notice both do) wins, so a
	// person who lands from the terminal and scrolls to the footer is still
	// counted as coming from the terminal. The Worker only accepts values it
	// knows, so an edited URL cannot invent a label.
	let urlSrc = $state<string | null>(null);
	const src = $derived(urlSrc ?? uid);

	onMount(() => {
		urlSrc = new URLSearchParams(window.location.search).get('src');
	});

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
				body: JSON.stringify({ email, website, src })
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
	{#if !showIntro}
		<!-- The container supplies the heading. -->
	{:else if dark}
		<p class="text-sm font-semibold text-neutral-100">Want to hear about new releases?</p>
		<p class="mt-1.5 text-sm leading-relaxed text-neutral-300">
			New releases and new posts. Nothing else, and you can leave whenever you want.
		</p>
	{:else if !compact}
		<p class="text-base font-semibold tracking-tight text-neutral-900">Get the updates</p>
		<p class="mt-2 text-sm leading-relaxed text-neutral-600">
			New releases and new posts. Nothing else, and you can leave whenever you want.
		</p>
	{:else}
		<p class="text-xs font-semibold tracking-wider text-neutral-500 uppercase">Updates</p>
		<p class="mt-3 text-sm text-neutral-600">New releases and new posts.</p>
	{/if}

	<div class="mt-3 flex flex-wrap gap-2">
		<label class="sr-only" for={`subscribe-email-${uid}`}>Email address</label>
		<input
			id={`subscribe-email-${uid}`}
			type="email"
			name="email"
			bind:value={email}
			required
			autocomplete="email"
			placeholder="you@example.com"
			class={dark
				? 'min-w-0 flex-1 rounded-lg border border-accent/30 bg-brand-deep px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:border-accent focus:outline-none'
				: 'min-w-0 flex-1 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-500 focus:outline-none'}
		/>
		<button
			type="submit"
			disabled={status === 'sending'}
			class={dark
				? 'cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-brand-deep hover:bg-accent/90 disabled:cursor-default disabled:opacity-60'
				: 'cursor-pointer rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 disabled:cursor-default disabled:opacity-60'}
		>
			{status === 'sending' ? 'Sending' : 'Subscribe'}
		</button>
	</div>

	<!-- Carries the source on a native (no-JavaScript) post, where the fetch
	     body above never runs. -->
	<input type="hidden" name="src" value={src} />

	<!--
		Honeypot. Hidden from people and from screen readers, left in the DOM for
		anything that fills in every field it finds. tabindex=-1 keeps it out of
		keyboard order, so a keyboard user never lands in it by accident.
	-->
	<div class="hidden" aria-hidden="true">
		<label for={`subscribe-website-${uid}`}>Leave this empty</label>
		<input
			id={`subscribe-website-${uid}`}
			type="text"
			name="website"
			bind:value={website}
			tabindex="-1"
			autocomplete="off"
		/>
	</div>

	<p
		class={dark ? 'mt-3 text-xs text-neutral-400' : 'mt-3 text-xs text-neutral-500'}
		role="status"
		aria-live="polite"
	>
		{#if status === 'sent'}
			Check your inbox and click the link to confirm. It works for 48 hours.
		{:else if status === 'error'}
			{message}
		{:else}
			Confirmed opt-in, one click to unsubscribe.
		{/if}
	</p>
</form>
