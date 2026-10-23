<script lang="ts">
	import FlowLink from '$lib/components/flow/FlowLink.svelte';

	// How Connect is wired, in two tracks. The conversation runs phone -> AI
	// model -> Editmamei's server and back; the photo itself goes straight to
	// Editmamei's server by an upload link and comes back as a download. Facts
	// follow Connect's privacy policy (uploads deleted 24 hours after upload).
	const thumb = '/connect/lehua/9.webp';
</script>

{#snippet phone()}
	<div class="fl-node">
		<div
			class="mb-3 grid h-14 w-9 place-items-center rounded-[10px] bg-white/10 ring-1 ring-white/25"
			aria-hidden="true"
		>
			<span class="h-1 w-3 rounded-full bg-white/40"></span>
		</div>
		<div class="fl-node-title">Your phone</div>
		<div class="fl-node-sub">Or laptop. Your AI app, with Connect added</div>
	</div>
{/snippet}

{#snippet server(sub: string)}
	<div class="fl-node">
		<div
			class="mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-2xl font-black text-brand-deep shadow-[0_0_30px_-4px_rgba(206,255,140,0.6)]"
			aria-hidden="true"
		>
			E
		</div>
		<div class="fl-node-title">Editmamei's server</div>
		<div class="fl-node-sub">{sub}</div>
	</div>
{/snippet}

<div class="grid gap-6">
	<div
		class="relative rounded-[26px] border border-dashed border-[#ffb08f]/45 bg-white/[0.02] px-5 pt-11 pb-6 lg:px-7 lg:pb-8"
	>
		<span
			class="absolute top-4 left-5 text-[12px] font-bold tracking-[0.14em] text-[#ffb08f] uppercase lg:left-7"
			>The conversation</span
		>
		<div class="flex flex-col items-stretch lg:flex-row lg:items-center">
			{@render phone()}
			<FlowLink kind="ai" label="Your request" {thumb} out="text" outAt={0} />
			<div class="fl-node">
				<div
					class="mb-3 grid size-14 place-items-center rounded-2xl bg-[#ff8a5c]/15 ring-1 ring-[#ffb08f]/40"
					aria-hidden="true"
				>
					<svg
						class="size-7 text-[#ffb08f]"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.8"
						stroke-linejoin="round"
						><path d="M7 18h10a4 4 0 0 0 .6-7.96A6 6 0 0 0 6.2 9.1 4.5 4.5 0 0 0 7 18z" /></svg
					>
				</div>
				<div class="fl-node-title">The AI model</div>
				<div class="fl-node-sub">Plans each step, as with any chat</div>
			</div>
			<FlowLink
				kind="ai"
				label="Each step, and a small preview back"
				{thumb}
				out="edit"
				outAt={1.2}
				back="photo"
				backAt={2.6}
			/>
			{@render server('Makes each edit with real editing tools')}
		</div>
	</div>

	<div
		class="relative rounded-[26px] border border-accent/30 bg-white/[0.03] px-5 pt-11 pb-6 lg:px-7 lg:pb-8"
	>
		<span
			class="absolute top-4 left-5 text-[12px] font-bold tracking-[0.14em] text-accent uppercase lg:left-7"
			>Your photo</span
		>
		<div class="flex flex-col items-stretch lg:flex-row lg:items-center">
			{@render phone()}
			<FlowLink
				kind="editor"
				label="Up by an upload link, back as a download"
				{thumb}
				out="photo"
				outAt={0.4}
				back="photo"
				backAt={4.4}
			/>
			{@render server('Deleted 24 hours after upload')}
		</div>
	</div>
</div>
