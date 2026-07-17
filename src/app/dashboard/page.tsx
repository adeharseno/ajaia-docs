import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DocumentList } from "@/components/documents/DocumentList";
import { NewDocumentButton } from "@/components/documents/NewDocumentButton";
import { FileUploadButton } from "@/components/upload/FileUploadButton";
import { LogoutButton } from "@/components/ui/LogoutButton";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [owned, sharedRows] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.documentShare.findMany({
      where: { userId: user.id },
      include: { document: { include: { owner: { select: { name: true } } } } },
      orderBy: { document: { updatedAt: "desc" } },
    }),
  ]);

  const shared = sharedRows.map((row: (typeof sharedRows)[number]) => ({
    id: row.document.id,
    title: row.document.title,
    updatedAt: row.document.updatedAt.toISOString(),
    owner: { name: row.document.owner.name },
  }));

  const ownedSerialized = owned.map((d: (typeof owned)[number]) => ({
    ...d,
    updatedAt: d.updatedAt.toISOString(),
  }));

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Ajaia Docs</h1>
          <p className="text-sm text-neutral-500">Logged in as {user.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <FileUploadButton />
          <NewDocumentButton />
          <LogoutButton />
        </div>
      </header>

      <DocumentList
        title="My Documents"
        documents={ownedSerialized}
        emptyMessage="You haven't created any documents yet."
      />
      <DocumentList
        title="Shared with Me"
        documents={shared}
        emptyMessage="No documents have been shared with you yet."
      />
    </main>
  );
}
