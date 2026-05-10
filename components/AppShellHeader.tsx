"use client";

import { usePathname } from "next/navigation";
import { ModeSwitcher } from "./ModeSwitcher";
import { useFitMode } from "./FitModeProvider";

export function AppShellHeader() {
  const { bundle } = useFitMode();
  const pathname = usePathname() ?? "";
  const hideModeOnHome = pathname === "/";

  return (
    <header className="sticky top-0 z-40 border-b-2 border-duo-surface2 bg-duo-bg/95 backdrop-blur-md">
      <div className="mx-auto max-w-3xl px-4 py-3 md:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-duo-green text-lg font-black text-white shadow-[0_4px_0_0_#358000]"
              aria-hidden
            >
              幻
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black tracking-tight text-duo-ink md:text-base">
                游戏化运动激励工具
              </p>
              <p className="truncate text-xs text-duo-muted md:text-sm">
                {bundle.shellTagline}
              </p>
            </div>
          </div>
          {!hideModeOnHome && (
            <ModeSwitcher className="w-full sm:w-auto sm:max-w-[300px] sm:shrink-0" />
          )}
        </div>
      </div>
    </header>
  );
}
