"use client";

import { useState } from "react";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { useBeastProfile } from "@/components/BeastProfileProvider";
import { useFitMode } from "@/components/FitModeProvider";
import { ArenaBeastAvatar } from "@/components/arena/ArenaBeastAvatar";
import { ArenaFriendPk } from "@/components/arena/ArenaFriendPk";
import { ArenaLeaderboard } from "@/components/arena/ArenaLeaderboard";
import { ArenaRadarModal } from "@/components/arena/ArenaRadarModal";
import { ArenaTierBoard } from "@/components/arena/ArenaTierBoard";
import { computeBmi } from "@/lib/beastProfile";
import { gemTierLabelFromGrade } from "@/lib/arenaTiers";
import type { ArenaBeastSnapshot, ExerciseRadarStats } from "@/lib/fitMode";

const FALLBACK_SELF_BEAST: ArenaBeastSnapshot = {
  beastId: "leon",
  goal: "vitality",
  bmi: 22,
};

export default function ArenaPage() {
  const { bundle } = useFitMode();
  const { profile } = useBeastProfile();
  const [radar, setRadar] = useState<{
    name: string;
    beast: ArenaBeastSnapshot;
    radar: ExerciseRadarStats;
  } | null>(null);

  const { arenaLeaderboard, boundFriends, arenaSelf, todayGoal } = bundle.data;
  const pressure = bundle.features.emphasizeLeaderboardPressure;

  const selfRow = arenaLeaderboard.find((r) => r.isSelf);
  const selfName = selfRow?.name ?? "你";

  const selfBeast: ArenaBeastSnapshot = profile
    ? {
        beastId: profile.beastId,
        goal: profile.goal,
        bmi: computeBmi(profile.heightCm, profile.weightKg),
      }
    : FALLBACK_SELF_BEAST;

  return (
    <div className="space-y-5 pb-4">
      <header>
        <p className="text-sm font-bold text-duo-blue">{bundle.arena.eyebrow}</p>
        <h1 className="mt-1 text-3xl font-black text-duo-ink">{bundle.arena.title}</h1>
        <p className="mt-1 text-sm text-duo-muted">{bundle.arena.subtitle}</p>
        {!pressure && bundle.id === "finals" ? (
          <p className="mt-2 rounded-xl border border-duo-green/30 bg-duo-green/10 px-3 py-2 text-xs font-bold text-duo-green">
            期末周：榜单看「减压效率」与微运动频次，不鼓励堆消耗攀比。
          </p>
        ) : null}
        {bundle.id === "holiday" ? (
          <p className="mt-2 rounded-xl border border-duo-blue/30 bg-duo-blue/10 px-3 py-2 text-xs font-bold text-duo-blue">
            假期榜额外展示离校天数与自律率；无站内私信，仅雷达查看运动画像。
          </p>
        ) : null}
      </header>

      <ArenaTierBoard self={arenaSelf} />

      <ArenaFriendPk
        title={bundle.arena.pkSectionTitle}
        mode={bundle.id}
        friends={boundFriends}
        selfMinutesToday={todayGoal.minutesDone}
        selfDisplayName={selfName}
        selfBeast={selfBeast}
      />

      <ArenaLeaderboard
        mode={bundle.id}
        title={bundle.arena.leaderboardTitle}
        scoreLabel={bundle.arena.scoreLabel}
        rulesHint={bundle.arena.leaderboardRulesHint}
        rows={arenaLeaderboard}
        selfTierGrade={arenaSelf.tierGrade}
        profile={profile}
        onOpenRadar={setRadar}
      />

      <SectionCard title={bundle.arena.bindTitle}>
        <p className="mb-3 text-sm text-duo-muted">{bundle.arena.bindBody}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <DuoButton variant="green" className="flex-1">
            生成邀请链接
          </DuoButton>
          <DuoButton variant="blue" className="flex-1">
            扫码加入小队
          </DuoButton>
        </div>
        <p className="mt-3 text-[11px] font-bold text-duo-muted">
          不提供私信与聊天入口，降低社交负担；绑定仅用于榜单资格与 PK。
        </p>
      </SectionCard>

      <SectionCard title={bundle.arena.friendsTitle}>
        <ul className="space-y-2">
          {boundFriends.map((f) => (
            <li
              key={f.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-duo-surface2 bg-duo-bg px-3 py-2.5"
            >
              <div className="flex min-w-0 items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setRadar({
                      name: f.name,
                      beast: f.beast,
                      radar: f.radar,
                    })
                  }
                  className="shrink-0 rounded-full ring-2 ring-duo-surface2 transition hover:ring-duo-blue"
                  aria-label={`查看 ${f.name} 幻兽与雷达`}
                >
                  <ArenaBeastAvatar beast={f.beast} mode={bundle.id} size={44} />
                </button>
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-duo-ink">{f.name}</p>
                  <p className="text-[11px] font-bold text-duo-muted">
                    {gemTierLabelFromGrade(f.tierGrade)} · 羁绊 Lv.{f.bondLevel}
                    {f.todaySynced ? (
                      <span className="ml-1.5 text-duo-green">· 今日已同步</span>
                    ) : (
                      <span className="ml-1.5">· 今日未同步</span>
                    )}
                  </p>
                </div>
              </div>
              <p className="shrink-0 text-[10px] font-bold text-duo-muted">点头像</p>
            </li>
          ))}
        </ul>
      </SectionCard>

      <ArenaRadarModal
        open={radar !== null}
        name={radar?.name ?? ""}
        beast={radar?.beast ?? FALLBACK_SELF_BEAST}
        mode={bundle.id}
        radar={
          radar?.radar ?? {
            duration: 50,
            burn: 50,
            consistency: 50,
            strength: 50,
            recovery: 50,
          }
        }
        onClose={() => setRadar(null)}
      />
    </div>
  );
}
