"use client";

/** 增强体质：环绕呼吸粒子（8 点分布） */
export function VitalityParticles() {
  const n = 9;
  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden
    >
      <div className="relative h-[240px] w-[240px]">
        {Array.from({ length: n }).map((_, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${i * (360 / n)}deg)`,
            }}
          >
            <span
              className="vitality-pulse-dot block rounded-full bg-duo-green shadow-[0_0_14px_rgba(88,204,2,0.95)]"
              style={{
                width: i % 3 === 0 ? 9 : 6,
                height: i % 3 === 0 ? 9 : 6,
                animationDelay: `${i * 0.16}s`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
