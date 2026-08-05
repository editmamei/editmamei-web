---
title: Post title
description: One or two plain sentences. Used on the blog index, in the RSS feed, and as the meta description.
date: 2026-08-05
---

Copy this file to `drafts/<slug>.md` to start a post. The filename becomes
the URL (`/blog/<slug>`), so keep it lowercase ASCII kebab-case. Files
starting with `_` are never picked up.

The folder is the publish state, and it is a hard boundary: anything in
`posts/` is compiled into the public site, while `drafts/` renders only on
the `npm run dev` server and is excluded from production builds entirely
(pages, RSS, sitemap, and the JS bundle). **Publishing = moving the file
from `drafts/` up into `posts/`.** There is no draft frontmatter flag.

Body is Markdown (mdsvex). Frontmatter fields: `title`, `description`, and
`date` (YYYY-MM-DD) are required; `updated` (YYYY-MM-DD) is optional.

House rules for the words themselves: the brand-voice guide applies (no
AI-tells, no em dashes, no hype, honesty above all), and never name a
`ps_*` tool that is not at a shippable tier (the leak guard scans this
folder like any other source).
