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
				Editmamei is not a cloud service. It runs on your machine and drives the Adobe Photoshop you
				already have installed. Editmamei itself transmits nothing — no telemetry, no analytics, no
				files, no metadata.
			</p>
		</div>

		<div class="grid gap-6 md:grid-cols-3">
			<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
				<h3 class="text-sm font-semibold tracking-tight text-neutral-950">No telemetry</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Editmamei does not collect, transmit, or store usage data, crash reports, or analytics of
					any kind. Confirmable with a network monitor.
				</p>
			</div>
			<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
				<h3 class="text-sm font-semibold tracking-tight text-neutral-950">
					Your content stays local
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Photos, documents, templates, layer data, metadata — none of it leaves your machine. All
					processing happens locally between Editmamei and Photoshop.
				</p>
			</div>
			<div class="rounded-xl border border-neutral-200 bg-neutral-50/60 p-6">
				<h3 class="text-sm font-semibold tracking-tight text-neutral-950">
					One carved-out exception
				</h3>
				<p class="mt-2 text-sm leading-relaxed text-neutral-700">
					Pro license validation sends a license key, version, and OS to the license server about
					once every 7 days. No document, image, file path, or template data — ever.
				</p>
			</div>
		</div>

		<div class="mt-10 rounded-xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<h3 class="text-sm font-semibold tracking-tight text-neutral-950">Every release ships with</h3>
			<ul class="mt-4 grid gap-3 text-sm leading-relaxed text-neutral-700 md:grid-cols-3">
				<li>
					<span class="font-semibold text-neutral-900">npm provenance.</span>
					Cryptographic attestation that the published bytes match a specific CI build of a specific
					commit.
				</li>
				<li>
					<span class="font-semibold text-neutral-900">Software Bill of Materials.</span>
					A full SBOM lists every transitive dependency, per release.
				</li>
				<li>
					<span class="font-semibold text-neutral-900">Abandonment → MIT.</span>
					If Editmamei goes unmaintained for 24 months, the license converts to MIT automatically.
					You're never stranded.
				</li>
			</ul>
		</div>

		<p class="mt-6 text-sm text-neutral-600">
			One thing to be clear about: your AI assistant is a cloud service. When you ask it to analyze
			a preview, a downscaled JPEG is sent to <span class="italic">that AI provider</span> — exactly
			as if you had dropped the file into a chat with it. That's a property of using a cloud AI, not
			a hop Editmamei adds.
		</p>
	</div>
</section>
