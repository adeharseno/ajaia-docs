"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

const SEEDED_EMAILS = ["alice@ajaia.test", "bob@ajaia.test", "carol@ajaia.test"];

export function ShareDialog({
  documentId,
  currentUserEmail,
  onClose,
}: {
  documentId: string;
  currentUserEmail: string;
  onClose: () => void;
}) {
  const [email, setEmail] = useState(
    SEEDED_EMAILS.find((e) => e !== currentUserEmail) ?? ""
  );
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleShare() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not share document.");
      }
      setStatus("done");
      setMessage(`Shared with ${email}.`);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
        <h2 className="mb-3 text-sm font-semibold">Share this document</h2>

        <label className="mb-1 block text-xs text-neutral-500">Share with</label>
        <select
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-md border border-neutral-300 px-2 py-1.5 text-sm"
        >
          {SEEDED_EMAILS.filter((e) => e !== currentUserEmail).map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>

        {message && (
          <p className={`mb-3 text-xs ${status === "error" ? "text-red-600" : "text-green-600"}`}>
            {message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={handleShare} disabled={status === "loading"}>
            {status === "loading" ? "Sharing…" : "Share"}
          </Button>
        </div>
      </div>
    </div>
  );
}
