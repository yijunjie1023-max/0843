"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PhantomBeastCanvas } from "@/components/beasts/PhantomBeastCanvas";
import { DuoButton } from "@/components/DuoButton";
import { SectionCard } from "@/components/SectionCard";
import { useBeastProfile } from "@/components/BeastProfileProvider";
import { useFitMode } from "@/components/FitModeProvider";
import {
  BEAST_CATALOG,
  GOAL_OPTIONS,
  PROFILE_GENDER_LABELS,
  PROFILE_GENDER_OPTIONS,
  type BeastId,
  type BeastProfile,
  type FitnessGoal,
  type ProfileGender,
  computeBmi,
} from "@/lib/beastProfile";

type Step = "survey" | "summon" | "covenant" | "naming";

export function OnboardingWizard({ editMode = false }: { editMode?: boolean }) {
  const router = useRouter();
  const { profile: existingProfile, saveProfile, clearProfile } = useBeastProfile();
  const { mode } = useFitMode();

  const [step, setStep] = useState<Step>("survey");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(65);
  const [gender, setGender] = useState<ProfileGender>("unspecified");
  const [goal, setGoal] = useState<FitnessGoal>("fat_loss");
  const [beastId, setBeastId] = useState<BeastId>("leon");
  const [nickname, setNickname] = useState("");
  const [transition, setTransition] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const hydratedRef = useRef(false);
  useEffect(() => {
    if (!editMode || !existingProfile?.onboardingComplete || hydratedRef.current) return;
    hydratedRef.current = true;
    setHeightCm(existingProfile.heightCm);
    setWeightKg(existingProfile.weightKg);
    setGoal(existingProfile.goal);
    setBeastId(existingProfile.beastId);
    setNickname(existingProfile.nickname);
    setGender(existingProfile.gender ?? "unspecified");
  }, [editMode, existingProfile]);

  const bmi = useMemo(() => computeBmi(heightCm, weightKg), [heightCm, weightKg]);

  const canSurvey =
    heightCm >= 130 &&
    heightCm <= 230 &&
    weightKg >= 35 &&
    weightKg <= 180;

  const finish = () => {
    const trimmed = nickname.trim() || "未命名幻兽";
    const profile: BeastProfile = {
      ...(editMode && existingProfile
        ? {
            waistCm: existingProfile.waistCm,
            chestCm: existingProfile.chestCm,
            armCm: existingProfile.armCm,
            hipCm: existingProfile.hipCm,
          }
        : {}),
      heightCm,
      weightKg,
      goal,
      beastId,
      nickname: trimmed,
      onboardingComplete: true,
      gender,
    };
    setSaveError(null);
    setTransition(true);
    window.setTimeout(() => {
      const ok = saveProfile(profile);
      if (!ok) {
        setTransition(false);
        setSaveError(
          "无法保存契约到本地存储（常见于无痕模式或存储已满）。请换用普通窗口或清理站点数据后重试。",
        );
        return;
      }
      router.replace("/");
    }, 950);
  };

  return (
    <div className="relative space-y-6">
      <header className="text-center">
        <p className="text-xs font-black uppercase tracking-[0.15em] text-duo-muted">
          {editMode ? "Revise" : "Awakening"}
        </p>
        <h1 className="mt-1 text-3xl font-black text-duo-ink">
          {editMode ? "契约修订" : "觉醒仪式"}
        </h1>
        <p className="mt-2 text-sm text-duo-muted">
          {editMode
            ? "可更新身高体重、性别、运动诉求、幻兽立绘与昵称；保存后返回首页。"
            : "基础信息 → 幻兽召唤 → 契约预览 → 命名签订"}
        </p>
      </header>

      {editMode && (
        <div className="flex justify-center">
          <DuoButton variant="ghost" href="/" className="text-sm">
            取消 · 返回首页
          </DuoButton>
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="button"
          className="text-xs font-bold text-red-300/90 underline decoration-red-500/45 underline-offset-[3px] hover:text-red-200"
          onClick={() => {
            if (
              !window.confirm(
                "确定清除本地契约？已填写的数据将被删除，并从头开始觉醒问卷。此操作不可撤销。",
              )
            ) {
              return;
            }
            clearProfile();
            window.location.assign("/onboarding");
          }}
        >
          清除契约 · 重新开始
        </button>
      </div>

      {step === "survey" && (
        <SectionCard title="① 数据调查">
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-bold text-duo-muted">身高（cm）</span>
              <input
                type="number"
                min={130}
                max={230}
                value={heightCm}
                onChange={(e) => setHeightCm(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-4 py-3 font-bold text-duo-ink outline-none focus:border-duo-green"
              />
            </label>
            <label className="block">
              <span className="text-xs font-bold text-duo-muted">体重（kg）</span>
              <input
                type="number"
                min={35}
                max={180}
                step={0.1}
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-4 py-3 font-bold text-duo-ink outline-none focus:border-duo-green"
              />
            </label>
            <div>
              <p className="mb-2 text-xs font-bold text-duo-muted">性别（仅保存在本机）</p>
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="性别">
                {PROFILE_GENDER_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    role="radio"
                    aria-checked={gender === g}
                    onClick={() => setGender(g)}
                    className={[
                      "rounded-xl border-2 px-4 py-2.5 text-sm font-black transition-colors",
                      gender === g
                        ? "border-duo-green bg-duo-green/15 text-duo-green ring-2 ring-duo-green/25"
                        : "border-duo-surface2 bg-duo-bg text-duo-ink hover:border-duo-blue/40",
                    ].join(" ")}
                  >
                    {PROFILE_GENDER_LABELS[g]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-xs font-bold text-duo-muted">运动诉求</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {GOAL_OPTIONS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGoal(g.id)}
                    className={[
                      "rounded-xl border-2 px-3 py-3 text-left text-sm font-extrabold transition-colors",
                      goal === g.id
                        ? "border-duo-green bg-duo-green/15 text-duo-green"
                        : "border-duo-surface2 bg-duo-bg text-duo-muted hover:border-duo-blue/40",
                    ].join(" ")}
                  >
                    {g.label}
                    <span className="mt-1 block text-[11px] font-bold text-duo-muted">
                      {g.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <p className="text-center text-xs font-bold text-duo-blue">
              当前 BMI（演示）：{bmi.toFixed(1)}
            </p>
            <DuoButton
              variant="green"
              className="w-full"
              disabled={!canSurvey}
              onClick={() => setStep("summon")}
            >
              下一步 · 幻兽召唤
            </DuoButton>
          </div>
        </SectionCard>
      )}

      {step === "summon" && (
        <SectionCard title="② 幻兽召唤 · 立绘选择">
          <p className="mb-4 text-sm text-duo-muted">
            以下为六款官方立绘位图，小卡为剪影预览，点击心仪的一只缔结契约。
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {BEAST_CATALOG.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setBeastId(b.id)}
                className={[
                  "rounded-2xl border-2 p-2 text-left transition-transform active:scale-[0.98]",
                  beastId === b.id
                    ? "border-duo-green bg-duo-green/10 ring-2 ring-duo-green/30"
                    : "border-duo-surface2 bg-duo-bg hover:border-duo-blue/35",
                ].join(" ")}
              >
                <div className="flex h-[132px] items-center justify-center overflow-hidden">
                  <div className="origin-center scale-[0.58]">
                    <PhantomBeastCanvas
                      beastId={b.id}
                      goal={goal}
                      bmi={22}
                      mode="normal"
                      silhouette
                    />
                  </div>
                </div>
                <p className="mt-2 px-1 text-xs font-black text-duo-ink">
                  {b.nameZh}{" "}
                  <span className="text-duo-muted">{b.nameEn}</span>
                </p>
                <p className="px-1 pb-1 text-[10px] text-duo-muted">{b.oneLiner}</p>
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <DuoButton variant="ghost" className="flex-1" onClick={() => setStep("survey")}>
              上一步
            </DuoButton>
            <DuoButton variant="green" className="flex-1" onClick={() => setStep("covenant")}>
              下一步 · 契约预览
            </DuoButton>
          </div>
        </SectionCard>
      )}

      {step === "covenant" && (
        <SectionCard title="③ 契约达成 · BMI 初始形态">
          <p className="mb-3 text-sm text-duo-muted">
            按公式{" "}
            <span className="font-mono text-duo-blue">
              scaleX = 1 + (BMI − 22) × 0.05
            </span>{" "}
            实时映射宽度；诉求驱动描边、透明度与滤镜。
          </p>
          <div className="rounded-2xl border-2 border-duo-surface2 bg-duo-bg py-4">
            <PhantomBeastCanvas beastId={beastId} goal={goal} bmi={bmi} mode={mode} />
          </div>
          <p className="mt-3 text-center text-sm font-bold text-duo-ink">
            {BEAST_CATALOG.find((x) => x.id === beastId)?.nameZh} · BMI {bmi.toFixed(1)}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <DuoButton variant="ghost" className="flex-1" onClick={() => setStep("summon")}>
              上一步
            </DuoButton>
            <DuoButton variant="green" className="flex-1" onClick={() => setStep("naming")}>
              下一步 · 命名仪式
            </DuoButton>
          </div>
        </SectionCard>
      )}

      {step === "naming" && (
        <SectionCard title="④ 命名仪式">
          <label className="block">
            <span className="text-xs font-bold text-duo-muted">幻兽昵称</span>
            <input
              type="text"
              maxLength={16}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="例如：焰尾小叶"
              className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-4 py-3 font-bold text-duo-ink outline-none focus:border-duo-green"
            />
          </label>
          <p className="mt-3 text-xs text-duo-muted">
            {editMode
              ? "保存后将返回首页。若在「我的」中填写过腰围等围度，会继续保留。"
              : "签订契约后将进入首页。你可随时在浏览器本地清除站点数据以重新觉醒（演示）。"}
          </p>
          {saveError && (
            <p className="mt-3 rounded-xl border-2 border-red-500/50 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200">
              {saveError}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <DuoButton variant="ghost" className="flex-1" onClick={() => setStep("covenant")}>
              上一步
            </DuoButton>
            <DuoButton variant="green" className="flex-1" onClick={finish}>
              {editMode ? "保存修改 · 返回首页" : "签订契约 · 进入首页"}
            </DuoButton>
          </div>
        </SectionCard>
      )}

      {transition && (
        <div
          className="awaken-overlay pointer-events-none fixed inset-0 z-[200]"
          style={{
            background:
              "linear-gradient(135deg, rgba(88,204,2,0.96) 0%, rgba(28,176,246,0.92) 48%, rgba(26,26,46,1) 100%)",
          }}
          aria-hidden
        />
      )}
    </div>
  );
}
