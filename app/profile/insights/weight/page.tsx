"use client";

import Link from "next/link";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { useBeastProfile } from "@/components/BeastProfileProvider";
import { WEIGHT_LAST_12_MONTHS_KG } from "@/lib/profileInsightsMock";

const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export default function InsightWeightPage() {
  const { profile } = useBeastProfile();
  const current =
    profile?.weightKg ?? WEIGHT_LAST_12_MONTHS_KG[WEIGHT_LAST_12_MONTHS_KG.length - 1]!;
  const series = WEIGHT_LAST_12_MONTHS_KG;
  const w = 640;
  const h = 260;
  const pad = { x: 48, y: 28 };
  const min = Math.min(...series);
  const max = Math.max(...series);

  const pts = series.map((v, i) => {
    const x = pad.x + (i / (series.length - 1)) * (w - pad.x * 2);
    const t = max === min ? 0.5 : (v - min) / (max - min);
    const y = pad.y + (1 - t) * (h - pad.y * 2);
    return { x, y, v };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <DuoButton variant="ghost">← 返回我的</DuoButton>
        </Link>
      </div>

      <SectionCard title="体重数据 · 12 个月">
        <p className="text-sm font-bold text-duo-muted">
          当前体重{" "}
          <span className="text-2xl font-black text-duo-ink">
            {current.toFixed(2)} 公斤
          </span>
        </p>
        <div className="mt-6 w-full overflow-x-auto">
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
            <polyline
              fill="none"
              stroke="#58CC02"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            />
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={5} fill="#58CC02" />
                <text
                  x={p.x}
                  y={h - 8}
                  textAnchor="middle"
                  fill="#9b9bb8"
                  fontSize={11}
                  fontWeight={700}
                >
                  {MONTHS[i]}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-duo-muted">
          折线演示近一年波动；真实数据可与可穿戴设备或手动记录同步。
        </p>
      </SectionCard>
    </div>
  );
}
