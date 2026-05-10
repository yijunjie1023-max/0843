import type { ReactNode } from "react";

export function StatChip({
  icon,
  label,
  value,
  accent = "green",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  accent?: "green" | "blue";
}) {
  const ring = accent === "green" ? "ring-duo-green/40" : "ring-duo-blue/40";
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl bg-duo-surface px-4 py-3 ring-2 ring-inset ${ring}`}
    >
      <span className="text-2xl" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-duo-muted">
          {label}
        </p>
        <p className="truncate text-lg font-extrabold text-duo-ink">{value}</p>
      </div>
    </div>
  );
}
