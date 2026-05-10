"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FitModeBundle } from "@/lib/fitMode";
import {
  type BeastGrowthPersist,
  GROWTH_STORAGE_KEY,
  computeTodayEnergy,
  defaultGrowth,
  parseGrowth,
  rollGrowthForNewDay,
} from "@/lib/beastGrowth";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safeStorage";

export function useBeastGrowth(
  bundle: FitModeBundle,
  taskCompleted: boolean[],
) {
  const [growth, setGrowth] = useState<BeastGrowthPersist | null>(null);

  useEffect(() => {
    const rolled = rollGrowthForNewDay(parseGrowth(safeLocalStorageGet(GROWTH_STORAGE_KEY)));
    setGrowth(rolled);
    safeLocalStorageSet(GROWTH_STORAGE_KEY, JSON.stringify(rolled));
  }, []);

  const todayGoal = bundle.data.todayGoal;

  const energyPct = useMemo(() => {
    const g = rollGrowthForNewDay(growth ?? defaultGrowth());
    return computeTodayEnergy({
      minutesDone: todayGoal.minutesDone,
      minutesTarget: todayGoal.minutesTarget,
      taskCompleted,
      awakenExtra: g.extraEnergy,
    });
  }, [
    growth,
    todayGoal.minutesDone,
    todayGoal.minutesTarget,
    taskCompleted,
  ]);

  const rolledGrowth = rollGrowthForNewDay(growth ?? defaultGrowth());

  const persist = useCallback((updater: (prev: BeastGrowthPersist) => BeastGrowthPersist) => {
    setGrowth((prev) => {
      const base = rollGrowthForNewDay(prev ?? defaultGrowth());
      const next = rollGrowthForNewDay(updater(base));
      safeLocalStorageSet(GROWTH_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const oneClickAwaken = useCallback(() => {
    persist((prev) => {
      if (prev.awakenUsed) return prev;
      return {
        ...prev,
        awakenUsed: true,
        extraEnergy: Math.min(100, prev.extraEnergy + 22),
      };
    });
  }, [persist]);

  const claimAttribute = useCallback(() => {
    if (energyPct < 100) return;
    persist((prev) => {
      if (prev.bonusClaimed) return prev;
      return {
        ...prev,
        bonusClaimed: "attribute",
        attributeLv: prev.attributeLv + 1,
      };
    });
  }, [energyPct, persist]);

  const claimAge = useCallback(() => {
    if (energyPct < 100) return;
    persist((prev) => {
      if (prev.bonusClaimed) return prev;
      return {
        ...prev,
        bonusClaimed: "age",
        ageLv: prev.ageLv + 1,
      };
    });
  }, [energyPct, persist]);

  const awakenAvailable = !rolledGrowth.awakenUsed;

  return {
    growth: rolledGrowth,
    energyPct,
    oneClickAwaken,
    claimAttribute,
    claimAge,
    awakenAvailable,
  };
}
