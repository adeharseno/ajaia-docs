import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  fileToTiptap,
  isAllowedImportFile,
  MAX_IMPORT_FILE_SIZE_BYTES,
} from "@/lib/fileToTiptap";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not logged in." }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  if (!isAllowedImportFile(file.name)) {
    return NextResponse.json(
      { error: "Only .txt and .md files are supported." },
      { status: 400 }
    );
  }

  if (file.size > MAX_IMPORT_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File is too large. Max size is 1MB." },
      { status: 400 }
    );
  }

  const text = await file.text();
  const content = fileToTiptap(text);
  const title = file.name.replace(/\.(txt|md)$/i, "");

  const document = await prisma.document.create({
    data: { title: title || "Imported document", content, ownerId: user.id },
  });

  return NextResponse.json(document, { status: 201 });
}
