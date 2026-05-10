"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/exercise", label: "运动", icon: "💪" },
  { href: "/diet", label: "饮食", icon: "🥗" },
  { href: "/arena", label: "竞技场", icon: "⚔️" },
  { href: "/profile", label: "我的", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t-2 border-duo-surface2 bg-duo-bg/95 backdrop-blur-md pb-safe"
      aria-label="主导航"
    >
      <div className="mx-auto flex max-w-3xl items-stretch justify-between gap-1 px-2 py-2 md:px-4">
        {tabs.map((t) => {
          const active =
            t.href === "/"
              ? pathname === "/"
              : pathname.startsWith(t.href);
          return (
            <Link
              key={t.href}
              href={t.href}
              className={[
                "flex min-w-0 flex-1 flex-col items-center justify-center rounded-xl py-2 text-[11px] font-bold transition-colors md:text-xs",
                active
                  ? "text-duo-green bg-duo-surface2"
                  : "text-duo-muted hover:text-duo-ink",
              ].join(" ")}
            >
              <span className="text-lg md:text-xl" aria-hidden>
                {t.icon}
              </span>
              <span className="truncate">{t.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
