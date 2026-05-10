"use client";

import { useId, useLayoutEffect, useRef } from "react";
import { LayoutGroup, motion } from "framer-motion";
import {
  GEM_TIER_DEFINITIONS,
  GEM_TIER_COUNT,
  gemPolygonVertices,
  gemTierLabelFromGrade,
  gemTierSlotFromGrade,
  type GemTierDefinition,
} from "@/lib/arenaTiers";

function tierGlowShadow(mainHex: string): string {
  const m = mainHex.replace(/^#/, "");
  const withAlpha = m.length === 6 ? `${m}99` : m;
  return `drop-shadow(0 0 14px #${withAlpha}) drop-shadow(0 4px 0 rgba(0,0,0,0.52))`;
}

function KeyholeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-1.2 10h2.4l2.2 10H8.6l2.2-10Z" />
    </svg>
  );
}

type StepVisual = "past" | "current" | "locked";

function stepVisual(slot: number, index: number): StepVisual {
  if (index > slot) return "locked";
  if (index === slot) return "current";
  return "past";
}

/** 垂直挤出厚度（viewBox 单位） */
const GEM_THICKNESS = 11;

function sideShade(
  i: number,
  vertsTop: { x: number; y: number }[],
  cx: number,
  cy: number,
): number {
  const n = vertsTop.length;
  const j = (i + 1) % n;
  const mx = (vertsTop[i].x + vertsTop[j].x) / 2;
  const my = (vertsTop[i].y + vertsTop[j].y) / 2;
  let nx = mx - cx;
  let ny = my - cy;
  const len = Math.hypot(nx, ny) || 1;
  nx /= len;
  ny /= len;
  const lx = 0.58;
  const ly = 0.56;
  const llen = Math.hypot(lx, ly);
  const d = nx * (lx / llen) + ny * (ly / llen);
  return 0.2 + 0.75 * Math.max(0, Math.min(1, d));
}

/** 挤出棱柱 + 顶面高光 + 浅蓝底座 */
function EvolvedGemSvg({
  tier,
  uid,
  locked,
}: {
  tier: GemTierDefinition;
  uid: string;
  locked: boolean;
}) {
  const gid = `eg-${uid}`;
  const cx = 50;
  const cyTop = 36;
  const r = 26;
  const vertsTop = gemPolygonVertices(cx, cyTop, r, tier.level);
  const vertsBot = vertsTop.map((v) => ({ x: v.x, y: v.y + GEM_THICKNESS }));
  const botPts = vertsBot.map((v) => `${v.x},${v.y}`).join(" ");
  const topPts = vertsTop.map((v) => `${v.x},${v.y}`).join(" ");
  const maxYB = Math.max(...vertsBot.map((v) => v.y));
  const stemTop = maxYB + 1;
  const stemBot = 100;
  const stemFill = locked ? "#52525b" : tier.gradientTo;

  const n = vertsTop.length;
  const sides = [];
  for (let i = 0; i < n; i++) {
    const j = (i + 1) % n;
    const facePts = `${vertsTop[i].x},${vertsTop[i].y} ${vertsTop[j].x},${vertsTop[j].y} ${vertsBot[j].x},${vertsBot[j].y} ${vertsBot[i].x},${vertsBot[i].y}`;
    const sh = sideShade(i, vertsTop, cx, cyTop);
    sides.push(
      <polygon
        key={`s-${i}`}
        points={facePts}
        fill={locked ? "#3f3f46" : tier.gradientTo}
        fillOpacity={locked ? 0.35 + sh * 0.45 : 0.42 + sh * 0.48}
        stroke="rgba(0,0,0,0.28)"
        strokeWidth={0.35}
        strokeLinejoin="round"
      />,
    );
  }

  return (
    <svg
      className="h-[6.35rem] w-[4.75rem] overflow-visible sm:h-[6.6rem] sm:w-[4.85rem]"
      viewBox="0 0 100 132"
      aria-hidden
    >
      <defs>
        {locked ? (
          <linearGradient id={gid} x1="18%" y1="10%" x2="82%" y2="92%">
            <stop offset="0%" stopColor="#71717a" />
            <stop offset="50%" stopColor="#52525b" />
            <stop offset="100%" stopColor="#3f3f46" />
          </linearGradient>
        ) : (
          <linearGradient id={gid} x1="22%" y1="8%" x2="78%" y2="92%">
            <stop offset="0%" stopColor={tier.gradientFrom} />
            <stop offset="48%" stopColor={tier.main} />
            <stop offset="100%" stopColor={tier.gradientTo} />
          </linearGradient>
        )}
        <linearGradient id={`${gid}-bottom`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={locked ? "#27272a" : tier.gradientFrom} stopOpacity={0.85} />
          <stop offset="100%" stopColor="#000000" stopOpacity={locked ? 0.75 : 0.65} />
        </linearGradient>
        <radialGradient id={`${gid}-shine`} cx="30%" cy="26%" r="62%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity={locked ? 0.06 : 0.42} />
          <stop offset="55%" stopColor="#ffffff" stopOpacity={locked ? 0 : 0.12} />
          <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
        </radialGradient>
      </defs>

      {/* 浅蓝分层底座 */}
      <ellipse cx="50" cy="124" rx="32" ry="7.5" fill="#4f8edb" opacity={0.94} />
      <ellipse cx="50" cy="118" rx="26" ry="6" fill="#60a5fa" />
      <ellipse cx="50" cy="113" rx="20" ry="4.8" fill="#93c5fd" />
      <ellipse cx="50" cy="109" rx="14" ry="3.5" fill="#dbeafe" />

      {/* 承接柱 */}
      <path
        d={`M 42 ${stemTop} L 42 ${stemBot} L 58 ${stemBot} L 58 ${stemTop} Z`}
        fill={stemFill}
        opacity={locked ? 0.82 : 1}
      />

      {/* 台面接触影 */}
      <ellipse cx="50" cy={stemTop + 1} rx="17" ry="3.8" fill="#000000" opacity={0.38} />

      <motion.g
        key={`${tier.level}-${locked}`}
        initial={{ opacity: 0.75, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 440, damping: 32 }}
      >
        {/* 底面（厚度底） */}
        <polygon
          points={botPts}
          fill={`url(#${gid}-bottom)`}
          stroke="rgba(0,0,0,0.35)"
          strokeWidth={0.45}
          strokeLinejoin="round"
          opacity={locked ? 0.55 : 0.72}
        />

        {/* 侧壁挤出 */}
        {sides}

        {/* 顶面 */}
        <polygon
          points={topPts}
          fill={`url(#${gid})`}
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={1.25}
          strokeLinejoin="round"
        />
        <polygon points={topPts} fill={`url(#${gid}-shine)`} style={{ mixBlendMode: "soft-light" }} />

        {/* 顶棱高光边 */}
        <polygon
          points={topPts}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={0.55}
          strokeLinejoin="round"
          opacity={locked ? 0.35 : 1}
        />
      </motion.g>
    </svg>
  );
}

const SLOT_W_CLASS = "min-w-[4.75rem] w-[4.75rem] shrink-0 snap-center";

function RankGemColumn({
  tier,
  visual,
  uid,
  slot,
  itemRef,
}: {
  tier: GemTierDefinition;
  visual: StepVisual;
  uid: string;
  slot: number;
  itemRef: (el: HTMLDivElement | null) => void;
}) {
  const locked = visual === "locked";
  const current = visual === "current";

  return (
    <motion.div
      layout
      ref={itemRef}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className={`${SLOT_W_CLASS} flex flex-col items-center px-1`}
    >
      <motion.div
        layout
        className="relative flex flex-col items-center"
        animate={{
          scale: current ? 1.2 : 1,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        style={{
          filter: current ? tierGlowShadow(tier.main) : "drop-shadow(0 4px 0 rgba(0,0,0,0.48))",
        }}
      >
        <EvolvedGemSvg tier={tier} uid={uid} locked={locked} />

        {locked ? (
          <div className="pointer-events-none absolute left-1/2 top-[14%] z-[2] -translate-x-1/2 text-zinc-400">
            <KeyholeIcon className="h-9 w-9 opacity-90 drop-shadow-sm" />
          </div>
        ) : null}
      </motion.div>

      <div className="mt-1 flex max-w-full flex-col items-center gap-0.5 text-center">
        <span
          className={[
            "truncate text-[10px] font-black leading-none sm:text-[11px]",
            locked ? "text-duo-muted/45" : current ? "text-duo-ink" : "text-duo-muted",
          ].join(" ")}
          style={!locked && current ? { color: tier.main } : undefined}
        >
          {tier.nameZh}
        </span>
        <span
          className={[
            "truncate text-[8px] font-bold uppercase leading-none tracking-wide text-duo-muted/75 sm:text-[9px]",
            locked ? "opacity-40" : "",
          ].join(" ")}
        >
          {tier.nameEn}
        </span>
      </div>
    </motion.div>
  );
}

type Props = {
  tierGrade: number;
  className?: string;
};

/**
 * 十阶宝石：边数 = Level + 3；横向滑动 snap 居中当前阶；
 * 当前阶 1.2× + 高光 drop-shadow + layout 弹簧过渡。
 */
export function HonorRankStrip({ tierGrade, className = "" }: Props) {
  const slot = gemTierSlotFromGrade(tierGrade);
  const uid = useId().replace(/:/g, "");
  const currentLabel = gemTierLabelFromGrade(tierGrade);
  const scrollRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const firstCenterRef = useRef(true);

  useLayoutEffect(() => {
    const row = scrollRef.current;
    const el = itemRefs.current[slot];
    if (!row || !el) return;
    const behavior: ScrollBehavior = firstCenterRef.current ? "auto" : "smooth";
    firstCenterRef.current = false;
    el.scrollIntoView({ inline: "center", block: "nearest", behavior });
  }, [slot]);

  const setItemRef = (i: number) => (node: HTMLDivElement | null) => {
    itemRefs.current[i] = node;
  };

  return (
    <div
      className={[
        "w-full rounded-2xl bg-duo-bg/35 py-2 ring-1 ring-white/5 sm:py-2.5",
        className,
      ].join(" ")}
      role="img"
      aria-label={`段位宝石，当前 ${currentLabel}；横向滑动浏览全部 ${GEM_TIER_COUNT} 阶`}
    >
      <p className="mb-2 px-3 text-center text-[10px] font-bold text-duo-muted sm:text-[11px]">
        当前段位居中 · 左右各两阶上下文 · 滑动查看全部
      </p>

      <LayoutGroup id={`rank-strip-${uid}`}>
        <div
          ref={scrollRef}
          className={[
            "flex max-w-full gap-3 overflow-x-auto overscroll-x-contain px-[calc(50%-2.375rem)] pb-2 pt-1",
            "snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none]",
            "[&::-webkit-scrollbar]:hidden",
          ].join(" ")}
        >
          {GEM_TIER_DEFINITIONS.map((tier, i) => (
            <RankGemColumn
              key={tier.level}
              tier={tier}
              visual={stepVisual(slot, i)}
              uid={`${uid}-g-${i}`}
              slot={slot}
              itemRef={setItemRef(i)}
            />
          ))}
        </div>
      </LayoutGroup>
    </div>
  );
}
