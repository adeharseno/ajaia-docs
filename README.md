# Ajaia Docs

A lightweight, Google Docs–style collaborative document editor. Built for
the Ajaia take-home assignment. See `docs/prd.md` for full scope and
`docs/architecture-note.md` for design decisions and trade-offs.

## Features
- Create, rename, and edit documents with rich text formatting (bold,
  italic, underline, headings, bullet/numbered lists)
- Autosave — content persists after refresh
- Upload a `.txt` or `.md` file to create a new document from it
- Share a document with another user (full edit access)
- Dashboard separates "My Documents" from "Shared with Me"

## Stack
Next.js (App Router, TypeScript) · Prisma · Postgres (Neon, via the
Vercel Marketplace) · Tiptap · Tailwind CSS · Vitest

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   This runs `prisma generate` automatically. It needs internet access to
   download Prisma's engine binaries — if `npm install` fails on that step
   behind a restrictive network/proxy, run `npx prisma generate` again once
   connectivity is available.

   Note: this project pins `prisma`/`@prisma/client` to `6.19.3`. Prisma 7
   moved database connection config out of `schema.prisma` into a separate
   `prisma.config.ts` + driver adapter — more setup than this project's
   scope needs, so it stays on the 6.x config style (`url`/`directUrl`
   directly in the datasource block).

2. Set up the database. Vercel no longer offers a native Postgres
   product — create one through the Marketplace instead:
   - In your Vercel project, go to Storage → Browse Marketplace → **Neon**
     (or go directly to vercel.com/marketplace/neon), install it, and
     connect it to this project. This auto-generates `DATABASE_URL` and
     several other connection variables.
   - Neon's integration doesn't name a variable `DIRECT_URL` by default —
     add one manually in Vercel's Environment Variables using the value
     from `DATABASE_URL_UNPOOLED` (same connection, just without the
     pooler in the hostname). Prisma needs both `DATABASE_URL` (pooled)
     and `DIRECT_URL` (direct) — see `prisma/schema.prisma`.
   - Then locally:
   ```bash
   cp .env.example .env
   # fill in DATABASE_URL and DIRECT_URL in .env
   ```

3. Push the schema and seed demo users:
   ```bash
   npm run db:push
   npm run db:seed
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## Test Accounts
No passwords — pick a user on the login screen:
- alice@ajaia.test
- bob@ajaia.test
- carol@ajaia.test

Alice already has one sample document shared with Bob, so the sharing flow
is visible immediately.

## Running Tests
```bash
npm test
```
Covers the document access-control logic (`lib/access.ts`) — who can view
or edit a given document.

## Deployment
Deployed to Vercel. Push this repo to GitHub, import it in Vercel, install
the Neon integration from the Vercel Marketplace and connect it to this
project (this sets `DATABASE_URL` and related variables automatically —
add `DIRECT_URL` manually as described above), then deploy. Run
`npm run db:push` and `npm run db:seed` once against the production
database (e.g. via `vercel env pull` locally, then run both commands) to
create the schema and demo users.

If reviewers get a login page from Vercel instead of the app, check
Settings → Deployment Protection — "Vercel Authentication" needs to be
off for the URL to be publicly reachable.

## Known Limitations
- Only `.txt` and `.md` files can be imported (max 1MB); `.md` content is
  imported as plain text, not parsed into formatting
- Sharing is all-or-nothing (no view-only role)
- No real-time collaboration — last save wins if two people edit at once
- Auth is a mock (pick a seeded user, no password) — not production auth