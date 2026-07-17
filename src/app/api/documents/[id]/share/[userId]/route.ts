import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isOwner } from "@/lib/access";

type Params = { params: Promise<{ id: string; userId: string }> };

export async function DELETE(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id, userId } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
  if (!isOwner(document, user.id)) {
    return NextResponse.json({ error: "Only the owner can revoke access." }, { status: 403 });
  }

  await prisma.documentShare.deleteMany({ where: { documentId: id, userId } });
  return new NextResponse(null, { status: 204 });
}
