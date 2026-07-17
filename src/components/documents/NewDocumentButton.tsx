"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function NewDocumentButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setLoading(true);
    try {
      const res = await fetch("/api/documents", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not create document.");
      router.push(`/documents/${data.id}`);
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button onClick={handleCreate} disabled={loading}>
      {loading ? "Creating…" : "New document"}
    </Button>
  );
}
