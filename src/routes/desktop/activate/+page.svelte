<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { PRO_FEATURES } from '$lib/content/pro-features';
	import { CUSTOMER_PORTAL_URL, GITHUB_PRO_TROUBLESHOOTING_URL } from '$lib/links';

	const code = 'rounded bg-[#ece6d6] px-1.5 py-0.5 font-mono text-[14px]';
	const link = 'font-semibold text-brand underline underline-offset-2';
</script>

<Seo
	title="Activate Editmamei Pro with your license key"
	description="Find your Editmamei Pro key, enter it with editmamei activate or in Claude Desktop's extension settings, then restart. Your Pro tools appear."
	path="/desktop/activate"
/>

<PageHero
	crumbs={[{ label: 'Editmamei Desktop', href: '/desktop' }, { label: 'Activate Pro' }]}
	eyebrow="Editmamei Pro"
	title="Activate your Pro license"
	lede="Thanks for going Pro. Activation takes about a minute: find your key, enter it the way that matches how you run Editmamei, and restart. Your Pro tools then appear in your AI app."
>
	<p class="max-w-[40em] text-[15px] leading-relaxed text-[#a9bcb4]">
		Already subscribed and just need to manage it?
		<a
			href={CUSTOMER_PORTAL_URL}
			rel="noopener"
			class="font-semibold text-accent underline underline-offset-4">Open your account portal</a
		>
		to update payment, cancel, view invoices or remove a device. Sign in with the email you bought it
		with; no password needed.
	</p>
</PageHero>

<section class="bg-paper px-4 py-14 md:py-20">
	<ol class="mx-auto grid max-w-3xl gap-5">
		<li class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10 md:p-7">
			<div class="flex items-start gap-4">
				<span
					class="grid size-8 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-accent"
					>1</span
				>
				<div class="min-w-0">
					<h2 class="text-xl font-bold text-brand">Find your license key</h2>
					<p class="mt-2 text-[16px] leading-relaxed text-neutral-700">
						It's in your purchase confirmation email, and any time in your
						<a href={CUSTOMER_PORTAL_URL} rel="noopener" class={link}>account portal</a>
						(sign in with your purchase email). It looks like
						<code class={code}>XXXX-XXXX-…</code>.
					</p>
				</div>
			</div>
		</li>

		<li class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10 md:p-7">
			<div class="flex items-start gap-4">
				<span
					class="grid size-8 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-accent"
					>2</span
				>
				<div class="min-w-0 flex-1">
					<h2 class="text-xl font-bold text-brand">Enter your key</h2>
					<p class="mt-2 text-[16px] leading-relaxed text-neutral-700">
						Pick the one that matches how you installed Editmamei.
					</p>
					<div class="mt-5 grid gap-4 md:grid-cols-2">
						<div class="min-w-0 rounded-2xl bg-paper p-5">
							<h3 class="font-bold text-brand">Claude Code, npm</h3>
							<p class="mt-2 text-[15px] leading-relaxed text-neutral-700">
								Run this in your terminal:
							</p>
							<pre
								class="mt-3 overflow-x-auto rounded-xl bg-brand-deep px-4 py-3 font-mono text-[14px] text-[#f4f1e8]"><code
									>editmamei activate YOUR-KEY</code
								></pre>
							<p class="mt-3 text-[15px] leading-relaxed text-neutral-700">
								Then restart your AI app. Check any time with <code class={code}
									>editmamei license</code
								>.
							</p>
						</div>
						<div class="min-w-0 rounded-2xl bg-paper p-5">
							<h3 class="font-bold text-brand">Claude Desktop</h3>
							<p class="mt-2 text-[15px] leading-relaxed text-neutral-700">
								No terminal needed. Open <strong class="text-brand"
									>Settings → Extensions → Editmamei</strong
								>, paste your key into the <strong class="text-brand">Pro license key</strong> field,
								and save. Then quit and reopen Claude Desktop so it picks up the key.
							</p>
						</div>
					</div>
				</div>
			</div>
		</li>

		<li class="rounded-[22px] bg-white p-6 ring-1 ring-brand/10 md:p-7">
			<div class="flex items-start gap-4">
				<span
					class="grid size-8 flex-none place-items-center rounded-full bg-brand text-sm font-bold text-accent"
					>3</span
				>
				<div class="min-w-0">
					<h2 class="text-xl font-bold text-brand">Confirm Pro is on</h2>
					<p class="mt-2 text-[16px] leading-relaxed text-neutral-700">
						After the restart, the Pro tools appear in your AI app:
					</p>
					<ul class="mt-3 grid gap-1.5 text-[16px] leading-relaxed text-neutral-700 sm:grid-cols-2">
						{#each PRO_FEATURES as feature (feature.title)}
							<li class="flex gap-2.5">
								<span aria-hidden="true" class="mt-2.5 size-1.5 flex-none rounded-full bg-brand"
								></span>{feature.title}
							</li>
						{/each}
					</ul>
					<p class="mt-3 text-[16px] leading-relaxed text-neutral-700">
						Not there yet? Check the key, and that you fully restarted the app.
					</p>
				</div>
			</div>
		</li>
	</ol>

	<div class="mx-auto mt-14 max-w-3xl">
		<h2 class="text-2xl font-bold tracking-[-0.02em] text-brand">Good to know</h2>
		<dl class="mt-5 divide-y divide-[#ddd6c4] border-y border-[#ddd6c4] text-[16px]">
			<div class="py-5">
				<dt class="font-bold text-brand">Two devices per license</dt>
				<dd class="mt-1.5 leading-relaxed text-neutral-700">
					Activate a second computer the same way. To switch, run <code class={code}
						>editmamei deactivate</code
					>
					on the old one, or remove it in your
					<a href={CUSTOMER_PORTAL_URL} rel="noopener" class={link}>account portal</a> if you no longer
					have it.
				</dd>
			</div>
			<div class="py-5">
				<dt class="font-bold text-brand">Works offline</dt>
				<dd class="mt-1.5 leading-relaxed text-neutral-700">
					Pro checks its license about once a day and keeps working for seven days without a
					connection.
				</dd>
			</div>
			<div class="py-5">
				<dt class="font-bold text-brand">It never locks you out</dt>
				<dd class="mt-1.5 leading-relaxed text-neutral-700">
					If a subscription lapses, Editmamei keeps running as the free Community edition, and your
					work and settings are untouched. Renew, restart your AI app, and Pro switches back on.
				</dd>
			</div>
		</dl>
		<p class="mt-8 text-[16px] leading-relaxed text-neutral-700">
			Stuck? If Pro isn't unlocking, the
			<a href={GITHUB_PRO_TROUBLESHOOTING_URL} rel="noopener" class={link}>troubleshooting guide</a>
			walks through it step by step. Still stuck? <a href="/contact" class={link}>Get in touch</a> and
			we'll sort it out.
		</p>
	</div>
</section>
