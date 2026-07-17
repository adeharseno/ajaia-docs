import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const [owned, sharedRows] = await Promise.all([
    prisma.document.findMany({
      where: { ownerId: user.id },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true, updatedAt: true },
    }),
    prisma.documentShare.findMany({
      where: { userId: user.id },
      include: {
        document: {
          include: { owner: { select: { name: true } } },
        },
      },
      orderBy: { document: { updatedAt: "desc" } },
    }),
  ]);

  const shared = sharedRows.map((row: (typeof sharedRows)[number]) => ({
    id: row.document.id,
    title: row.document.title,
    updatedAt: row.document.updatedAt,
    owner: { name: row.document.owner.name },
  }));

  return NextResponse.json({ owned, shared });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  let title = "Untitled document";
  try {
    const body = await req.json();
    if (body?.title) title = String(body.title).slice(0, 200);
  } catch {
    // no body is fine, use default title
  }

  const document = await prisma.document.create({
    data: {
      title,
      ownerId: user.id,
      content: { type: "doc", content: [{ type: "paragraph" }] },
    },
  });

  return NextResponse.json(document, { status: 201 });
}
