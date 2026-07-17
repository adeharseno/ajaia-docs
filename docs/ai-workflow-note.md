# AI Workflow Note

> Draft based on this session. Edit this before submitting so it reflects
> what you actually did, adjusted, and verified — this is meant to be your
> account, not a generic AI-generated summary.

## Tools used
- Claude (chat) for planning: PRD, database design, API contract, folder
  structure, and a timeboxed roadmap, before writing any code.
- Claude for scaffolding: initial project structure, Prisma schema, API
  routes, and components, based on the planning docs above.

## Where AI materially sped up the work
- Turning an open-ended brief into a concrete PRD and API contract up
  front, instead of designing the schema while writing routes.
- Generating boilerplate (API routes, form components, Prisma schema) that
  follows a consistent pattern once the contract was defined.

## What I changed or rejected
- [Fill in: e.g. "Simplified the share dialog to a dropdown of seeded
  users instead of a free-text email field, since there are only 3 users
  in this demo."]
- [Fill in: e.g. "Rejected an initial suggestion to add JWT-based auth —
  overkill for a seeded-user demo and would cost setup time."]

## How I verified correctness
- Ran `npm test` — unit tests on the access-control logic (`lib/access.ts`)
- Manually tested the full flow locally: create a document, edit with
  formatting, refresh, upload a file, share with another seeded user, log
  in as that user and confirm it appears under "Shared with Me"
- [Fill in: any bugs found and fixed, anything AI got wrong initially]
