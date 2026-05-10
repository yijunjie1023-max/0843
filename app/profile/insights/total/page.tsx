"use client";

import Link from "next/link";
import { useId } from "react";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { TOTAL_MINUTES_HISTORY } from "@/lib/profileInsightsMock";

export default function InsightTotalPage() {
  const gradId = useId().replace(/:/g, "");
  const series = TOTAL_MINUTES_HISTORY;
  const total = series[series.length - 1]!;
  const w = 640;
  const h = 280;
  const pad = { x: 36, y: 32 };
  const min = Math.min(...series);
  const max = Math.max(...series);

  const path: string[] = [];
  series.forEach((v, i) => {
    const x = pad.x + (i / (series.length - 1)) * (w - pad.x * 2);
    const t = max === min ? 0.5 : (v - min) / (max - min);
    const y = pad.y + (1 - t) * (h - pad.y * 2);
    path.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  });
  const lastX = pad.x + (w - pad.x * 2);
  const bottomY = h - pad.y / 2;
  path.push(`L ${lastX} ${bottomY} L ${pad.x} ${bottomY} Z`);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <DuoButton variant="ghost">← 返回我的</DuoButton>
        </Link>
      </div>

      <SectionCard title="总运动数据 · 历史峰值">
        <p className="text-sm font-bold text-duo-muted">
          累计运动分钟{" "}
          <span className="text-2xl font-black text-duo-ink">{total} 分钟</span>
        </p>
        <div className="mt-6 w-full overflow-x-auto">
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffc800" stopOpacity={0.65} />
                <stop offset="100%" stopColor="#ffc800" stopOpacity={0.06} />
              </linearGradient>
            </defs>
            <path d={path.join(" ")} fill={`url(#${gradId})`} stroke="#ffc800" strokeWidth={2.5} />
          </svg>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-duo-muted">
          面积图突出长期峰值与回落；可与赛季榜、竞技勋章联动展示。
        </p>
      </SectionCard>
    </div>
  );
}
