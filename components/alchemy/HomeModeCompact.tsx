"use client";

import { FIT_MODES, getModeBundle } from "@/lib/fitMode";
import type { FitMode } from "@/lib/fitMode";
import { useFitMode } from "@/components/FitModeProvider";

const seg =
  "rounded-md px-2 py-1 text-[10px] font-extrabold transition-colors md:text-[11px]";

export function HomeModeCompact({ className = "" }: { className?: string }) {
  const { mode, setMode } = useFitMode();

  const short = (m: FitMode) =>
    m === "normal" ? "日常" : m === "finals" ? "期末" : "假期";

  return (
    <div
      className={[
        "inline-flex rounded-xl border border-duo-surface2/80 bg-duo-bg/70 p-0.5 shadow-sm backdrop-blur-sm",
        className,
      ].join(" ")}
      role="group"
      aria-label="首页场景模式"
    >
      {FIT_MODES.map((m) => {
        const on = mode === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            aria-pressed={on}
            title={getModeBundle(m).label}
            className={[
              seg,
              on
                ? "bg-duo-surface2 text-duo-green ring-1 ring-duo-green/40"
                : "text-duo-muted hover:text-duo-ink",
            ].join(" ")}
          >
            {short(m)}
          </button>
        );
      })}
    </div>
  );
}
