"use client";

import { useMemo, useState } from "react";
import type { FitModeBundle } from "@/lib/fitMode";

type Props = {
  bundle: FitModeBundle;
};

/** 演示用：由步数种子生成 24 小时波动曲线 */
function synthHourly(steps: number, calories: number): number[] {
  const base = Math.max(80, steps / 120);
  return Array.from({ length: 24 }, (_, h) => {
    const dayCurve = 0.35 + 0.65 * Math.sin(((h - 6) / 24) * Math.PI);
    const noise = 0.85 + 0.15 * Math.sin(h * 1.7 + steps * 0.0001);
    return Math.round(base * dayCurve * noise + (h === 13 ? calories * 0.08 : 0));
  });
}

export function MovementActivityCard({ bundle }: Props) {
  const { todayGoal, workouts } = bundle.data;
  const [open, setOpen] = useState(false);

  const primaryWorkout = useMemo(
    () => workouts.find((w) => w.done)?.title ?? "今日尚未同步训练类型",
    [workouts],
  );

  const hourly = useMemo(
    () => synthHourly(todayGoal.steps, todayGoal.calories),
    [todayGoal.steps, todayGoal.calories],
  );
  const maxH = Math.max(...hourly, 1);

  return (
    <>
      <section className="rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-4 md:p-5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-duo-muted">Movement</p>
            <h2 className="text-base font-black text-duo-ink md:text-lg">今日运动明细</h2>
          </div>
          <span className="rounded-full bg-duo-blue/15 px-2 py-1 text-[10px] font-black text-duo-blue ring-1 ring-duo-blue/25">
            同步演示
          </span>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full rounded-2xl border-2 border-duo-surface2 bg-duo-bg px-4 py-4 text-left transition-transform active:scale-[0.99] hover:border-duo-blue/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duo-blue"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-duo-blue/20 text-2xl ring-2 ring-duo-blue/30">
              🏃
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black text-duo-ink">{primaryWorkout}</p>
              <p className="mt-0.5 text-[11px] font-bold text-duo-muted">点击查看今日数据波动</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-duo-surface2 pt-4">
            <div>
              <p className="text-[10px] font-bold text-duo-muted">步数</p>
              <p className="text-sm font-black text-duo-ink">{todayGoal.steps.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-duo-muted">消耗</p>
              <p className="text-sm font-black text-duo-ink">{todayGoal.calories} kcal</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-duo-muted">锻炼</p>
              <p className="text-sm font-black text-duo-ink">
                {todayGoal.minutesDone}/{todayGoal.minutesTarget} 分
              </p>
            </div>
          </div>
        </button>
      </section>

      {open ? (
        <div
          className="fixed inset-0 z-[55] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="movement-detail-title"
        >
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="关闭"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-[56] max-h-[min(88dvh,520px)] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-5 shadow-xl">
            <h3 id="movement-detail-title" className="text-lg font-black text-duo-ink">
              今日波动 · 演示数据
            </h3>
            <p className="mt-1 text-xs font-bold text-duo-muted">
              按当前模式模拟同步曲线（非真实传感器）。
            </p>

            <div className="mt-5 flex h-36 items-end gap-1">
              {hourly.map((v, h) => (
                <div key={h} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className="w-full max-w-[10px] rounded-t-md bg-gradient-to-t from-duo-blue to-duo-green transition-all"
                    style={{ height: `${Math.max(8, (v / maxH) * 100)}%` }}
                    title={`${h}:00 · 活跃指数 ${v}`}
                  />
                  {h % 4 === 0 ? (
                    <span className="text-[8px] font-bold text-duo-muted">{h}</span>
                  ) : (
                    <span className="h-3 w-px opacity-0">.</span>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-2 rounded-2xl border border-duo-surface2 bg-duo-bg/80 p-4 text-sm font-bold">
              <div className="flex justify-between">
                <span className="text-duo-muted">步数峰值时段</span>
                <span className="text-duo-ink">
                  {hourly.indexOf(Math.max(...hourly))}:00 前后
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-duo-muted">消耗累计</span>
                <span className="text-duo-ink">{todayGoal.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-duo-muted">训练类型</span>
                <span className="truncate pl-2 text-right text-duo-blue">{primaryWorkout}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-5 w-full rounded-2xl border-2 border-duo-surface2 bg-duo-bg py-3 text-sm font-black text-duo-ink"
            >
              关闭
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
