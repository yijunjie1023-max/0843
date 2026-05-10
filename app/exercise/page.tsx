import { Suspense } from "react";
import { ExercisePageClient } from "./ExercisePageClient";

function ExerciseFallback() {
  return (
    <div className="space-y-6">
      <div className="h-24 animate-pulse rounded-3xl bg-duo-surface" />
      <div className="h-12 animate-pulse rounded-xl bg-duo-surface" />
      <div className="h-64 animate-pulse rounded-3xl bg-duo-surface" />
    </div>
  );
}

export default function ExercisePage() {
  return (
    <Suspense fallback={<ExerciseFallback />}>
      <ExercisePageClient />
    </Suspense>
  );
}
