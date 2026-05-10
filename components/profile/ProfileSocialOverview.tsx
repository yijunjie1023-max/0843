"use client";

import Link from "next/link";
import { SectionCard } from "@/components/SectionCard";
import { RADAR_STATS } from "@/lib/profileInsightsMock";
import { userProfile } from "@/lib/mockData";
import { MiniRadarChart } from "./MiniRadarChart";
import { ProfileDualMirrors } from "./ProfileDualMirrors";

export function ProfileSocialOverview({
  morphKey,
  heightCm,
  weightKg,
  waistCm,
  chestCm,
  onPhotoRefresh,
}: {
  morphKey: number;
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  onPhotoRefresh?: () => void;
}) {
  return (
    <SectionCard title="社交与概况 · Social & Overview">
      <ProfileDualMirrors
        morphKey={morphKey}
        heightCm={heightCm}
        weightKg={weightKg}
        waistCm={waistCm}
        chestCm={chestCm}
        onPhotoRefresh={onPhotoRefresh}
      />

      <div className="mt-5 flex justify-center">
        <Link
          href="/arena"
          className="inline-flex min-w-[200px] items-center justify-center gap-2 rounded-full border-2 border-duo-blue-dark bg-duo-blue px-8 py-3 text-sm font-extrabold text-white shadow-duo transition hover:brightness-105 active:translate-y-px active:shadow-duo-sm"
        >
          <span className="text-xl leading-none" aria-hidden>
            +
          </span>
          添加好友
        </Link>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-center text-xs font-extrabold uppercase tracking-wide text-duo-muted">
          核心概况 · Stats Grid
        </h3>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-6">
          <div className="mx-auto flex w-full max-w-[11rem] flex-col gap-3 lg:mx-0 lg:w-36 lg:flex-shrink-0">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-duo-warning/40 bg-duo-warning/10 px-3 py-4">
              <span className="text-3xl" aria-hidden>
                🔥
              </span>
              <p className="mt-1 text-2xl font-black text-duo-ink">{userProfile.streak}</p>
              <p className="text-xs font-bold text-duo-muted">连击天数</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-duo-green/35 bg-duo-green/10 px-3 py-4">
              <span className="text-3xl" aria-hidden>
                🪙
              </span>
              <p className="mt-1 text-2xl font-black text-duo-ink">{userProfile.gems}</p>
              <p className="text-xs font-bold text-duo-muted">炼金币</p>
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center rounded-2xl border-2 border-duo-surface2 bg-duo-bg/40 px-2 py-3">
            <MiniRadarChart values={RADAR_STATS} size={216} />
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
