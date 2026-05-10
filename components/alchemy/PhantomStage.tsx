"use client";

import type { BeastId, FitnessGoal } from "@/lib/beastProfile";
import type { FitMode } from "@/lib/fitMode";
import { PhantomBeastCanvas } from "@/components/beasts/PhantomBeastCanvas";

type Props = {
  mode: FitMode;
  bmi: number;
  beastId: BeastId;
  goal: FitnessGoal;
  displayName: string;
  stageLabel: string;
  evolutionPercent: number;
  todayEnergyPct: number;
  attributeLv: number;
  ageLv: number;
  onBeastClick: () => void;
};

export function PhantomStage({
  mode,
  bmi,
  beastId,
  goal,
  displayName,
  stageLabel,
  evolutionPercent,
  todayEnergyPct,
  attributeLv,
  ageLv,
  onBeastClick,
}: Props) {
  const stageBeastGlow =
    mode === "normal"
      ? "shadow-[0_0_36px_rgba(88,204,2,0.18)]"
      : "";

  return (
    <section
      className="relative overflow-visible rounded-none border-0 bg-transparent"
      aria-labelledby="phantom-stage-title"
    >

      {mode === "finals" && (
        <>
          {[
            { l: "12%", t: "18%", d: "0s" },
            { l: "78%", t: "22%", d: "0.7s" },
            { l: "22%", t: "38%", d: "1.2s" },
            { l: "68%", t: "44%", d: "0.3s" },
            { l: "84%", t: "62%", d: "1.6s" },
            { l: "40%", t: "12%", d: "2s" },
          ].map((p, i) => (
            <span
              key={i}
              className="float-book absolute text-sm opacity-80"
              style={{ left: p.l, top: p.t, animationDelay: p.d }}
              aria-hidden
            >
              📖
            </span>
          ))}
        </>
      )}

      {mode === "holiday" && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 opacity-90">
          <svg
            className="h-full w-full text-duo-surface2"
            viewBox="0 0 400 80"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              fill="currentColor"
              d="M0 78 L0 52 Q60 44 120 50 Q200 58 280 48 Q340 42 400 46 L400 78 Z"
              opacity="0.65"
            />
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              d="M52 48 L72 28 L96 44 L118 22 L142 48"
              className="text-duo-muted"
              opacity="0.5"
            />
            <rect
              x="268"
              y="18"
              width="72"
              height="26"
              rx="6"
              fill="currentColor"
              opacity="0.35"
            />
            <path
              fill="currentColor"
              d="M276 18 L308 4 L340 18 Z"
              opacity="0.35"
            />
          </svg>
          <div className="float-soft absolute bottom-2 left-[18%] h-10 w-24 rounded-lg bg-duo-surface2/60" />
          <div
            className="float-soft absolute bottom-3 right-[14%] h-12 w-28 rounded-xl bg-duo-surface2/50"
            style={{ animationDelay: "1.2s" }}
          />
        </div>
      )}

      <div className="relative px-4 pb-4 pt-5 md:px-6 md:pt-6">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p
              id="phantom-stage-title"
              className="text-xs font-bold uppercase tracking-wide text-duo-muted"
            >
              Phantom Stage
            </p>
            <h2 className="text-lg font-black text-duo-ink md:text-xl">幻兽舞台</h2>
          </div>
          <span className="rounded-full bg-duo-bg px-2 py-1 text-[11px] font-black text-duo-green ring-1 ring-duo-green/30">
            BMI {bmi.toFixed(1)}
          </span>
        </div>

        <div className="relative mt-2 flex w-full min-h-[320px] items-end justify-center px-0 sm:min-h-[328px] md:min-h-[336px]">
          <button
            type="button"
            onClick={onBeastClick}
            className={[
              "phantom-breathe relative flex min-h-[320px] w-full max-w-full cursor-pointer items-end justify-center overflow-visible rounded-none border-0 bg-transparent px-0 py-0 shadow-none ring-0 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duo-blue focus-visible:ring-offset-2 focus-visible:ring-offset-duo-bg sm:min-h-[328px] md:min-h-[336px]",
              stageBeastGlow,
            ].join(" ")}
            aria-label="打开幻兽互动：一键觉醒与能量奖励"
          >
            <PhantomBeastCanvas
              beastId={beastId}
              goal={goal}
              bmi={bmi}
              mode={mode}
              presentation="stage"
            />
            <span className="absolute bottom-2 right-3 rounded-full bg-duo-blue/90 px-2 py-0.5 text-[10px] font-black text-white shadow-md ring-1 ring-white/15">
              点我
            </span>
          </button>
        </div>

        <div className="mx-auto mt-4 max-w-md">
          <div className="mb-1 flex items-center justify-between text-xs font-bold text-duo-muted">
            <span>今日能量</span>
            <span className="text-duo-blue">{todayEnergyPct}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-duo-bg ring-1 ring-duo-blue/30">
            <div
              className="h-full rounded-full bg-duo-blue transition-all duration-500"
              style={{ width: `${Math.min(100, todayEnergyPct)}%` }}
            />
          </div>
          <p className="mt-1 text-center text-[10px] text-duo-muted">
            依据当日训练时长进度与今日训练完成情况 · 点幻兽可一键觉醒加成
          </p>
        </div>

        <div className="mt-4 space-y-2 text-center">
          <p className="text-sm font-extrabold text-duo-ink">
            {displayName}{" "}
            <span className="text-duo-muted">·</span>{" "}
            <span className="text-duo-blue">{stageLabel}</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
            <span className="rounded-full bg-duo-green/15 px-2 py-1 text-duo-green">
              属性 Lv.{attributeLv}
            </span>
            <span className="rounded-full bg-duo-blue/15 px-2 py-1 text-duo-blue">
              成长龄 Lv.{ageLv}
            </span>
          </div>
          <div className="mx-auto max-w-md pt-1">
            <div className="mb-1 flex justify-between text-xs font-bold text-duo-muted">
              <span>进化能量</span>
              <span className="text-duo-green">{evolutionPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-duo-bg ring-1 ring-duo-green/25">
              <div
                className="h-full rounded-full bg-duo-green transition-all duration-500"
                style={{ width: `${evolutionPercent}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-duo-muted">
              宽度由 BMI 映射 scaleX(1 + (BMI−22)×0.05) · 立绘随体态伸缩
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
