"use client";

import type { ReactNode } from "react";
import { BeastProfileProvider } from "./BeastProfileProvider";
import { FitModeProvider } from "./FitModeProvider";
import { OnboardingGate } from "./OnboardingGate";
import { WorkoutActivationProvider } from "./WorkoutActivationProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <FitModeProvider>
      <BeastProfileProvider>
        <WorkoutActivationProvider>
          <OnboardingGate>{children}</OnboardingGate>
        </WorkoutActivationProvider>
      </BeastProfileProvider>
    </FitModeProvider>
  );
}
