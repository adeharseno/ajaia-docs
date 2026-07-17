# PRD — Lightweight Collaborative Document Editor

## Goal
A small Google Docs–style app. Users can create/edit documents, upload a
file to create a document, and share documents with other users. Built in
~4 hours, so scope is intentionally small.

## Users
No real signup. 3 seeded users, pick one to "log in":
- alice@ajaia.test
- bob@ajaia.test
- carol@ajaia.test

## Features

**1. Document editing**
- Create new document, rename it, edit content
- Formatting: bold, italic, underline, headings, bullet/numbered lists
- Autosave, content persists after refresh

**2. File upload**
- Upload a `.txt` or `.md` file → becomes a new document
- Reject other file types with a clear error message

**3. Sharing**
- Each document has one owner
- Owner can share the document with another seeded user (full edit access,
  no roles)
- Dashboard shows "My Documents" and "Shared with Me" separately

**4. Persistence**
- Everything stored in Postgres (Vercel Postgres + Prisma)
- Data survives refresh and redeploys

## Out of Scope
- Real-time collaboration
- Permission levels (viewer/editor roles)
- Version history, comments, export
- Real auth (OAuth, passwords)
- Any file type beyond .txt/.md

## Done When
- Can create/edit/refresh a document and formatting is preserved
- Can upload a .txt/.md file and it becomes a document
- Can share a document and the other user sees it under "Shared with Me"
- App is deployed and reviewers can test it for free, no signup needed
- README, architecture note, AI workflow note, and one automated test exist
