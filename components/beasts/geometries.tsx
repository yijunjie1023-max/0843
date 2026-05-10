"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { FitnessGoal } from "@/lib/beastProfile";
import { BeastCuteFace } from "./BeastCuteFace";
import type { BeastPalette } from "./types";

export type BeastGeometryProps = {
  p: BeastPalette;
  goal: FitnessGoal;
  /** 剪影模式下不做 framer 形变与五官 */
  animateMorph: boolean;
  /** 体积高光（径向渐变 url） */
  highlightFill?: string;
  irisGradientUrl: string;
  cheekGradientUrl: string;
  mouthStroke: string;
};

function StrokeSoftWrap({ p, children }: { p: BeastPalette; children: ReactNode }) {
  const op = p.strokeOpacity;
  if (op == null) return <g>{children}</g>;
  return <g strokeOpacity={op}>{children}</g>;
}

const muscleSpring = { type: "spring" as const, stiffness: 260, damping: 22 };

const idleSlow = { duration: 5.5, repeat: Infinity, ease: "easeInOut" as const };

/** 莱昂：圆角躯干 + 三角形鬃毛 */
export function LeonGeometry({
  p,
  goal,
  animateMorph,
  highlightFill,
  irisGradientUrl,
  cheekGradientUrl,
  mouthStroke,
}: BeastGeometryProps) {
  const muscle = animateMorph && goal === "muscle_gain";

  const torso = (
    <rect
      x="50"
      y="88"
      width="100"
      height="112"
      rx="32"
      ry="32"
      fill={p.fill}
      stroke={p.stroke}
      strokeWidth={p.strokeWidth}
      fillOpacity={p.fillOpacity}
    />
  );

  const maneInner = (
    <>
      <polygon
        points="100,38 86,62 114,62"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth * 0.45)}
        fillOpacity={p.fillOpacity}
      />
      <polygon
        points="72,58 58,88 88,82"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth * 0.45)}
        fillOpacity={p.fillOpacity * 0.92}
      />
      <polygon
        points="128,58 142,88 112,82"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth * 0.45)}
        fillOpacity={p.fillOpacity * 0.92}
      />
    </>
  );

  return (
    <g>
      <StrokeSoftWrap p={p}>
        <g>
          {animateMorph ? (
            <motion.g
              initial={false}
              animate={{ rotate: [0, 2.8, -2.2, 0] }}
              transition={idleSlow}
              style={{ transformOrigin: "100px 58px", transformBox: "fill-box" }}
            >
              {maneInner}
            </motion.g>
          ) : (
            <g>{maneInner}</g>
          )}
          <polygon
            points="100,48 78,76 122,76"
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth={Math.max(1.5, p.strokeWidth * 0.5)}
            fillOpacity={p.fillOpacity}
          />
          {muscle ? (
            <motion.g
              style={{ transformOrigin: "100px 144px", transformBox: "fill-box" }}
              initial={false}
              animate={{ scale: 1.2 }}
              transition={muscleSpring}
            >
              {torso}
            </motion.g>
          ) : (
            torso
          )}
          <rect
            x="72"
            y="168"
            width="22"
            height="44"
            rx="10"
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            fillOpacity={p.fillOpacity}
          />
          <rect
            x="106"
            y="168"
            width="22"
            height="44"
            rx="10"
            fill={p.fill}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
            fillOpacity={p.fillOpacity}
          />
          {highlightFill && animateMorph ? (
            <ellipse
              cx={100}
              cy={126}
              rx={46}
              ry={58}
              fill={highlightFill}
              opacity={0.86}
              style={{ mixBlendMode: "soft-light" }}
            />
          ) : null}
        </g>
      </StrokeSoftWrap>
      <BeastCuteFace
        cx={100}
        cy={124}
        eyeSpacing={18}
        eyeR={6}
        show={animateMorph}
        irisGradientUrl={irisGradientUrl}
        cheekGradientUrl={cheekGradientUrl}
        mouthStroke={mouthStroke}
      />
    </g>
  );
}

function MuscleWrap({
  on,
  ox,
  oy,
  scale,
  children,
}: {
  on: boolean;
  ox: number;
  oy: number;
  scale: number;
  children: ReactNode;
}) {
  if (!on) return <g>{children}</g>;
  return (
    <motion.g
      style={{
        transformOrigin: `${ox}px ${oy}px`,
        transformBox: "fill-box",
      }}
      initial={false}
      animate={{ scale }}
      transition={muscleSpring}
    >
      {children}
    </motion.g>
  );
}

/** 墨丘利：流线椭圆身 + 叠羽 */
export function MercuryGeometry({
  p,
  goal,
  animateMorph,
  highlightFill,
  irisGradientUrl,
  cheekGradientUrl,
  mouthStroke,
}: BeastGeometryProps) {
  const muscle = animateMorph && goal === "muscle_gain";
  const body = (
    <StrokeSoftWrap p={p}>
      <g>
      <path
        d="M 42 118 Q 38 78 72 62 Q 100 52 128 62 Q 162 78 158 118 Q 154 158 128 168 Q 100 176 72 168 Q 46 158 42 118 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity}
      />
      <path
        d="M 44 96 Q 28 110 34 138 Q 52 112 78 98 Q 58 88 44 96 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth - 1)}
        fillOpacity={p.fillOpacity * 0.85}
      />
      <path
        d="M 156 96 Q 172 110 166 138 Q 148 112 122 98 Q 142 88 156 96 Z"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth - 1)}
        fillOpacity={p.fillOpacity * 0.85}
      />
      <path
        d="M 52 124 Q 26 132 22 156 Q 48 142 62 128 Z"
        fill={p.stroke}
        fillOpacity={p.fillOpacity * 0.45}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth * 0.35)}
      />
      <path
        d="M 148 124 Q 174 132 178 156 Q 152 142 138 128 Z"
        fill={p.stroke}
        fillOpacity={p.fillOpacity * 0.45}
        stroke={p.stroke}
        strokeWidth={Math.max(1.5, p.strokeWidth * 0.35)}
      />
      <ellipse
        cx="100"
        cy="118"
        rx="38"
        ry="26"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth * 0.55}
        fillOpacity={Math.min(1, p.fillOpacity + 0.08)}
      />
      {highlightFill && animateMorph ? (
        <ellipse
          cx={100}
          cy={112}
          rx={40}
          ry={30}
          fill={highlightFill}
          opacity={0.78}
          style={{ mixBlendMode: "soft-light" }}
        />
      ) : null}
      </g>
    </StrokeSoftWrap>
  );

  const wrapped = (
    <MuscleWrap on={muscle} ox={100} oy={124} scale={1.1}>
      {body}
    </MuscleWrap>
  );

  return (
    <g>
      {animateMorph ? (
        <motion.g
          initial={false}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          {wrapped}
        </motion.g>
      ) : (
        wrapped
      )}
      <BeastCuteFace
        cx={100}
        cy={114}
        eyeSpacing={17}
        eyeR={5.8}
        show={animateMorph}
        irisGradientUrl={irisGradientUrl}
        cheekGradientUrl={cheekGradientUrl}
        mouthStroke={mouthStroke}
      />
    </g>
  );
}

/** 阿特拉斯：岩石多边形组合 */
export function AtlasGeometry({
  p,
  goal,
  animateMorph,
  highlightFill,
  irisGradientUrl,
  cheekGradientUrl,
  mouthStroke,
}: BeastGeometryProps) {
  const muscle = animateMorph && goal === "muscle_gain";
  const core = (
    <StrokeSoftWrap p={p}>
      <g>
      <polygon
        points="100,52 132,68 124,96 76,96 68,68"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity}
      />
      <polygon
        points="54,102 92,88 104,124 66,138"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity * 0.92}
      />
      <polygon
        points="146,102 108,88 96,124 134,138"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity * 0.92}
      />
      <polygon
        points="100,118 138,132 128,182 72,182 62,132"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity}
      />
      <polygon
        points="78,188 100,172 122,188 114,222 86,222"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity}
      />
      {highlightFill && animateMorph ? (
        <ellipse
          cx={100}
          cy={104}
          rx={34}
          ry={30}
          fill={highlightFill}
          opacity={0.72}
          style={{ mixBlendMode: "soft-light" }}
        />
      ) : null}
      </g>
    </StrokeSoftWrap>
  );

  const wrapped = (
    <MuscleWrap on={muscle} ox={100} oy={150} scale={1.08}>
      {core}
    </MuscleWrap>
  );

  return (
    <g>
      {animateMorph ? (
        <motion.g
          initial={false}
          animate={{ rotate: [0, -1.8, 1.8, 0] }}
          transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "100px 132px", transformBox: "fill-box" }}
        >
          {wrapped}
        </motion.g>
      ) : (
        wrapped
      )}
      <BeastCuteFace
        cx={100}
        cy={92}
        eyeSpacing={15}
        eyeR={5.2}
        show={animateMorph}
        irisGradientUrl={irisGradientUrl}
        cheekGradientUrl={cheekGradientUrl}
        mouthStroke={mouthStroke}
      />
    </g>
  );
}

/** 露娜：水滴身 + S 尾 */
export function LunaGeometry({
  p,
  goal,
  animateMorph,
  highlightFill,
  irisGradientUrl,
  cheekGradientUrl,
  mouthStroke,
}: BeastGeometryProps) {
  const muscle = animateMorph && goal === "muscle_gain";
  const drop = (
    <path
      d="M 100 48 C 132 48 148 88 148 124 C 148 164 126 188 100 196 C 74 188 52 164 52 124 C 52 88 68 48 100 48 Z"
      fill={p.fill}
      stroke={p.stroke}
      strokeWidth={p.strokeWidth}
      fillOpacity={p.fillOpacity}
    />
  );

  const tail = (
    <path
      d="M 118 178 C 138 182 154 196 162 214 C 172 236 156 228 146 218 C 134 206 122 198 108 192"
      fill="none"
      stroke={p.stroke}
      strokeWidth={Math.max(3, p.strokeWidth + 1)}
      strokeLinecap="round"
      opacity={p.fillOpacity}
    />
  );

  const inner = (
    <StrokeSoftWrap p={p}>
      <g>
      {drop}
      {highlightFill && animateMorph ? (
        <ellipse
          cx={100}
          cy={88}
          rx={30}
          ry={42}
          fill={highlightFill}
          opacity={0.72}
          style={{ mixBlendMode: "soft-light" }}
        />
      ) : null}
      <ellipse
        cx="100"
        cy="118"
        rx="22"
        ry="34"
        fill={p.stroke}
        fillOpacity={0.22}
        stroke="none"
      />
      {animateMorph ? (
        <motion.g
          initial={false}
          animate={{ rotate: [0, 7, -6, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "112px 184px", transformBox: "fill-box" }}
        >
          {tail}
        </motion.g>
      ) : (
        tail
      )}
      </g>
    </StrokeSoftWrap>
  );

  return (
    <g>
      <MuscleWrap on={muscle} ox={100} oy={118} scale={1.08}>
        {inner}
      </MuscleWrap>
      <BeastCuteFace
        cx={100}
        cy={102}
        eyeSpacing={14}
        eyeR={5.4}
        show={animateMorph}
        irisGradientUrl={irisGradientUrl}
        cheekGradientUrl={cheekGradientUrl}
        mouthStroke={mouthStroke}
      />
    </g>
  );
}

/** 派罗：梯形背甲 + 尖刺 */
export function PyroGeometry({
  p,
  goal,
  animateMorph,
  highlightFill,
  irisGradientUrl,
  cheekGradientUrl,
  mouthStroke,
}: BeastGeometryProps) {
  const muscle = animateMorph && goal === "muscle_gain";
  const spikes = animateMorph ? (
    <motion.g
      initial={false}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: "100px 72px", transformBox: "fill-box" }}
    >
      <polygon
        points="100,56 92,84 108,84"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.2, p.strokeWidth * 0.4)}
      />
      <polygon
        points="76,68 70,92 88,88"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.2, p.strokeWidth * 0.4)}
      />
      <polygon
        points="124,68 130,92 112,88"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.2, p.strokeWidth * 0.4)}
      />
    </motion.g>
  ) : (
    <g>
      <polygon
        points="100,56 92,84 108,84"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.2, p.strokeWidth * 0.4)}
      />
      <polygon
        points="76,68 70,92 88,88"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.2, p.strokeWidth * 0.4)}
      />
      <polygon
        points="124,68 130,92 112,88"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={Math.max(1.2, p.strokeWidth * 0.4)}
      />
    </g>
  );

  const core = (
    <g>
      <polygon
        points="62,96 138,72 148,118 52,124"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity}
      />
      <rect
        x="76"
        y="118"
        width="48"
        height="72"
        rx="10"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity * 0.95}
      />
      <polygon
        points="88,190 100,172 112,190 106,216 94,216"
        fill={p.fill}
        stroke={p.stroke}
        strokeWidth={p.strokeWidth}
        fillOpacity={p.fillOpacity}
      />
    </g>
  );

  return (
    <g>
      <StrokeSoftWrap p={p}>
        <g>
          {spikes}
          <MuscleWrap on={muscle} ox={100} oy={142} scale={1.1}>
            {core}
          </MuscleWrap>
          {highlightFill && animateMorph ? (
            <ellipse
              cx={100}
              cy={144}
              rx={28}
              ry={44}
              fill={highlightFill}
              opacity={0.74}
              style={{ mixBlendMode: "soft-light" }}
            />
          ) : null}
        </g>
      </StrokeSoftWrap>
      <BeastCuteFace
        cx={100}
        cy={142}
        eyeSpacing={13}
        eyeR={5}
        show={animateMorph}
        irisGradientUrl={irisGradientUrl}
        cheekGradientUrl={cheekGradientUrl}
        mouthStroke={mouthStroke}
      />
    </g>
  );
}
