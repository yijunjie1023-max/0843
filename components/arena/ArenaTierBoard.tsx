"use client";

import type { ArenaSelfState } from "@/lib/fitMode";
import { HonorRankStrip } from "@/components/arena/HonorRankStrip";
import { gemTierDefinitionFromGrade, gemTierLabelFromGrade } from "@/lib/arenaTiers";

type Props = {
  self: ArenaSelfState;
};

/** 顶部段位：十阶实心宝石条 */
export function ArenaTierBoard({ self }: Props) {
  const def = gemTierDefinitionFromGrade(self.tierGrade);
  const label = gemTierLabelFromGrade(self.tierGrade);

  return (
    <section className="rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-4 shadow-duo-sm md:p-5">
      <div className="mb-4 border-b border-duo-surface2 pb-3">
        <p className="text-[11px] font-bold uppercase tracking-wider text-duo-muted">
          段位宝石
        </p>
        <p className="mt-1 text-lg font-black leading-tight text-duo-ink">
          当前 ·{" "}
          <span style={{ color: def.main }} className="drop-shadow-sm">
            {label}
          </span>
        </p>
      </div>
      <HonorRankStrip tierGrade={self.tierGrade} />
    </section>
  );
}
