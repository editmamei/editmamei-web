<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { track } from '$lib/analytics/clarity';
	import { CONNECT_URL, GITHUB_REPO_URL } from '$lib/links';
	import { primaryNav, productNavs, type ProductNav } from '$lib/content/surfaces';

	// Desktop: one disclosure per product (button + panel), opened by click or
	// Enter/Space, closed by Escape, an outside click, focus leaving it, or
	// following a link. Only one is open at a time.
	let open = $state<ProductNav['id'] | null>(null);
	const wraps: Record<string, HTMLElement | undefined> = $state({});
	const buttons: Record<string, HTMLButtonElement | undefined> = $state({});

	// Mobile menu: a full-width sheet under the bar.
	let menuOpen = $state(false);
	let menuButton = $state<HTMLButtonElement>();
	let sheetEl = $state<HTMLElement>();
	let firstSheetLink = $state<HTMLAnchorElement>();

	function toggle(id: ProductNav['id']) {
		open = open === id ? null : id;
		if (open) track(`nav-${id}-opened`);
	}
	function toggleMenu() {
		menuOpen = !menuOpen;
		// Move focus into the sheet so keyboard users land on the first item.
		if (menuOpen) queueMicrotask(() => firstSheetLink?.focus());
	}
	function closeAll() {
		open = null;
		menuOpen = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (open) {
			buttons[open]?.focus();
			open = null;
		}
		if (menuOpen) {
			menuOpen = false;
			menuButton?.focus();
		}
	}
	// Closes a panel when keyboard focus moves outside it. A null relatedTarget
	// (a click that focuses nothing, as Safari does for links) is left to the
	// outside-click handler, so a click inside still lands.
	function onFocusout(e: FocusEvent, id: string) {
		const next = e.relatedTarget as Node | null;
		if (open === id && next && !wraps[id]?.contains(next)) open = null;
	}
	function onPointerdown(e: PointerEvent) {
		const target = e.target as Node;
		if (open && !wraps[open]?.contains(target)) open = null;
		if (
			menuOpen &&
			sheetEl &&
			!sheetEl.contains(target) &&
			menuButton &&
			!menuButton.contains(target)
		)
			menuOpen = false;
	}

	afterNavigate(closeAll);

	const isCurrent = (href: string) => page.url.pathname === href;

	// The bar's button follows the section you're in: inside a product it starts
	// that product, elsewhere it goes to the home page's choice between the two.
	const cta = $derived(
		page.url.pathname.startsWith('/connect')
			? { label: 'Start free', href: CONNECT_URL, id: 'connect' }
			: page.url.pathname.startsWith('/desktop')
				? { label: 'Install free', href: '/desktop#install', id: 'desktop' }
				: { label: 'Get started', href: '/#fork', id: 'fork' }
	);
	const inSection = (p: ProductNav) =>
		page.url.pathname === p.overview.href || page.url.pathname.startsWith(`${p.overview.href}/`);

	const topLinkClass =
		'rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950';
	const sheetLinkClass =
		'flex min-h-9 items-center gap-1.5 rounded-lg px-3 text-[15px] text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950';
	const sheetHeadClass =
		'flex items-center gap-3 rounded-xl bg-paper px-3 py-2 ring-1 ring-brand/10 hover:ring-brand/30';
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

{#snippet sheetHead(p: ProductNav)}
	<span
		class="grid size-8 flex-none place-items-center rounded-lg {p.id === 'desktop'
			? 'bg-accent text-brand-deep'
			: 'bg-brand text-accent'}"
		aria-hidden="true"
	>
		<svg
			class="size-5"
			viewBox="0 0 32 32"
			fill="none"
			stroke="currentColor"
			stroke-width="2.4"
			stroke-linejoin="round"
		>
			{#if p.id === 'desktop'}
				<rect x="6" y="7" width="20" height="13" rx="2" /><path d="M3 24h26l-2 2.5H5L3 24z" />
			{:else}
				<rect x="10" y="3.5" width="12" height="25" rx="3" /><path d="M14 24.5h4" />
			{/if}
		</svg>
	</span>
	<span class="flex min-w-0 flex-1 flex-col">
		<span class="text-[16px] leading-tight font-bold text-brand">{p.overview.label}</span>
		<span class="mt-0.5 text-[12.5px] leading-snug text-neutral-600">{p.overview.description}</span>
	</span>
	<span aria-hidden="true" class="text-lg text-brand">→</span>
{/snippet}

{#snippet arrow()}
	<span aria-hidden="true" class="text-neutral-400">↗</span><span class="sr-only"
		>(opens connect.editmamei.com)</span
	>
{/snippet}

<header class="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/85 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
		<a
			href="/"
			class="flex items-center gap-2.5 font-bold tracking-tight text-neutral-900"
			aria-label="Editmamei home"
		>
			<img src="/icons/icon-64.png" alt="" width="32" height="32" class="size-8 shrink-0" />
			<span class="text-lg">Editmamei</span>
		</a>

		<div class="flex items-center gap-2">
			<nav class="relative hidden items-center gap-1 md:flex" aria-label="Primary">
				{#each productNavs as p (p.id)}
					<div bind:this={wraps[p.id]} onfocusout={(e) => onFocusout(e, p.id)} class="relative">
						<button
							bind:this={buttons[p.id]}
							type="button"
							class="{topLinkClass} inline-flex items-center gap-1 {inSection(p)
								? 'text-neutral-950'
								: ''}"
							aria-expanded={open === p.id}
							aria-controls="nav-{p.id}-panel"
							onclick={() => toggle(p.id)}
						>
							{p.menu}
							<svg
								class="size-3.5 transition-transform motion-reduce:transition-none"
								class:rotate-180={open === p.id}
								viewBox="0 0 24 24"
								fill="none"
								aria-hidden="true"
							>
								<path
									d="M6 9 L12 15 L18 9"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
								/>
							</svg>
						</button>

						<div
							id="nav-{p.id}-panel"
							class="absolute top-full left-0 z-40 mt-2 w-[19rem] rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
							hidden={open !== p.id}
						>
							<a
								href={p.overview.href}
								onclick={closeAll}
								aria-current={isCurrent(p.overview.href) ? 'page' : undefined}
								class="block rounded-lg px-3 py-2.5 hover:bg-neutral-50"
							>
								<span class="block text-sm font-semibold text-neutral-950">{p.overview.label}</span>
								<span class="mt-0.5 block text-xs text-neutral-600">{p.overview.description}</span>
							</a>
							<ul class="mt-1 border-t border-neutral-100 pt-1">
								{#each p.links as link (link.href)}
									<li>
										<a
											href={link.href}
											onclick={closeAll}
											aria-current={isCurrent(link.href) ? 'page' : undefined}
											class="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
											>{link.label}{#if link.external}{@render arrow()}{/if}</a
										>
									</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}

				{#each primaryNav as link (link.href)}
					<a
						href={link.href}
						class={topLinkClass}
						aria-current={isCurrent(link.href) ? 'page' : undefined}>{link.label}</a
					>
				{/each}

				<a
					href={GITHUB_REPO_URL}
					rel="noopener noreferrer"
					aria-label="Editmamei on GitHub"
					class="grid size-9 place-items-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
				>
					<svg class="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path
							d="M12 .5C5.65.5.5 5.65.5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"
						/>
					</svg>
				</a>
			</nav>

			<a
				href={cta.href}
				onclick={() => track(`nav-cta-${cta.id}`)}
				class="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				{cta.label}
			</a>

			<button
				bind:this={menuButton}
				type="button"
				class="grid size-10 place-items-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls={menuOpen ? 'site-nav-menu' : undefined}
				onclick={toggleMenu}
			>
				{#if menuOpen}
					<svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M6 6 L18 18 M18 6 L6 18"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				{:else}
					<svg class="size-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M3 6 H21 M3 12 H21 M3 18 H21"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
						/>
					</svg>
				{/if}
			</button>
		</div>
	</div>

	{#if menuOpen}
		<nav
			bind:this={sheetEl}
			id="site-nav-menu"
			aria-label="Site"
			class="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-neutral-200 bg-white pb-3 shadow-lg md:hidden"
		>
			<!-- One card per product: its header opens the product page, its pages are listed under it. -->
			{#each productNavs as p, gi (p.id)}
				<div class="px-3 pt-2.5">
					{#if gi === 0}
						<a
							bind:this={firstSheetLink}
							href={p.overview.href}
							onclick={closeAll}
							aria-current={isCurrent(p.overview.href) ? 'page' : undefined}
							class={sheetHeadClass}>{@render sheetHead(p)}</a
						>
					{:else}
						<a
							href={p.overview.href}
							onclick={closeAll}
							aria-current={isCurrent(p.overview.href) ? 'page' : undefined}
							class={sheetHeadClass}>{@render sheetHead(p)}</a
						>
					{/if}
					<ul aria-label="{p.overview.label} pages" class="mt-0.5 ml-11 grid">
						{#each p.links as link (link.href)}
							<li>
								<a
									href={link.href}
									onclick={closeAll}
									aria-current={isCurrent(link.href) ? 'page' : undefined}
									class={sheetLinkClass}
									>{link.label}{#if link.external}{@render arrow()}{/if}</a
								>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
			<ul class="mx-3 mt-2 flex flex-wrap gap-x-1 border-t border-neutral-100 pt-1.5">
				{#each primaryNav as link (link.href)}
					<li>
						<a
							href={link.href}
							onclick={closeAll}
							aria-current={isCurrent(link.href) ? 'page' : undefined}
							class={sheetLinkClass}>{link.sheetLabel ?? link.label}</a
						>
					</li>
				{/each}
				<li>
					<a
						href={GITHUB_REPO_URL}
						rel="noopener noreferrer"
						onclick={closeAll}
						class={sheetLinkClass}>GitHub</a
					>
				</li>
			</ul>
		</nav>
	{/if}
</header>
