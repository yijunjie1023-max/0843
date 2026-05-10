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
import {
  type FitMode,
  type FitModeBundle,
  STORAGE_KEY,
  getModeBundle,
  parseFitMode,
} from "@/lib/fitMode";
import { safeLocalStorageGet, safeLocalStorageSet } from "@/lib/safeStorage";

type FitModeContextValue = {
  mode: FitMode;
  setMode: (mode: FitMode) => void;
  bundle: FitModeBundle;
};

const FitModeContext = createContext<FitModeContextValue | null>(null);

export function FitModeProvider({ children }: { children: ReactNode }) {
  // 与服务端首屏一致为 normal，避免 Hydration mismatch（勿在 useState 初始化里读 localStorage）
  const [mode, setModeState] = useState<FitMode>("normal");

  useEffect(() => {
    setModeState(parseFitMode(safeLocalStorageGet(STORAGE_KEY)));
  }, []);

  const setMode = useCallback((next: FitMode) => {
    setModeState(next);
    safeLocalStorageSet(STORAGE_KEY, next);
  }, []);

  const bundle = useMemo(() => getModeBundle(mode), [mode]);

  const value = useMemo(
    (): FitModeContextValue => ({ mode, setMode, bundle }),
    [mode, setMode, bundle],
  );

  return (
    <FitModeContext.Provider value={value}>{children}</FitModeContext.Provider>
  );
}

export function useFitMode(): FitModeContextValue {
  const ctx = useContext(FitModeContext);
  if (!ctx) {
    throw new Error("useFitMode must be used within FitModeProvider");
  }
  return ctx;
}
