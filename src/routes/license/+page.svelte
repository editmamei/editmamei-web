<script lang="ts">
	import Seo from '$lib/components/Seo.svelte';
	import { GITHUB_LICENSE_URL, GITHUB_README_URL } from '$lib/links';

	// Section (a): Editmamei Community Edition, FSL-1.1-MIT.
	//
	// Verbatim mirror of the PUBLIC source repo's LICENSE.md
	// (github.com/editmamei/editmamei). Byte-for-byte, including the markdown
	// headers — FSL's value is standardization, so the text on this page must
	// never diverge from the upstream file it mirrors. Keep this string in
	// sync whenever LICENSE.md changes; never edit the wording here first.
	const FSL_LICENSE_TEXT = `# Functional Source License, Version 1.1, MIT Future License

## Abbreviation

FSL-1.1-MIT

## Notice

Copyright 2026 EMBD Artifacts LLC

## Terms and Conditions

### Licensor ("We")

The party offering the Software under these Terms and Conditions.

### The Software

The "Software" is each version of the software that we make available under
these Terms and Conditions, as indicated by our inclusion of these Terms and
Conditions with the Software.

### License Grant

Subject to your compliance with this License Grant and the Patents,
Redistribution and Trademark clauses below, we hereby grant you the right to
use, copy, modify, create derivative works, publicly perform, publicly display
and redistribute the Software for any Permitted Purpose identified below.

### Permitted Purpose

A Permitted Purpose is any purpose other than a Competing Use. A Competing Use
means making the Software available to others in a commercial product or
service that:

1. substitutes for the Software;

2. substitutes for any other product or service we offer using the Software
   that exists as of the date we make the Software available; or

3. offers the same or substantially similar functionality as the Software.

Permitted Purposes specifically include using the Software:

1. for your internal use and access;

2. for non-commercial education;

3. for non-commercial research; and

4. in connection with professional services that you provide to a licensee
   using the Software in accordance with these Terms and Conditions.

### Patents

To the extent your use for a Permitted Purpose would necessarily infringe our
patents, the license grant above includes a license under our patents. If you
make a claim against any party that the Software infringes or contributes to
the infringement of any patent, then your patent license to the Software ends
immediately.

### Redistribution

The Terms and Conditions apply to all copies, modifications and derivatives of
the Software.

If you redistribute any copies, modifications or derivatives of the Software,
you must include a copy of or a link to these Terms and Conditions and not
remove any copyright notices provided in or with the Software.

### Disclaimer

THE SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING WITHOUT LIMITATION WARRANTIES OF FITNESS FOR A PARTICULAR
PURPOSE, MERCHANTABILITY, TITLE OR NON-INFRINGEMENT.

IN NO EVENT WILL WE HAVE ANY LIABILITY TO YOU ARISING OUT OF OR RELATED TO THE
SOFTWARE, INCLUDING INDIRECT, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES,
EVEN IF WE HAVE BEEN INFORMED OF THEIR POSSIBILITY IN ADVANCE.

### Trademarks

Except for displaying the License Details and identifying us as the origin of
the Software, you have no right under these Terms and Conditions to use our
trademarks, trade names, service marks or product names.

## Grant of Future License

We hereby irrevocably grant you an additional license to use the Software under
the MIT license that is effective on the second anniversary of the date we make
the Software available. On or after that date, you may use the Software under
the MIT license, in which case the following will apply:

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;

	// Section (b): Editmamei Pro, commercial license.
	//
	// Retained from the prior single-agreement text that used to cover the
	// whole npm package, rescoped to the Pro module and subscription now that
	// Community Edition is licensed separately under FSL-1.1-MIT above. The
	// substantive terms (restrictions, ownership, warranty, liability) are
	// unchanged; only the definition of "the Software" and the license-grant/
	// validity language were narrowed to Pro.
	const PRO_LICENSE_TEXT = `Editmamei Pro License Agreement

Copyright (c) 2026 EMBD Artifacts LLC. All rights reserved.

This License Agreement (the "Agreement") governs your use of Editmamei Pro —
the paid module and subscription that unlocks additional tools on top of the
free Community Edition, including the Pro tool surface, the bundled Pro
engine components, and all accompanying files (collectively, the "Software").
Editmamei Community Edition is licensed separately, under the Functional
Source License above; this Agreement covers Pro only. By activating,
installing, or using the Software, you agree to be bound by this Agreement.
If you do not agree, do not activate or use the Software.

1. License grant.
   Subject to your compliance with this Agreement and a valid, active Pro
   license, EMBD Artifacts LLC grants you a personal, worldwide,
   royalty-free, non-exclusive, non-transferable, and revocable license to
   install and use the Software on devices you own or control, for your own
   personal or commercial photo-editing work, for as long as your license
   remains valid.

2. License validity and lapses.
   Access to the Software requires a valid, active Pro license (monthly,
   annual, or perpetual). Pricing, billing, and term are governed by the
   additional terms presented at the time of purchase. If a subscription
   lapses or is canceled, the license granted in Section 1 ends and access
   to the Software ends with it; Editmamei continues to run on the
   separately licensed Community Edition. Nothing in this Agreement grants
   any right to the Software without a valid paid license.

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
       technical protection measure, including to access the Software without
       a valid paid license.

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
   NOTICES.md file.

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

<Seo
	title="License: Community Edition (FSL-1.1-MIT) and Pro — Editmamei"
	description="Editmamei Community Edition is source-available under the Functional Source License (FSL-1.1-MIT); Editmamei Pro is a separate commercial add-on."
	path="/license"
/>

<section class="bg-white py-20 md:py-28">
	<div class="mx-auto max-w-2xl px-4">
		<p class="mb-3 text-xs font-semibold tracking-wider text-neutral-500 uppercase">License</p>
		<h1 class="text-3xl font-bold tracking-tight text-neutral-950 md:text-4xl">License</h1>
		<p class="mt-4 text-base leading-relaxed text-neutral-700">
			Two licenses cover Editmamei. Community Edition's source is public and source-available; Pro
			is a separate, paid add-on with its own commercial terms.
		</p>

		<h2 class="mt-14 text-xl font-bold tracking-tight text-neutral-950">
			Editmamei Community Edition — FSL-1.1-MIT
		</h2>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			Editmamei CE is <a
				href="https://fair.io"
				rel="noopener noreferrer"
				class="underline hover:text-neutral-950">Fair Source</a
			>
			software under the
			<a
				href={GITHUB_LICENSE_URL}
				rel="noopener noreferrer"
				class="underline hover:text-neutral-950"
				>Functional Source License, v1.1, MIT Future License</a
			> (FSL-1.1-MIT).
		</p>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			You can read, run, modify, and redistribute the code for almost anything: commercial photo
			editing, internal tools, education, research, security review. The one thing the license holds
			back, for two years per release, is offering the code to others in a commercial product or
			service that competes with Editmamei CE or Pro. If you redistribute the code, keep the license
			and copyright notices with it. Two years after each version ships, that version automatically
			becomes available under plain MIT.
		</p>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			This summary is plain English. The text below is the license; where they differ, the license
			text controls.
		</p>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			Editmamei is not open source under the OSI definition, and we don't call it that. It is
			source-available, with the full CE stack developed in the open.
		</p>
		<p class="mt-3 text-sm leading-relaxed text-neutral-700">
			Editmamei Pro is a separate, commercially licensed module; its source is not published. See
			below.
		</p>

		<div class="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<pre
				class="font-sans text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">{FSL_LICENSE_TEXT}</pre>
		</div>

		<h2 class="mt-16 text-xl font-bold tracking-tight text-neutral-950">
			Editmamei Pro — commercial license
		</h2>
		<p class="mt-4 text-sm leading-relaxed text-neutral-700">
			Editmamei Pro is a paid module and subscription, activated over Community Edition. It is not
			covered by the FSL-1.1-MIT license above; its source is not published, and it is licensed
			under the separate commercial agreement below.
		</p>

		<div class="mt-8 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-6 md:p-8">
			<pre
				class="font-sans text-sm leading-relaxed whitespace-pre-wrap text-neutral-800">{PRO_LICENSE_TEXT}</pre>
		</div>

		<div class="mt-10 flex flex-col gap-3 sm:flex-row">
			<a
				href={GITHUB_README_URL}
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
