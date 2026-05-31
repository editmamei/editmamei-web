<script lang="ts"></script>

<section id="how-it-works" class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<header class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
				How it works
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				You talk. Photoshop works.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				For years, getting the look in your head meant nudging sliders and hunting for a tutorial
				that matched your exact shot. Editmamei plugs your AI chat assistant straight into the
				desktop Photoshop you already have. You describe what you want, the way you'd tell a friend,
				and it builds the layers, makes the adjustments, and hands back the finished photo.
			</p>
		</header>

		<ol class="mb-12 grid gap-4 md:grid-cols-4" aria-label="The four steps of an Editmamei edit">
			{#each [{ n: '1', title: 'You describe the edit', body: '"Warm up the golden hour, lift the shadows, clean up the horizon."' }, { n: '2', title: 'The AI plans the steps', body: 'Which adjustments, which selections, in what order.' }, { n: '3', title: 'Your Photoshop does the editing', body: 'On your machine, using its own standard tools: adjustment layers, masks, selections, filters.' }, { n: '4', title: 'You get a finished photo', body: 'Fully layered, maskable, and editable. Nothing baked in.' }] as step, i (i)}
				<li class="relative rounded-xl border border-neutral-200 bg-neutral-50/60 p-5">
					<span
						class="mb-3 inline-flex size-7 items-center justify-center rounded-full bg-neutral-900 text-xs font-bold text-white"
						aria-hidden="true">{step.n}</span
					>
					<h3 class="text-sm font-semibold tracking-tight text-neutral-950">{step.title}</h3>
					<p class="mt-2 text-sm leading-relaxed text-neutral-700">{step.body}</p>
				</li>
			{/each}
		</ol>

		<p class="mb-12 max-w-3xl text-base leading-relaxed text-neutral-700">
			The AI looks at the result and refines it; Photoshop performs every actual change.
		</p>

		<!-- Flow diagram — Tailwind-only placeholder. Replace with a designed
		     graphic when ready; intent is from how-it-works-spec.md §5. -->
		<div
			class="mb-16 rounded-2xl border border-neutral-200 bg-gradient-to-br from-emerald-50/40 via-white to-white p-6 md:p-10"
			role="img"
			aria-label="Diagram: you describe the edit, the AI plans the steps, your Photoshop edits with its own tools, you get a finished photo. The AI and Photoshop check and refine in a loop."
		>
			<div class="grid gap-3 md:grid-cols-7 md:items-stretch">
				<!-- Node 1: You -->
				<div
					class="rounded-xl border border-emerald-200 bg-white p-4 text-center shadow-sm md:col-span-2"
				>
					<p class="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase">You</p>
					<p class="mt-1 text-sm font-semibold text-neutral-900">describe the edit</p>
				</div>

				<!-- Arrow 1 -->
				<div class="hidden items-center justify-center md:col-span-1 md:flex" aria-hidden="true">
					<svg viewBox="0 0 32 16" class="h-4 w-full text-neutral-400">
						<path
							d="M0 8 H 26 M22 4 L28 8 L22 12"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>

				<!-- Node 2: AI assistant + Photoshop loop -->
				<div class="rounded-xl border border-neutral-300 bg-white p-4 shadow-sm md:col-span-2">
					<div class="flex items-center justify-between gap-2">
						<div class="flex-1 text-center">
							<p class="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">AI</p>
							<p class="text-xs font-semibold text-neutral-900">plans the steps</p>
						</div>
						<svg viewBox="0 0 24 24" class="h-6 w-6 text-neutral-400" aria-hidden="true">
							<path
								d="M4 8 H 20 M16 5 L20 8 L16 11 M20 16 H 4 M8 13 L4 16 L8 19"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
						<div class="flex-1 text-center">
							<p class="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
								Photoshop
							</p>
							<p class="text-xs font-semibold text-neutral-900">edits with its own tools</p>
						</div>
					</div>
					<p class="mt-3 text-center text-[11px] text-neutral-500 italic">
						check &amp; refine, on your machine
					</p>
				</div>

				<!-- Arrow 2 -->
				<div class="hidden items-center justify-center md:col-span-1 md:flex" aria-hidden="true">
					<svg viewBox="0 0 32 16" class="h-4 w-full text-neutral-400">
						<path
							d="M0 8 H 26 M22 4 L28 8 L22 12"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</div>

				<!-- Node 3: Finished photo -->
				<div
					class="rounded-xl border border-neutral-300 bg-white p-4 text-center shadow-sm md:col-span-1"
				>
					<p class="text-[10px] font-semibold tracking-wider text-neutral-500 uppercase">
						Finished
					</p>
					<p class="mt-1 text-sm font-semibold text-neutral-900">fully layered photo</p>
				</div>
			</div>
			<p class="mt-6 text-center text-xs text-neutral-500">
				The AI is the director; Photoshop is the hands. Both live where they already do: the AI in
				the cloud, Photoshop on your computer.
			</p>
		</div>

		<!-- "Edited, not generated" subsection -->
		<div class="mb-12 max-w-3xl">
			<h3 class="text-xl font-bold tracking-tight text-neutral-950 md:text-2xl">
				Edited, not generated.
			</h3>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Most "AI photo" tools are <em>generative</em>. They invent new pixels: skies, objects, even
				faces that were never in your shot.
				<strong class="font-semibold text-neutral-900">Editmamei doesn't do that.</strong>
				It works only with the pixels you captured, using the same non-generative Photoshop tools professionals
				have used for years: adjustment layers, masks, selections, filters. The AI is the director, not
				the artist. Your photo is yours, just finished faster.
			</p>
		</div>

		<!-- "Your files, your machine" subsection — privacy folded in -->
		<div class="rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<h3 class="text-base font-semibold tracking-tight text-neutral-950">
				Your files, your machine.
			</h3>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700">
				Editmamei runs on your own computer, and the editing happens inside your own Photoshop.
				Editmamei itself ships no analytics, crash reports, or telemetry, and your photo files
				aren't uploaded to Editmamei's servers.
			</p>
			<p class="mt-3 text-sm leading-relaxed text-neutral-700">
				Worth being clear about: your AI assistant is a cloud service. When you ask it to analyze an
				image (for example, the visual-verification preview), a downscaled JPEG is sent to
				<em>that AI provider</em>, exactly as if you'd dropped the file into a chat with it. That's
				a property of using a cloud AI, and a function of which assistant you choose. Not a hop
				Editmamei adds.
			</p>
		</div>
	</div>
</section>
