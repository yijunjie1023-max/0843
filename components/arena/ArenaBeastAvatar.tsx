"use client";

import { PhantomBeastCanvas } from "@/components/beasts/PhantomBeastCanvas";
import type { ArenaBeastSnapshot, FitMode } from "@/lib/fitMode";

type Props = {
  beast: ArenaBeastSnapshot;
  mode: FitMode;
  /** 头像直径（px） */
  size?: number;
  className?: string;
  ringClassName?: string;
};

export function ArenaBeastAvatar({
  beast,
  mode,
  size = 48,
  className = "",
  ringClassName = "ring-2 ring-white shadow-sm ring-slate-200",
}: Props) {
  const scale = (size / 200) * 0.92;

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full bg-duo-bg ${ringClassName} ${className}`}
      style={{ width: size, height: size }}
    >
      <div
        className="pointer-events-none absolute left-1/2 bottom-0"
        style={{
          transform: `translateX(-50%) scale(${scale})`,
          transformOrigin: "center bottom",
          width: 200,
          height: 260,
        }}
      >
        <PhantomBeastCanvas
          beastId={beast.beastId}
          goal={beast.goal}
          bmi={beast.bmi}
          mode={mode}
        />
      </div>
    </div>
  );
}
