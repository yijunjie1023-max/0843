"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

const tabs = [
  { id: "all", label: "全部" },
  { id: "run", label: "跑步" },
  { id: "gym", label: "力量" },
  { id: "stretch", label: "放松" },
];

export function ExerciseTabs() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "all";

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 md:flex-wrap" role="tablist">
      {tabs.map((t) => {
        const active = tab === t.id;
        const href =
          t.id === "all" ? pathname : `${pathname}?tab=${encodeURIComponent(t.id)}`;
        return (
          <Link
            key={t.id}
            href={href}
            scroll={false}
            role="tab"
            aria-selected={active}
            className={[
              "shrink-0 rounded-xl border-2 px-4 py-2 text-sm font-extrabold transition-colors",
              active
                ? "border-duo-green bg-duo-green/15 text-duo-green"
                : "border-duo-surface2 bg-duo-surface text-duo-muted hover:text-duo-ink",
            ].join(" ")}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
