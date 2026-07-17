# CLAUDE.md

Context for AI assistance on this project. Read `docs/` before writing code.

## Stack
Next.js (App Router) + TypeScript, Prisma + Vercel Postgres, Tiptap editor.
Deploys to Vercel only, no paid services — reviewers must be able to use it
for free with no setup.

## Source of truth
- `docs/prd.md` — scope, what's in/out
- `docs/database-design.md` — schema, don't change without updating this
- `docs/api-contract.md` — endpoint shapes, follow as-is
- `docs/roadmap.md` — build order and time budget

## Rules
1. Follow the API contract and schema as written — don't improvise field
   names or response shapes.
2. Speed over perfection. If two approaches work, pick the faster one and
   leave a short comment on the trade-off.
3. Don't build anything outside the PRD (no real-time sync, no permission
   levels, no version history) unless core is fully done first.
4. Every API route needs basic validation and error handling.
5. Keep `lib/access.ts` small and testable — it's the unit test we ship.

## Don't do without asking first
- Swap the database/ORM
- Add a big new dependency (full auth library, state management, etc.)
- Build a stretch feature before core is done
- Change the API contract without updating the doc
