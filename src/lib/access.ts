/**
 * Pure access-control logic — no DB calls, no imports that need a
 * generated Prisma client. Kept separate from lib/documents.ts so this
 * file (and its behavior) can be unit tested in isolation.
 *
 * A user can access a document if they own it, or if it has been shared
 * with them. Sharing is all-or-nothing (full edit access) — there are no
 * view-only permissions in this scope.
 */
export function canAccessDocument(
  document: { ownerId: string },
  sharedUserIds: string[],
  userId: string
): boolean {
  if (document.ownerId === userId) return true;
  return sharedUserIds.includes(userId);
}

export function isOwner(document: { ownerId: string }, userId: string): boolean {
  return document.ownerId === userId;
}
