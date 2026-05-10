import type { DietFoodItem, DietMealSlot, MealSlotId } from "./dietDay";
import { defaultMealSlotLabels, MEAL_SLOT_ORDER } from "./dietDay";

function makeSlot(
  id: MealSlotId,
  skipped: boolean,
  items: DietFoodItem[],
): DietMealSlot {
  const labels = defaultMealSlotLabels();
  return { id, label: labels[id], skipped, items };
}

/** 日常模式 · 与旧版三餐总摄入约 1955 kcal 对齐 */
export const NORMAL_MEAL_SLOTS: DietMealSlot[] = [
  makeSlot("breakfast", false, [
    {
      id: "n-b1",
      name: "燕麦牛奶",
      grams: 260,
      kcal: 195,
      proteinG: 9,
      carbsG: 28,
      fatG: 5.5,
      fiberG: 3,
    },
    {
      id: "n-b2",
      name: "水煮蛋",
      grams: 55,
      kcal: 78,
      proteinG: 6.5,
      carbsG: 0.6,
      fatG: 5.4,
      fiberG: 0,
    },
    {
      id: "n-b3",
      name: "小番茄",
      grams: 80,
      kcal: 47,
      proteinG: 1,
      carbsG: 10,
      fatG: 0.5,
      fiberG: 1.2,
    },
  ]),
  makeSlot("morning_snack", false, [
    {
      id: "n-ms1",
      name: "希腊酸奶杯",
      grams: 120,
      kcal: 80,
      proteinG: 8,
      carbsG: 9,
      fatG: 2,
      fiberG: 0,
    },
  ]),
  makeSlot("lunch", false, [
    {
      id: "n-l1",
      name: "米饭",
      grams: 180,
      kcal: 208,
      proteinG: 4.5,
      carbsG: 46,
      fatG: 0.5,
      fiberG: 0.5,
    },
    {
      id: "n-l2",
      name: "鱼香肉丝",
      grams: 200,
      kcal: 320,
      proteinG: 22,
      carbsG: 18,
      fatG: 18,
      fiberG: 2,
    },
    {
      id: "n-l3",
      name: "炒菠菜",
      grams: 200,
      kcal: 72,
      proteinG: 6,
      carbsG: 8,
      fatG: 3,
      fiberG: 4,
    },
  ]),
  makeSlot("afternoon_snack", false, [
    {
      id: "n-as1",
      name: "香蕉",
      grams: 110,
      kcal: 95,
      proteinG: 1.2,
      carbsG: 24,
      fatG: 0.3,
      fiberG: 2.2,
    },
  ]),
  makeSlot("dinner", false, [
    {
      id: "n-d1",
      name: "紫菜蛋花汤",
      grams: 250,
      kcal: 88,
      proteinG: 6,
      carbsG: 6,
      fatG: 4,
      fiberG: 0.5,
    },
    {
      id: "n-d2",
      name: "米饭",
      grams: 220,
      kcal: 257,
      proteinG: 5,
      carbsG: 56,
      fatG: 0.6,
      fiberG: 0.6,
    },
    {
      id: "n-d3",
      name: "清蒸鸡腿肉",
      grams: 200,
      kcal: 380,
      proteinG: 42,
      carbsG: 0,
      fatG: 22,
      fiberG: 0,
    },
    {
      id: "n-d4",
      name: "凉拌黄瓜",
      grams: 150,
      kcal: 45,
      proteinG: 2,
      carbsG: 8,
      fatG: 1,
      fiberG: 1.5,
    },
    {
      id: "n-d5",
      name: "无糖酸奶",
      grams: 130,
      kcal: 110,
      proteinG: 10,
      carbsG: 12,
      fatG: 3,
      fiberG: 0,
    },
  ]),
  makeSlot("supper", false, []),
];

/** 期末周 */
export const FINALS_MEAL_SLOTS: DietMealSlot[] = [
  makeSlot("breakfast", false, [
    {
      id: "f-b1",
      name: "三明治",
      grams: 180,
      kcal: 290,
      proteinG: 16,
      carbsG: 32,
      fatG: 11,
      fiberG: 2,
    },
    {
      id: "f-b2",
      name: "豆浆",
      grams: 300,
      kcal: 90,
      proteinG: 6,
      carbsG: 9,
      fatG: 3,
      fiberG: 1,
    },
  ]),
  makeSlot("morning_snack", false, [
    {
      id: "f-ms1",
      name: "美式咖啡",
      grams: 350,
      kcal: 12,
      proteinG: 0.5,
      carbsG: 2,
      fatG: 0,
      fiberG: 0,
    },
  ]),
  makeSlot("lunch", false, [
    {
      id: "f-l1",
      name: "轻食鸡胸沙拉",
      grams: 380,
      kcal: 380,
      proteinG: 38,
      carbsG: 28,
      fatG: 14,
      fiberG: 6,
    },
    {
      id: "f-l2",
      name: "荞麦面底",
      grams: 160,
      kcal: 140,
      proteinG: 5,
      carbsG: 28,
      fatG: 1,
      fiberG: 2,
    },
  ]),
  makeSlot("afternoon_snack", false, [
    {
      id: "f-as1",
      name: "坚果小包",
      grams: 25,
      kcal: 148,
      proteinG: 4,
      carbsG: 5,
      fatG: 13,
      fiberG: 2,
    },
  ]),
  makeSlot("dinner", false, []),
  makeSlot("supper", false, []),
];

/** 假期 · 聚餐场景 */
export const HOLIDAY_MEAL_SLOTS: DietMealSlot[] = [
  makeSlot("breakfast", false, [
    {
      id: "h-b1",
      name: "全麦吐司鸡蛋",
      grams: 220,
      kcal: 320,
      proteinG: 18,
      carbsG: 28,
      fatG: 14,
      fiberG: 4,
    },
    {
      id: "h-b2",
      name: "牛奶",
      grams: 240,
      kcal: 110,
      proteinG: 6,
      carbsG: 9,
      fatG: 6,
      fiberG: 0,
    },
    {
      id: "h-b3",
      name: "草莓",
      grams: 100,
      kcal: 35,
      proteinG: 0.7,
      carbsG: 8,
      fatG: 0.4,
      fiberG: 2,
    },
  ]),
  makeSlot("morning_snack", false, [
    {
      id: "h-ms1",
      name: "核桃仁",
      grams: 20,
      kcal: 132,
      proteinG: 3,
      carbsG: 2,
      fatG: 13,
      fiberG: 1.5,
    },
  ]),
  makeSlot("lunch", false, [
    {
      id: "h-l1",
      name: "米饭",
      grams: 200,
      kcal: 232,
      proteinG: 5,
      carbsG: 51,
      fatG: 0.5,
      fiberG: 0.6,
    },
    {
      id: "h-l2",
      name: "清蒸鲈鱼",
      grams: 220,
      kcal: 260,
      proteinG: 42,
      carbsG: 2,
      fatG: 9,
      fiberG: 0,
    },
    {
      id: "h-l3",
      name: "蒜蓉西兰花",
      grams: 220,
      kcal: 128,
      proteinG: 8,
      carbsG: 14,
      fatG: 6,
      fiberG: 6,
    },
  ]),
  makeSlot("afternoon_snack", false, [
    {
      id: "h-as1",
      name: "橙子",
      grams: 200,
      kcal: 94,
      proteinG: 1.8,
      carbsG: 22,
      fatG: 0.2,
      fiberG: 4,
    },
  ]),
  makeSlot("dinner", false, [
    {
      id: "h-d1",
      name: "火锅牛肉卷",
      grams: 180,
      kcal: 380,
      proteinG: 32,
      carbsG: 4,
      fatG: 26,
      fiberG: 0,
    },
    {
      id: "h-d2",
      name: "蔬菜拼盘",
      grams: 260,
      kcal: 120,
      proteinG: 6,
      carbsG: 18,
      fatG: 4,
      fiberG: 8,
    },
    {
      id: "h-d3",
      name: "蘸料香油碟",
      grams: 40,
      kcal: 180,
      proteinG: 0.5,
      carbsG: 4,
      fatG: 18,
      fiberG: 0,
    },
    {
      id: "h-d4",
      name: "红糖糍粑",
      grams: 120,
      kcal: 280,
      proteinG: 3,
      carbsG: 52,
      fatG: 7,
      fiberG: 1,
    },
  ]),
  makeSlot("supper", false, [
    {
      id: "h-s1",
      name: "无糖乌龙茶",
      grams: 500,
      kcal: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0,
      fiberG: 0,
    },
  ]),
];

export function assertSlotOrder(slots: DietMealSlot[]): DietMealSlot[] {
  const byId = new Map(slots.map((s) => [s.id, s]));
  return MEAL_SLOT_ORDER.map((id) => {
    const found = byId.get(id);
    if (found) return found;
    const labels = defaultMealSlotLabels();
    return { id, label: labels[id], skipped: false, items: [] };
  });
}
