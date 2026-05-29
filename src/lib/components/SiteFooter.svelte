<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-neutral-200 bg-neutral-50">
	<div class="mx-auto max-w-6xl px-4 py-12 md:py-16">
		<div class="grid gap-8 md:grid-cols-4">
			<div class="md:col-span-2">
				<p class="text-base font-semibold tracking-tight text-neutral-900">Editmamei</p>
				<p class="mt-2 max-w-md text-sm leading-relaxed text-neutral-600">
					Unlock Photoshop with natural-language photo editing. An MCP server that lets your AI
					assistant drive Adobe Photoshop directly.
				</p>
				<p class="mt-4 text-sm text-neutral-500 italic">
					Pairs well with: a layered PSD, a willing AI, and a small bowl of edamame.
				</p>
			</div>

			<div>
				<p
					class="text-xs font-semibold tracking-wider text-neutral-500 uppercase"
				>
					Product
				</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li><a href="#capabilities" class="hover:text-neutral-950">Features</a></li>
					<li><a href="/pricing" class="hover:text-neutral-950">Pricing</a></li>
					<li>
						<a
							href="https://github.com/editmamei/editmamei-ce/blob/main/CHANGELOG.md"
							class="hover:text-neutral-950">Changelog</a
						>
					</li>
					<li><a href="#demo" class="hover:text-neutral-950">Demo</a></li>
				</ul>
			</div>

			<div>
				<p
					class="text-xs font-semibold tracking-wider text-neutral-500 uppercase"
				>
					Resources
				</p>
				<ul class="mt-3 space-y-2 text-sm text-neutral-700">
					<li>
						<a
							href="https://github.com/editmamei/editmamei-ce#readme"
							class="hover:text-neutral-950">Docs</a
						>
					</li>
					<li>
						<a
							href="https://github.com/editmamei/editmamei-ce/issues"
							class="hover:text-neutral-950">Report a bug</a
						>
					</li>
					<li>
						<a href="https://www.npmjs.com/package/editmamei" class="hover:text-neutral-950">npm</a>
					</li>
					<li>
						<a href="https://github.com/editmamei" class="hover:text-neutral-950">GitHub</a>
					</li>
				</ul>
			</div>
		</div>

		<div
			class="mt-10 flex flex-col gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between"
		>
			<p>© {year} Editmamei</p>
			<p class="flex items-center gap-4">
				<a href="/privacy" class="hover:text-neutral-800">Privacy</a>
				<a href="/security" class="hover:text-neutral-800">Security</a>
				<a href="/license" class="hover:text-neutral-800">License</a>
			</p>
		</div>
	</div>
</footer>
