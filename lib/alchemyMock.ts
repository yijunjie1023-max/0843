/** 首页数据 · 前端模拟 */

export const userMetrics = {
  /** 演示用基准 BMI；页面可做轻微浮动以模拟「实时」 */
  currentBmi: 22.6,
};

/** BMI → 幻兽舞台主体宽度百分比（约 18.5–30 映射到可视区间） */
export function bmiToPhantomWidthPercent(bmi: number): number {
  const clamped = Math.min(30, Math.max(17, bmi));
  const t = (clamped - 17) / (30 - 17);
  return Math.round(38 + t * 34);
}
