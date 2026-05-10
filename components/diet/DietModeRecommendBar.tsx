"use client";

import type { FitMode } from "@/lib/fitMode";

type Props = {
  mode: FitMode;
};

export function DietModeRecommendBar({ mode }: Props) {
  if (mode === "finals") {
    return (
      <section className="rounded-3xl border-2 border-indigo-500/35 bg-gradient-to-br from-indigo-950/80 via-duo-surface to-duo-bg p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-indigo-500/25 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-indigo-200 ring-1 ring-indigo-400/35">
            期末周 · 补脑抗压
          </span>
          <span className="text-[11px] font-bold text-duo-muted">
            蓝莓 · 坚果 · 黑巧克力 · 酸奶
          </span>
        </div>
        <p className="mt-3 text-sm font-bold leading-relaxed text-duo-ink">
          复习辛苦了，来点<span className="text-indigo-300">低 GI 零食</span>保持清醒。
        </p>
      </section>
    );
  }

  if (mode === "holiday") {
    return (
      <section className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-950/70 via-duo-surface to-duo-bg p-4 md:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-amber-100 ring-1 ring-amber-400/40">
            假期 · 聚餐预警
          </span>
          <span className="text-[11px] font-bold text-duo-muted">
            大碗汤 · 蔬菜先行 · 放慢进食节奏
          </span>
        </div>
        <p className="mt-3 text-sm font-bold leading-relaxed text-duo-ink">
          今天家里聚餐？记得先喝杯<span className="text-amber-200">温水</span>
          增加饱腹感。
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border-2 border-duo-blue/25 bg-duo-surface p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-duo-blue/15 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-duo-blue ring-1 ring-duo-blue/25">
          日常 · 节律优先
        </span>
        <span className="text-[11px] font-bold text-duo-muted">
          定时三餐 · 足量蛋白 · 备考周适度咖啡因
        </span>
      </div>
      <p className="mt-3 text-sm font-bold leading-relaxed text-duo-muted">
        根据当前学期节奏：优先稳住血糖曲线，复习日晚上可加一小份复合碳水助眠（演示）。
      </p>
    </section>
  );
}
