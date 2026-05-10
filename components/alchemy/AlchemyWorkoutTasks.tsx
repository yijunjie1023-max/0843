"use client";

import { DuoButton } from "@/components/DuoButton";
import type { FitMode } from "@/lib/fitMode";
import { fiveSlotTitle } from "@/lib/workoutTaskPools";

const REROLL_COST = 6;

type Props = {
  mode: FitMode;
  /** 激活达标所需完成数（日常 3 · 期末 1） */
  activationRequired: number;
  alchemyCoins: number;
  activationOffer: string[];
  activationDone: boolean[];
  onRequestCompleteActivation: (index: number) => void;
  onRerollActivation: () => void;
  coreGenerated: [string, string, string, string];
  coreCustom: string;
  onCoreCustomChange: (value: string) => void;
  coreDone: boolean[];
  onRequestCompleteCore: (index: number) => void;
  onRerollCore: () => void;
  challengeGenerated: [string, string, string, string];
  challengeCustom: string;
  onChallengeCustomChange: (value: string) => void;
  challengeDone: boolean[];
  onRequestCompleteChallenge: (index: number) => void;
  onRerollChallenge: () => void;
};

export function AlchemyWorkoutTasks({
  mode,
  activationRequired,
  alchemyCoins,
  activationOffer,
  activationDone,
  onRequestCompleteActivation,
  onRerollActivation,
  coreGenerated,
  coreCustom,
  onCoreCustomChange,
  coreDone,
  onRequestCompleteCore,
  onRerollCore,
  challengeGenerated,
  challengeCustom,
  onChallengeCustomChange,
  challengeDone,
  onRequestCompleteChallenge,
  onRerollChallenge,
}: Props) {
  const actCount = activationDone.filter(Boolean).length;
  const actMet = actCount >= activationRequired;

  const coreCount = coreDone.filter(Boolean).length;
  const coreMet = coreCount >= 2;

  const chMet = challengeDone.some(Boolean);

  const modeHint =
    mode === "normal"
      ? "按诉求匹配任务池 · 激活 / 核心 / 挑战三层递进"
      : mode === "finals"
        ? "期末周：激活任意 1 项即可点亮内环并解锁外圈（动了就行）"
        : "假期：核心与挑战可与好友合力打卡";

  const allDone = actMet && coreMet && chMet;

  const tierCard = (done: boolean, active: boolean) =>
    [
      "min-h-[120px] shrink-0 snap-start rounded-2xl border-2 px-3 py-3 text-left transition-transform active:scale-[0.99] md:min-h-[128px]",
      done
        ? "border-duo-green bg-duo-green/10"
        : active
          ? "border-duo-blue bg-duo-blue/10 ring-2 ring-duo-blue/30"
          : "border-duo-surface2 bg-duo-bg hover:-translate-y-0.5",
    ].join(" ");

  const cardWidth = "min(220px, 78vw)";
  const customCardWidth = "min(240px, 78vw)";

  const renderCustomSlot = (args: {
    tier: "核心" | "挑战";
    slotIndex: number;
    rowId: string;
    generated: [string, string, string, string];
    custom: string;
    onCustomChange: (v: string) => void;
    done: boolean;
    active: boolean;
    onRequestComplete: () => void;
    disabledBase: boolean;
    /** 例如挑战已有其它槽完成时，锁住未完成槽 */
    blocked?: boolean;
  }) => {
    const {
      tier,
      slotIndex,
      rowId,
      generated,
      custom,
      onCustomChange,
      done,
      active,
      onRequestComplete,
      disabledBase,
      blocked = false,
    } = args;
    const preview = fiveSlotTitle(generated, custom, slotIndex);
    return (
      <div
        key={slotIndex}
        id={rowId}
        className={tierCard(done, active)}
        style={{ width: customCardWidth }}
      >
        <p className="text-[10px] font-black uppercase text-duo-muted">
          {tier} · {slotIndex + 1}
        </p>
        <p className="mt-0.5 text-[10px] font-black text-duo-green">自定义</p>
        <p className="mt-1 line-clamp-3 text-sm font-black leading-snug text-duo-ink">
          {preview}
        </p>
        <input
          type="text"
          disabled={done || disabledBase || blocked}
          placeholder="填写自定义内容…"
          value={custom}
          onChange={(e) => onCustomChange(e.target.value)}
          className="mt-2 w-full rounded-xl border-2 border-duo-surface2 bg-duo-surface px-2 py-1.5 text-xs font-bold text-duo-ink outline-none placeholder:text-duo-muted focus:border-duo-green"
        />
        <button
          type="button"
          disabled={done || disabledBase || blocked || !custom.trim()}
          onClick={onRequestComplete}
          className="mt-2 w-full text-left text-[11px] font-bold text-duo-blue disabled:opacity-40"
        >
          {done ? "已完成 ✓" : "上传照片打卡"}
        </button>
      </div>
    );
  };

  return (
    <section
      id="alchemy-workout-tasks"
      className="rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-4 md:p-5"
      aria-labelledby="workout-tasks-title"
    >
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-duo-muted">Training</p>
          <h2 id="workout-tasks-title" className="text-lg font-black text-duo-ink md:text-xl">
            今日训练
          </h2>
          <p className="mt-1 text-xs text-duo-muted">{modeHint}</p>
        </div>
        <div className="rounded-2xl border-2 border-duo-green/35 bg-duo-green/10 px-3 py-2 text-right">
          <p className="text-[10px] font-bold uppercase text-duo-muted">炼金币</p>
          <p className="text-lg font-black text-duo-green">{alchemyCoins}</p>
        </div>
      </div>

      {/* 激活：横向 5 选，完成 3 */}
      <div id="workout-activation" className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-black text-duo-ink">激活任务</h3>
          <span className="text-[11px] font-bold text-duo-muted">
            横向 5 项 · 完成任意{" "}
            <span className="text-duo-green">{activationRequired}</span>{" "}
            项（须上传打卡照）· 当前 <span className="text-duo-ink">{actCount}/5</span> · 达标{" "}
            {actMet ? "✓" : "—"}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {activationOffer.map((title, i) => {
            const done = activationDone[i] ?? false;
            return (
              <button
                key={`${title}-${i}`}
                type="button"
                disabled={done}
                onClick={() => onRequestCompleteActivation(i)}
                className={tierCard(done, !done && actCount < activationRequired)}
                style={{ width: cardWidth }}
              >
                <p className="text-[10px] font-black uppercase text-duo-muted">激活 · {i + 1}</p>
                <p className="mt-1 text-sm font-black leading-snug text-duo-ink">{title}</p>
                <p className="mt-2 text-[11px] font-bold text-duo-blue">
                  {done ? "已完成 ✓" : "上传照片打卡"}
                </p>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DuoButton
            type="button"
            variant="ghost"
            className="px-4 py-2 text-sm"
            disabled={alchemyCoins < REROLL_COST}
            onClick={onRerollActivation}
          >
            花费 {REROLL_COST} 炼金币刷新候选池
          </DuoButton>
          <p className="text-[11px] text-duo-muted">刷新后重新抽取 5 条激活任务（进度清零）</p>
        </div>
      </div>

      {/* 核心：同激活 · 槽 1–2 系统 · 槽 3 自定义 · 槽 4–5 系统；任意完成 2 */}
      <div id="workout-core" className="mb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-black text-duo-ink">核心任务</h3>
          <span className="text-[11px] font-bold text-duo-muted">
            横向 5 项 · 任务 1–2 系统生成 · 任务 3 自定义 · 任务 4–5 系统 · 完成任意{" "}
            <span className="text-duo-green">2</span> 项（须上传打卡照）· 当前{" "}
            <span className="text-duo-ink">{coreCount}/5</span> · 达标 {coreMet ? "✓" : "—"}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {[0, 1, 2, 3, 4].map((i) => {
            const done = coreDone[i] ?? false;
            const disabledBase = coreGenerated[0] === "—";
            if (i === 2) {
              return renderCustomSlot({
                tier: "核心",
                slotIndex: i,
                rowId: `workout-task-core-${i}`,
                generated: coreGenerated,
                custom: coreCustom,
                onCustomChange: onCoreCustomChange,
                done,
                active: !done && coreCount < 2,
                onRequestComplete: () => onRequestCompleteCore(i),
                disabledBase,
              });
            }
            const title = fiveSlotTitle(coreGenerated, coreCustom, i);
            return (
              <button
                key={i}
                type="button"
                id={`workout-task-core-${i}`}
                disabled={done || disabledBase}
                onClick={() => onRequestCompleteCore(i)}
                className={tierCard(done, !done && coreCount < 2)}
                style={{ width: cardWidth }}
              >
                <p className="text-[10px] font-black uppercase text-duo-muted">核心 · {i + 1}</p>
                <p className="mt-1 text-sm font-black leading-snug text-duo-ink">{title}</p>
                <p className="mt-2 text-[11px] font-bold text-duo-blue">
                  {done ? "已完成 ✓" : "上传照片打卡"}
                </p>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DuoButton
            type="button"
            variant="ghost"
            className="px-4 py-2 text-sm"
            disabled={alchemyCoins < REROLL_COST}
            onClick={onRerollCore}
          >
            花费 {REROLL_COST} 炼金币刷新候选池
          </DuoButton>
          <p className="text-[11px] text-duo-muted">刷新后重新抽取核心任务（进度与自定义清零）</p>
        </div>
      </div>

      {/* 挑战：同布局 · 完成任意 1 */}
      <div id="workout-challenge">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-black text-duo-ink">挑战任务</h3>
          <span className="text-[11px] font-bold text-duo-muted">
            横向 5 项 · 任务 1–2 系统 · 任务 3 自定义 · 任务 4–5 系统 · 完成任意{" "}
            <span className="text-duo-green">1</span> 项（须上传打卡照）· 当前{" "}
            <span className="text-duo-ink">{challengeDone.filter(Boolean).length}/5</span> · 达标{" "}
            {chMet ? "✓" : "—"}
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
          {[0, 1, 2, 3, 4].map((i) => {
            const done = challengeDone[i] ?? false;
            const disabledBase = challengeGenerated[0] === "—";
            if (i === 2) {
              return renderCustomSlot({
                tier: "挑战",
                slotIndex: i,
                rowId: `workout-task-challenge-${i}`,
                generated: challengeGenerated,
                custom: challengeCustom,
                onCustomChange: onChallengeCustomChange,
                done,
                active: !done && !chMet,
                onRequestComplete: () => onRequestCompleteChallenge(i),
                disabledBase,
                blocked: chMet && !done,
              });
            }
            const title = fiveSlotTitle(challengeGenerated, challengeCustom, i);
            return (
              <button
                key={i}
                type="button"
                id={`workout-task-challenge-${i}`}
                disabled={done || disabledBase || (chMet && !done)}
                onClick={() => onRequestCompleteChallenge(i)}
                className={tierCard(done, !done && !chMet)}
                style={{ width: cardWidth }}
              >
                <p className="text-[10px] font-black uppercase text-duo-muted">挑战 · {i + 1}</p>
                <p className="mt-1 text-sm font-black leading-snug text-duo-ink">{title}</p>
                <p className="mt-2 text-[11px] font-bold text-duo-blue">
                  {done ? "已完成 ✓" : "上传照片打卡"}
                </p>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <DuoButton
            type="button"
            variant="ghost"
            className="px-4 py-2 text-sm"
            disabled={alchemyCoins < REROLL_COST}
            onClick={onRerollChallenge}
          >
            花费 {REROLL_COST} 炼金币刷新候选池
          </DuoButton>
          <p className="text-[11px] text-duo-muted">刷新后重新抽取挑战任务（进度与自定义清零）</p>
        </div>
      </div>

      {allDone && (
        <p className="mt-4 text-center text-sm font-bold text-duo-green">
          今日训练已全部完成 · 明日再来
        </p>
      )}
    </section>
  );
}
