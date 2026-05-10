/** 三大营养素供能比 vs 参考均衡区间的偏离度 → 0–100；纤维达标小幅加成 */

type MacroGrams = {
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  fiberGoalG: number;
};

const IDEAL_PROTEIN_KCAL_FRAC = 0.22;
const IDEAL_CARB_KCAL_FRAC = 0.52;
const IDEAL_FAT_KCAL_FRAC = 0.26;

export function macroBalanceScore(macros: MacroGrams): number {
  const kP = macros.proteinG * 4;
  const kC = macros.carbsG * 4;
  const kF = macros.fatG * 9;
  const t = kP + kC + kF;
  if (t < 50) return 55;

  const p = kP / t;
  const c = kC / t;
  const f = kF / t;
  const deviation =
    Math.abs(p - IDEAL_PROTEIN_KCAL_FRAC) +
    Math.abs(c - IDEAL_CARB_KCAL_FRAC) +
    Math.abs(f - IDEAL_FAT_KCAL_FRAC);

  let score = 100 - deviation * 88;
  const fiberRatio =
    macros.fiberGoalG > 0
      ? Math.min(1, macros.fiberG / macros.fiberGoalG)
      : 0;
  score += fiberRatio * 12;
  return Math.round(Math.max(0, Math.min(100, score)));
}
