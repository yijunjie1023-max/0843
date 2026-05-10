"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { AlchemyRings } from "@/components/alchemy/AlchemyRings";
import { MovementActivityCard } from "@/components/alchemy/MovementActivityCard";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { useFitMode } from "@/components/FitModeProvider";
import { useWorkoutActivation } from "@/components/WorkoutActivationProvider";
import type { WorkoutItem } from "@/lib/fitMode";
import { formatTemplate } from "@/lib/fitMode";
import { beast, userProfile } from "@/lib/mockData";
import { ExerciseTabs } from "./ExerciseTabs";

function tabFilter(tab: string, workouts: WorkoutItem[]) {
  const map: Record<string, string | undefined> = {
    run: "有氧",
    gym: "力量",
    stretch: "恢复",
  };
  const tag = map[tab];
  if (!tag) return workouts;
  return workouts.filter((w) => w.tag === tag);
}

export function ExercisePageClient() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "all";
  const { mode, bundle } = useFitMode();
  const { activationDone } = useWorkoutActivation();
  const { workouts } = bundle.data;
  const list = tab === "all" ? workouts : tabFilter(tab, workouts);

  const activationDoneCount = useMemo(
    () => activationDone.filter(Boolean).length,
    [activationDone],
  );
  const activationRequired = mode === "finals" ? 1 : 3;
  const todayGoal = bundle.data.todayGoal;
  const holidayOuterMuted =
    mode === "holiday" &&
    activationDoneCount >= activationRequired &&
    todayGoal.minutesDone <
      Math.max(10, Math.round(todayGoal.minutesTarget * 0.28));

  return (
    <div className="space-y-6">
      <header>
        <p className="text-sm font-bold text-duo-blue">{bundle.exercise.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-black text-duo-ink">{bundle.exercise.title}</h1>
        <p className="mt-1 text-sm text-duo-muted">
          {formatTemplate(bundle.exercise.subtitle, {
            minutes: bundle.data.todayGoal.minutesDone,
          })}
        </p>
      </header>

      <AlchemyRings
        mode={mode}
        activationDoneCount={activationDoneCount}
        activationRequired={activationRequired}
        todayGoal={todayGoal}
        holidayStreakDays={mode === "holiday" ? userProfile.streak : null}
        holidayOuterMuted={holidayOuterMuted}
      />

      <MovementActivityCard bundle={bundle} />

      <SectionCard title="今日训练在哪打卡？">
        <p className="text-sm leading-relaxed text-duo-muted">
          炼金圆环与运动明细见上方；激活 / 核心 / 挑战的打卡、炼金币与照片凭证请在{" "}
          <span className="font-bold text-duo-ink">首页 · 今日训练</span>{" "}
          完成。此处可按分类浏览动作清单。
        </p>
        <div className="mt-4">
          <DuoButton href="/#alchemy-workout-tasks" variant="green" className="w-full sm:w-auto">
            去首页打卡
          </DuoButton>
        </div>
      </SectionCard>

      <Suspense
        fallback={<div className="h-12 animate-pulse rounded-xl bg-duo-surface" />}
      >
        <ExerciseTabs />
      </Suspense>

      <SectionCard title={bundle.exercise.recommendTitle}>
        {list.length === 0 ? (
          <p className="text-sm text-duo-muted">该分类下暂无推荐，试试「全部」。</p>
        ) : (
          <ul className="space-y-3">
            {list.map((w) => (
              <li
                key={w.id}
                className="rounded-2xl border-2 border-duo-surface2 bg-duo-bg px-4 py-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg font-black text-duo-ink">{w.title}</span>
                  <span className="rounded-full bg-duo-blue/20 px-2 py-0.5 text-xs font-bold text-duo-blue">
                    {w.tag}
                  </span>
                  {w.done && (
                    <span className="rounded-full bg-duo-green/20 px-2 py-0.5 text-xs font-bold text-duo-green">
                      演示数据 · 已完成
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-duo-muted">
                  预计 {w.durationMin} 分钟 · 完成可得{" "}
                  <span className="font-bold text-duo-warning">+{w.xp} XP</span>
                </p>
                <p className="mt-2 text-xs font-bold text-duo-muted">
                  打卡与奖励请以首页为准（前端演示）。
                </p>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      <SectionCard title={bundle.exercise.bondTitle}>
        <p className="text-sm text-duo-muted">{bundle.exercise.bondBody}</p>
        <p className="mt-2 text-sm font-bold text-duo-ink">
          当前进化阶段：{beast.stageNames[beast.stage]} · 能量{" "}
          {bundle.data.beast.evolutionPercent}%
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <DuoButton href="/arena" variant="blue" className="text-sm">
            前往竞技场绑定 / 监督
          </DuoButton>
          <DuoButton href="/#alchemy-workout-tasks" variant="ghost" className="text-sm">
            首页今日训练
          </DuoButton>
        </div>
      </SectionCard>
    </div>
  );
}
