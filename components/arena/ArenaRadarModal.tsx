"use client";

import type { ExerciseRadarStats, ArenaBeastSnapshot, FitMode } from "@/lib/fitMode";
import { ArenaBeastAvatar } from "@/components/arena/ArenaBeastAvatar";

type Props = {
  open: boolean;
  name: string;
  beast: ArenaBeastSnapshot;
  mode: FitMode;
  radar: ExerciseRadarStats;
  onClose: () => void;
};

const AXES: { key: keyof ExerciseRadarStats; label: string }[] = [
  { key: "duration", label: "时长" },
  { key: "burn", label: "消耗" },
  { key: "consistency", label: "坚持" },
  { key: "strength", label: "力量" },
  { key: "recovery", label: "恢复" },
];

function polygonPoints(stats: ExerciseRadarStats): string {
  const cx = 50;
  const cy = 50;
  const rMax = 36;
  const pts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const ang = (-90 + i * 72) * (Math.PI / 180);
    const v = stats[AXES[i].key] / 100;
    const rr = rMax * Math.max(0.08, Math.min(1, v));
    const x = cx + rr * Math.cos(ang);
    const y = cy + rr * Math.sin(ang);
    pts.push(`${x},${y}`);
  }
  return pts.join(" ");
}

export function ArenaRadarModal({ open, name, beast, mode, radar, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arena-radar-title"
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className="relative z-[61] w-full max-w-sm rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <ArenaBeastAvatar beast={beast} mode={mode} size={56} />
          <div className="min-w-0">
            <h2 id="arena-radar-title" className="truncate text-lg font-black text-duo-ink">
              {name}
            </h2>
            <p className="text-[11px] font-bold text-duo-muted">
              幻兽运动雷达 · 无私信 · 弱社交查看
            </p>
          </div>
        </div>

        <div className="relative mx-auto mt-4 aspect-square w-full max-w-[240px]">
          <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
            {[0.25, 0.5, 0.75, 1].map((scale) => (
              <polygon
                key={scale}
                fill="none"
                stroke="currentColor"
                strokeWidth={0.35}
                className="text-duo-surface2"
                points={polygonPoints({
                  duration: 100 * scale,
                  burn: 100 * scale,
                  consistency: 100 * scale,
                  strength: 100 * scale,
                  recovery: 100 * scale,
                })}
              />
            ))}
            <polygon
              fill="rgba(88,204,2,0.25)"
              stroke="rgb(88,204,2)"
              strokeWidth={1.2}
              strokeLinejoin="round"
              points={polygonPoints(radar)}
            />
            {AXES.map((axis, i) => {
              const ang = (-90 + i * 72) * (Math.PI / 180);
              const lx = 50 + 44 * Math.cos(ang);
              const ly = 50 + 44 * Math.sin(ang);
              return (
                <text
                  key={axis.key}
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-duo-muted font-black"
                  style={{ fontSize: "5px" }}
                >
                  {axis.label}
                </text>
              );
            })}
          </svg>
        </div>

        <ul className="mt-3 grid grid-cols-2 gap-2 text-[11px] font-bold text-duo-ink">
          {AXES.map((axis) => (
            <li key={axis.key} className="rounded-xl bg-duo-bg px-2 py-1.5">
              <span className="text-duo-muted">{axis.label}</span>{" "}
              <span className="tabular-nums">{radar[axis.key]}</span>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 w-full rounded-2xl bg-duo-blue py-3 text-sm font-black text-white"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
