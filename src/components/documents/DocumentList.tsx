import { DocumentSummary } from "@/types";
import { DocumentCard } from "@/components/documents/DocumentCard";

export function DocumentList({
  title,
  documents,
  emptyMessage,
}: {
  title: string;
  documents: DocumentSummary[];
  emptyMessage: string;
}) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold text-neutral-600">{title}</h2>
      {documents.length === 0 ? (
        <p className="text-sm text-neutral-400">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}
    </section>
  );
}
