# Database Design

Postgres (Vercel Postgres) via Prisma. `prisma db push` instead of formal
migrations, to save time.

## Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String

  ownedDocuments Document[]      @relation("OwnedDocuments")
  sharedWithMe   DocumentShare[]
}

model Document {
  id        String   @id @default(cuid())
  title     String   @default("Untitled document")
  content   Json     @default("{}")
  ownerId   String
  owner     User     @relation("OwnedDocuments", fields: [ownerId], references: [id])
  updatedAt DateTime @updatedAt

  shares DocumentShare[]
}

model DocumentShare {
  id         String   @id @default(cuid())
  documentId String
  userId     String
  document   Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([documentId, userId])
}
```

## How it works
- `Document.ownerId` = who created it
- `DocumentShare` = a row per (document, user) that has been given access
- A user can open a document if they're the owner OR a `DocumentShare` row
  exists for them
- Sharing is all-or-nothing (full edit access) — no view-only mode

## Seed Data
3 users (alice, bob, carol). Optionally one sample document from alice,
already shared with bob, so the reviewer sees sharing working immediately.
