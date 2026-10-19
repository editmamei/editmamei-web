#!/usr/bin/env node
/**
 * Email every published blog post to the "Editmamei updates" list, once.
 *
 * Runs at the end of deploy.yml on main, after the site is live. For each
 * published post (src/lib/content/posts/*.md, never drafts/ or `_` files)
 * dated on or after EMAIL_POSTS_SINCE, it makes sure a Resend broadcast named
 * `post:<slug>` exists and has been sent:
 *   - a broadcast in any state other than "draft" (sent, queued, scheduled)
 *     means the post was already mailed: skip;
 *   - an existing draft is sent, never duplicated;
 *   - otherwise one is created and sent.
 * Rerunning (daily rebuild, redeploy) is therefore safe.
 *
 * Env: RESEND_BROADCAST_KEY (GitHub secret). Unset = log one line, exit 0.
 * Flags: --dry-run  print what would be created or sent; only the list
 *        endpoint is called (nothing at all when there is no key).
 *
 * Errors exit non-zero with a message that never contains the key.
 * Older posts are never mailed: the cutoff is EMAIL_POSTS_SINCE below.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const EMAIL_POSTS_SINCE = '2026-10-18';
export const AUDIENCE_ID = '4496fce6-cedd-4a45-ab8b-cea7e58e2292';
export const FROM = 'Editmamei <updates@noreply.editmamei.com>';
export const SITE = 'https://editmamei.com';
const API = 'https://api.resend.com';
// Resend sits behind Cloudflare, which 1010-blocks some default agents.
const USER_AGENT = 'editmamei-web/1.0 (+https://editmamei.com)';

const here = dirname(fileURLToPath(import.meta.url));
const DEFAULT_POSTS_DIR = resolve(here, '..', 'src', 'lib', 'content', 'posts');

/* ---------- posts ---------- */

function unquote(value) {
	const v = value.trim();
	const m = v.match(/^(["'])([\s\S]*)\1$/);
	if (!m) return v;
	return m[1] === '"' ? m[2].replace(/\\"/g, '"').replace(/\\\\/g, '\\') : m[2].replace(/''/g, "'");
}

/** Parse the flat `key: value` frontmatter posts use. */
export function parseFrontmatter(source) {
	const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!match) return null;
	const fields = {};
	for (const line of match[1].split(/\r?\n/)) {
		const kv = line.match(/^([A-Za-z_]+):\s*(.*)$/);
		if (kv) fields[kv[1]] = unquote(kv[2]);
	}
	return fields;
}

/**
 * Published posts only: top-level *.md in the posts dir, `_` files skipped,
 * drafts/ never read (readdirSync is not recursive). Slug = filename.
 */
export function loadPosts(dir = DEFAULT_POSTS_DIR) {
	if (!existsSync(dir)) return [];
	const posts = [];
	for (const file of readdirSync(dir)) {
		if (!file.endsWith('.md') || file.startsWith('_')) continue;
		const fm = parseFrontmatter(readFileSync(join(dir, file), 'utf8'));
		if (!fm?.title || !fm.description || !/^\d{4}-\d{2}-\d{2}/.test(fm.date ?? '')) {
			throw new Error(`Post ${file}: needs title, description and a YYYY-MM-DD date`);
		}
		posts.push({
			slug: file.replace(/\.md$/, ''),
			title: fm.title,
			description: fm.description,
			date: fm.date.slice(0, 10)
		});
	}
	return posts.sort((a, b) =>
		a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? -1 : 1
	);
}

/** Posts that are eligible to be mailed (on or after the since-date). */
export function selectPosts(posts, since = EMAIL_POSTS_SINCE) {
	return posts.filter((p) => p.date >= since);
}

/* ---------- the email ---------- */

export function escapeHtml(value) {
	return String(value)
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export const UNSUBSCRIBE = '{{{RESEND_UNSUBSCRIBE_URL}}}';
const SIGNUP_NOTE = 'You signed up for Editmamei updates at editmamei.com.';

export function postUrl(slug) {
	return `${SITE}/blog/${slug}`;
}

export function emailText(post) {
	return [
		post.title,
		'',
		post.description,
		'',
		`Read the post: ${postUrl(post.slug)}`,
		'',
		'--',
		SIGNUP_NOTE,
		`Unsubscribe: ${UNSUBSCRIBE}`
	].join('\n');
}

/**
 * Same card as the signup confirmation email (editmamei-subscribe
 * src/resend.ts), copied rather than imported. Colors come from the site's
 * design tokens (src/routes/layout.css @theme). Tables, inline styles only.
 */
export function emailHtml(post) {
	const url = escapeHtml(postUrl(post.slug));
	const font =
		"font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
	return [
		'<div style="display:none;max-height:0;overflow:hidden;mso-hide:all">',
		escapeHtml(post.description),
		'</div>',
		'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f3ea;padding:32px 16px">',
		'<tr><td align="center">',
		'<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#ffffff;border:1px solid #e8e3d4;border-radius:12px">',
		'<tr><td style="padding:32px 36px 28px">',
		'<table role="presentation" cellpadding="0" cellspacing="0"><tr>',
		'<td><img src="https://editmamei.com/icons/icon-64.png" width="28" height="28" alt="" style="display:block;border-radius:6px"></td>',
		`<td style="padding-left:10px;${font};font-size:18px;font-weight:700;color:#143731">Editmamei</td>`,
		'</tr></table>',
		`<h1 style="margin:26px 0 0;${font};font-size:22px;line-height:1.3;font-weight:700;color:#1c1917">${escapeHtml(post.title)}</h1>`,
		`<p style="margin:12px 0 0;${font};font-size:15px;line-height:1.6;color:#44403c">${escapeHtml(post.description)}</p>`,
		'<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 0"><tr>',
		'<td style="background-color:#143731;border-radius:8px">',
		`<a href="${url}" style="display:block;padding:12px 28px;${font};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none">Read the post</a>`,
		'</td></tr></table>',
		`<p style="margin:24px 0 0;${font};font-size:13px;line-height:1.6;color:#57534e;word-break:break-all">`,
		`<a href="${url}" style="color:#a8512f">${url}</a>`,
		'</p>',
		'<hr style="margin:26px 0 0;border:none;border-top:1px solid #e8e3d4">',
		`<p style="margin:18px 0 0;${font};font-size:13px;line-height:1.6;color:#57534e">`,
		`${SIGNUP_NOTE} <a href="${UNSUBSCRIBE}" style="color:#a8512f">Unsubscribe</a>.`,
		'</p>',
		'</td></tr>',
		'</table>',
		`<p style="margin:18px 0 0;${font};font-size:12px;color:#78716c">`,
		'Editmamei &middot; <a href="https://editmamei.com" style="color:#78716c">editmamei.com</a>',
		'</p>',
		'</td></tr>',
		'</table>'
	].join('');
}

/* ---------- decisions ---------- */

export const broadcastName = (slug) => `post:${slug}`;

/**
 * 'skip'   a non-draft broadcast exists (sent / queued / scheduled / sending)
 * 'send'   only a draft exists: send it, do not create another
 * 'create' nothing exists: create then send
 */
export function decide(post, broadcasts) {
	const mine = broadcasts.filter((b) => b.name === broadcastName(post.slug));
	const handled = mine.find((b) => b.status !== 'draft');
	if (handled) return { action: 'skip', reason: handled.status, id: handled.id };
	const draft = mine.find((b) => b.status === 'draft');
	if (draft) return { action: 'send', id: draft.id };
	return { action: 'create' };
}

/* ---------- Resend ---------- */

/** Thrown for any API failure; the message never includes the key. */
export class ResendError extends Error {}

function makeClient(key, fetchImpl) {
	async function call(method, path, body) {
		let res;
		try {
			res = await fetchImpl(`${API}${path}`, {
				method,
				headers: {
					Authorization: `Bearer ${key}`,
					'Content-Type': 'application/json',
					'User-Agent': USER_AGENT
				},
				body: body === undefined ? undefined : JSON.stringify(body)
			});
		} catch (error) {
			throw new ResendError(`${method} ${path}: network error (${scrub(error?.message, key)})`);
		}
		const text = await res.text().catch(() => '');
		if (!res.ok) {
			throw new ResendError(
				`${method} ${path}: HTTP ${res.status} ${scrub(text, key).slice(0, 300)}`
			);
		}
		try {
			return text ? JSON.parse(text) : {};
		} catch {
			throw new ResendError(`${method} ${path}: response was not JSON`);
		}
	}

	return {
		/** All broadcasts, following has_more / after cursors if the API pages. */
		async listBroadcasts() {
			const all = [];
			let after;
			for (let page = 0; page < 100; page++) {
				const q = after ? `?limit=100&after=${encodeURIComponent(after)}` : '?limit=100';
				const body = await call('GET', `/broadcasts${q}`);
				const data = Array.isArray(body.data) ? body.data : [];
				all.push(...data);
				if (!body.has_more || data.length === 0) break;
				after = data[data.length - 1].id;
			}
			return all;
		},
		async createBroadcast(post) {
			const body = await call('POST', '/broadcasts', {
				audience_id: AUDIENCE_ID,
				from: FROM,
				subject: post.title,
				name: broadcastName(post.slug),
				html: emailHtml(post),
				text: emailText(post)
			});
			if (!body.id) throw new ResendError('POST /broadcasts: response had no id');
			return body.id;
		},
		async sendBroadcast(id) {
			await call('POST', `/broadcasts/${encodeURIComponent(id)}/send`, {});
		}
	};
}

function scrub(text, key) {
	const s = String(text ?? '');
	return key ? s.split(key).join('[redacted]') : s;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- run ---------- */

/** Returns the process exit code. Injectable for tests. */
export async function run({
	env = process.env,
	argv = process.argv.slice(2),
	fetchImpl = globalThis.fetch,
	postsDir = DEFAULT_POSTS_DIR,
	since = EMAIL_POSTS_SINCE,
	log = console.log,
	logError = console.error,
	pauseMs = 600 // Resend allows 2 requests per second
} = {}) {
	const dryRun = argv.includes('--dry-run');
	const key = env.RESEND_BROADCAST_KEY;
	const candidates = selectPosts(loadPosts(postsDir), since);

	if (!key) {
		log(
			`RESEND_BROADCAST_KEY is not set: skipping post emails (${candidates.length} post(s) dated ${since} or later).`
		);
		return 0;
	}

	const client = makeClient(key, fetchImpl);
	try {
		const broadcasts = await client.listBroadcasts();
		let did = 0;
		for (const post of candidates) {
			const d = decide(post, broadcasts);
			if (d.action === 'skip') {
				log(`${post.slug}: already mailed (${d.reason}), skipping`);
				continue;
			}
			if (dryRun) {
				log(
					d.action === 'send'
						? `${post.slug}: [dry-run] would send existing draft ${d.id}`
						: `${post.slug}: [dry-run] would create "${broadcastName(post.slug)}" ("${post.title}") and send it`
				);
				continue;
			}
			if (did++) await sleep(pauseMs);
			const id = d.action === 'send' ? d.id : await client.createBroadcast(post);
			if (d.action === 'create') await sleep(pauseMs);
			await client.sendBroadcast(id);
			log(`${post.slug}: sent (broadcast ${id})`);
		}
		if (candidates.length === 0) log(`No published posts dated ${since} or later.`);
		return 0;
	} catch (error) {
		logError(`send-post-emails failed: ${scrub(error?.message ?? error, key)}`);
		return 1;
	}
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	process.exitCode = await run();
}
