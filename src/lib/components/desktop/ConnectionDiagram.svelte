<script lang="ts">
	// How Desktop is wired: the editor, Editmamei and the AI app all run on your
	// computer; only the AI app talks to the cloud model. Links carry two cues,
	// colour and line style (solid green = on your computer, dashed orange = to
	// the AI model), plus a text label, so neither colour is needed to read it.
	// A small preview travels out along the links and the edit comes back.
	type Link = { kind: 'local' | 'cloud'; label: string; slot: number };
	const links: Link[] = [
		{ kind: 'local', label: 'Layers, masks, filters', slot: 0 },
		{ kind: 'local', label: 'Tool calls and small previews', slot: 1 },
		{ kind: 'cloud', label: 'Your request and small previews', slot: 2 }
	];
</script>

{#snippet link(l: Link)}
	<div class="relative flex flex-none items-center justify-center lg:flex-1">
		<!-- the line: vertical on phones, horizontal on large screens -->
		<div
			class="line {l.kind === 'local'
				? 'line-local'
				: 'line-cloud'} h-16 w-0 lg:h-0 lg:w-full lg:min-w-16"
			aria-hidden="true"
		>
			<span class="chip-out" style="--slot: {l.slot};">
				<img src="/desktop/falls.webp" alt="" class="h-full w-full rounded-[3px] object-cover" />
			</span>
			<span class="chip-back" style="--slot: {l.slot};">✎</span>
		</div>
		<span
			class="absolute top-1/2 left-[calc(50%+14px)] -translate-y-1/2 text-[12.5px] leading-tight font-semibold whitespace-nowrap lg:hidden {l.kind ===
			'local'
				? 'text-accent'
				: 'text-[#ffb08f]'}">{l.label}</span
		>
		<span
			class="absolute top-[calc(50%+12px)] left-1/2 hidden w-[9.5rem] -translate-x-1/2 text-center text-[12px] leading-tight font-semibold lg:block {l.kind ===
			'local'
				? 'text-accent'
				: 'text-[#ffb08f]'}">{l.label}</span
		>
	</div>
{/snippet}

<div class="flex flex-col items-stretch lg:flex-row lg:items-center">
	<!-- Your computer -->
	<div
		class="relative flex flex-col items-stretch rounded-[26px] border border-accent/30 bg-white/[0.03] px-5 pt-11 pb-6 lg:flex-[3.2] lg:flex-row lg:items-center lg:px-7 lg:pb-14"
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

		<div class="node">
			<img
				src="/desktop/falls.webp"
				alt="A waterfall, open in the editor"
				class="mb-3 aspect-[3/4] w-20 rounded-md object-cover shadow-lg ring-1 ring-white/15"
				loading="lazy"
			/>
			<div class="node-title">Photoshop or GIMP</div>
			<div class="node-sub">Your full-size photo stays here, and the edit happens here</div>
		</div>

		{@render link(links[0])}

		<div class="node">
			<div
				class="mb-3 grid size-14 place-items-center rounded-2xl bg-accent text-2xl font-black text-brand-deep shadow-[0_0_30px_-4px_rgba(206,255,140,0.6)]"
				aria-hidden="true"
			>
				E
			</div>
			<div class="node-title">Editmamei</div>
			<div class="node-sub">Runs each step with the editor's own tools</div>
		</div>

		{@render link(links[1])}

		<div class="node">
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
			<div class="node-title">Your AI app</div>
			<div class="node-sub">Claude Desktop, Claude Code, Cursor and others</div>
		</div>
	</div>

	{@render link(links[2])}

	<!-- The cloud -->
	<div
		class="relative flex flex-col items-center rounded-[26px] border border-dashed border-[#ffb08f]/50 bg-white/[0.02] px-5 py-6 lg:flex-1 lg:py-10"
	>
		<div class="node">
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
			<div class="node-title">The AI model</div>
			<div class="node-sub">In the cloud, as with any chat</div>
		</div>
	</div>
</div>

<style>
	.node {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		min-width: 0;
	}
	@media (min-width: 1024px) {
		.node {
			width: 9.5rem;
			flex: none;
		}
	}
	.node-title {
		font-size: 1rem;
		font-weight: 700;
		color: #f4f1e8;
	}
	.node-sub {
		margin-top: 0.25rem;
		font-size: 0.8125rem;
		line-height: 1.35;
		color: #a9bcb4;
		max-width: 16rem;
	}

	.line {
		position: relative;
	}
	/* solid green: stays on your computer */
	.line-local {
		border-left: 3px solid #ceff8c;
		filter: drop-shadow(0 0 6px rgba(206, 255, 140, 0.55));
	}
	/* dashed orange: goes to the AI model */
	.line-cloud {
		border-left: 3px dashed #ff9b70;
		filter: drop-shadow(0 0 6px rgba(255, 138, 92, 0.45));
	}
	@media (min-width: 1024px) {
		.line-local {
			border-left: 0;
			border-top: 3px solid #ceff8c;
		}
		.line-cloud {
			border-left: 0;
			border-top: 3px dashed #ff9b70;
		}
	}

	/* What travels: a small preview out, the edit back. Each link has a slot in
	   one shared 8 s cycle, so the preview hops link to link. */
	.chip-out,
	.chip-back {
		position: absolute;
		left: -1.5px;
		top: 0;
		translate: -50% -50%;
		opacity: 0;
		pointer-events: none;
	}
	.chip-out {
		width: 18px;
		height: 24px;
		padding: 2px;
		border-radius: 4px;
		background: #f4f1e8;
		box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
	}
	.chip-back {
		display: grid;
		place-items: center;
		width: 22px;
		height: 22px;
		border-radius: 999px;
		background: #ceff8c;
		color: #0b1f1a;
		font-size: 12px;
		font-weight: 800;
	}
	@media (min-width: 1024px) {
		.chip-out,
		.chip-back {
			left: 0;
			top: -1.5px;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.chip-out {
			animation: out-y 8s linear infinite;
			animation-delay: calc(var(--slot) * 1.2s);
		}
		.chip-back {
			animation: back-y 8s linear infinite;
			animation-delay: calc((2 - var(--slot)) * 1.2s + 4s);
		}
		@media (min-width: 1024px) {
			.chip-out {
				animation-name: out-x;
			}
			.chip-back {
				animation-name: back-x;
			}
		}
	}
	/* Reduced motion: the preview sits on each link, still. */
	@media (prefers-reduced-motion: reduce) {
		.chip-out {
			opacity: 1;
			top: 50%;
		}
		@media (min-width: 1024px) {
			.chip-out {
				top: -1.5px;
				left: 50%;
			}
		}
	}

	@keyframes out-y {
		0% {
			top: 0%;
			opacity: 0;
		}
		2% {
			opacity: 1;
		}
		13% {
			opacity: 1;
		}
		15% {
			top: 100%;
			opacity: 0;
		}
		100% {
			top: 100%;
			opacity: 0;
		}
	}
	@keyframes back-y {
		0% {
			top: 100%;
			opacity: 0;
		}
		2% {
			opacity: 1;
		}
		13% {
			opacity: 1;
		}
		15% {
			top: 0%;
			opacity: 0;
		}
		100% {
			top: 0%;
			opacity: 0;
		}
	}
	@keyframes out-x {
		0% {
			left: 0%;
			opacity: 0;
		}
		2% {
			opacity: 1;
		}
		13% {
			opacity: 1;
		}
		15% {
			left: 100%;
			opacity: 0;
		}
		100% {
			left: 100%;
			opacity: 0;
		}
	}
	@keyframes back-x {
		0% {
			left: 100%;
			opacity: 0;
		}
		2% {
			opacity: 1;
		}
		13% {
			opacity: 1;
		}
		15% {
			left: 0%;
			opacity: 0;
		}
		100% {
			left: 0%;
			opacity: 0;
		}
	}
</style>
