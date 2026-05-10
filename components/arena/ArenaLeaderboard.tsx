"use client";

import { Fragment, useState } from "react";
import type {
  ArenaBeastSnapshot,
  ArenaRow,
  ExerciseRadarStats,
  FitMode,
} from "@/lib/fitMode";
import type { BeastProfile } from "@/lib/beastProfile";
import { computeBmi } from "@/lib/beastProfile";
import { SectionCard } from "@/components/SectionCard";
import { ArenaBeastAvatar } from "@/components/arena/ArenaBeastAvatar";

const MAX_TIER_GAP = 4;

function beastForRow(row: ArenaRow, profile: BeastProfile | null): ArenaBeastSnapshot {
  if (row.isSelf && profile) {
    return {
      beastId: profile.beastId,
      goal: profile.goal,
      bmi: computeBmi(profile.heightCm, profile.weightKg),
    };
  }
  return row.beast;
}

type Props = {
  mode: FitMode;
  title: string;
  scoreLabel: string;
  rulesHint: string;
  rows: ArenaRow[];
  selfTierGrade: number;
  profile: BeastProfile | null;
  onOpenRadar: (payload: {
    name: string;
    beast: ArenaBeastSnapshot;
    radar: ExerciseRadarStats;
  }) => void;
};

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center text-lg drop-shadow-sm"
        aria-hidden
      >
        🥇
      </span>
    );
  }
  if (rank === 2) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-lg" aria-hidden>
        🥈
      </span>
    );
  }
  if (rank === 3) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-lg" aria-hidden>
        🥉
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-duo-surface2 text-sm font-black text-duo-ink">
      {rank}
    </span>
  );
}

export function ArenaLeaderboard({
  mode,
  title,
  scoreLabel,
  rulesHint,
  rows,
  selfTierGrade,
  profile,
  onOpenRadar,
}: Props) {
  const [addHint, setAddHint] = useState<string | null>(null);
  const promoCutoff = Math.ceil(rows.length * 0.3);

  const demoAddFriend = () => {
    const tooFarTier = selfTierGrade + MAX_TIER_GAP + 3;
    const okTier = selfTierGrade - 3;
    const useBlockedDemo = Math.random() > 0.55;
    const candidate = useBlockedDemo ? tooFarTier : okTier;
    if (Math.abs(selfTierGrade - candidate) > MAX_TIER_GAP) {
      setAddHint("段位差距过大（>4 级），不可添加该好友至榜单（演示规则）。");
      return;
    }
    setAddHint("已模拟发送邀请：对方同意后出现在榜尾（前端占位）。");
  };

  return (
    <SectionCard title={title}>
      <p className="text-[11px] font-bold leading-relaxed text-duo-muted">{rulesHint}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={demoAddFriend}
          className="rounded-xl border-2 border-duo-blue bg-duo-blue/10 px-3 py-2 text-xs font-black text-duo-blue"
        >
          手动添加好友入榜（演示）
        </button>
      </div>
      {addHint ? (
        <p className="mt-2 rounded-lg bg-duo-bg px-2 py-1.5 text-[11px] font-bold text-duo-ink">
          {addHint}
        </p>
      ) : null}

      <ol className="mt-4 max-h-[min(520px,55vh)] space-y-1.5 overflow-y-auto pr-1">
        {rows.map((row, idx) => (
          <Fragment key={`${row.rank}-${row.name}`}>
            <li
              className={[
                "flex items-center gap-2 rounded-xl border px-2 py-2 md:gap-3 md:px-3",
                row.rank === 1
                  ? "border-amber-200 bg-amber-50/90 ring-1 ring-amber-100"
                  : row.isSelf
                    ? "border-duo-green bg-duo-green/10"
                    : "border-duo-surface2 bg-duo-bg",
              ].join(" ")}
            >
              <RankBadge rank={row.rank} />

              <button
                type="button"
                onClick={() =>
                  onOpenRadar({
                    name: row.name,
                    beast: beastForRow(row, profile),
                    radar: row.radar,
                  })
                }
                className="shrink-0 rounded-full ring-2 ring-transparent transition hover:ring-duo-blue"
                aria-label={`查看 ${row.name} 幻兽与雷达`}
              >
                <ArenaBeastAvatar beast={beastForRow(row, profile)} mode={mode} size={44} />
              </button>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-duo-ink">{row.name}</p>
                <p className="truncate text-[10px] font-bold text-duo-muted">
                  {row.tierLabel} · {row.relation}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-black tabular-nums text-duo-blue">
                  {row.xpWeek} {scoreLabel}
                </p>
                {mode === "finals" && row.microSessionsWeek !== undefined ? (
                  <p className="text-[9px] font-bold text-duo-muted">
                    微运动 {row.microSessionsWeek} 次
                  </p>
                ) : null}
                {mode === "holiday" &&
                row.daysAway !== undefined &&
                row.disciplinePct !== undefined ? (
                  <p className="text-[9px] font-bold text-duo-muted">
                    离校 {row.daysAway}d · 自律 {row.disciplinePct}%
                  </p>
                ) : null}
              </div>
            </li>

            {idx === promoCutoff - 1 ? (
              <li className="list-none py-2 text-center text-[11px] font-black tracking-wide text-duo-green">
                ⬆️ 跃升地带 ⬆️
              </li>
            ) : null}
          </Fragment>
        ))}
      </ol>
    </SectionCard>
  );
}
