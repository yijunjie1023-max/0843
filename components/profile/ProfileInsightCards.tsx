"use client";

import Link from "next/link";
import { useId } from "react";
import { SectionCard } from "@/components/SectionCard";
import {
  TOTAL_MINUTES_HISTORY,
  WEEKLY_MINUTES_BY_DAY,
  WEIGHT_LAST_12_MONTHS_KG,
  weeklyTotalMinutes,
} from "@/lib/profileInsightsMock";

const DAYS = ["一", "二", "三", "四", "五", "六", "日"];

function MiniWeekBars({ values }: { values: number[] }) {
  const max = Math.max(1, ...values);
  const w = 140;
  const h = 56;
  const barW = (w - 16) / values.length - 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="text-duo-blue">
      {values.map((v, i) => {
        const bh = (v / max) * (h - 14);
        const x = 8 + i * ((w - 16) / values.length) + 1;
        const y = h - 6 - bh;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={Math.max(v > 0 ? 2 : 0, bh)}
            rx={3}
            fill="currentColor"
            opacity={v > 0 ? 0.85 : 0.15}
          />
        );
      })}
    </svg>
  );
}

function MiniWeightLine({ series }: { series: number[] }) {
  const w = 160;
  const h = 56;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pad = 6;
  const pts = series.map((v, i) => {
    const x = pad + (i / (series.length - 1)) * (w - pad * 2);
    const t = max === min ? 0.5 : (v - min) / (max - min);
    const y = pad + (1 - t) * (h - pad * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <polyline
        fill="none"
        stroke="#58CC02"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts.join(" ")}
      />
      {series.map((v, i) => {
        const x = pad + (i / (series.length - 1)) * (w - pad * 2);
        const t = max === min ? 0.5 : (v - min) / (max - min);
        const y = pad + (1 - t) * (h - pad * 2);
        return <circle key={i} cx={x} cy={y} r={3} fill="#58CC02" />;
      })}
    </svg>
  );
}

function MiniAreaPeak({ series }: { series: number[] }) {
  const gradId = useId().replace(/:/g, "");
  const w = 168;
  const h = 60;
  const min = Math.min(...series);
  const max = Math.max(...series);
  const pad = 4;
  const path: string[] = [];
  series.forEach((v, i) => {
    const x = pad + (i / (series.length - 1)) * (w - pad * 2);
    const t = max === min ? 0.5 : (v - min) / (max - min);
    const y = pad + (1 - t) * (h - pad * 2);
    path.push(`${i === 0 ? "M" : "L"} ${x} ${y}`);
  });
  const lastX = pad + (w - pad * 2);
  const bottomY = h - pad;
  path.push(`L ${lastX} ${bottomY} L ${pad} ${bottomY} Z`);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc800" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#ffc800" stopOpacity={0.05} />
        </linearGradient>
      </defs>
      <path d={path.join(" ")} fill={`url(#${gradId})`} stroke="#ffc800" strokeWidth={2} />
    </svg>
  );
}

export function ProfileInsightCards({
  weightKg,
}: {
  weightKg: number;
}) {
  const weekTotal = weeklyTotalMinutes();
  const totalLast = TOTAL_MINUTES_HISTORY[TOTAL_MINUTES_HISTORY.length - 1];
  const weightDisplay = weightKg.toFixed(2);

  const cards = [
    {
      href: "/profile/insights/week",
      title: "我的数据",
      subtitle: "本周运动总时长",
      value: `${weekTotal} 分钟`,
      chart: <MiniWeekBars values={WEEKLY_MINUTES_BY_DAY} />,
      footer: `周一至周日分布 · ${DAYS.join(" ")}`,
      border: "border-duo-blue/45",
      bg: "bg-duo-blue/5",
    },
    {
      href: "/profile/insights/weight",
      title: "体重数据",
      subtitle: "当前体重",
      value: `${weightDisplay} 公斤`,
      chart: <MiniWeightLine series={WEIGHT_LAST_12_MONTHS_KG} />,
      footer: "近 12 个月趋势",
      border: "border-duo-green/45",
      bg: "bg-duo-green/5",
    },
    {
      href: "/profile/insights/total",
      title: "总运动数据",
      subtitle: "累计运动分钟",
      value: `${totalLast} 分钟`,
      chart: <MiniAreaPeak series={TOTAL_MINUTES_HISTORY} />,
      footer: "历史波动与峰值",
      border: "border-duo-warning/45",
      bg: "bg-duo-warning/10",
    },
  ] as const;

  return (
    <SectionCard title="深度数据 · Insight">
      <div className="grid gap-3 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={[
              "group flex flex-col rounded-2xl border-2 p-4 transition",
              c.border,
              c.bg,
              "hover:brightness-110 active:scale-[0.99]",
            ].join(" ")}
          >
            <p className="text-xs font-extrabold uppercase tracking-wide text-duo-muted">
              {c.title}
            </p>
            <p className="mt-1 text-sm font-bold text-duo-ink">{c.subtitle}</p>
            <p className="mt-2 text-xl font-black text-duo-ink">{c.value}</p>
            <div className="mt-3 flex flex-1 items-end justify-center">{c.chart}</div>
            <p className="mt-2 text-center text-[10px] font-bold text-duo-muted group-hover:text-duo-ink">
              {c.footer} · 点击查看详情
            </p>
          </Link>
        ))}
      </div>
    </SectionCard>
  );
}
