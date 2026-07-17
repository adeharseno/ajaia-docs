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
Next.js (App Router, TypeScript) · Prisma · Postgres (Vercel Postgres) ·
Tiptap · Tailwind CSS · Vitest

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

2. Set up the database. Create a free Postgres database (e.g. via the
   Vercel dashboard → Storage → Create Database → Postgres), then:
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
Deployed to Vercel. Push this repo to GitHub, import it in Vercel, add a
Vercel Postgres database from the Storage tab (this sets `DATABASE_URL` /
`DIRECT_URL` automatically), then deploy. Run `npm run db:seed` once
against the production database (e.g. via `vercel env pull` locally, then
`npm run db:seed`) to create the demo users.

## Known Limitations
- Only `.txt` and `.md` files can be imported (max 1MB); `.md` content is
  imported as plain text, not parsed into formatting
- Sharing is all-or-nothing (no view-only role)
- No real-time collaboration — last save wins if two people edit at once
- Auth is a mock (pick a seeded user, no password) — not production auth
