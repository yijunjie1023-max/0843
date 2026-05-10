import type { DayMacroTotals } from "./dietDay";

export function mealAnalysisLines(totals: DayMacroTotals): string[] {
  const t = totals.kcal;
  if (t < 1) {
    return ["本餐暂无记录。跳过时不会计入全天摄入；恢复用餐后可添加菜品。"];
  }

  const pk = totals.proteinG * 4;
  const ck = totals.carbsG * 4;
  const fk = totals.fatG * 9;
  const denom = pk + ck + fk || 1;
  const p = pk / denom;
  const c = ck / denom;
  const f = fk / denom;

  const lines: string[] = [];

  if (p < 0.14) {
    lines.push("蛋白质供能偏低：下一餐可搭配豆制品、鱼禽蛋或希腊酸奶。");
  }
  if (f > 0.42) {
    lines.push("脂肪占比较高：可减少油炸、蘸料与糕点，增加清炒蔬菜。");
  }
  if (c > 0.62) {
    lines.push("碳水比例偏高：可与优质蛋白、蔬菜同食，帮助平稳血糖。");
  }
  if (totals.fiberG < 4) {
    lines.push("膳食纤维不足：可加一份深色蔬菜或少量粗粮。");
  }
  if (t > 900) {
    lines.push("单次热量较高：若是聚餐可放慢进食速度，优先蔬菜与高蛋白。");
  }

  if (lines.length === 0) {
    lines.push("本餐三大营养素比例相对均衡，可根据训练日与饱腹感微调份量。");
  }

  return lines;
}
