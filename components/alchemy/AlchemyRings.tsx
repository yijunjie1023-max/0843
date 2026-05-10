"use client";

import type { FitMode } from "@/lib/fitMode";

type TodayRingGoal = {
  minutesDone: number;
  minutesTarget: number;
  calories: number;
  caloriesTarget: number;
  steps: number;
  standHoursDone: number;
  standHoursTarget: number;
};

type Props = {
  mode: FitMode;
  /** 今日已完成激活项数量（5 选） */
  activationDoneCount: number;
  /** 解锁外三环所需激活完成数：日常 3 · 期末 1 */
  activationRequired: number;
  todayGoal: TodayRingGoal;
  /** 假期：连胜展示；无则隐藏 */
  holidayStreakDays?: number | null;
  /** 假期：节奏偏弱时外环整体压暗 */
  holidayOuterMuted?: boolean;
};

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function pt(cx: number, cy: number, r: number, deg: number): [number, number] {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const [sx, sy] = pt(cx, cy, r, startDeg);
  const [ex, ey] = pt(cx, cy, r, endDeg);
  const sweep = endDeg - startDeg;
  const large = sweep > 180 ? 1 : 0;
  return `M ${sx} ${sy} A ${r} ${r} 0 ${large} 1 ${ex} ${ey}`;
}

function ProgressRing({
  cx,
  cy,
  r,
  stroke,
  progress,
  color,
  trackColor,
  active,
  muted,
}: {
  cx: number;
  cy: number;
  r: number;
  stroke: number;
  progress: number;
  color: string;
  trackColor: string;
  active: boolean;
  muted: boolean;
}) {
  const C = 2 * Math.PI * r;
  const dash = C * clamp01(progress);
  const opacity = active ? (muted ? 0.62 : 1) : 0.22;
  return (
    <>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={trackColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${C * 0.999} ${C}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        className="transition-opacity duration-500"
      />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${C}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ opacity }}
        className="transition-all duration-700"
      />
    </>
  );
}

export function AlchemyRings({
  mode,
  activationDoneCount,
  activationRequired,
  todayGoal,
  holidayStreakDays,
  holidayOuterMuted = false,
}: Props) {
  const cx = 100;
  const cy = 100;
  const isFinals = mode === "finals";
  const innerR = 30;
  const innerStroke = 9;
  const gap = 5;
  const ringStroke = 11;
  const rCal = innerR + innerStroke / 2 + gap + ringStroke / 2;
  const rEx = rCal + ringStroke + gap;
  const rStand = rEx + ringStroke + gap;

  const unlocked = activationDoneCount >= activationRequired;

  const standP = clamp01(todayGoal.standHoursDone / todayGoal.standHoursTarget);
  const exP = clamp01(todayGoal.minutesDone / todayGoal.minutesTarget);
  const moveP = clamp01(todayGoal.calories / todayGoal.caloriesTarget);

  const track = "rgba(51,65,85,0.85)";
  const colStand = "#38bdf8";
  const colEx = "#4ade80";
  const colMove = "#fb7185";

  const innerLit = isFinals
    ? Math.min(activationDoneCount, 1)
    : Math.min(activationDoneCount, 3);
  const segmentCount = isFinals ? 1 : 3;

  const innerGap = 14;
  const segSweep = isFinals ? 360 - innerGap : (360 - segmentCount * innerGap) / segmentCount;
  const innerGold = "#e8c872";
  const innerDim = "rgba(71,85,105,0.55)";

  const outerMuted = holidayOuterMuted && unlocked;

  return (
    <section
      id="alchemy-rings"
      className="relative overflow-hidden rounded-3xl border-2 border-duo-surface2 bg-duo-bg/90 px-3 py-4 md:px-5 md:py-5"
      aria-label="炼金圆环 · 先激活再记录外圈"
    >
      {mode === "holiday" && holidayStreakDays != null && holidayStreakDays > 0 && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-gradient-to-r from-amber-500/25 to-orange-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-100 ring-1 ring-amber-400/40">
          🔥 {holidayStreakDays} 天连胜
        </div>
      )}

      <div className="mb-3 flex items-start justify-between gap-2 pr-16 md:pr-20">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-duo-muted">
            Alchemy Rings
          </p>
          <h2 className="text-base font-black text-duo-ink md:text-lg">炼金圆环</h2>
          <p className="mt-1 max-w-[18rem] text-[11px] font-bold leading-snug text-duo-muted">
            {unlocked
              ? "外环已解锁：站立 · 锻炼 · 消耗同步计入。"
              : `外环已锁定：先完成 ${activationRequired} 项激活热身，再点亮锻炼数据（培养先热身再运动）。`}
          </p>
        </div>
      </div>

      <div className="relative mx-auto flex max-w-[280px] justify-center">
        <svg
          viewBox="0 0 200 200"
          className="h-[min(72vw,280px)] w-[min(72vw,280px)] drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          aria-hidden
        >
          <defs>
            <filter id="ringGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="1.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* 外 → 内：站立 · 锻炼 · 热量 */}
          <g filter="url(#ringGlow)">
            <ProgressRing
              cx={cx}
              cy={cy}
              r={rStand}
              stroke={ringStroke}
              progress={unlocked ? standP : 0}
              color={colStand}
              trackColor={track}
              active={unlocked}
              muted={outerMuted}
            />
            <ProgressRing
              cx={cx}
              cy={cy}
              r={rEx}
              stroke={ringStroke}
              progress={unlocked ? exP : 0}
              color={colEx}
              trackColor={track}
              active={unlocked}
              muted={outerMuted}
            />
            <ProgressRing
              cx={cx}
              cy={cy}
              r={rCal}
              stroke={ringStroke}
              progress={unlocked ? moveP : 0}
              color={colMove}
              trackColor={track}
              active={unlocked}
              muted={outerMuted}
            />
          </g>

          {/* 内环：激活分段 */}
          <g>
            {isFinals ? (
              <>
                <circle
                  cx={cx}
                  cy={cy}
                  r={innerR}
                  fill="none"
                  stroke={innerDim}
                  strokeWidth={innerStroke}
                  strokeLinecap="round"
                />
                {innerLit >= 1 && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={innerR}
                    fill="none"
                    stroke={innerGold}
                    strokeWidth={innerStroke}
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * innerR * 0.98} ${2 * Math.PI * innerR}`}
                    transform={`rotate(-90 ${cx} ${cy})`}
                    className="transition-all duration-500"
                  />
                )}
              </>
            ) : (
              Array.from({ length: segmentCount }, (_, i) => {
                const start = -90 + i * (segSweep + innerGap);
                const end = start + segSweep;
                const lit = innerLit > i;
                return (
                  <path
                    key={i}
                    d={arcPath(cx, cy, innerR, start, end)}
                    fill="none"
                    stroke={lit ? innerGold : innerDim}
                    strokeWidth={innerStroke}
                    strokeLinecap="round"
                    className="transition-colors duration-500"
                  />
                );
              })
            )}
          </g>

          {/* 中心点缀 */}
          <circle cx={cx} cy={cy} r={innerR - innerStroke} fill="rgba(15,23,42,0.55)" />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fill="#94a3b8"
            style={{ fontSize: "9px", fontWeight: 900 }}
          >
            激活
          </text>
        </svg>
      </div>

      <div className="mx-auto mt-4 grid max-w-md grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl border border-duo-surface2 bg-duo-surface/40 px-2 py-2">
          <p className="text-[10px] font-black text-sky-400">站立</p>
          <p className="mt-1 text-xs font-black text-duo-ink">
            {todayGoal.standHoursDone}/{todayGoal.standHoursTarget}{" "}
            <span className="text-[10px] font-bold text-duo-muted">h</span>
          </p>
        </div>
        <div className="rounded-2xl border border-duo-surface2 bg-duo-surface/40 px-2 py-2">
          <p className="text-[10px] font-black text-duo-green">锻炼</p>
          <p className="mt-1 text-xs font-black text-duo-ink">
            {todayGoal.minutesDone}/{todayGoal.minutesTarget}{" "}
            <span className="text-[10px] font-bold text-duo-muted">分</span>
          </p>
        </div>
        <div className="rounded-2xl border border-duo-surface2 bg-duo-surface/40 px-2 py-2">
          <p className="text-[10px] font-black text-rose-400">消耗</p>
          <p className="mt-1 text-xs font-black text-duo-ink">
            {todayGoal.calories}/{todayGoal.caloriesTarget}{" "}
            <span className="text-[10px] font-bold text-duo-muted">kcal</span>
          </p>
        </div>
      </div>

      {isFinals && (
        <p className="mt-3 text-center text-[10px] font-bold text-duo-muted">
          期末周模式 · 激活环 1 段点亮即可解锁外环 · 目标已缩减
        </p>
      )}
    </section>
  );
}
