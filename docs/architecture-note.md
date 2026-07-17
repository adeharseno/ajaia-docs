# Architecture Note

## Stack
Next.js (App Router) for both frontend and API routes, Prisma + Postgres
(Vercel Postgres) for storage, Tiptap for the rich text editor. One
deployment target (Vercel), no separate backend service.

## Key decisions

**API routes as the backend.** Everything lives in one Next.js app, deployed
as a single Vercel project. Simpler to build and deploy in a 4-hour window
than a separate backend.

**Mock auth via cookie.** A cookie stores the logged-in user's id, set after
picking one of three seeded users — no passwords, no OAuth. This is a
deliberate scope cut: real auth adds real setup cost for reviewers and
doesn't add value to what's being evaluated here.

**Sharing is all-or-nothing.** A `DocumentShare` row means full edit access;
there's no viewer/editor distinction. Simpler schema and UI, and the
assignment doesn't require granular roles.

**Access logic pulled into `lib/access.ts`.** `canAccessDocument()` is a pure
function (no DB calls) so it can be unit tested directly — this is the
automated test the assignment asks for. The DB-aware wrapper
(`getAccessibleDocument`) is a thin layer on top.

**Content stored as Tiptap JSON.** Simple to save/load and preserves
formatting exactly. Not designed for real-time collaborative editing
(operational transforms), which is out of scope here.

**File import is intentionally basic.** `.txt`/`.md` only, each line becomes
a paragraph — no Markdown parsing into real formatting. Parsing `.docx` or
full Markdown was judged not worth the time for the value it adds in this
scope.

## What I'd build next with more time
- Real Markdown parsing on import (headings, lists, bold from `**text**`)
- View-only vs edit share permissions
- Debounced conflict handling for two people editing the same doc at once
- Proper auth (even a simple email+password flow)
