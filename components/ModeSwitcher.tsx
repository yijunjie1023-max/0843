"use client";

import { FIT_MODES, getModeBundle } from "@/lib/fitMode";
import { useFitMode } from "./FitModeProvider";

const pillBase =
  "min-w-0 flex-1 rounded-lg px-2 py-2 text-center text-[11px] font-extrabold transition-colors md:px-3 md:text-xs";

export function ModeSwitcher({ className = "" }: { className?: string }) {
  const { mode, setMode } = useFitMode();

  return (
    <div
      className={[
        "flex min-w-0 max-w-full gap-1 rounded-2xl border-2 border-duo-surface2 bg-duo-surface p-1",
        className,
      ].join(" ")}
      role="group"
      aria-label="场景模式切换"
    >
      {FIT_MODES.map((m) => {
        const active = mode === m;
        const label =
          m === "normal" ? "日常" : m === "finals" ? "期末" : "假期";
        return (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={active}
            title={getModeBundle(m).label}
            className={[
              pillBase,
              active
                ? "bg-duo-green text-white shadow-[0_4px_0_0_#358000] md:shadow-[0_3px_0_0_#358000]"
                : "text-duo-muted hover:bg-duo-surface2 hover:text-duo-ink",
            ].join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
