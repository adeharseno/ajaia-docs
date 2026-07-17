# SUBMISSION.md

## What's included
- Full source code (Next.js app) — see `README.md` for setup/run
  instructions
- `docs/prd.md` — product requirements
- `docs/database-design.md` — schema and rationale
- `docs/api-contract.md` — API endpoint reference
- `docs/folder-structure.md` — project layout
- `docs/roadmap.md` — the 4-hour build plan used
- `docs/architecture-note.md` — design decisions and trade-offs
- `docs/ai-workflow-note.md` — AI usage notes from the actual build and
  deploy session
- `tests/access.test.ts` — automated test for document access control
  (5 tests, passing — `npm test`)
- `CLAUDE.md` — context file used to keep AI-assisted development
  consistent with the docs above
- `walkthrough-video.txt` — link to the recorded walkthrough

## Live deployment
- URL: https://ajaia-docs-one-delta.vercel.app/login
- No signup needed — pick alice@ajaia.test, bob@ajaia.test, or
  carol@ajaia.test on the login screen
- Deployment protection is disabled, so this loads for anyone with the
  link

## Walkthrough video
- Loom link: https://www.loom.com/share/8d0ac26c68f540189c58ab51daeff9ec
- Also included as its own text file: `walkthrough-video.txt`

## Status
- Working: document create/edit/rename with rich text formatting, autosave,
  refresh persistence, file upload (.txt/.md), sharing between seeded
  users, My Documents vs Shared with Me split, one automated test (all
  5 cases passing)
- Verified on the live deployment, not just locally — this caught two
  issues before submission: the database schema hadn't been pushed/seeded
  against production yet (was causing a 500 on login), and Vercel's
  default deployment protection was blocking access for anyone outside
  my team. Both fixed; see `docs/ai-workflow-note.md` for details.
- Incomplete / out of scope: real-time collaboration, view-only sharing,
  version history, `.docx` import — see `docs/architecture-note.md` for
  what's deprioritized and why
- What I'd build next with 2-4 more hours: see the "What I'd build next"
  section in `docs/architecture-note.md`