<script lang="ts"></script>

<section id="verifiable" class="bg-white py-16 md:py-20">
	<div class="mx-auto max-w-5xl px-4">
		<div class="mb-10 max-w-2xl">
			<p class="mb-2 text-xs font-semibold tracking-wider text-terracotta-ink uppercase">
				Verifiable, not just promised
			</p>
			<h2 class="text-2xl font-bold tracking-tight text-neutral-950 md:text-3xl">
				Closed-source, with the receipts.
			</h2>
			<p class="mt-3 text-base leading-relaxed text-neutral-700">
				Editmamei is closed-source, so what we can verify, we do. Every release ships with three
				independent ways to confirm what you installed and how it's licensed.
			</p>
		</div>

		<div class="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<ul class="grid gap-3 text-sm leading-relaxed text-neutral-700 md:grid-cols-3">
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

		<p class="text-sm text-neutral-600">
			The only data Editmamei itself transmits is Pro license validation — license key, version, OS
			— roughly once a week. No document, image, file path, or template data. Full details in our
			<a href="/privacy" class="underline underline-offset-2 hover:text-neutral-900"
				>privacy policy</a
			>; disclosure path at
			<a href="/security" class="underline underline-offset-2 hover:text-neutral-900"
				>editmamei.com/security</a
			>.
		</p>
	</div>
</section>
