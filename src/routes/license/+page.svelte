<script lang="ts">
	// Verbatim mirror of Editmamei/LICENSE (the proprietary npm-package license).
	// editmamei.com/license is the canonical PUBLIC home for this text: the npm
	// package's bundled LICENSE, the public wiki repo's own (CC BY 4.0, docs-only)
	// LICENSE, and the FAQ all point here for the full software terms. Keep this
	// byte-for-byte in sync with Editmamei/LICENSE when that file changes.
	const LICENSE_TEXT = `Editmamei License Agreement

Copyright (c) 2026 EMBD Artifacts LLC. All rights reserved.

This License Agreement (the "Agreement") governs your use of the Editmamei
software distributed in this package — including the command-line interface,
the Model Context Protocol (MCP) server, the bundled engine binaries, and all
accompanying files (collectively, the "Software"). By installing, copying, or
using the Software, you agree to be bound by this Agreement. If you do not
agree, do not install or use the Software.

1. License grant.
   Subject to your compliance with this Agreement, EMBD Artifacts LLC grants
   you a personal, worldwide, royalty-free, non-exclusive, non-transferable,
   and revocable license to install and use the Software, at no charge, on
   devices you own or control, for your own personal or commercial
   photo-editing work.

2. Paid features.
   Some features (the "Pro" features) are not included in the no-charge license
   granted above and require a separate paid license. Access to Pro features is
   governed by the additional terms presented at the time of purchase. Nothing
   in this Agreement grants any right to Pro features without a valid paid
   license.

3. Restrictions.
   Except as expressly permitted in Section 1, or to the extent a restriction
   below is prohibited by applicable law, you may not:
   (a) copy (other than a reasonable number of backup copies), publish,
       distribute, sublicense, rent, lease, lend, or sell the Software;
   (b) modify, adapt, translate, or create derivative works of the Software;
   (c) reverse engineer, decompile, or disassemble the Software, or otherwise
       attempt to derive its source code or underlying ideas;
   (d) remove, obscure, or alter any copyright, trademark, or other proprietary
       notice in the Software or this Agreement; or
   (e) circumvent, disable, or interfere with any licensing, entitlement, or
       technical protection measure, including to access Pro features without a
       valid paid license.

4. Ownership.
   The Software is licensed, not sold. EMBD Artifacts LLC and its licensors
   retain all right, title, and interest in and to the Software, including all
   intellectual property rights. All rights not expressly granted in this
   Agreement are reserved.

5. Third-party components.
   The Software incorporates components provided by third parties under their
   own licenses. Those licenses continue to apply to the corresponding
   components and, in the event of a conflict, govern those components only.
   Required attributions and notices are reproduced in the accompanying
   NOTICES.md file; the full license text for each dependency ships with that
   dependency through the npm package manager (see node_modules/<package>/
   after install).

6. Term and termination.
   This Agreement is effective until terminated. The license granted in
   Section 1 terminates automatically, without notice, if you breach any term
   of this Agreement. Upon termination you must cease all use of the Software
   and delete all copies in your possession or control. Sections 3 through 9
   survive termination.

7. Disclaimer of warranty.
   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE, AND NONINFRINGEMENT.

8. Limitation of liability.
   IN NO EVENT SHALL THE COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES, OR
   OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT, OR OTHERWISE,
   ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
   DEALINGS IN THE SOFTWARE.

9. General.
   This Agreement is the entire agreement between you and EMBD Artifacts LLC
   regarding the Software and supersedes any prior or contemporaneous
   understanding. If any provision is held unenforceable, the remaining
   provisions remain in full force and effect. A failure to enforce any
   provision is not a waiver of it.

For commercial licensing, redistribution rights, or other inquiries, contact:
support@editmamei.com`;
</script>

<svelte:head>
	<title>The Editmamei License Agreement, full text</title>
	<meta
		name="description"
		content="The Editmamei License Agreement. Editmamei is proprietary and free to install and use for personal or commercial work; Pro features require a paid license."
	/>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">License</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">License</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Editmamei is proprietary, and free to install and use at no charge for personal or commercial
			work. Redistribution, modification, and reverse engineering are reserved, and Pro features
			require a paid license.
		</p>
		<p class="mt-3 text-sm leading-relaxed text-neutral-600">
			The full agreement is below. The same text ships in the
			<code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">LICENSE</code> file with
			every npm release, and third-party attributions are in
			<code class="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs">NOTICES.md</code>,
			bundled with the package.
		</p>

		<div class="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<pre
				class="font-sans text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">{LICENSE_TEXT}</pre>
		</div>

		<div class="mt-10 flex flex-col gap-3 sm:flex-row">
			<a
				href="https://github.com/editmamei/editmamei-wiki#readme"
				rel="noopener noreferrer"
				class="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800"
			>
				Read the docs
			</a>
			<a
				href="/"
				class="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-50"
			>
				Back to home
			</a>
		</div>
	</div>
</section>
