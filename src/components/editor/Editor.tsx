"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { useRouter } from "next/navigation";
import { Toolbar } from "@/components/editor/Toolbar";
import { SaveStatus, SaveState } from "@/components/ui/SaveStatus";
import { Button } from "@/components/ui/Button";
import { ShareDialog } from "@/components/documents/ShareDialog";
import { DocumentDetail } from "@/types";

const AUTOSAVE_DELAY_MS = 1000;

export function Editor({
  document,
  currentUserEmail,
}: {
  document: DocumentDetail;
  currentUserEmail: string;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(document.title);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [shareOpen, setShareOpen] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({ placeholder: "Start writing…" }),
    ],
    content: document.content,
    immediatelyRender: false,
    onUpdate: () => scheduleSave(),
    editorProps: {
      attributes: {
        class: "prose prose-neutral max-w-none px-4 py-4 min-h-[60vh] focus:outline-none",
      },
    },
  });

  function scheduleSave() {
    setSaveState("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(save, AUTOSAVE_DELAY_MS);
  }

  async function save(overrides?: { title?: string }) {
    if (!editor) return;
    setSaveState("saving");
    try {
      const res = await fetch(`/api/documents/${document.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: overrides?.title ?? title,
          content: editor.getJSON(),
        }),
      });
      if (!res.ok) throw new Error();
      setSaveState("saved");
    } catch {
      setSaveState("error");
    }
  }

  function handleTitleChange(newTitle: string) {
    setTitle(newTitle);
    setSaveState("saving");
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => save({ title: newTitle }), AUTOSAVE_DELAY_MS);
  }

  // Save any pending changes when leaving the page.
  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Button variant="secondary" onClick={() => router.push("/dashboard")}>
          ← Back
        </Button>
        <div className="flex items-center gap-3">
          <SaveStatus state={saveState} />
          {document.isOwner && (
            <Button variant="secondary" onClick={() => setShareOpen(true)}>
              Share
            </Button>
          )}
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="mb-4 w-full border-none bg-transparent text-2xl font-semibold outline-none"
        placeholder="Untitled document"
      />

      <div className="rounded-lg border border-neutral-200 bg-white">
        <Toolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>

      {shareOpen && (
        <ShareDialog
          documentId={document.id}
          currentUserEmail={currentUserEmail}
          onClose={() => setShareOpen(false)}
        />
      )}
    </main>
  );
}
