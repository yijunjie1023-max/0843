"use client";

import Link from "next/link";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { WEEKLY_MINUTES_BY_DAY, weeklyTotalMinutes } from "@/lib/profileInsightsMock";

const DAYS = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default function InsightWeekPage() {
  const total = weeklyTotalMinutes();
  const max = Math.max(1, ...WEEKLY_MINUTES_BY_DAY);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/profile">
          <DuoButton variant="ghost">← 返回我的</DuoButton>
        </Link>
      </div>

      <SectionCard title="我的数据 · 本周">
        <p className="text-sm font-bold text-duo-muted">
          本周运动总时长{" "}
          <span className="text-duo-ink">{total} 分钟</span>
        </p>
        <div className="mt-6 overflow-x-auto">
          <svg
            width={Math.min(560, DAYS.length * 72)}
            height={220}
            viewBox={`0 0 ${DAYS.length * 72} 220`}
            className="text-duo-blue"
          >
            {WEEKLY_MINUTES_BY_DAY.map((v, i) => {
              const bw = 36;
              const bx = 20 + i * 72;
              const bh = (v / max) * 140;
              const by = 160 - bh;
              return (
                <g key={i}>
                  <rect
                    x={bx}
                    y={by}
                    width={bw}
                    height={Math.max(v > 0 ? 4 : 0, bh)}
                    rx={8}
                    fill="currentColor"
                    opacity={v > 0 ? 0.9 : 0.12}
                  />
                  <text
                    x={bx + bw / 2}
                    y={185}
                    textAnchor="middle"
                    fill="#9b9bb8"
                    fontSize={14}
                    fontWeight={700}
                  >
                    {DAYS[i]?.replace("周", "")}
                  </text>
                  <text
                    x={bx + bw / 2}
                    y={205}
                    textAnchor="middle"
                    fill="#e8e8ef"
                    fontSize={13}
                    fontWeight={800}
                  >
                    {v}′
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-duo-muted">
          柱状图对应周一至周日每分钟贡献；零打卡日仍会占位提示 Rest Day。
        </p>
      </SectionCard>
    </div>
  );
}
