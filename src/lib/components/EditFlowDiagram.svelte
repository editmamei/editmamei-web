<script lang="ts">
	// The full round-trip behind one adjustment, as an actor-lane sequence.
	//
	// Lived on the home page until 2026-08-14. Moved here because it is a
	// reference asset for someone already sold, not a persuasion asset: scroll
	// data showed only ~23-31% of home-page visitors ever reached it, and the
	// real drop-off was far earlier. See docs/20260814-home-page-restructure.md.
	type Actor = 'you' | 'ai' | 'editmamei' | 'photoshop';
	type Message = { from: Actor; to: Actor; label: string; quote?: boolean };
	type Segment =
		| { kind: 'msg'; msg: Message }
		| { kind: 'loop'; label: string; trailer?: string; messages: Message[] };

	const actorInfo: Record<
		Actor,
		{ label: string; sub?: string; text: string; border: string; bg: string }
	> = {
		you: {
			label: 'You',
			text: 'text-emerald-700',
			border: 'border-emerald-200',
			bg: 'bg-emerald-50'
		},
		ai: {
			label: 'AI assistant',
			sub: 'in the cloud',
			text: 'text-sky-700',
			border: 'border-sky-200',
			bg: 'bg-sky-50'
		},
		editmamei: {
			label: 'Editmamei',
			sub: 'on your desktop',
			text: 'text-neutral-700',
			border: 'border-neutral-300',
			bg: 'bg-white'
		},
		photoshop: {
			label: 'Photoshop',
			sub: 'on your desktop',
			text: 'text-neutral-700',
			border: 'border-neutral-300',
			bg: 'bg-white'
		}
	};

	const actorOrder: Actor[] = ['you', 'ai', 'editmamei', 'photoshop'];

	const segments: Segment[] = [
		{
			kind: 'msg',
			msg: {
				from: 'you',
				to: 'ai',
				label: 'warm up the golden hour, lift the shadows, clean up the horizon',
				quote: true
			}
		},
		{
			kind: 'msg',
			msg: {
				from: 'ai',
				to: 'editmamei',
				label: 'add a warming curves adjustment layer',
				quote: true
			}
		},
		{
			kind: 'msg',
			msg: {
				from: 'editmamei',
				to: 'photoshop',
				label: "runs the edit using Photoshop's own scripting commands"
			}
		},
		{
			kind: 'msg',
			msg: { from: 'photoshop', to: 'editmamei', label: 'edit applied + updated layer info' }
		},
		{
			kind: 'msg',
			msg: {
				from: 'editmamei',
				to: 'ai',
				label: "structured result: what changed, what's now in the document"
			}
		},
		{
			kind: 'loop',
			label: 'Check & refine',
			trailer:
				'More to adjust? The AI sends another instruction. Looks done? It hands back to you.',
			messages: [
				{
					from: 'ai',
					to: 'editmamei',
					label: 'let me see what it looks like now',
					quote: true
				},
				{ from: 'editmamei', to: 'photoshop', label: 'render a downscaled JPEG' },
				{ from: 'photoshop', to: 'editmamei', label: 'preview JPEG' },
				{
					from: 'editmamei',
					to: 'ai',
					label: 'preview: the AI looks at the actual pixels'
				}
			]
		},
		{
			kind: 'msg',
			msg: {
				from: 'ai',
				to: 'you',
				label: "done: your photo's ready, fully layered and editable",
				quote: true
			}
		}
	];
</script>

<div
	class="rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-50/40 via-white to-white p-4 md:p-8"
>
	<p class="mb-5 max-w-2xl text-sm leading-relaxed text-neutral-700 md:text-base">
		Step by step, here's the round-trip behind a single adjustment.
	</p>

	<!-- Actor legend — orients the reader before the sequence -->
	<div
		class="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4"
		aria-label="The four participants in an edit"
	>
		{#each actorOrder as actorId (actorId)}
			{@const a = actorInfo[actorId]}
			<div class="rounded-lg border {a.border} {a.bg} px-2.5 py-2 text-center">
				<p class="text-[10px] font-semibold tracking-wider uppercase {a.text}">
					{a.label}
				</p>
				{#if a.sub}
					<p class="mt-0.5 text-[10px] text-neutral-500">{a.sub}</p>
				{/if}
			</div>
		{/each}
	</div>

	<!-- Sequence of messages -->
	<ol class="space-y-2" aria-label="Step-by-step message sequence">
		{#each segments as seg, i (i)}
			{#if seg.kind === 'msg'}
				<li class="rounded-lg border border-neutral-200 bg-white px-3 py-2">
					<div class="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase">
						<span class={actorInfo[seg.msg.from].text}>{actorInfo[seg.msg.from].label}</span>
						<svg
							class="size-3 shrink-0 text-neutral-400"
							viewBox="0 0 24 24"
							fill="none"
							aria-hidden="true"
						>
							<path
								d="M5 12 H19 M15 8 L19 12 L15 16"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<span class={actorInfo[seg.msg.to].text}>{actorInfo[seg.msg.to].label}</span>
					</div>
					<p class="mt-1 text-sm leading-snug text-neutral-700">
						{#if seg.msg.quote}<span class="text-neutral-400">&ldquo;</span>{seg.msg.label}<span
								class="text-neutral-400">&rdquo;</span
							>{:else}{seg.msg.label}{/if}
					</p>
				</li>
			{:else}
				<li>
					<div class="rounded-xl border border-sky-200 bg-sky-50/40 px-2.5 py-2.5 md:px-4 md:py-3">
						<p
							class="mb-2.5 flex items-center gap-1.5 text-[10px] font-semibold tracking-wider text-sky-800 uppercase"
						>
							<svg class="size-3.5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<path
									d="M3 12a9 9 0 0 1 15.5-6.3M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.3M3 21v-5h5"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
							Loop · {seg.label}
						</p>
						<ol class="space-y-2">
							{#each seg.messages as msg, j (j)}
								<li class="rounded-lg border border-neutral-200 bg-white px-3 py-2">
									<div
										class="flex items-center gap-1.5 text-[10px] font-semibold tracking-wider uppercase"
									>
										<span class={actorInfo[msg.from].text}>{actorInfo[msg.from].label}</span>
										<svg
											class="size-3 shrink-0 text-neutral-400"
											viewBox="0 0 24 24"
											fill="none"
											aria-hidden="true"
										>
											<path
												d="M5 12 H19 M15 8 L19 12 L15 16"
												stroke="currentColor"
												stroke-width="2"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
										<span class={actorInfo[msg.to].text}>{actorInfo[msg.to].label}</span>
									</div>
									<p class="mt-1 text-sm leading-snug text-neutral-700">
										{#if msg.quote}<span class="text-neutral-400">&ldquo;</span>{msg.label}<span
												class="text-neutral-400">&rdquo;</span
											>{:else}{msg.label}{/if}
									</p>
								</li>
							{/each}
						</ol>
						{#if seg.trailer}
							<p class="mt-3 pl-1 text-[11px] leading-relaxed text-sky-900/80 italic">
								{seg.trailer}
							</p>
						{/if}
					</div>
				</li>
			{/if}
		{/each}
	</ol>

	<p class="mt-6 text-center text-xs leading-relaxed text-neutral-500 md:text-sm">
		Both live where they already do: the AI in the cloud, Photoshop on your desktop.
	</p>
</div>
