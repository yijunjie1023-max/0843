"use client";

import { useMemo } from "react";
import type { DietToday } from "@/lib/fitMode";
import { aggregateActiveMeals } from "@/lib/dietDay";
import { macroBalanceScore } from "@/lib/dietNutritionScore";

type Props = {
  dietToday: DietToday;
  exerciseBurnKcal: number;
};

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function DietEnergyBudgetCard({ dietToday, exerciseBurnKcal }: Props) {
  const consumed = useMemo(
    () => aggregateActiveMeals(dietToday.mealSlots),
    [dietToday.mealSlots],
  );

  const intakeKcal = consumed.kcal;

  const remainingRaw =
    dietToday.calorieBudgetTarget - intakeKcal + exerciseBurnKcal;

  const ringFraction = useMemo(() => {
    if (dietToday.calorieBudgetTarget <= 0) return 0;
    return clamp(remainingRaw / dietToday.calorieBudgetTarget, -0.05, 1);
  }, [remainingRaw, dietToday.calorieBudgetTarget]);

  const score = useMemo(
    () =>
      macroBalanceScore({
        proteinG: consumed.proteinG,
        carbsG: consumed.carbsG,
        fatG: consumed.fatG,
        fiberG: consumed.fiberG,
        fiberGoalG: dietToday.macroGoals.fiber,
      }),
    [consumed, dietToday.macroGoals.fiber],
  );

  const cx = 72;
  const cy = 72;
  const r = 56;
  const stroke = 12;
  const C = 2 * Math.PI * r;
  const dash = C * clamp(ringFraction, 0, 1);
  const ringColor =
    remainingRaw < 0 ? "#f87171" : remainingRaw < 200 ? "#fb923c" : "#fb923c";

  const macroRow = (
    label: string,
    color: string,
    cur: number,
    goal: number,
  ) => {
    const pct = goal > 0 ? clamp((cur / goal) * 100, 0, 130) : 0;
    return (
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black text-duo-muted">{label}</p>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-duo-bg">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
        <p className="mt-1 text-[10px] font-bold text-duo-ink">
          {Math.round(cur * 10) / 10}/{goal}克
        </p>
      </div>
    );
  };

  const g = dietToday.macroGoals;

  return (
    <section className="rounded-3xl border-2 border-duo-surface2 bg-[#1c2529] p-4 shadow-inner md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-black text-white md:text-xl">卡路里目标</h2>
          <span className="text-duo-muted" aria-hidden title="设置（演示）">
            ⚙️
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-full bg-duo-green px-3 py-1.5 text-[11px] font-black text-white shadow-sm ring-2 ring-duo-green/40"
        >
          📈 趋势
        </button>
      </div>

      <p className="mt-2 rounded-xl bg-black/25 px-3 py-2 font-mono text-[11px] font-bold leading-relaxed text-sky-200/95">
        剩余热量 = 目标 − 摄入 + 消耗 · 今日评分{" "}
        <span className="text-duo-green">{score}</span> / 100
      </p>

      <div className="mt-5 flex flex-col gap-5 md:flex-row md:items-center">
        <div className="relative mx-auto shrink-0 md:mx-0">
          <svg width={144} height={144} viewBox="0 0 144 144" aria-hidden>
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="rgba(51,65,85,0.9)"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={ringColor}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${dash} ${C}`}
              transform={`rotate(-90 ${cx} ${cy})`}
              className="drop-shadow-[0_0_12px_rgba(251,146,60,0.35)]"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[10px] font-bold text-slate-400">剩余</p>
            <p className="text-3xl font-black tabular-nums text-white md:text-4xl">
              {Math.round(remainingRaw)}
            </p>
            <p className="text-xs font-black text-slate-400">千卡</p>
          </div>
        </div>

        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex items-start gap-3 rounded-2xl bg-black/20 px-3 py-3">
            <span className="text-xl" aria-hidden>
              🍜
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-400">食物摄入</p>
              <p className="text-lg font-black tabular-nums text-white">
                {Math.round(intakeKcal).toLocaleString()}{" "}
                <span className="text-sm">千卡</span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-2xl bg-black/20 px-3 py-3">
            <span className="text-xl" aria-hidden>
              🔥
            </span>
            <div>
              <p className="text-[11px] font-bold text-slate-400">运动消耗</p>
              <p className="text-lg font-black tabular-nums text-white">
                {exerciseBurnKcal.toLocaleString()}{" "}
                <span className="text-sm">千卡</span>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400">
            <span>目标 {dietToday.calorieBudgetTarget} kcal</span>
            <span className="text-slate-600">·</span>
            <span>碳水/蛋白/脂肪比例评分（按全天汇总）</span>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {macroRow("脂肪", "#fb923c", consumed.fatG, g.fat)}
        {macroRow("碳水", "#eab308", consumed.carbsG, g.carbs)}
        {macroRow("蛋白质", "#38bdf8", consumed.proteinG, g.protein)}
        {macroRow("纤维", "#4ade80", consumed.fiberG, g.fiber)}
      </div>
    </section>
  );
}
