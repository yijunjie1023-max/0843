import type { ReactNode } from "react";

export function SectionCard({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-extrabold text-duo-ink">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
