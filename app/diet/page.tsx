"use client";

import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { useFitMode } from "@/components/FitModeProvider";
import { DietDayProvider, useDietDay } from "@/components/diet/DietDayProvider";
import { DietEnergyBudgetCard } from "@/components/diet/DietEnergyBudgetCard";
import { DietMealTimeline } from "@/components/diet/DietMealTimeline";
import { DietModeRecommendBar } from "@/components/diet/DietModeRecommendBar";
import { DietQuickLogFab } from "@/components/diet/DietQuickLogFab";
import type { FitMode, FitModeBundle } from "@/lib/fitMode";

export default function DietPage() {
  const { bundle, mode } = useFitMode();

  return (
    <DietDayProvider mode={mode} seedDietToday={bundle.data.dietToday}>
      <DietPageBody bundle={bundle} mode={mode} />
    </DietDayProvider>
  );
}

function DietPageBody({ bundle, mode }: { bundle: FitModeBundle; mode: FitMode }) {
  const { dietToday, addWater } = useDietDay();
  const exerciseBurnKcal = bundle.data.todayGoal.calories;
  const waterPct = Math.round((dietToday.waterMl / dietToday.waterTargetMl) * 100);

  return (
    <>
      <div className="space-y-6 pb-28">
        <header>
          <p className="text-sm font-bold text-duo-blue">{bundle.diet.eyebrow}</p>
          <h1 className="mt-1 text-3xl font-black text-duo-ink">{bundle.diet.title}</h1>
          <p className="mt-1 text-sm text-duo-muted">{bundle.diet.subtitle}</p>
        </header>

        <DietEnergyBudgetCard dietToday={dietToday} exerciseBurnKcal={exerciseBurnKcal} />

        <DietModeRecommendBar mode={mode} />

        <SectionCard title={bundle.diet.mealsTitle}>
          <DietMealTimeline />
        </SectionCard>

        <SectionCard title={bundle.diet.waterTitle}>
          <div className="mb-3 flex items-end justify-between">
            <p className="text-4xl font-black text-duo-blue">
              {dietToday.waterMl}
              <span className="text-lg font-bold text-duo-muted">
                {" "}
                / {dietToday.waterTargetMl} ml
              </span>
            </p>
            <span className="text-sm font-bold text-duo-green">{waterPct}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-duo-bg ring-2 ring-duo-blue/30">
            <div
              className="h-full rounded-full bg-duo-blue"
              style={{ width: `${Math.min(waterPct, 100)}%` }}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <DuoButton variant="blue" className="min-w-[100px]" onClick={() => addWater(250)}>
              +250ml
            </DuoButton>
            <DuoButton variant="blue" className="min-w-[100px]" onClick={() => addWater(500)}>
              +500ml
            </DuoButton>
            <DuoButton variant="ghost" className="min-w-[100px]">
              自定义
            </DuoButton>
          </div>
        </SectionCard>

        <SectionCard title={bundle.diet.tipsTitle}>
          <p className="text-sm leading-relaxed text-duo-muted">{bundle.diet.tipsBody}</p>
        </SectionCard>
      </div>

      <DietQuickLogFab />
    </>
  );
}
