// Surface a few recent "what's been landing" entries on /product. Hand-maintained
// from editmamei-ce/CHANGELOG.md so the wording can be tuned for the landing page
// without rewriting the canonical release notes.

export interface ChangelogEntry {
	label: string;
	date: string;
	title: string;
	body: string;
}

export const changelogEntries: ChangelogEntry[] = [
	{
		label: 'v1.0 candidate',
		date: '2026-06',
		title: 'Multi-client install CLI',
		body: 'editmamei install / uninstall / status / help. One command registers the MCP server with Claude Desktop and drops the Claude skill files into ~/.claude/skills/.'
	},
	{
		label: 'v1.0 candidate',
		date: '2026-05',
		title: 'PS 27.x cross-platform fixes',
		body: 'Descriptor-shape repairs for levels, curves, mask-from-selection on pixel layers, and the Hst2-vs-Hsrt master Hue/Saturation key. Structured error context surfaced on failure.'
	},
	{
		label: 'milestone',
		date: '2026-05-30',
		title: 'Pre-launch readiness review',
		body: '15-track audit of the codebase, ahead of the v1.0 release. Outcome and remediation plan inform the v1.0 scope.'
	},
	{
		label: 'v0.2.0',
		date: '2026-05',
		title: 'npm package name reservation',
		body: 'Placeholder release reserving the editmamei and @editmamei/placeholder package names. The full editing surface, Templates system, and CE/Pro build pipeline land in v1.0.0.'
	}
];

export const fullChangelogUrl = 'https://github.com/editmamei/editmamei-ce/blob/main/CHANGELOG.md';
