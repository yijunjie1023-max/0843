"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { normalizePath } from "@/lib/normalizePath";
import { AppShellHeader } from "./AppShellHeader";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = normalizePath(usePathname() ?? "");
  const onboarding = pathname === "/onboarding" || pathname === "/onboarding/edit";

  return (
    <div className="flex min-h-dvh flex-col">
      {!onboarding && <AppShellHeader />}
      <main
        className={
          onboarding
            ? "mx-auto w-full max-w-lg flex-1 px-4 pb-12 pt-8 md:px-6 md:pt-12"
            : "mx-auto w-full max-w-3xl flex-1 px-4 pb-28 pt-6 md:px-6 md:pb-32 md:pt-8"
        }
      >
        {children}
      </main>
      {!onboarding && <BottomNav />}
    </div>
  );
}
