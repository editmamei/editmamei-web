<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { track } from '$lib/analytics/clarity';
	import { GITHUB_REPO_URL } from '$lib/links';
	import {
		isOnSite,
		primaryNav,
		productExtras,
		productOverview,
		surfaces
	} from '$lib/content/surfaces';

	// Only surfaces with a page on this site appear in the menus.
	const navSurfaces = surfaces.filter(isOnSite);
	// The mobile sheet lists primaryNav right below, so extras that duplicate a
	// primary link are left out of its Product group.
	const primaryHrefs = new Set(primaryNav.map((l) => l.href));
	const productLinks: { label: string; href: string; beta?: boolean }[] = [
		productOverview,
		...navSurfaces.map((s) => ({ label: s.name, href: s.href, beta: s.beta })),
		...productExtras.filter((l) => !primaryHrefs.has(l.href))
	];

	// Desktop Product menu: a disclosure (button + panel), opened by click or
	// Enter/Space, closed by Escape, an outside click, or following a link.
	let productOpen = $state(false);
	let productWrap = $state<HTMLElement>();
	let productButton = $state<HTMLButtonElement>();

	// Mobile menu: a full-width sheet under the bar.
	let menuOpen = $state(false);
	let menuButton = $state<HTMLButtonElement>();
	let sheetEl = $state<HTMLElement>();
	let firstSheetLink = $state<HTMLAnchorElement>();

	function toggleProduct() {
		productOpen = !productOpen;
		if (productOpen) track('nav-product-opened');
	}
	function toggleMenu() {
		menuOpen = !menuOpen;
		// Move focus into the sheet so keyboard users land on the first item.
		if (menuOpen) queueMicrotask(() => firstSheetLink?.focus());
	}
	function closeAll() {
		productOpen = false;
		menuOpen = false;
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key !== 'Escape') return;
		if (productOpen) {
			productOpen = false;
			productButton?.focus();
		}
		if (menuOpen) {
			menuOpen = false;
			menuButton?.focus();
		}
	}
	function onPointerdown(e: PointerEvent) {
		const target = e.target as Node;
		if (productOpen && productWrap && !productWrap.contains(target)) productOpen = false;
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

	const topLinkClass =
		'rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950';
	const sheetLinkClass =
		'flex min-h-11 items-center gap-2 px-4 text-base text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950';
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

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
				<div bind:this={productWrap}>
					<button
						bind:this={productButton}
						type="button"
						class="{topLinkClass} inline-flex items-center gap-1"
						aria-expanded={productOpen}
						aria-controls="nav-product-panel"
						onclick={toggleProduct}
					>
						Product
						<svg
							class="size-3.5 transition-transform motion-reduce:transition-none"
							class:rotate-180={productOpen}
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
						id="nav-product-panel"
						class="absolute top-full right-0 z-40 mt-2 w-[34rem] max-w-[calc(100vw-2rem)] rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
						hidden={!productOpen}
					>
						<a
							href={productOverview.href}
							onclick={closeAll}
							aria-current={isCurrent(productOverview.href) ? 'page' : undefined}
							class="block rounded-lg px-3 py-2.5 hover:bg-neutral-50"
						>
							<span class="block text-sm font-semibold text-neutral-950">
								{productOverview.label}
							</span>
							<span class="mt-0.5 block text-xs text-neutral-600">
								{productOverview.description}
							</span>
						</a>
						<!-- Editors sit in a three-column row; fewer than three center in it. -->
						<ul class="mt-1 flex flex-wrap justify-center border-t border-neutral-100 pt-1">
							{#each navSurfaces as s (s.id)}
								<li class="w-1/3 min-w-40 grow-0">
									<a
										href={s.href}
										onclick={closeAll}
										aria-current={isCurrent(s.href) ? 'page' : undefined}
										class="block h-full rounded-lg px-3 py-2.5 hover:bg-neutral-50"
									>
										<span class="flex items-center gap-1.5 text-sm font-semibold text-neutral-950">
											{s.name}
											{#if s.beta}
												<span
													class="rounded-full border border-neutral-300 px-1.5 text-[10px] font-medium text-neutral-600"
													>beta</span
												>
											{/if}
										</span>
										<span class="mt-0.5 block text-xs text-neutral-600">{s.descriptor}</span>
									</a>
								</li>
							{/each}
						</ul>
						{#if productExtras.length}
							<ul class="mt-1 flex justify-end gap-1 border-t border-neutral-100 pt-1">
								{#each productExtras as link (link.href)}
									<li>
										<a
											href={link.href}
											onclick={closeAll}
											class="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
											>{link.label} <span aria-hidden="true">→</span></a
										>
									</li>
								{/each}
							</ul>
						{/if}
					</div>
				</div>

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
				href="/#install"
				class="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				Install
			</a>

			<button
				bind:this={menuButton}
				type="button"
				class="grid size-10 place-items-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 md:hidden"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				aria-expanded={menuOpen}
				aria-controls="site-nav-menu"
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
			class="absolute inset-x-0 top-full z-40 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-neutral-200 bg-white pb-2 shadow-lg md:hidden"
		>
			<p
				id="site-nav-product"
				class="px-4 pt-4 pb-1 text-xs font-semibold tracking-wider text-neutral-500 uppercase"
			>
				Product
			</p>
			<ul aria-labelledby="site-nav-product">
				{#each productLinks as link, i (link.href)}
					<li>
						{#if i === 0}
							<a
								bind:this={firstSheetLink}
								href={link.href}
								onclick={closeAll}
								aria-current={isCurrent(link.href) ? 'page' : undefined}
								class={sheetLinkClass}>{link.label}</a
							>
						{:else}
							<a
								href={link.href}
								onclick={closeAll}
								aria-current={isCurrent(link.href) ? 'page' : undefined}
								class={sheetLinkClass}
							>
								{link.label}
								{#if link.beta}
									<span
										class="rounded-full border border-neutral-300 px-1.5 text-[10px] font-medium text-neutral-600"
										>beta</span
									>
								{/if}
							</a>
						{/if}
					</li>
				{/each}
			</ul>
			<ul class="mt-2 border-t border-neutral-100 pt-2">
				{#each primaryNav as link (link.href)}
					<li>
						<a
							href={link.href}
							onclick={closeAll}
							aria-current={isCurrent(link.href) ? 'page' : undefined}
							class={sheetLinkClass}>{link.label}</a
						>
					</li>
				{/each}
			</ul>
			<ul class="mt-2 border-t border-neutral-100 pt-2">
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
