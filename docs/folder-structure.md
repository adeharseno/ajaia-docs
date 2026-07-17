# Folder Structure

```
src/
  app/
    login/page.tsx
    dashboard/page.tsx
    documents/[id]/page.tsx
    api/
      auth/          (login, logout, me)
      documents/     (route.ts, import/, [id]/route.ts, [id]/share/)

  components/
    editor/          (Tiptap editor + toolbar)
    documents/       (list, card, share dialog)
    upload/          (upload button)

  lib/
    prisma.ts        (Prisma client)
    auth.ts          (get current user from cookie)
    access.ts         (pure: can this user open this document? — unit tested)
    documents.ts       (DB-aware wrapper around access.ts)
    fileToTiptap.ts   (turn uploaded text into editor content)

tests/
  access.test.ts      (unit test for access.ts)

prisma/
  schema.prisma
  seed.ts

docs/                 (all the planning + writeup docs)
CLAUDE.md
README.md
SUBMISSION.md
```

## Why
- API routes double as the backend — no separate server, deploys as one
  Vercel project.
- `lib/access.ts` is pulled out on its own so it's easy to unit test — this
  is the test we'll ship.
- Editor lives in its own folder so it can be reused for both "new
  document" and "imported from file".
