/** 单日饮食：餐次时间轴 + 菜品明细（前端演示，可 localStorage 持久化） */

export type MealSlotId =
  | "breakfast"
  | "morning_snack"
  | "lunch"
  | "afternoon_snack"
  | "dinner"
  | "supper";

export type DietFoodItem = {
  id: string;
  name: string;
  grams: number;
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export type DietMealSlot = {
  id: MealSlotId;
  label: string;
  skipped: boolean;
  items: DietFoodItem[];
};

export type MacroGoals = {
  fat: number;
  carbs: number;
  protein: number;
  fiber: number;
};

export const MEAL_SLOT_ORDER: MealSlotId[] = [
  "breakfast",
  "morning_snack",
  "lunch",
  "afternoon_snack",
  "dinner",
  "supper",
];

export function defaultMealSlotLabels(): Record<MealSlotId, string> {
  return {
    breakfast: "早餐",
    morning_snack: "早加餐",
    lunch: "午餐",
    afternoon_snack: "午加餐",
    dinner: "晚餐",
    supper: "宵夜",
  };
}

export function emptyMealSlots(): DietMealSlot[] {
  const labels = defaultMealSlotLabels();
  return MEAL_SLOT_ORDER.map((id) => ({
    id,
    label: labels[id],
    skipped: false,
    items: [],
  }));
}

/** 稳定占位图：无需配置 Next Image 域名 */
export function foodImageUrl(seed: string): string {
  const s = seed.replace(/[^a-zA-Z0-9]/g, "").slice(0, 24) || "food";
  return `https://picsum.photos/seed/${s}/400/300`;
}

export type DayMacroTotals = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
};

export function aggregateActiveMeals(slots: DietMealSlot[]): DayMacroTotals {
  return slots
    .filter((s) => !s.skipped)
    .flatMap((s) => s.items)
    .reduce(
      (acc, it) => ({
        kcal: acc.kcal + it.kcal,
        proteinG: acc.proteinG + it.proteinG,
        carbsG: acc.carbsG + it.carbsG,
        fatG: acc.fatG + it.fatG,
        fiberG: acc.fiberG + it.fiberG,
      }),
      { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 },
    );
}

export function sumMealKcal(slot: DietMealSlot): number {
  if (slot.skipped) return 0;
  return slot.items.reduce((s, it) => s + it.kcal, 0);
}

export function mealMacroTotals(slot: DietMealSlot): DayMacroTotals {
  if (slot.skipped) {
    return { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 };
  }
  return slot.items.reduce(
    (acc, it) => ({
      kcal: acc.kcal + it.kcal,
      proteinG: acc.proteinG + it.proteinG,
      carbsG: acc.carbsG + it.carbsG,
      fatG: acc.fatG + it.fatG,
      fiberG: acc.fiberG + it.fiberG,
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0, fiberG: 0 },
  );
}

export function newFoodItemId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `food-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
