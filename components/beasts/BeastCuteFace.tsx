"use client";

import { motion } from "framer-motion";

type FaceProps = {
  cx: number;
  cy: number;
  eyeSpacing: number;
  eyeR: number;
  show: boolean;
  /** 虹膜径向渐变 url（参考插画的通透大眼） */
  irisGradientUrl: string;
  /** 腮红径向渐变 url */
  cheekGradientUrl: string;
  /** 嘴线颜色（体色深色描边，避免纯黑） */
  mouthStroke: string;
};

/** 多邻国式大眼 + 渐变腮红 + 微笑；眨眼节奏偏可爱 */
export function BeastCuteFace({
  cx,
  cy,
  eyeSpacing,
  eyeR,
  show,
  irisGradientUrl,
  cheekGradientUrl,
  mouthStroke,
}: FaceProps) {
  if (!show) return null;

  const cheekOff = eyeSpacing + 6;
  const cheekRy = eyeR * 0.95;

  return (
    <g pointerEvents="none" aria-hidden>
      <ellipse cx={cx - cheekOff} cy={cy + eyeR + 7} rx={eyeR * 1.35} ry={cheekRy} fill={cheekGradientUrl} />
      <ellipse cx={cx + cheekOff} cy={cy + eyeR + 7} rx={eyeR * 1.35} ry={cheekRy} fill={cheekGradientUrl} />

      <motion.g
        initial={false}
        animate={{ scaleY: [1, 1, 0.14, 1, 1] }}
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.42, 0.46, 0.5, 1],
        }}
        style={{
          transformOrigin: `${cx}px ${cy}px`,
          transformBox: "fill-box",
        }}
      >
        <circle
          cx={cx - eyeSpacing}
          cy={cy}
          r={eyeR}
          fill={irisGradientUrl}
          stroke="#fefce8"
          strokeOpacity={0.92}
          strokeWidth={Math.max(1.4, eyeR * 0.2)}
        />
        <circle
          cx={cx + eyeSpacing}
          cy={cy}
          r={eyeR}
          fill={irisGradientUrl}
          stroke="#fefce8"
          strokeOpacity={0.92}
          strokeWidth={Math.max(1.4, eyeR * 0.2)}
        />
        <ellipse
          cx={cx - eyeSpacing - eyeR * 0.15}
          cy={cy - eyeR * 0.35}
          rx={eyeR * 0.42}
          ry={eyeR * 0.34}
          fill="#ffffff"
          opacity={0.97}
        />
        <ellipse
          cx={cx + eyeSpacing - eyeR * 0.12}
          cy={cy - eyeR * 0.33}
          rx={eyeR * 0.38}
          ry={eyeR * 0.3}
          fill="#ffffff"
          opacity={0.97}
        />
        <circle cx={cx - eyeSpacing + eyeR * 0.35} cy={cy + eyeR * 0.25} r={eyeR * 0.16} fill="#0f172a" opacity={0.55} />
        <circle cx={cx + eyeSpacing + eyeR * 0.35} cy={cy + eyeR * 0.25} r={eyeR * 0.16} fill="#0f172a" opacity={0.55} />
      </motion.g>

      <motion.g
        initial={false}
        animate={{ rotate: [0, 2.5, -2, 0] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          transformOrigin: `${cx}px ${cy + eyeR + 18}px`,
          transformBox: "fill-box",
        }}
      >
        <path
          d={`M ${cx - eyeSpacing - 4} ${cy + eyeR + 12} Q ${cx} ${cy + eyeR + 24} ${cx + eyeSpacing + 4} ${cy + eyeR + 12}`}
          fill="none"
          stroke={mouthStroke}
          strokeOpacity={0.92}
          strokeWidth={2.35}
          strokeLinecap="round"
        />
      </motion.g>
    </g>
  );
}
