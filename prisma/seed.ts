import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Empty Tiptap doc used as a starting point for seeded documents.
function emptyDoc(text: string) {
  return {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text }],
      },
    ],
  };
}

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: "alice@ajaia.test" },
    update: {},
    create: { email: "alice@ajaia.test", name: "Alice" },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@ajaia.test" },
    update: {},
    create: { email: "bob@ajaia.test", name: "Bob" },
  });

  await prisma.user.upsert({
    where: { email: "carol@ajaia.test" },
    update: {},
    create: { email: "carol@ajaia.test", name: "Carol" },
  });

  // A sample document owned by Alice, already shared with Bob, so the
  // sharing flow is visible immediately without any manual setup.
  const existing = await prisma.document.findFirst({
    where: { ownerId: alice.id, title: "Welcome to Ajaia Docs" },
  });

  const doc =
    existing ??
    (await prisma.document.create({
      data: {
        title: "Welcome to Ajaia Docs",
        content: emptyDoc(
          "This is a sample document owned by Alice and shared with Bob. Try editing it, or log in as Bob to see it under Shared with Me."
        ),
        ownerId: alice.id,
      },
    }));

  await prisma.documentShare.upsert({
    where: { documentId_userId: { documentId: doc.id, userId: bob.id } },
    update: {},
    create: { documentId: doc.id, userId: bob.id },
  });

  console.log("Seed complete: alice, bob, carol + 1 sample shared document.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
