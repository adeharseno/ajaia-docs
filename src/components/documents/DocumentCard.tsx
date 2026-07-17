import Link from "next/link";
import { DocumentSummary } from "@/types";

export function DocumentCard({ doc }: { doc: DocumentSummary }) {
  const updated = new Date(doc.updatedAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Link
      href={`/documents/${doc.id}`}
      className="block rounded-lg border border-neutral-200 bg-white p-4 transition hover:border-neutral-400"
    >
      <p className="truncate font-medium">{doc.title || "Untitled document"}</p>
      <p className="mt-1 text-xs text-neutral-500">
        {doc.owner ? `Shared by ${doc.owner.name} · ` : ""}
        Updated {updated}
      </p>
    </Link>
  );
}
