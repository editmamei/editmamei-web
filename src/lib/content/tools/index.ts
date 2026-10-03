// The /tools directory data: the generated tool list joined with the
// written copy and categories. Importing this module validates the join and
// throws on any mismatch, which fails `npm run build`. The same checks run
// under `npm test` (tests/tools-directory.test.mjs).

import snapshotJson from './tools.generated.json';
import { CATEGORIES, GROUP_TO_CATEGORY, type Category, type CategoryId } from './categories';
import { TOOL_COPY, type ToolMedia } from './tool-copy';

export type Editor = 'photoshop' | 'gimp';
export type Edition = 'community' | 'pro';

export interface Tool {
	/** Tool identifier, also the row's anchor (`/tools#ps_select_subject`). */
	id: string;
	editor: Editor;
	edition: Edition;
	/** Capability group from the code. */
	group: string;
	category: CategoryId;
	task: string;
	summary: string;
	keywords: string[];
	media?: ToolMedia;
}

interface GeneratedTool {
	id: string;
	editor: string;
	edition: string;
	group: string;
}

const EDITORS: Editor[] = ['photoshop', 'gimp'];
const EDITIONS: Edition[] = ['community', 'pro'];

/** `ps_select_subject` becomes `select-subject`; `gimp_add_adjustment` becomes `gimp-add-adjustment`. */
export function slugFor(id: string): string {
	return (id.startsWith('ps_') ? id.slice(3) : id).replaceAll('_', '-');
}

function build(): Tool[] {
	const problems: string[] = [];
	const generated = snapshotJson.tools as GeneratedTool[];
	const generatedIds = new Set(generated.map((t) => t.id));
	const categoryIds = new Set(CATEGORIES.map((c) => c.id));

	for (const id of Object.keys(TOOL_COPY)) {
		if (!generatedIds.has(id)) {
			problems.push(`tool-copy.ts has an entry for ${id}, which is not a shipped tool`);
		}
	}

	const tools: Tool[] = [];
	for (const g of generated) {
		const copy = TOOL_COPY[g.id];
		if (!copy) {
			problems.push(`${g.id} has no entry in tool-copy.ts`);
			continue;
		}
		if (!EDITORS.includes(g.editor as Editor)) problems.push(`${g.id}: unknown editor ${g.editor}`);
		if (!EDITIONS.includes(g.edition as Edition)) {
			problems.push(`${g.id}: edition ${g.edition} is not community or pro`);
		}
		const category = copy.category ?? GROUP_TO_CATEGORY[g.group];
		if (!category) problems.push(`${g.id}: group ${g.group} has no category in categories.ts`);
		else if (!categoryIds.has(category)) problems.push(`${g.id}: unknown category ${category}`);
		tools.push({
			id: g.id,
			editor: g.editor as Editor,
			edition: g.edition as Edition,
			group: g.group,
			category,
			task: copy.task,
			summary: copy.summary,
			keywords: copy.keywords ?? [],
			media: copy.media
		});
	}

	if (problems.length > 0) {
		throw new Error(`Tools directory data is inconsistent:\n- ${problems.join('\n- ')}`);
	}

	const categoryOrder = new Map(CATEGORIES.map((c, i) => [c.id, i]));
	const copyOrder = new Map(Object.keys(TOOL_COPY).map((id, i) => [id, i]));
	return tools.sort(
		(a, b) =>
			categoryOrder.get(a.category)! - categoryOrder.get(b.category)! ||
			EDITORS.indexOf(a.editor) - EDITORS.indexOf(b.editor) ||
			EDITIONS.indexOf(a.edition) - EDITIONS.indexOf(b.edition) ||
			copyOrder.get(a.id)! - copyOrder.get(b.id)!
	);
}

export const tools: Tool[] = build();

export const snapshot = {
	version: snapshotJson.source.version,
	date: snapshotJson.snapshotDate
};

function count(pred: (t: Tool) => boolean): number {
	return tools.filter(pred).length;
}

/** Counts for copy anywhere on the site, so no page types a number by hand. */
export const toolCounts = {
	total: tools.length,
	photoshop: count((t) => t.editor === 'photoshop'),
	gimp: count((t) => t.editor === 'gimp'),
	photoshopPro: count((t) => t.editor === 'photoshop' && t.edition === 'pro')
};

/** Categories that have at least one tool, in page order. */
export const categories: Category[] = CATEGORIES.filter((c) =>
	tools.some((t) => t.category === c.id)
);

export { CATEGORIES, type Category, type CategoryId };
