"use client";

import type { DietMealSlot } from "@/lib/dietDay";
import { mealMacroTotals } from "@/lib/dietDay";
import { mealAnalysisLines } from "@/lib/dietMealAnalysis";

type Props = {
  open: boolean;
  slot: DietMealSlot | null;
  onClose: () => void;
};

export function DietMealAnalysisModal({ open, slot, onClose }: Props) {
  if (!open || !slot) return null;

  const totals = mealMacroTotals(slot);
  const lines = mealAnalysisLines(totals);
  const tK = totals.kcal;
  const pk = totals.proteinG * 4;
  const ck = totals.carbsG * 4;
  const fk = totals.fatG * 9;
  const sum = pk + ck + fk || 1;

  return (
    <div
      className="fixed inset-0 z-[54] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="meal-analysis-title"
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className="relative z-[55] w-full max-w-md rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-5 shadow-xl">
        <h2 id="meal-analysis-title" className="text-xl font-black text-duo-ink">
          {slot.label} · 饮食分析
        </h2>
        {slot.skipped ? (
          <p className="mt-3 text-sm font-bold text-duo-muted">
            本顿已标注为「未吃」，不计入全天摄入汇总。
          </p>
        ) : (
          <>
            <p className="mt-2 text-sm font-bold text-duo-muted">
              本餐约 <span className="text-duo-ink">{Math.round(tK)}</span> 千卡
              {tK > 0 ? (
                <>
                  {" "}
                  · 蛋白 {Math.round((pk / sum) * 100)}% · 碳水 {Math.round((ck / sum) * 100)}% · 脂肪{" "}
                  {Math.round((fk / sum) * 100)}%
                </>
              ) : null}
            </p>
            <ul className="mt-4 space-y-2 text-sm font-bold leading-relaxed text-duo-ink">
              {lines.map((line, idx) => (
                <li key={`${idx}-${line.slice(0, 24)}`} className="flex gap-2">
                  <span className="text-duo-green">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-2xl bg-duo-blue py-3 text-sm font-black text-white"
        >
          知道了
        </button>
      </div>
    </div>
  );
}
