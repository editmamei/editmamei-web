<script lang="ts">
	let menuOpen = $state(false);
	let navEl = $state<HTMLElement>();
	let firstMenuLink = $state<HTMLAnchorElement>();

	function openMenu() {
		menuOpen = true;
		// Move focus into the menu so keyboard users land on the first item.
		queueMicrotask(() => firstMenuLink?.focus());
	}
	function toggleMenu() {
		if (menuOpen) menuOpen = false;
		else openMenu();
	}
	function closeMenu() {
		menuOpen = false;
	}
	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && menuOpen) menuOpen = false;
	}
	function onPointerdown(e: PointerEvent) {
		if (menuOpen && navEl && !navEl.contains(e.target as Node)) menuOpen = false;
	}
</script>

<svelte:window onkeydown={onKeydown} onpointerdown={onPointerdown} />

<header class="sticky top-0 z-30 border-b border-neutral-200/80 bg-white/85 backdrop-blur">
	<div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
		<a
			href="/"
			class="flex items-center gap-2.5 font-bold tracking-tight text-neutral-900"
			aria-label="Editmamei — home"
		>
			<img src="/icons/icon-64.png" alt="" width="32" height="32" class="size-8 shrink-0" />
			<span class="text-lg">Editmamei</span>
			<span class="hidden text-xs font-normal text-neutral-500 italic sm:inline"
				>· pronounced like edamame</span
			>
		</a>

		<div class="flex items-center gap-2">
			<nav class="hidden items-center gap-1 md:flex" aria-label="Primary">
				<a
					href="/product"
					class="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
					>Product</a
				>
				<a
					href="/pricing"
					class="rounded-md px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
					>Pricing</a
				>
			</nav>

			<a
				href="/#install"
				class="rounded-md bg-brand px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-light"
			>
				Install
			</a>

			<div class="relative md:hidden" bind:this={navEl}>
				<button
					type="button"
					class="grid size-10 place-items-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100"
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

				{#if menuOpen}
					<nav
						id="site-nav-menu"
						aria-label="Site"
						class="absolute top-full right-0 z-40 mt-2 min-w-[180px] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
					>
						<ul class="flex flex-col py-1">
							<li>
								<a
									bind:this={firstMenuLink}
									href="/product"
									onclick={closeMenu}
									class="block px-4 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950"
									>Product</a
								>
							</li>
							<li>
								<a
									href="/pricing"
									onclick={closeMenu}
									class="block px-4 py-2.5 text-sm text-neutral-800 hover:bg-neutral-50 hover:text-neutral-950"
									>Pricing</a
								>
							</li>
						</ul>
					</nav>
				{/if}
			</div>
		</div>
	</div>
</header>
