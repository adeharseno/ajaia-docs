import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isOwner } from "@/lib/access";

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id } = await params;
  const document = await prisma.document.findUnique({ where: { id } });
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
  if (!isOwner(document, user.id)) {
    return NextResponse.json({ error: "Only the owner can share this document." }, { status: 403 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (!body.email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const targetUser = await prisma.user.findUnique({ where: { email: body.email } });
  if (!targetUser) {
    return NextResponse.json({ error: "No user found with that email." }, { status: 404 });
  }
  if (targetUser.id === user.id) {
    return NextResponse.json({ error: "You already own this document." }, { status: 409 });
  }

  const existingShare = await prisma.documentShare.findUnique({
    where: { documentId_userId: { documentId: id, userId: targetUser.id } },
  });
  if (existingShare) {
    return NextResponse.json({ error: "Already shared with this user." }, { status: 409 });
  }

  const share = await prisma.documentShare.create({
    data: { documentId: id, userId: targetUser.id },
  });

  return NextResponse.json(share, { status: 201 });
}
