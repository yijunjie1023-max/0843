"use client";

import {
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { useBeastProfile } from "@/components/BeastProfileProvider";
import { useFitMode } from "@/components/FitModeProvider";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safeStorage";

type Value = {
  activationDone: boolean[];
  setActivationDone: Dispatch<SetStateAction<boolean[]>>;
};

const WorkoutActivationContext = createContext<Value | null>(null);

function parseStoredActivation(raw: string | null): boolean[] | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (
      Array.isArray(parsed) &&
      parsed.length === 5 &&
      parsed.every((x) => typeof x === "boolean")
    ) {
      return parsed as boolean[];
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function WorkoutActivationProvider({ children }: { children: ReactNode }) {
  const { mode } = useFitMode();
  const { profile } = useBeastProfile();
  const dateKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const storageKey = useMemo(() => {
    if (!profile?.goal) return null;
    return `gamefit-activation-v1|${dateKey}|${mode}|${profile.goal}`;
  }, [profile?.goal, dateKey, mode]);

  const [activationDone, setActivationDone] = useState<boolean[]>(() =>
    Array(5).fill(false),
  );

  const storageKeyAppliedRef = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (!storageKey) return;
    if (storageKeyAppliedRef.current === storageKey) return;
    storageKeyAppliedRef.current = storageKey;

    const stored = parseStoredActivation(safeLocalStorageGet(storageKey));
    setActivationDone(stored ?? Array(5).fill(false));
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    if (storageKeyAppliedRef.current !== storageKey) return;
    safeLocalStorageSet(storageKey, JSON.stringify(activationDone));
  }, [storageKey, activationDone]);

  const value = useMemo(
    () => ({ activationDone, setActivationDone }),
    [activationDone],
  );

  return (
    <WorkoutActivationContext.Provider value={value}>
      {children}
    </WorkoutActivationContext.Provider>
  );
}

export function useWorkoutActivation() {
  const ctx = useContext(WorkoutActivationContext);
  if (!ctx) {
    throw new Error("useWorkoutActivation must be used within WorkoutActivationProvider");
  }
  return ctx;
}
