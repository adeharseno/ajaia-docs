import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-lg font-semibold">Document not found</h1>
      <p className="mb-6 text-sm text-neutral-500">
        This document doesn&apos;t exist, or you don&apos;t have access to it.
      </p>
      <Link href="/dashboard" className="text-sm underline">
        Back to dashboard
      </Link>
    </main>
  );
}
