"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ArenaBeastSnapshot, BoundFriend, FitMode } from "@/lib/fitMode";
import { ArenaBeastAvatar } from "@/components/arena/ArenaBeastAvatar";
import { SectionCard } from "@/components/SectionCard";

type Props = {
  title: string;
  mode: FitMode;
  friends: BoundFriend[];
  selfMinutesToday: number;
  selfDisplayName: string;
  selfBeast: ArenaBeastSnapshot;
};

/** 演示用：从好友种子推导「今日分钟」 */
function mockFriendMinutesToday(f: BoundFriend): number {
  return 12 + (f.bondLevel * 5 + f.name.length) % 42;
}

export function ArenaFriendPk({
  title,
  mode,
  friends,
  selfMinutesToday,
  selfDisplayName,
  selfBeast,
}: Props) {
  const [fid, setFid] = useState(friends[0]?.id ?? "");
  const [result, setResult] = useState<{
    win: boolean;
    loot: string;
  } | null>(null);

  const friend = useMemo(() => friends.find((x) => x.id === fid), [friends, fid]);
  const oppMin = friend ? mockFriendMinutesToday(friend) : 0;
  const maxM = Math.max(selfMinutesToday, oppMin, 1);
  const selfPct = (selfMinutesToday / maxM) * 100;
  const oppPct = (oppMin / maxM) * 100;
  const diff = selfMinutesToday - oppMin;
  const leadText =
    diff === 0
      ? "今日进度持平"
      : diff > 0
        ? `你领先 ${diff} 分钟`
        : `落后对方 ${Math.abs(diff)} 分钟`;

  const simulate = () => {
    if (!friend) return;
    const win = selfMinutesToday >= oppMin;
    const lootIsGems = Math.random() > 0.45;
    const amt = 6 + (friend.bondLevel % 5) + Math.floor(Math.random() * 8);
    const loot = lootIsGems ? `${amt} 炼金币` : `${amt + 4} XP`;
    setResult({ win, loot });
  };

  if (friends.length === 0) {
    return (
      <SectionCard title={title}>
        <p className="text-sm font-bold text-duo-muted">暂无绑定好友，无法发起 PK。</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard title={title}>
      <p className="text-xs font-bold leading-relaxed text-duo-muted">
        当日运动 PK · 每晚 <strong className="text-duo-ink">24:00</strong> 结算；胜方随机掠夺炼金币或
        XP（演示）。
      </p>

      <label className="mt-3 block text-[10px] font-black uppercase text-duo-muted">
        选择对手
      </label>
      <select
        value={fid}
        onChange={(e) => {
          setFid(e.target.value);
          setResult(null);
        }}
        className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-3 py-2.5 text-sm font-black text-duo-ink outline-none focus:border-duo-green"
      >
        {friends.map((f) => (
          <option key={f.id} value={f.id}>
            {f.name}
          </option>
        ))}
      </select>

      <div className="relative mt-4 overflow-hidden rounded-2xl border-2 border-duo-surface2 bg-gradient-to-b from-duo-surface to-duo-bg px-3 py-3 sm:px-3.5">
        <div className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:repeating-linear-gradient(-60deg,#000_0,#000_1px,transparent_1px,transparent_12px)]" />

        {/* 顶栏：横向紧凑，头像 + 昵称 + 分数单行 */}
        <div className="relative flex items-center gap-2 sm:gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <ArenaBeastAvatar
              beast={selfBeast}
              mode={mode}
              size={40}
              ringClassName="ring-1 ring-white/25 shadow-none ring-inset"
            />
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-[9px] font-black uppercase tracking-wide text-duo-muted">你</p>
              <p className="truncate text-[11px] font-black text-duo-ink">{selfDisplayName}</p>
              <p className="mt-0.5 tabular-nums">
                <span className="text-base font-black text-duo-blue sm:text-lg">{selfMinutesToday}</span>
                <span className="ml-0.5 text-[9px] font-bold text-duo-muted">分钟</span>
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <motion.span
              className="inline-flex rounded-lg border border-duo-surface2 bg-duo-bg/80 px-2 py-1 text-[11px] font-black tracking-wider text-duo-muted shadow-inner ring-1 ring-white/5"
              animate={{ scale: [1, 1.04, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              VS
            </motion.span>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2">
            {friend ? (
              <>
                <div className="min-w-0 flex-1 text-right leading-tight">
                  <p className="text-[9px] font-black uppercase tracking-wide text-duo-muted">对手</p>
                  <p className="truncate text-[11px] font-black text-duo-ink">{friend.name}</p>
                  <p className="mt-0.5 tabular-nums">
                    <span className="text-base font-black text-duo-ink sm:text-lg">{oppMin}</span>
                    <span className="ml-0.5 text-[9px] font-bold text-duo-muted">分钟</span>
                  </p>
                </div>
                <ArenaBeastAvatar
                  beast={friend.beast}
                  mode={mode}
                  size={40}
                  ringClassName="ring-1 ring-white/25 shadow-none ring-inset"
                />
              </>
            ) : null}
          </div>
        </div>

        <div className="relative mt-3 space-y-2.5">
          <div>
            <div className="mb-0.5 flex justify-between text-[10px] font-black">
              <span className="text-duo-blue">你</span>
              <span className="tabular-nums text-duo-muted">{selfPct.toFixed(0)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-duo-surface2 ring-1 ring-duo-blue/12">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-duo-blue to-sky-400"
                initial={false}
                animate={{ width: `${selfPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>
          <div>
            <div className="mb-0.5 flex justify-between text-[10px] font-black">
              <span className="text-duo-ink">对手</span>
              <span className="tabular-nums text-duo-muted">{oppPct.toFixed(0)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-duo-surface2 ring-1 ring-duo-ink/08">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-slate-500 to-slate-400"
                initial={false}
                animate={{ width: `${oppPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
          </div>
        </div>

        <motion.p
          className="relative mt-3 text-center text-sm font-black text-duo-ink sm:text-base"
          key={`${fid}-${selfMinutesToday}-${oppMin}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {leadText}
        </motion.p>
      </div>

      <button
        type="button"
        onClick={simulate}
        className="mt-4 w-full rounded-2xl bg-duo-green py-3 text-sm font-black text-white shadow-sm ring-2 ring-duo-green/30"
      >
        模拟 24:00 结算
      </button>

      <AnimatePresence>
        {result ? (
          <motion.div
            key="pk-result"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className={`mt-5 rounded-2xl border-4 px-5 py-6 text-center shadow-lg ${
              result.win
                ? "border-duo-green bg-duo-green/15 ring-4 ring-duo-green/20"
                : "border-amber-400 bg-amber-50 ring-4 ring-amber-100"
            }`}
          >
            <p className="text-sm font-black uppercase tracking-wide text-duo-muted">
              PK 结算（演示）
            </p>
            <p className="mt-3 text-3xl font-black text-duo-ink md:text-4xl">
              {result.win ? "胜利" : "失利"}
            </p>
            <p className="mt-3 text-lg font-bold leading-snug text-duo-ink md:text-xl">
              {result.win
                ? `恭喜掠夺成功：获得 ${result.loot}`
                : `被对方掠夺：失去 ${result.loot}`}
            </p>
            <p className="mt-4 text-sm font-bold text-duo-muted">
              真实环境请接入服务端；次日 0:00 开启新一轮 PK。
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </SectionCard>
  );
}
