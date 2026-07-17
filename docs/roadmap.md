# Roadmap — 4 Hours

Build core end-to-end first. Polish later. If running behind, cut scope
(see bottom) rather than skipping docs/tests at the end.

**0:00–0:30 — Setup**
Next.js + TypeScript project, Prisma + Vercel Postgres, seed 3 users,
deploy an empty skeleton to Vercel early (catch deploy issues now, not
later).

**0:30–1:00 — Auth + Access**
Simple login (pick a seeded user), cookie session, `lib/access.ts` +
its unit test.

**1:00–2:15 — Documents + Editor**
Document CRUD API, dashboard (My Docs / Shared with Me), Tiptap editor
with formatting, autosave, rename.
*Checkpoint: create → edit → refresh → content still there.*

**2:15–3:00 — Sharing**
Share/unshare API, share dialog, dashboard shows owned vs shared clearly.

**3:00–3:30 — File Upload**
Upload .txt/.md → new document, reject other types with a clear message.

**3:30–3:50 — Error handling pass**
Check every API route has validation + sensible status codes. Add basic
loading/empty states.

**3:50–4:20 — Docs**
README, architecture note, AI workflow note, SUBMISSION.md.

**4:20–4:45 (buffer) — Video + final check**
Record walkthrough, test the live deploy in incognito, put files in Drive.

## If running out of time, cut in this order
1. Drop inline rename → plain form instead
2. Drop autosave debounce → manual "Save" button
3. Drop underline/lists first, keep bold/italic/heading
