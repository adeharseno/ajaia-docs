import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isOwner } from "@/lib/access";
import { getAccessibleDocument } from "@/lib/documents";
import { Editor } from "@/components/editor/Editor";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const document = await getAccessibleDocument(id, user.id);
  if (!document) notFound();

  return (
    <Editor
      document={{
        id: document.id,
        title: document.title,
        content: document.content as object,
        ownerId: document.ownerId,
        isOwner: isOwner(document, user.id),
        updatedAt: document.updatedAt.toISOString(),
      }}
      currentUserEmail={user.email}
    />
  );
}
