<script lang="ts">
	import FlowLink from '$lib/components/flow/FlowLink.svelte';

	// How Desktop is wired: the editor, Editmamei and the AI app all run on your
	// computer; only the AI app talks to the cloud model. A small preview hops
	// out link by link, and the edit comes back.
	const thumb = '/desktop/falls.webp';
</script>

<div class="flex flex-col items-stretch lg:flex-row lg:items-center">
	<!-- Your computer -->
	<div
		class="relative flex flex-col items-stretch rounded-[26px] border border-accent/30 bg-white/[0.03] px-5 pt-11 pb-6 lg:flex-[4] lg:flex-row lg:items-center lg:px-7 lg:pb-9"
	>
		<span
			class="absolute top-4 left-5 flex items-center gap-2 text-[12px] font-bold tracking-[0.14em] text-accent uppercase lg:left-7"
		>
			<svg
				aria-hidden="true"
				class="size-4"
				viewBox="0 0 32 32"
				fill="none"
				stroke="currentColor"
				stroke-width="2.4"
				stroke-linejoin="round"
				><rect x="6" y="7" width="20" height="13" rx="2" /><path d="M3 24h26l-2 2.5H5L3 24z" /></svg
			>
			Your computer
		</span>

		<div class="fl-node">
			<img
				src="/desktop/falls.webp"
				alt="A waterfall, open in the editor"
				class="mb-3 aspect-[3/4] w-20 rounded-md object-cover shadow-lg ring-1 ring-white/15"
				loading="lazy"
			/>
			<div class="fl-node-title">Photoshop or GIMP</div>
			<div class="fl-node-sub">Your full-size photo stays here, and the edit happens here</div>
		</div>

		<FlowLink
			kind="editor"
			label="Layers, masks, filters"
			{thumb}
			out="photo"
			outAt={0}
			back="edit"
			backAt={6.4}
		/>

		<div class="fl-node">
			<div
				class="mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-2xl font-black text-brand-deep shadow-[0_0_30px_-4px_rgba(206,255,140,0.6)]"
				aria-hidden="true"
			>
				E
			</div>
			<div class="fl-node-title">Editmamei</div>
			<div class="fl-node-sub">Runs each step with the editor's own tools</div>
		</div>

		<FlowLink
			kind="editor"
			label="Tool calls and small previews"
			{thumb}
			out="photo"
			outAt={1.2}
			back="edit"
			backAt={5.2}
		/>

		<div class="fl-node">
			<div
				class="mb-3 grid size-14 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20"
				aria-hidden="true"
			>
				<svg
					class="size-7 text-white"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4V5z" /></svg
				>
			</div>
			<div class="fl-node-title">Your AI app</div>
			<div class="fl-node-sub">Claude Desktop, Claude Code, Cursor and others</div>
		</div>
	</div>

	<FlowLink
		kind="ai"
		label="Your request and small previews"
		{thumb}
		out="photo"
		outAt={2.4}
		back="edit"
		backAt={4}
	/>

	<!-- The cloud -->
	<div
		class="relative flex flex-col items-center rounded-[26px] border border-dashed border-[#ffb08f]/50 bg-white/[0.02] px-5 py-6 lg:flex-1 lg:py-10"
	>
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
			<div class="fl-node-sub">In the cloud, as with any chat</div>
		</div>
	</div>
</div>
