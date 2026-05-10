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
  type BeastProfile,
  PROFILE_STORAGE_KEY,
  parseProfile,
} from "@/lib/beastProfile";
import {
  safeLocalStorageGet,
  safeLocalStorageRemove,
  safeLocalStorageSet,
} from "@/lib/safeStorage";

type Ctx = {
  ready: boolean;
  profile: BeastProfile | null;
  setProfile: (p: BeastProfile) => boolean;
  saveProfile: (p: BeastProfile) => boolean;
  clearProfile: () => void;
};

const BeastProfileContext = createContext<Ctx | null>(null);

export function BeastProfileProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfileState] = useState<BeastProfile | null>(null);

  useEffect(() => {
    const raw = safeLocalStorageGet(PROFILE_STORAGE_KEY);
    setProfileState(parseProfile(raw));
    setReady(true);
  }, []);

  const saveProfile = useCallback((p: BeastProfile): boolean => {
    const ok = safeLocalStorageSet(PROFILE_STORAGE_KEY, JSON.stringify(p));
    if (!ok) return false;
    setProfileState(p);
    return true;
  }, []);

  const clearProfile = useCallback(() => {
    setProfileState(null);
    safeLocalStorageRemove(PROFILE_STORAGE_KEY);
  }, []);

  const value = useMemo(
    (): Ctx => ({
      ready,
      profile,
      setProfile: saveProfile,
      saveProfile,
      clearProfile,
    }),
    [ready, profile, saveProfile, clearProfile],
  );

  return (
    <BeastProfileContext.Provider value={value}>
      {children}
    </BeastProfileContext.Provider>
  );
}

export function useBeastProfile(): Ctx {
  const ctx = useContext(BeastProfileContext);
  if (!ctx) throw new Error("useBeastProfile must be used within BeastProfileProvider");
  return ctx;
}
