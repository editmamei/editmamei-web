<script lang="ts">
	// A YouTube Short in a blog post, click to play. Until the reader presses
	// play the page loads nothing from YouTube (the poster is our own file), so
	// a post with a video sets no third-party cookies on its own.
	let { id, title, poster }: { id: string; title: string; poster: string } = $props();
	let playing = $state(false);
</script>

<figure class="not-prose mx-auto my-10 w-full max-w-[340px]">
	<div class="relative aspect-[9/16] overflow-hidden rounded-xl bg-brand-deep shadow-lg">
		{#if playing}
			<iframe
				class="absolute inset-0 h-full w-full"
				src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
				{title}
				allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
			></iframe>
		{:else}
			<button
				type="button"
				class="group absolute inset-0 h-full w-full cursor-pointer"
				aria-label={`Play the video: ${title}`}
				onclick={() => (playing = true)}
			>
				<img
					src={poster}
					alt=""
					width="540"
					height="960"
					loading="lazy"
					decoding="async"
					class="h-full w-full object-cover"
				/>
				<span class="absolute inset-0 grid place-items-center">
					<span
						class="grid h-16 w-16 place-items-center rounded-full bg-brand/70 transition group-hover:bg-brand/90 group-focus-visible:bg-brand/90"
					>
						<svg viewBox="0 0 24 24" class="ml-1 h-7 w-7 fill-white" aria-hidden="true">
							<path d="M8 5v14l11-7z" />
						</svg>
					</span>
				</span>
			</button>
		{/if}
	</div>
	<figcaption class="mt-3 text-center text-[14px] text-brand/70">
		Plays from YouTube.
		<a
			href={`https://www.youtube.com/shorts/${id}`}
			class="font-semibold text-brand underline underline-offset-2">Watch it there</a
		>
	</figcaption>
</figure>
