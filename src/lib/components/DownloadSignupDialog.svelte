<script lang="ts">
	import SubscribeForm from '$lib/components/SubscribeForm.svelte';
	import { track } from '$lib/analytics/clarity';

	// Shown right after the .mcpb download fires. It deliberately does NOT gate
	// anything: the anchor's default action has already started the download by
	// the time this opens, and the install steps are already revealed behind it.
	// Dismissing returns the visitor to those steps.
	//
	// Native <dialog> rather than a hand-rolled overlay: showModal() gives focus
	// trapping, Escape-to-close, inertness of the page behind, and focus return
	// to the download link, all from the browser. Re-implementing those by hand
	// is where accessible modals usually go wrong.
	let { open = $bindable(false) }: { open?: boolean } = $props();

	let dialogEl = $state<HTMLDialogElement>();

	$effect(() => {
		const el = dialogEl;
		if (!el) return;
		if (open && !el.open) {
			el.showModal();
			track('download-signup-shown');
		} else if (!open && el.open) {
			el.close();
		}
	});

	// Closing from anywhere (Escape, the X, the backdrop) funnels through the
	// dialog's own close event, so `open` can never drift out of sync with the
	// element's real state.
	function onClose() {
		open = false;
	}

	// The backdrop is part of the dialog element's own box, so a click that lands
	// on the element itself (rather than the card inside it) is a backdrop click.
	function onBackdrop(event: MouseEvent) {
		if (event.target === dialogEl) dialogEl?.close();
	}
</script>

<dialog
	bind:this={dialogEl}
	onclose={onClose}
	onclick={onBackdrop}
	aria-labelledby="download-signup-title"
	class="m-auto w-[min(30rem,calc(100vw-2rem))] rounded-2xl border border-accent/25 bg-brand-deep p-0 text-neutral-100 shadow-2xl backdrop:bg-black/60 open:motion-safe:animate-[fade-in_140ms_ease-out]"
>
	<div class="relative p-6 md:p-7">
		<button
			type="button"
			onclick={() => dialogEl?.close()}
			aria-label="Close and go back to the install steps"
			class="absolute top-3 right-3 cursor-pointer rounded-md p-2 text-neutral-400 transition-colors hover:bg-white/5 hover:text-neutral-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="none"
				stroke="currentColor"
				stroke-width="1.6"
				stroke-linecap="round"
				class="h-4 w-4"
				aria-hidden="true"
			>
				<path d="M5 5l10 10M15 5L5 15" />
			</svg>
		</button>

		<p class="text-xs font-semibold tracking-wider text-accent uppercase">
			Downloading editmamei.mcpb
		</p>
		<h2 id="download-signup-title" class="mt-2 text-lg font-semibold tracking-tight text-white">
			Want to hear about new releases?
		</h2>
		<p class="mt-2 text-sm leading-relaxed text-neutral-300">
			New releases and new posts. Nothing else, and you can leave whenever you want.
		</p>

		<div class="mt-4">
			<SubscribeForm compact tone="dark" placement="install_mcpb" showIntro={false} />
		</div>

		<button
			type="button"
			onclick={() => dialogEl?.close()}
			class="mt-4 cursor-pointer text-xs text-neutral-400 underline underline-offset-2 transition-colors hover:text-neutral-200"
		>
			No thanks, show me the install steps
		</button>
	</div>
</dialog>

<style>
	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(4px) scale(0.98);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
</style>
