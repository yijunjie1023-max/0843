"use client";

const N = 6;

const LABELS = [
  { key: "power", zh: "力量", en: "Power" },
  { key: "endurance", zh: "耐力", en: "Endurance" },
  { key: "agility", zh: "敏捷", en: "Agility" },
  { key: "flexibility", zh: "柔韧", en: "Flexibility" },
  { key: "speed", zh: "速度", en: "Speed" },
  { key: "coordination", zh: "协调", en: "Coordination" },
] as const;

export type RadarSixValues = {
  power: number;
  endurance: number;
  agility: number;
  flexibility: number;
  speed: number;
  coordination: number;
};

function angleAt(index: number): number {
  return -Math.PI / 2 + (index * 2 * Math.PI) / N;
}

export function MiniRadarChart({
  values,
  size = 200,
}: {
  values: RadarSixValues;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size * 0.31;
  const steps = [0.25, 0.5, 0.75, 1];
  const labelR = maxR + 20;

  const map = values;

  const pts = LABELS.map(({ key }, i) => {
    const angle = angleAt(i);
    const v = Math.min(100, Math.max(0, map[key])) / 100;
    const x = cx + Math.cos(angle) * maxR * v;
    const y = cy + Math.sin(angle) * maxR * v;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="text-duo-blue">
        {steps.map((s) => (
          <polygon
            key={s}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
            points={LABELS.map((_, i) => {
              const angle = angleAt(i);
              const x = cx + Math.cos(angle) * maxR * s;
              const y = cy + Math.sin(angle) * maxR * s;
              return `${x},${y}`;
            }).join(" ")}
          />
        ))}
        <polygon
          fill="rgba(28,176,246,0.22)"
          stroke="currentColor"
          strokeWidth={2}
          points={pts}
        />
        {LABELS.map(({ zh, en }, i) => {
          const angle = angleAt(i);
          const lx = cx + Math.cos(angle) * labelR;
          const ly = cy + Math.sin(angle) * labelR;
          return (
            <g key={zh}>
              <text
                x={lx}
                y={ly - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#e8e8ef"
                fontSize={9}
                fontWeight={800}
              >
                {zh}
              </text>
              <text
                x={lx}
                y={ly + 6}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#9b9bb8"
                fontSize={7}
                fontWeight={700}
              >
                {en}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-2 max-w-[18rem] text-center text-[10px] leading-snug text-duo-muted">
        力量·抗阻 · 耐力·有氧 · 敏捷·HIIT · 柔韧·拉伸 · 速度·冲刺配速 · 协调·复合动作节奏
      </p>
    </div>
  );
}
