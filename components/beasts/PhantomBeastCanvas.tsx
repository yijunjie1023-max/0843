"use client";

import { type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { BeastId, FitnessGoal } from "@/lib/beastProfile";
import { computeBmiScaleX } from "@/lib/beastProfile";
import { BEAST_PORTRAIT_SRC } from "@/lib/beastPortraits";
import type { FitMode } from "@/lib/fitMode";
import { VitalityParticles } from "./VitalityParticles";

export type { BeastPalette } from "./types";

type Props = {
  beastId: BeastId;
  goal: FitnessGoal;
  bmi: number;
  mode: FitMode;
  silhouette?: boolean;
  /** 首页舞台：大尺寸立绘 + 光晕容器 */
  presentation?: "default" | "stage";
};

function beastDropShadow(beastId: BeastId, goal: FitnessGoal, silhouette: boolean): string | undefined {
  if (silhouette) return undefined;

  const glowPairs: Record<BeastId, [string, string]> = {
    leon: [
      "0 0 18px rgba(250,208,46,0.45)",
      "0 0 26px rgba(194,65,12,0.28)",
    ],
    luna: [
      "0 0 22px rgba(251,194,235,0.45)",
      "0 0 30px rgba(161,140,209,0.4)",
    ],
    mercury: [
      "0 0 18px rgba(56,189,248,0.48)",
      "0 0 28px rgba(125,211,252,0.22)",
    ],
    atlas: [
      "0 0 16px rgba(148,163,184,0.55)",
      "0 0 26px rgba(71,85,105,0.35)",
    ],
    pyro: [
      "0 0 20px rgba(251,146,60,0.52)",
      "0 0 32px rgba(234,88,12,0.28)",
    ],
    volt: [
      "0 0 20px rgba(232,121,249,0.5)",
      "0 0 30px rgba(167,139,250,0.35)",
    ],
  };

  const [a, b] = glowPairs[beastId];
  const depth = "drop-shadow(0 8px 0 rgba(0,0,0,0.32))";
  const layers = [`drop-shadow(${a})`, `drop-shadow(${b})`, depth];

  if (goal === "body_shape") {
    layers.push(
      "drop-shadow(0 0 3px rgba(255,255,255,0.55))",
      "drop-shadow(0 0 14px rgba(28,176,246,0.42))",
    );
  }

  return layers.join(" ");
}

function HeatRipples({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-end justify-center overflow-visible"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute bottom-7 left-1/2 -translate-x-1/2 rounded-full border-2 border-duo-green/50"
          style={{
            width: 100,
            height: 100,
          }}
          initial={false}
          animate={{
            scale: [0.55, 2.15],
            opacity: [0.42, 0],
          }}
          transition={{
            duration: 2.35,
            repeat: Infinity,
            delay: i * 0.78,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

export function PhantomBeastCanvas({
  beastId,
  goal,
  bmi,
  mode,
  silhouette,
  presentation = "default",
}: Props) {
  const sil = !!silhouette;
  const stage = presentation === "stage";
  const scaleX = computeBmiScaleX(bmi);
  const fatWrap = goal === "fat_loss" && !sil;
  const imgFilter = beastDropShadow(beastId, goal, sil);

  const breatheScale: [number, number, number] = sil
    ? [1, 1.018, 1]
    : stage
      ? [1, 1.048, 1]
      : [1, 1.03, 1];

  const imgClassSilhouette =
    "pointer-events-none max-h-[94%] max-w-full select-none object-contain object-bottom opacity-[0.5] grayscale contrast-[1.05] brightness-[0.55]";

  const imgClassColor =
    "beast-kill-black-matte pointer-events-none max-h-full max-w-full select-none object-contain object-bottom drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]";

  const portraitGlowWrapStyle: CSSProperties =
    !sil && imgFilter ? { filter: imgFilter } : {};

  const outerClass = stage
    ? "relative flex h-[320px] w-full max-w-full min-w-0 items-end justify-center sm:h-[328px] md:h-[336px]"
    : "relative mx-auto flex h-[260px] w-full max-w-[280px] items-end justify-center";

  const innerFrameClass = "relative h-[240px] w-[230px] overflow-hidden";

  const stageFrameOuterClass =
    "relative mx-auto h-[228px] w-full min-w-0 max-w-[min(100%,380px)] overflow-visible sm:h-[236px] md:h-[244px]";
  const stagePortraitShellClass =
    "relative h-full w-full overflow-hidden rounded-2xl ring-1 ring-white/[0.09] shadow-[0_22px_60px_rgba(0,0,0,0.55),0_0_76px_rgba(28,176,246,0.24),0_0_110px_rgba(88,204,2,0.12)]";

  const portraitImg = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- static local assets from /public */}
      <img
        src={BEAST_PORTRAIT_SRC[beastId]}
        alt=""
        className={sil ? imgClassSilhouette : imgClassColor}
        draggable={false}
      />
    </>
  );

  const portraitSlot = (
    <div
      className="pointer-events-none flex h-full w-full items-end justify-center"
      style={portraitGlowWrapStyle}
    >
      {portraitImg}
    </div>
  );

  const finalsBadge =
    mode === "finals" && !sil ? (
      <div
        className="absolute left-[22%] top-[5%] z-10 rounded-md border-2 border-red-600 bg-red-600 px-2 py-0.5 text-[11px] font-black text-white shadow-md"
        style={{ fontFamily: "var(--font-nunito), system-ui, sans-serif" }}
      >
        奋斗
      </div>
    ) : null;

  const holidayDecor =
    mode === "holiday" && !sil ? (
      <div className="absolute bottom-[10%] right-[4%] z-10 flex items-end gap-1 drop-shadow-md">
        <div className="flex flex-col items-center rounded-lg border-2 border-duo-green bg-duo-surface px-1.5 pb-1 pt-0.5">
          <div className="h-0 w-0 border-x-[10px] border-x-transparent border-b-[8px] border-b-duo-green" />
          <div className="mt-0.5 h-6 w-10 rounded-md bg-duo-bg ring-1 ring-duo-green/60" />
        </div>
        <div className="rounded border-2 border-duo-blue bg-duo-blue/35 px-1 py-0.5">
          <span className="text-[10px]" aria-hidden>
            ✈️
          </span>
        </div>
      </div>
    ) : null;

  return (
    <div className={outerClass}>
      {goal === "vitality" && !sil && <VitalityParticles />}

      <AnimatePresence mode="wait">
        <motion.div
          key={beastId}
          className="relative flex w-full items-end justify-center"
          initial={{ opacity: 0.88, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.82, scale: 0.96 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <HeatRipples active={fatWrap} />

          <motion.div
            className="relative"
            style={{ transformOrigin: "center bottom" }}
            animate={{ scaleX }}
            transition={{ type: "spring", stiffness: 140, damping: 22 }}
          >
            <motion.div
              style={{ transformOrigin: "center bottom" }}
              animate={{ scale: breatheScale }}
              transition={{
                duration: stage && !sil ? 3.35 : 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.div
                style={{ transformOrigin: "center bottom" }}
                animate={{
                  scaleY: fatWrap ? 1.1 : 1,
                  scaleX: fatWrap ? 0.94 : 1,
                }}
                transition={{ type: "spring", stiffness: 180, damping: 20 }}
              >
                {stage ? (
                  <div className={stageFrameOuterClass}>
                    <div className={stagePortraitShellClass}>{portraitSlot}</div>
                    {finalsBadge}
                    {holidayDecor}
                  </div>
                ) : (
                  <div className={innerFrameClass}>
                    {portraitSlot}
                    {finalsBadge}
                    {holidayDecor}
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
