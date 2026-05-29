<script lang="ts"></script>

<section id="privacy" class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
				Privacy & trust
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Verifiable, not just promised.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Editmamei is a local MCP server that drives the Adobe Photoshop you already have installed.
				Your documents, templates, and project files stay on your machine. Details — including what
				your AI assistant sees — in our <a
					href="/privacy"
					class="underline underline-offset-2 hover:text-neutral-900">privacy policy</a
				>.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
				<h3 class="text-sm font-semibold tracking-tight text-neutral-950">No usage tracking</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					The Editmamei server doesn't ship analytics, crash reports, or usage telemetry. Your AI
					client is separate — that's governed by its own privacy policy.
				</p>
			</div>
			<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
				<h3 class="text-sm font-semibold tracking-tight text-neutral-950">
					Your project files stay local
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Documents, templates, and project files live on your disk. Editmamei doesn't transmit
					them. What you share with your AI in chat is between you and that assistant.
				</p>
			</div>
			<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
				<h3 class="text-sm font-semibold tracking-tight text-neutral-950">License validation</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Pro license checks send a license key, version, and OS to our server about once a week. No
					document, image, file path, or template data.
				</p>
			</div>
		</div>

		<div class="mt-10 rounded-xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<h3 class="text-sm font-semibold tracking-tight text-neutral-950">
				Every release ships with
			</h3>
			<ul class="mt-4 grid gap-3 text-sm leading-relaxed text-neutral-700 md:grid-cols-3">
				<li>
					<span class="font-semibold text-neutral-900">npm provenance.</span>
					Cryptographic attestation that the published bytes match a specific CI build of a specific commit.
				</li>
				<li>
					<span class="font-semibold text-neutral-900">Software Bill of Materials.</span>
					A full SBOM lists every transitive dependency, per release.
				</li>
				<li>
					<span class="font-semibold text-neutral-900">Abandonment → MIT.</span>
					If Editmamei goes unmaintained for 24 months, the license converts to MIT automatically. You're
					never stranded.
				</li>
			</ul>
		</div>

		<p class="mt-6 text-sm text-neutral-600">
			One thing to be clear about: your AI assistant is a cloud service. When you ask it to analyze
			a preview, a downscaled JPEG is sent to <span class="italic">that AI provider</span> — exactly as
			if you had dropped the file into a chat with it. That's a property of using a cloud AI, not a hop
			Editmamei adds.
		</p>
	</div>
</section>
