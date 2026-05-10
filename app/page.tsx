"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlchemyModal } from "@/components/alchemy/AlchemyModal";
import { AlchemyWorkoutTasks } from "@/components/alchemy/AlchemyWorkoutTasks";
import { HomeModeCompact } from "@/components/alchemy/HomeModeCompact";
import { BeastInteractModal } from "@/components/beasts/BeastInteractModal";
import { PhantomStage } from "@/components/alchemy/PhantomStage";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { StatChip } from "@/components/StatChip";
import { useBeastProfile } from "@/components/BeastProfileProvider";
import { useFitMode } from "@/components/FitModeProvider";
import { useWorkoutActivation } from "@/components/WorkoutActivationProvider";
import { computeBmi } from "@/lib/beastProfile";
import { formatTemplate } from "@/lib/fitMode";
import {
  fiveSlotTitle,
  getActivationOffer,
  getChallengeFiveGenerated,
  getCoreFiveGenerated,
} from "@/lib/workoutTaskPools";
import { useBeastGrowth } from "@/hooks/useBeastGrowth";
import { beast, userProfile } from "@/lib/mockData";

export default function HomePage() {
  const router = useRouter();
  const { mode, bundle } = useFitMode();
  const { profile } = useBeastProfile();
  const { todayGoal, quickActions, beast: beastProgress } = bundle.data;
  const pct = Math.round((todayGoal.minutesDone / todayGoal.minutesTarget) * 100);
  const xpPct = Math.round((userProfile.xp / userProfile.xpToNext) * 100);

  const bmi = profile ? computeBmi(profile.heightCm, profile.weightKg) : 22;

  const dateKey = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const [rerollCount, setRerollCount] = useState(0);
  const activationOffer = useMemo(
    () =>
      profile?.goal
        ? getActivationOffer(profile.goal, dateKey, rerollCount)
        : Array(5).fill("—"),
    [profile?.goal, dateKey, rerollCount],
  );

  const [coreRerollCount, setCoreRerollCount] = useState(0);
  const [challengeRerollCount, setChallengeRerollCount] = useState(0);

  const coreGenerated = useMemo((): [string, string, string, string] => {
    if (!profile?.goal) return ["—", "—", "—", "—"];
    return getCoreFiveGenerated(profile.goal, dateKey, coreRerollCount);
  }, [profile?.goal, dateKey, coreRerollCount]);

  const challengeGenerated = useMemo((): [string, string, string, string] => {
    if (!profile?.goal) return ["—", "—", "—", "—"];
    return getChallengeFiveGenerated(profile.goal, dateKey, challengeRerollCount);
  }, [profile?.goal, dateKey, challengeRerollCount]);

  const { activationDone, setActivationDone } = useWorkoutActivation();
  const [coreCustom, setCoreCustom] = useState("");
  const [coreDone, setCoreDone] = useState<boolean[]>(() => Array(5).fill(false));
  const [challengeCustom, setChallengeCustom] = useState("");
  const [challengeDone, setChallengeDone] = useState<boolean[]>(() =>
    Array(5).fill(false),
  );

  const [alchemyCoins, setAlchemyCoins] = useState(30);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCtx, setModalCtx] = useState<
    | null
    | { type: "core"; index: number }
    | { type: "challenge"; index: number }
    | { type: "activation"; index: number }
  >(null);
  const [beastInteractOpen, setBeastInteractOpen] = useState(false);

  const activationDoneCount = useMemo(
    () => activationDone.filter(Boolean).length,
    [activationDone],
  );
  const activationRequired = mode === "finals" ? 1 : 3;

  const growthTasks = useMemo(() => {
    const actMet = activationDoneCount >= activationRequired;
    const coreMet = coreDone.filter(Boolean).length >= 2;
    const challengeMet = challengeDone.some(Boolean);
    return [actMet, coreMet, challengeMet];
  }, [
    activationDoneCount,
    activationRequired,
    coreDone,
    challengeDone,
  ]);

  const {
    growth: growthState,
    energyPct,
    oneClickAwaken,
    claimAttribute,
    claimAge,
    awakenAvailable,
  } = useBeastGrowth(bundle, growthTasks);

  const workoutDailyKeyRef = useRef<string | null>(null);
  useEffect(() => {
    const key = `${mode}|${profile?.goal ?? ""}|${dateKey}`;
    if (workoutDailyKeyRef.current === key) return;
    workoutDailyKeyRef.current = key;

    setCoreCustom("");
    setCoreDone(Array(5).fill(false));
    setChallengeCustom("");
    setChallengeDone(Array(5).fill(false));
    setRerollCount(0);
    setCoreRerollCount(0);
    setChallengeRerollCount(0);
    setAlchemyCoins(30);
    setModalOpen(false);
    setModalCtx(null);
    // 激活进度由 WorkoutActivationProvider + localStorage 按日/模式/诉求持久化，不在此每次进入首页时清空
  }, [mode, profile?.goal, dateKey]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalCtx(null);
  }, []);

  const modalRewardBase = useCallback(() => {
    const m =
      mode === "finals" ? 0.88 : mode === "holiday" ? 0.98 : 1;
    return m;
  }, [mode]);

  const handleModalSolo = useCallback(() => {
    if (!modalCtx) return;
    const base =
      modalCtx.type === "challenge" ? 28 : modalCtx.type === "core" ? 22 : 14;
    const solo = Math.max(8, Math.round(base * modalRewardBase() * 0.42));
    if (modalCtx.type === "core") {
      const idx = modalCtx.index;
      setCoreDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    } else if (modalCtx.type === "challenge") {
      const idx = modalCtx.index;
      setChallengeDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    } else {
      const idx = modalCtx.index;
      setActivationDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    }
    setAlchemyCoins((c) => c + solo);
    closeModal();
  }, [closeModal, modalCtx, modalRewardBase, setActivationDone]);

  const handleModalCoop = useCallback(() => {
    if (!modalCtx) return;
    const base =
      modalCtx.type === "challenge" ? 28 : modalCtx.type === "core" ? 22 : 14;
    const coop = Math.max(12, Math.round(base * modalRewardBase() * 0.42 * 1.5));
    if (modalCtx.type === "core") {
      const idx = modalCtx.index;
      setCoreDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    } else if (modalCtx.type === "challenge") {
      const idx = modalCtx.index;
      setChallengeDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    } else {
      const idx = modalCtx.index;
      setActivationDone((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    }
    setAlchemyCoins((c) => c + coop);
    closeModal();
  }, [closeModal, modalCtx, modalRewardBase, setActivationDone]);

  const scrollToCurrentQuest = useCallback(() => {
    const actMet = activationDoneCount >= activationRequired;
    const coreMet = coreDone.filter(Boolean).length >= 2;
    const challengeMet = challengeDone.some(Boolean);
    if (!actMet) {
      document.getElementById("workout-activation")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    if (!coreMet) {
      const idx = coreDone.findIndex((d) => !d);
      document
        .getElementById(`workout-task-core-${idx >= 0 ? idx : 0}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      return;
    }
    if (!challengeMet) {
      document.getElementById("workout-challenge")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      return;
    }
    document.getElementById("alchemy-workout-tasks")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [
    activationDoneCount,
    activationRequired,
    coreDone,
    challengeDone,
  ]);

  const modalLabel =
    modalCtx?.type === "core"
      ? fiveSlotTitle(coreGenerated, coreCustom, modalCtx.index)
      : modalCtx?.type === "challenge"
        ? fiveSlotTitle(challengeGenerated, challengeCustom, modalCtx.index)
        : modalCtx?.type === "activation"
          ? (activationOffer[modalCtx.index] ?? "激活任务")
          : "";

  const onRerollActivation = useCallback(() => {
    const cost = 6;
    if (alchemyCoins < cost || !profile?.goal) return;
    setAlchemyCoins((c) => c - cost);
    setRerollCount((r) => r + 1);
    setActivationDone(Array(5).fill(false));
  }, [alchemyCoins, profile?.goal, setActivationDone]);

  const onRequestCompleteActivation = useCallback((index: number) => {
    if (activationDone[index]) return;
    setModalCtx({ type: "activation", index });
    setModalOpen(true);
  }, [activationDone]);

  const onRerollCore = useCallback(() => {
    const cost = 6;
    if (alchemyCoins < cost || !profile?.goal) return;
    setAlchemyCoins((c) => c - cost);
    setCoreRerollCount((r) => r + 1);
    setCoreDone(Array(5).fill(false));
    setCoreCustom("");
  }, [alchemyCoins, profile?.goal]);

  const onRerollChallenge = useCallback(() => {
    const cost = 6;
    if (alchemyCoins < cost || !profile?.goal) return;
    setAlchemyCoins((c) => c - cost);
    setChallengeRerollCount((r) => r + 1);
    setChallengeDone(Array(5).fill(false));
    setChallengeCustom("");
  }, [alchemyCoins, profile?.goal]);

  if (!profile?.onboardingComplete) {
    return (
      <div className="rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-8 text-center">
        <p className="font-bold text-duo-muted">正在加载契约档案…</p>
        <p className="mt-2 text-xs text-duo-muted">
          若长时间停留在此，请前往{" "}
          <a href="/onboarding" className="font-bold text-duo-blue underline">
            /onboarding
          </a>{" "}
          完成觉醒，或检查浏览器是否禁用本地存储。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-36">
      <div className="relative flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 pr-2">
          <p className="text-[11px] font-black uppercase tracking-[0.12em] text-duo-muted">
            Home
          </p>
          <h1 className="mt-0.5 text-3xl font-black tracking-tight text-duo-ink md:text-4xl">
            首页
          </h1>
          <p className="mt-1 text-sm text-duo-muted">
            任务驱动幻兽进化 · 当前状态一目了然
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
          <DuoButton
            type="button"
            variant="ghost"
            className="relative z-20 cursor-pointer px-4 py-2.5 text-sm"
            onClick={() => router.push("/onboarding/edit")}
          >
            编辑契约
          </DuoButton>
          <HomeModeCompact className="scale-[0.96] origin-top-right" />
        </div>
      </div>

      <PhantomStage
        mode={mode}
        bmi={bmi}
        beastId={profile.beastId}
        goal={profile.goal}
        displayName={profile.nickname}
        stageLabel={beast.stageNames[beast.stage]}
        evolutionPercent={beastProgress.evolutionPercent}
        todayEnergyPct={energyPct}
        attributeLv={growthState.attributeLv}
        ageLv={growthState.ageLv}
        onBeastClick={() => setBeastInteractOpen(true)}
      />

      <BeastInteractModal
        open={beastInteractOpen}
        onClose={() => setBeastInteractOpen(false)}
        nickname={profile.nickname}
        beastId={profile.beastId}
        goal={profile.goal}
        bmi={bmi}
        mode={mode}
        energyPct={energyPct}
        attributeLv={growthState.attributeLv}
        ageLv={growthState.ageLv}
        awakenAvailable={awakenAvailable}
        bonusClaimedLabel={
          growthState.bonusClaimed === "attribute"
            ? "提升属性"
            : growthState.bonusClaimed === "age"
              ? "提升成长龄"
              : null
        }
        onAwaken={oneClickAwaken}
        onClaimAttribute={claimAttribute}
        onClaimAge={claimAge}
      />

      <AlchemyWorkoutTasks
        mode={mode}
        activationRequired={activationRequired}
        alchemyCoins={alchemyCoins}
        activationOffer={activationOffer}
        activationDone={activationDone}
        onRequestCompleteActivation={onRequestCompleteActivation}
        onRerollActivation={onRerollActivation}
        coreGenerated={coreGenerated}
        coreCustom={coreCustom}
        onCoreCustomChange={setCoreCustom}
        coreDone={coreDone}
        onRequestCompleteCore={(i) => {
          if (coreDone[i]) return;
          if (i === 2 && !coreCustom.trim()) return;
          setModalCtx({ type: "core", index: i });
          setModalOpen(true);
        }}
        onRerollCore={onRerollCore}
        challengeGenerated={challengeGenerated}
        challengeCustom={challengeCustom}
        onChallengeCustomChange={setChallengeCustom}
        challengeDone={challengeDone}
        onRequestCompleteChallenge={(i) => {
          if (challengeDone[i]) return;
          if (i === 2 && !challengeCustom.trim()) return;
          setModalCtx({ type: "challenge", index: i });
          setModalOpen(true);
        }}
        onRerollChallenge={onRerollChallenge}
      />

      <AlchemyModal
        open={modalOpen}
        nodeLabel={modalLabel}
        onClose={closeModal}
        onSolo={handleModalSolo}
        onCoop={handleModalCoop}
      />

      {bundle.features.showFinalsMicroBreak && (
        <SectionCard title="1 分钟找回状态 · 期末专用">
          <p className="mb-4 text-sm text-duo-muted">
            闭眼深呼吸 + 肩颈绕环，降低烦躁感（演示入口）。
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <DuoButton href="/exercise?tab=stretch" variant="green" className="flex-1">
              去放松 8 分钟
            </DuoButton>
            <DuoButton href="/diet" variant="blue" className="flex-1">
              顺便喝口水
            </DuoButton>
          </div>
        </SectionCard>
      )}

      <SectionCard title={bundle.home.goalTitle}>
        <div className="mb-4 grid gap-3 sm:grid-cols-3">
          <StatChip
            icon="⏱️"
            label="时长"
            value={`${todayGoal.minutesDone}/${todayGoal.minutesTarget} 分`}
          />
          <StatChip
            accent="blue"
            icon="🔥"
            label="消耗"
            value={`${todayGoal.calories}/${todayGoal.caloriesTarget} kcal`}
          />
          <StatChip icon="👟" label="步数" value={`${todayGoal.steps.toLocaleString()} 步`} />
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-duo-bg ring-2 ring-duo-blue/30">
          <div
            className="h-full rounded-full bg-duo-blue"
            style={{ width: `${Math.min(pct, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-center text-xs font-bold text-duo-muted">
          {formatTemplate(bundle.home.goalFooter, { pct: Math.min(pct, 100) })}
        </p>
      </SectionCard>

      <SectionCard title={bundle.home.quickTitle}>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickActions.map((a, i) => (
            <DuoButton
              key={a.id}
              href={a.href}
              variant={i % 2 === 0 ? "green" : "blue"}
              className="h-full min-h-[96px] w-full flex-col gap-1 py-4 text-center"
            >
              <span className="text-3xl leading-none" aria-hidden>
                {a.icon}
              </span>
              <span className="text-sm leading-tight">{a.label}</span>
            </DuoButton>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={bundle.home.xpTitle}
        action={<span className="text-xs font-bold text-duo-muted">💎 {userProfile.gems}</span>}
      >
        <p className="mb-3 text-xs font-bold text-duo-muted">{bundle.home.xpFooterHint}</p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-duo-muted">
              当前 XP{" "}
              <span className="font-black text-duo-ink">{userProfile.xp}</span>
              <span className="text-duo-muted"> / {userProfile.xpToNext}</span>
            </p>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-duo-bg">
              <div
                className="h-full rounded-full bg-duo-warning"
                style={{ width: `${xpPct}%` }}
              />
            </div>
          </div>
          <DuoButton href="/exercise#alchemy-rings" variant="green" className="w-full min-w-[140px] md:w-auto">
            {bundle.home.xpCta}
          </DuoButton>
        </div>
      </SectionCard>

      <div
        className="fixed left-1/2 z-[35] w-[min(92vw,28rem)] -translate-x-1/2 px-4"
        style={{ bottom: "calc(5.25rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <DuoButton
          variant="green"
          className="w-full py-4 text-xl font-black tracking-wide"
          onClick={scrollToCurrentQuest}
        >
          Go!
        </DuoButton>
      </div>
    </div>
  );
}
