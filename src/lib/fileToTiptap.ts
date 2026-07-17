// Turns plain text / markdown-ish text into a minimal Tiptap JSON document.
// Deliberately simple: each non-empty line becomes a paragraph. Markdown
// syntax (#, -, *) is not parsed into real formatting — this is a text
// import, not a Markdown renderer. See docs/prd.md for scope notes.
export function fileToTiptap(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    return { type: "doc", content: [{ type: "paragraph" }] };
  }

  return {
    type: "doc",
    content: lines.map((line) => ({
      type: "paragraph",
      content: [{ type: "text", text: line }],
    })),
  };
}

export const ALLOWED_IMPORT_EXTENSIONS = [".txt", ".md"];
export const MAX_IMPORT_FILE_SIZE_BYTES = 1024 * 1024; // 1MB

export function isAllowedImportFile(filename: string): boolean {
  return ALLOWED_IMPORT_EXTENSIONS.some((ext) => filename.toLowerCase().endsWith(ext));
}
