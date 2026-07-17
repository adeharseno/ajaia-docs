import { prisma } from "@/lib/prisma";
import { canAccessDocument } from "@/lib/access";

/**
 * Loads a document with its shares and returns null if the document
 * doesn't exist or the given user can't access it (see lib/access.ts for
 * the access rule itself).
 */
export async function getAccessibleDocument(documentId: string, userId: string) {
  const document = await prisma.document.findUnique({
    where: { id: documentId },
    include: { shares: true },
  });

  if (!document) return null;

  const sharedUserIds = document.shares.map((s: (typeof document.shares)[number]) => s.userId);
  if (!canAccessDocument(document, sharedUserIds, userId)) return null;

  return document;
}
