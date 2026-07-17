export type SaveState = "idle" | "saving" | "saved" | "error";

export function SaveStatus({ state }: { state: SaveState }) {
  const label = {
    idle: "",
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save — retrying…",
  }[state];

  if (!label) return null;

  return (
    <span
      className={`text-xs ${state === "error" ? "text-red-600" : "text-neutral-400"}`}
    >
      {label}
    </span>
  );
}
