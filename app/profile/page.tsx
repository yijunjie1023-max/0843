"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { useBeastProfile } from "@/components/BeastProfileProvider";
import { useFitMode } from "@/components/FitModeProvider";
import { BodyMetricsUpdateFAB } from "@/components/profile/BodyMetricsUpdateFAB";
import { ProfileInsightCards } from "@/components/profile/ProfileInsightCards";
import { ProfileSocialOverview } from "@/components/profile/ProfileSocialOverview";
import { userProfile } from "@/lib/mockData";

export default function ProfilePage() {
  const router = useRouter();
  const { bundle } = useFitMode();
  const { profile, ready, clearProfile } = useBeastProfile();
  const achievements = bundle.data.achievements;
  const [mirrorMorph, setMirrorMorph] = useState(0);

  const heightCm = profile?.heightCm ?? 170;
  const weightKg = profile?.weightKg ?? 59.45;
  const waistCm = profile?.waistCm;

  return (
    <div className="relative space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl bg-duo-blue/20 text-3xl"
            aria-hidden
          >
            🎓
          </div>
          <div>
            <h1 className="text-2xl font-black text-duo-ink">{userProfile.nickname}</h1>
            <p className="text-sm text-duo-muted">{userProfile.campus}</p>
            <p className="mt-1 text-xs font-bold text-duo-blue">{bundle.profile.campusHint}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-duo-green/20 px-2 py-1 text-duo-green">
                Lv.{userProfile.level}
              </span>
              <span className="rounded-full bg-duo-blue/20 px-2 py-1 text-duo-blue">
                连胜 {userProfile.streak} 天
              </span>
              <span className="rounded-full bg-duo-surface2 px-2 py-1 text-duo-muted">
                💎 {userProfile.gems}
              </span>
              <span className="rounded-full bg-duo-warning/20 px-2 py-1 text-duo-warning">
                {bundle.label}
              </span>
            </div>
          </div>
        </div>
        <DuoButton
          type="button"
          variant="ghost"
          className="relative z-20 cursor-pointer self-start md:self-center"
          disabled={!ready}
          onClick={() => {
            router.push(profile?.onboardingComplete ? "/onboarding/edit" : "/onboarding");
          }}
        >
          编辑资料
        </DuoButton>
      </header>

      {bundle.features.showHolidayContract && (
        <SectionCard title={bundle.profile.contractCardTitle}>
          <p className="mb-4 text-sm leading-relaxed text-duo-muted">
            {bundle.profile.contractCardBody}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <DuoButton variant="green" className="flex-1">
              开启 14 天契约
            </DuoButton>
            <DuoButton variant="blue" className="flex-1">
              邀请好友盯进度
            </DuoButton>
          </div>
        </SectionCard>
      )}

      <ProfileSocialOverview
        morphKey={mirrorMorph}
        heightCm={heightCm}
        weightKg={weightKg}
        waistCm={waistCm}
        chestCm={profile?.chestCm}
        onPhotoRefresh={() => setMirrorMorph((k) => k + 1)}
      />

      <ProfileInsightCards weightKg={weightKg} />

      <SectionCard title={bundle.profile.achievementsTitle}>
        <ul className="grid gap-3 sm:grid-cols-2">
          {achievements.map((a) => (
            <li
              key={a.id}
              className={[
                "rounded-2xl border-2 p-4",
                a.unlocked
                  ? "border-duo-green/50 bg-duo-green/5"
                  : "border-duo-surface2 bg-duo-bg opacity-70",
              ].join(" ")}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl" aria-hidden>
                  {a.icon}
                </span>
                <div>
                  <p className="font-extrabold text-duo-ink">{a.title}</p>
                  <p className="text-sm text-duo-muted">{a.desc}</p>
                  <p className="mt-2 text-xs font-bold text-duo-green">
                    {a.unlocked ? "已解锁" : "未解锁 · 继续加油"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title={bundle.profile.settingsTitle}>
        <ul className="divide-y-2 divide-duo-surface2">
          {bundle.profile.settingsRows.map((label) => (
            <li key={label} className="flex items-center justify-between py-3">
              <span className="font-bold text-duo-ink">{label}</span>
              <span className="text-duo-muted">›</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          <DuoButton variant="blue">{bundle.profile.syncLabel}</DuoButton>
          <DuoButton variant="ghost">退出登录</DuoButton>
          <DuoButton
            type="button"
            variant="ghost"
            disabled={!ready}
            className="border-2 border-red-500/35 text-red-300 hover:bg-red-500/10"
            onClick={() => {
              if (
                !window.confirm(
                  "确定清除本地契约？将删除本浏览器保存的身高体重、性别、运动诉求、幻兽与昵称，并回到觉醒问卷。此操作不可撤销。",
                )
              ) {
                return;
              }
              clearProfile();
              window.location.assign("/onboarding");
            }}
          >
            清除契约
          </DuoButton>
        </div>
      </SectionCard>

      <BodyMetricsUpdateFAB onSubmitted={() => setMirrorMorph((k) => k + 1)} />
    </div>
  );
}
