"use client";

import type { BeastId, FitnessGoal } from "@/lib/beastProfile";
import type { FitMode } from "@/lib/fitMode";
import { DuoButton } from "@/components/DuoButton";
import { PhantomBeastCanvas } from "@/components/beasts/PhantomBeastCanvas";

type Props = {
  open: boolean;
  onClose: () => void;
  nickname: string;
  beastId: BeastId;
  goal: FitnessGoal;
  bmi: number;
  mode: FitMode;
  energyPct: number;
  attributeLv: number;
  ageLv: number;
  awakenAvailable: boolean;
  bonusClaimedLabel: string | null;
  onAwaken: () => void;
  onClaimAttribute: () => void;
  onClaimAge: () => void;
};

export function BeastInteractModal({
  open,
  onClose,
  nickname,
  beastId,
  goal,
  bmi,
  mode,
  energyPct,
  attributeLv,
  ageLv,
  awakenAvailable,
  bonusClaimedLabel,
  onAwaken,
  onClaimAttribute,
  onClaimAge,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="beast-interact-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative z-[71] w-full max-w-md rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-5 shadow-xl">
        <h2 id="beast-interact-title" className="text-xl font-black text-duo-ink">
          与 {nickname} 共鸣
        </h2>
        <p className="mt-1 text-xs font-bold text-duo-muted">
          今日能量 {energyPct}% · 属性 Lv.{attributeLv} · 成长龄 Lv.{ageLv}
        </p>

        <div className="mt-4 flex justify-center rounded-2xl border-2 border-duo-surface2 bg-duo-bg py-3">
          <div className="scale-[0.85]">
            <PhantomBeastCanvas beastId={beastId} goal={goal} bmi={bmi} mode={mode} />
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <DuoButton
            variant="green"
            className="w-full py-3.5"
            disabled={!awakenAvailable}
            onClick={() => {
              onAwaken();
            }}
          >
            {awakenAvailable ? "一键觉醒 · 注入今日能量 (+22)" : "今日已觉醒 · 明日再来"}
          </DuoButton>

          {energyPct >= 100 ? (
            <div className="rounded-2xl border-2 border-duo-blue/35 bg-duo-blue/10 px-3 py-3">
              <p className="text-sm font-extrabold text-duo-blue">今日能量已满</p>
              <p className="mt-1 text-xs text-duo-muted">
                可选择一项成长奖励（每日一次，演示数据存本地）。
              </p>
              {bonusClaimedLabel ? (
                <p className="mt-2 text-xs font-bold text-duo-green">
                  今日已选择：{bonusClaimedLabel}
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <DuoButton variant="blue" className="flex-1" onClick={onClaimAttribute}>
                    提升属性
                  </DuoButton>
                  <DuoButton variant="ghost" className="flex-1" onClick={onClaimAge}>
                    提升成长龄
                  </DuoButton>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-xs text-duo-muted">
              完成当日时长与今日训练即可蓄满能量条，解锁属性或成长龄提升。
            </p>
          )}
        </div>

        <div className="mt-4">
          <DuoButton variant="ghost" className="w-full py-3" onClick={onClose}>
            关闭
          </DuoButton>
        </div>
      </div>
    </div>
  );
}
