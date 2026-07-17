import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

// Intentionally simple mock auth: a cookie holds the user's id. There is
// no password check — this is a seeded-user demo, not production auth.
// See docs/prd.md for why this scope was chosen.
export const SESSION_COOKIE = "session_user_id";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthError("Not logged in.");
  }
  return user;
}

export class AuthError extends Error {}
