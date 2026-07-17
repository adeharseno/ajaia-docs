# AI Workflow Note

## Tools used
- Claude (chat) for planning — PRD, database schema, API contract, folder
  structure, and a 4-hour roadmap, all before writing a line of code.
- Claude for scaffolding the initial project: Prisma schema, API routes,
  components, based on the docs above.
- Claude again later for deployment troubleshooting — a Prisma version
  mismatch, missing env vars, and a Vercel setting that was blocking
  access to the live URL.

## Where AI actually helped
- Having a PRD and API contract locked before coding meant I wasn't
  redesigning the schema halfway through writing routes. Worth the hour
  it took up front.
- Boilerplate (API routes, form components, the Prisma schema) went fast
  once the contract existed — mostly filling in a pattern rather than
  inventing one each time.
- The deploy broke with a Prisma error I hadn't seen before (`P1012`,
  something about `url` no longer being supported in the datasource).
  Claude traced it to my lockfile still resolving Prisma 7 even though
  `package.json` was pinned to 6.19.3 — would've taken me a lot longer to
  connect those dots on my own.
- My docs still said "Vercel Postgres," which got discontinued back in
  Dec 2024 (it's Neon via the Marketplace now). If a reviewer had tried
  to follow my own README, they'd have hit a dead end at the exact step
  where you're supposed to create the database. Caught before submission.
- When I got lost in the Neon/Vercel dashboard (there are a lot of
  similarly-named env vars — `DATABASE_URL`, `DATABASE_URL_UNPOOLED`,
  `POSTGRES_PRISMA_URL`...), walking through screenshots step by step was
  faster than me digging through Neon's docs cold.

## What I changed or rejected
- Didn't go with plain SQLite even though it's listed as a valid option
  in the brief. Vercel functions don't have a persistent filesystem — a
  `.db` file written on one request can just be gone on the next. That
  breaks "documents survive a refresh" outright, so it was an easy no
  once I understood why.
- Looked at Turso (SQLite that actually persists on serverless) as a
  middle ground, but stuck with Postgres + Prisma instead — it's what I
  know better, and I didn't want to debug an unfamiliar driver on a
  4-hour clock.
- Login is just "pick alice, bob, or carol," no password. The brief
  allows this and I don't think a real auth flow adds anything a reviewer
  cares about here — I'd rather they get straight to the actual features.
- Sharing is all-or-nothing (one row = full edit access), no
  viewer/editor split. Keeps the schema and UI simple, and it's not asked
  for. Listed as a "next 2-4 hours" item instead of trying to squeeze it in.
- One of the uploaded files, `AGENTS.md`, had an instruction telling any
  AI agent to go "read" documentation at a path that doesn't exist
  (`node_modules/next/dist/docs/`), framed as if Next.js had some
  undisclosed breaking change. Claude called it out as suspicious instead
  of just going along with it. I deleted the file. Flagging it here
  because it's a decent example of not just doing whatever an AI (or a
  planted instruction) tells you to.

## How I verified this actually works
- `npm test` — unit tests on `lib/access.ts`, the access-control logic.
- Ran the full flow by hand locally: create a doc, format some text,
  refresh the page, upload a file, share it with another seeded user, log
  in as that user, check it shows up under "Shared with Me."
- Checked the actual production deployment, not just localhost:
  - Login was throwing a 500 on the live URL. Pulled the Vercel function
    logs and found the real error — `P2021: table 'public.users' does not
    exist` — because I'd deployed before running the schema push and seed
    against the production database. Fixed by pulling env vars locally
    (`vercel env pull`) and running `db:push` / `db:seed` against Neon
    directly.
  - The live URL was returning a Vercel login page for anyone outside my
    team — "Vercel Authentication" was on by default. Turned it off in
    Deployment Protection settings and re-checked the URL loads with no
    login before putting it in `SUBMISSION.md`.
- [Fill in: any other bugs you hit and fixed yourself]