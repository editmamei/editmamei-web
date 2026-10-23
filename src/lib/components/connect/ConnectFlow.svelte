<script lang="ts">
	import { onMount } from 'svelte';

	// How Connect is wired, as one triangle: your phone, the AI model and
	// Editmamei's server. The conversation (dashed orange) runs through the AI;
	// the photo itself (solid green) goes straight to Editmamei's server by an
	// upload link and comes back as a download. Two cues, never colour alone:
	// line style, and a text label on every link. Facts follow Connect's privacy
	// policy (uploads deleted 24 hours after upload).
	//
	// Drawn twice, wide for large screens and tall for phones, so text stays at
	// its real size. Travellers run on one 8 s cycle; with reduced motion, and
	// before scripts run, one rests at the middle of each link.

	type Key = 'phone' | 'ai' | 'server';
	type P = { x: number; y: number };
	type Node = { at: P; title: string; sub: string[]; side: 'below' | 'right' };
	type Label = { at: P; lines: string[]; anchor: 'start' | 'middle' | 'end' };
	type Layout = {
		id: string;
		w: number;
		h: number;
		nodes: Record<Key, Node>;
		labels: { request: Label; steps: Label; photo: Label };
	};

	const wide: Layout = {
		id: 'w',
		w: 1000,
		h: 420,
		nodes: {
			phone: {
				at: { x: 140, y: 270 },
				title: 'Your phone',
				sub: ['Or laptop. Your AI app,', 'with Connect added'],
				side: 'below'
			},
			ai: {
				at: { x: 500, y: 56 },
				title: 'The AI model',
				sub: ['Plans each step,', 'as with any chat'],
				side: 'below'
			},
			server: {
				at: { x: 860, y: 270 },
				title: "Editmamei's server",
				sub: ['Edits with real tools.', 'Uploads deleted after 24 hours'],
				side: 'below'
			}
		},
		labels: {
			request: { at: { x: 296, y: 132 }, lines: ['Your request'], anchor: 'end' },
			steps: {
				at: { x: 704, y: 124 },
				lines: ['Each step, and a', 'small preview back'],
				anchor: 'start'
			},
			photo: {
				at: { x: 500, y: 302 },
				lines: ['Your photo: up by an upload link,', 'back as a download'],
				anchor: 'middle'
			}
		}
	};

	const tall: Layout = {
		id: 't',
		w: 360,
		h: 650,
		nodes: {
			phone: {
				at: { x: 46, y: 56 },
				title: 'Your phone',
				sub: ['Your AI app,', 'with Connect added'],
				side: 'right'
			},
			ai: {
				at: { x: 286, y: 320 },
				title: 'The AI model',
				sub: ['Plans each step'],
				side: 'below'
			},
			server: {
				at: { x: 46, y: 584 },
				title: "Editmamei's server",
				sub: ['Edits with real tools.', 'Uploads deleted', 'after 24 hours'],
				side: 'right'
			}
		},
		labels: {
			request: { at: { x: 168, y: 176 }, lines: ['Your request'], anchor: 'start' },
			steps: {
				at: { x: 168, y: 470 },
				lines: ['Each step, and a', 'small preview back'],
				anchor: 'start'
			},
			photo: {
				at: { x: 62, y: 292 },
				lines: ['Your photo: up by', 'an upload link,', 'back as a download'],
				anchor: 'start'
			}
		}
	};

	// What travels, which way, and when in the 8 s cycle. `rest` marks the one
	// shown on each link when nothing moves.
	type Trip = { from: Key; to: Key; chip: 'text' | 'photo' | 'edit'; at: number; rest?: boolean };
	const trips: Trip[] = [
		{ from: 'phone', to: 'ai', chip: 'text', at: 0, rest: true },
		{ from: 'phone', to: 'server', chip: 'photo', at: 1.1, rest: true },
		{ from: 'ai', to: 'server', chip: 'edit', at: 2.4, rest: true },
		{ from: 'server', to: 'ai', chip: 'photo', at: 3.6 },
		{ from: 'ai', to: 'server', chip: 'edit', at: 4.8 },
		{ from: 'server', to: 'phone', chip: 'photo', at: 6.0 }
	];

	let animate = $state(false);
	onMount(() => {
		animate = !matchMedia('(prefers-reduced-motion: reduce)').matches;
	});

	const thumb = '/connect/lehua/9.webp';
	const line = (a: P, b: P) => `M${a.x} ${a.y} L${b.x} ${b.y}`;
	const mid = (a: P, b: P) => `translate(${(a.x + b.x) / 2} ${(a.y + b.y) / 2})`;
	// A dark outline behind every label, so a line passing behind never runs through text.
	const halo = 'paint-order: stroke; stroke: #162f29; stroke-width: 6px; stroke-linejoin: round;';
</script>

{#snippet diagram(L: Layout, cls: string)}
	{@const n = L.nodes}
	<svg
		viewBox="0 0 {L.w} {L.h}"
		class={cls}
		role="img"
		aria-label="Your phone sends your request to the AI model, which sends each editing step to Editmamei's server and gets a small preview back. Your photo goes straight from your phone to Editmamei's server by an upload link, and comes back as a download. Uploads are deleted 24 hours after upload."
	>
		<defs>
			<filter id="glow-{L.id}" x="-20%" y="-20%" width="140%" height="140%">
				<feGaussianBlur stdDeviation="4" result="b" />
				<feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
			</filter>
			<clipPath id="chip-{L.id}"><rect x="-8" y="-11" width="16" height="22" rx="3" /></clipPath>
		</defs>

		<!-- links: solid green for the photo, dashed orange for the conversation -->
		<path
			d={line(n.phone.at, n.server.at)}
			stroke="#ceff8c"
			stroke-width="3"
			fill="none"
			filter="url(#glow-{L.id})"
		/>
		<path
			d={line(n.phone.at, n.ai.at)}
			stroke="#ff9b70"
			stroke-width="3"
			stroke-dasharray="9 7"
			fill="none"
		/>
		<path
			d={line(n.ai.at, n.server.at)}
			stroke="#ff9b70"
			stroke-width="3"
			stroke-dasharray="9 7"
			fill="none"
		/>

		{#each [['request', '#ffb08f'], ['steps', '#ffb08f'], ['photo', '#ceff8c']] as [k, color] (k)}
			{@const lb = L.labels[k as 'request' | 'steps' | 'photo']}
			<text
				x={lb.at.x}
				y={lb.at.y}
				text-anchor={lb.anchor}
				fill={color}
				font-size="14"
				font-weight="650"
				style={halo}
			>
				{#each lb.lines as t, i (i)}<tspan x={lb.at.x} dy={i === 0 ? 0 : 18}>{t}</tspan>{/each}
			</text>
		{/each}

		<!-- travellers -->
		{#each trips as t, i (i)}
			{#if animate || t.rest}
				<g
					opacity={animate ? 0 : 1}
					transform={animate ? undefined : mid(n[t.from].at, n[t.to].at)}
				>
					{#if animate}
						<animate
							attributeName="opacity"
							values="0;1;1;0;0"
							keyTimes="0;0.02;0.12;0.14;1"
							dur="8s"
							begin="{t.at}s"
							repeatCount="indefinite"
						/>
						<animateMotion
							path={line(n[t.from].at, n[t.to].at)}
							keyPoints="0;1;1"
							keyTimes="0;0.14;1"
							calcMode="linear"
							dur="8s"
							begin="{t.at}s"
							repeatCount="indefinite"
						/>
					{/if}
					{#if t.chip === 'photo'}
						<rect x="-10" y="-13" width="20" height="26" rx="4" fill="#f4f1e8" />
						<image
							href={thumb}
							x="-8"
							y="-11"
							width="16"
							height="22"
							preserveAspectRatio="xMidYMid slice"
							clip-path="url(#chip-{L.id})"
						/>
					{:else if t.chip === 'edit'}
						<circle r="12" fill="#ceff8c" />
						<text y="5" text-anchor="middle" font-size="13" font-weight="800" fill="#0b1f1a">✎</text
						>
					{:else}
						<circle r="12" fill="#ffb08f" />
						<path d="M-6 -5h12v8h-7l-5 3.5z" fill="#2b1208" />
					{/if}
				</g>
			{/if}
		{/each}

		<!-- nodes -->
		{#each Object.entries(n) as [key, node] (key)}
			{@const right = node.side === 'right'}
			<g transform="translate({node.at.x} {node.at.y})">
				{#if key === 'server'}
					<rect
						x="-30"
						y="-30"
						width="60"
						height="60"
						rx="16"
						fill="#ceff8c"
						filter="url(#glow-{L.id})"
					/>
					<text y="10" text-anchor="middle" font-size="28" font-weight="900" fill="#0b1f1a">E</text>
				{:else if key === 'ai'}
					<rect
						x="-30"
						y="-30"
						width="60"
						height="60"
						rx="16"
						fill="#3a2a22"
						stroke="#ffb08f"
						stroke-opacity="0.45"
					/>
					<path
						d="M-9 8h18a7 7 0 0 0 1-13.9A10.5 10.5 0 0 0 -10.5 -3.4 8 8 0 0 0 -9 8z"
						fill="none"
						stroke="#ffb08f"
						stroke-width="2.4"
						stroke-linejoin="round"
					/>
				{:else}
					<rect
						x="-30"
						y="-30"
						width="60"
						height="60"
						rx="16"
						fill="#26332f"
						stroke="#ffffff"
						stroke-opacity="0.22"
					/>
					<rect
						x="-11"
						y="-18"
						width="22"
						height="36"
						rx="5"
						fill="none"
						stroke="#e9efe9"
						stroke-width="2.2"
					/>
					<path d="M-3 12h6" stroke="#e9efe9" stroke-width="2.2" stroke-linecap="round" />
				{/if}
				<text
					x={right ? 44 : 0}
					y={right ? -6 : 56}
					text-anchor={right ? 'start' : 'middle'}
					font-size="17"
					font-weight="700"
					fill="#f4f1e8"
					style={halo}>{node.title}</text
				>
				<text
					x={right ? 44 : 0}
					y={right ? 15 : 78}
					text-anchor={right ? 'start' : 'middle'}
					font-size="13.5"
					fill="#a9bcb4"
					style={halo}
				>
					{#each node.sub as s, i (i)}<tspan x={right ? 44 : 0} dy={i === 0 ? 0 : 18}>{s}</tspan
						>{/each}
				</text>
			</g>
		{/each}
	</svg>
{/snippet}

<div class="rounded-[26px] border border-white/10 bg-white/[0.03] px-3 py-6 sm:px-6 lg:py-8">
	{@render diagram(wide, 'hidden w-full lg:block')}
	{@render diagram(tall, 'mx-auto block w-full max-w-[360px] lg:hidden')}
</div>
