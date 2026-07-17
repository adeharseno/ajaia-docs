import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { isOwner } from "@/lib/access";
import { getAccessibleDocument } from "@/lib/documents";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id } = await params;
  const document = await getAccessibleDocument(id, user.id);
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: document.id,
    title: document.title,
    content: document.content,
    ownerId: document.ownerId,
    isOwner: isOwner(document, user.id),
    updatedAt: document.updatedAt,
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const { id } = await params;
  const document = await getAccessibleDocument(id, user.id);
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  let body: { title?: string; content?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const data: { title?: string; content?: object } = {};
  if (typeof body.title === "string") {
    if (body.title.trim().length === 0) {
      return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }
    data.title = body.title.slice(0, 200);
  }
  if (body.content !== undefined) {
    data.content = body.content as object;
  }

  const updated = await prisma.document.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
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
    return NextResponse.json({ error: "Only the owner can delete this document." }, { status: 403 });
  }

  await prisma.document.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
