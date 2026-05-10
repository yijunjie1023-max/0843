/** Profile「深度数据」演示用序列 — 可日后替换为 API */

export const WEEKLY_MINUTES_BY_DAY = [18, 32, 0, 45, 22, 16, 10]; // Mon–Sun

export const WEIGHT_LAST_12_MONTHS_KG = [
  61.2, 60.8, 60.5, 60.1, 59.9, 59.7, 59.6, 59.5, 59.6, 59.5, 59.45, 59.45,
];

export const TOTAL_MINUTES_HISTORY = [
  120, 340, 520, 890, 1100, 980, 1340, 1600, 2100, 2450, 3020, 3600, 4002,
];

/** 雷达六维 0–100 */
export const RADAR_STATS = {
  power: 78,
  endurance: 64,
  agility: 82,
  flexibility: 55,
  speed: 71,
  coordination: 68,
} as const;

export function weeklyTotalMinutes(values: number[] = WEEKLY_MINUTES_BY_DAY): number {
  return values.reduce((a, b) => a + b, 0);
}
