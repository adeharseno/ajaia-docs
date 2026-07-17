"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SEEDED_USERS = [
  { email: "alice@ajaia.test", name: "Alice" },
  { email: "bob@ajaia.test", name: "Bob" },
  { email: "carol@ajaia.test", name: "Carol" },
];

export default function LoginPage() {
  const router = useRouter();
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function login(email: string) {
    setError(null);
    setLoadingEmail(email);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Could not log in.");
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoadingEmail(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6">
      <h1 className="mb-1 text-2xl font-semibold">Ajaia Docs</h1>
      <p className="mb-8 text-sm text-neutral-500">
        This is a demo app with seeded users. Pick one to continue — no password needed.
      </p>

      <div className="flex flex-col gap-2">
        {SEEDED_USERS.map((u) => (
          <button
            key={u.email}
            onClick={() => login(u.email)}
            disabled={loadingEmail !== null}
            className="flex items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left transition hover:border-neutral-400 disabled:opacity-50"
          >
            <span>
              <span className="block font-medium">{u.name}</span>
              <span className="block text-xs text-neutral-500">{u.email}</span>
            </span>
            {loadingEmail === u.email && (
              <span className="text-xs text-neutral-400">Logging in…</span>
            )}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </main>
  );
}
