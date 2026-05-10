"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DietToday, FitMode } from "@/lib/fitMode";
import type { DietFoodItem, DietMealSlot, MealSlotId } from "@/lib/dietDay";
import { newFoodItemId } from "@/lib/dietDay";

type PersistedShape = {
  mealSlots: DietMealSlot[];
  waterMl: number;
};

function dietStorageKey(mode: FitMode) {
  return `gamefit-diet-day-v2-${mode}`;
}

function readPersisted(mode: FitMode): Partial<PersistedShape> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(dietStorageKey(mode));
    if (!raw) return null;
    return JSON.parse(raw) as PersistedShape;
  } catch {
    return null;
  }
}

function writePersisted(mode: FitMode, data: PersistedShape) {
  localStorage.setItem(dietStorageKey(mode), JSON.stringify(data));
}

function mergePersisted(base: DietToday, persisted: Partial<PersistedShape> | null): DietToday {
  if (!persisted?.mealSlots || persisted.mealSlots.length !== base.mealSlots.length) {
    return base;
  }
  for (let i = 0; i < base.mealSlots.length; i++) {
    if (persisted.mealSlots[i]?.id !== base.mealSlots[i].id) return base;
  }
  return {
    ...base,
    mealSlots: persisted.mealSlots.map((s, i) => ({
      ...s,
      label: base.mealSlots[i].label,
    })),
    waterMl: typeof persisted.waterMl === "number" ? persisted.waterMl : base.waterMl,
  };
}

type DietDayContextValue = {
  dietToday: DietToday;
  mode: FitMode;
  setWaterMl: (n: number) => void;
  addWater: (delta: number) => void;
  setSlotSkipped: (slotId: MealSlotId, skipped: boolean) => void;
  addFoodItem: (slotId: MealSlotId, draft: Omit<DietFoodItem, "id"> & { id?: string }) => void;
  updateFoodItem: (
    slotId: MealSlotId,
    itemId: string,
    patch: Partial<Omit<DietFoodItem, "id">>,
  ) => void;
  removeFoodItem: (slotId: MealSlotId, itemId: string) => void;
  resetDayFromSeed: () => void;
};

const DietDayContext = createContext<DietDayContextValue | null>(null);

type ProviderProps = {
  mode: FitMode;
  seedDietToday: DietToday;
  children: ReactNode;
};

export function DietDayProvider({ mode, seedDietToday, children }: ProviderProps) {
  const [dietToday, setDietToday] = useState<DietToday>(() =>
    mergePersisted(seedDietToday, readPersisted(mode)),
  );

  useEffect(() => {
    setDietToday(mergePersisted(seedDietToday, readPersisted(mode)));
  }, [mode, seedDietToday]);

  useEffect(() => {
    writePersisted(mode, {
      mealSlots: dietToday.mealSlots,
      waterMl: dietToday.waterMl,
    });
  }, [mode, dietToday.mealSlots, dietToday.waterMl]);

  const setWaterMl = useCallback((n: number) => {
    setDietToday((d) => ({ ...d, waterMl: Math.max(0, Math.round(n)) }));
  }, []);

  const addWater = useCallback((delta: number) => {
    setDietToday((d) => ({
      ...d,
      waterMl: Math.max(0, d.waterMl + delta),
    }));
  }, []);

  const setSlotSkipped = useCallback((slotId: MealSlotId, skipped: boolean) => {
    setDietToday((d) => ({
      ...d,
      mealSlots: d.mealSlots.map((s) =>
        s.id === slotId ? { ...s, skipped, items: skipped ? [] : s.items } : s,
      ),
    }));
  }, []);

  const addFoodItem = useCallback(
    (slotId: MealSlotId, draft: Omit<DietFoodItem, "id"> & { id?: string }) => {
      const id = draft.id ?? newFoodItemId();
      const item: DietFoodItem = {
        id,
        name: draft.name,
        grams: draft.grams,
        kcal: draft.kcal,
        proteinG: draft.proteinG,
        carbsG: draft.carbsG,
        fatG: draft.fatG,
        fiberG: draft.fiberG,
      };
      setDietToday((d) => ({
        ...d,
        mealSlots: d.mealSlots.map((s) =>
          s.id === slotId ? { ...s, skipped: false, items: [...s.items, item] } : s,
        ),
      }));
    },
    [],
  );

  const updateFoodItem = useCallback(
    (slotId: MealSlotId, itemId: string, patch: Partial<Omit<DietFoodItem, "id">>) => {
      setDietToday((d) => ({
        ...d,
        mealSlots: d.mealSlots.map((s) =>
          s.id === slotId
            ? {
                ...s,
                items: s.items.map((it) =>
                  it.id === itemId ? { ...it, ...patch } : it,
                ),
              }
            : s,
        ),
      }));
    },
    [],
  );

  const removeFoodItem = useCallback((slotId: MealSlotId, itemId: string) => {
    setDietToday((d) => ({
      ...d,
      mealSlots: d.mealSlots.map((s) =>
        s.id === slotId
          ? { ...s, items: s.items.filter((it) => it.id !== itemId) }
          : s,
      ),
    }));
  }, []);

  const resetDayFromSeed = useCallback(() => {
    localStorage.removeItem(dietStorageKey(mode));
    setDietToday(seedDietToday);
  }, [mode, seedDietToday]);

  const value = useMemo(
    (): DietDayContextValue => ({
      dietToday,
      mode,
      setWaterMl,
      addWater,
      setSlotSkipped,
      addFoodItem,
      updateFoodItem,
      removeFoodItem,
      resetDayFromSeed,
    }),
    [
      dietToday,
      mode,
      setWaterMl,
      addWater,
      setSlotSkipped,
      addFoodItem,
      updateFoodItem,
      removeFoodItem,
      resetDayFromSeed,
    ],
  );

  return <DietDayContext.Provider value={value}>{children}</DietDayContext.Provider>;
}

export function useDietDay(): DietDayContextValue {
  const ctx = useContext(DietDayContext);
  if (!ctx) throw new Error("useDietDay must be used within DietDayProvider");
  return ctx;
}
