"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { useBeastProfile } from "@/components/BeastProfileProvider";

export function BodyMetricsUpdateFAB({ onSubmitted }: { onSubmitted: () => void }) {
  const { profile, saveProfile } = useBeastProfile();
  const [open, setOpen] = useState(false);
  const [heightCm, setHeightCm] = useState(String(profile?.heightCm ?? 170));
  const [weightKg, setWeightKg] = useState(String(profile?.weightKg ?? 59.45));
  const [waistCm, setWaistCm] = useState(String(profile?.waistCm ?? 72));
  const [chestCm, setChestCm] = useState(String(profile?.chestCm ?? 88));
  const [armCm, setArmCm] = useState(String(profile?.armCm ?? 28));
  const [hipCm, setHipCm] = useState(String(profile?.hipCm ?? 92));

  useEffect(() => {
    if (!open || !profile) return;
    setHeightCm(String(profile.heightCm));
    setWeightKg(String(profile.weightKg));
    setWaistCm(String(profile.waistCm ?? 72));
    setChestCm(String(profile.chestCm ?? 88));
    setArmCm(String(profile.armCm ?? 28));
    setHipCm(String(profile.hipCm ?? 92));
  }, [open, profile]);

  const close = useCallback(() => setOpen(false), []);

  const submit = useCallback(() => {
    const h = Number.parseFloat(heightCm);
    const w = Number.parseFloat(weightKg);
    const waist = Number.parseFloat(waistCm);
    const chest = Number.parseFloat(chestCm);
    const arm = Number.parseFloat(armCm);
    const hip = Number.parseFloat(hipCm);
    if (!profile) {
      onSubmitted();
      setOpen(false);
      return;
    }
    if (
      Number.isFinite(h) &&
      h > 0 &&
      Number.isFinite(w) &&
      w > 0 &&
      Number.isFinite(waist) &&
      Number.isFinite(chest) &&
      Number.isFinite(arm) &&
      Number.isFinite(hip)
    ) {
      saveProfile({
        ...profile,
        heightCm: h,
        weightKg: w,
        waistCm: waist,
        chestCm: chest,
        armCm: arm,
        hipCm: hip,
      });
    }
    onSubmitted();
    setOpen(false);
  }, [
    armCm,
    hipCm,
    chestCm,
    heightCm,
    onSubmitted,
    profile,
    saveProfile,
    waistCm,
    weightKg,
  ]);

  return (
    <>
      <motion.button
        type="button"
        className="fixed bottom-24 right-4 z-[60] flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-duo-green-dark bg-duo-green text-lg font-black text-white shadow-duo md:bottom-28 md:right-8"
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.05 }}
        aria-label="更新身高体重与围度"
        onClick={() => setOpen(true)}
      >
        <span className="text-2xl leading-none">+</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-end justify-center bg-black/55 px-3 pb-safe pt-12 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="body-metrics-title"
              className="mb-20 w-full max-w-md rounded-3xl border-4 border-duo-warning bg-duo-surface p-5 shadow-[0_8px_0_0_rgba(0,0,0,0.35)] sm:mb-0"
              initial={{ y: 40, opacity: 0, scale: 0.92 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <p
                    id="body-metrics-title"
                    className="text-xl font-black text-duo-ink"
                  >
                    更新身体数据
                  </p>
                  <p className="mt-1 text-sm font-bold text-duo-muted">
                    身高 · 体重 · 围度一把抓，便于体态分析与雷达联动（演示）
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl border-2 border-duo-surface2 px-3 py-1 text-sm font-bold text-duo-muted hover:text-duo-ink"
                  onClick={close}
                >
                  ✕
                </button>
              </div>

              {!profile && (
                <p className="mb-3 rounded-2xl border-2 border-duo-blue/40 bg-duo-blue/10 px-3 py-2 text-xs font-bold text-duo-blue">
                  尚未完成幻兽档案 onboarding：仍可预览表单；保存将在完成档案后生效。
                </p>
              )}

              <div className="space-y-3">
                <label className="block">
                  <span className="text-sm font-extrabold text-duo-ink">身高 cm</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-2xl border-2 border-duo-surface2 bg-duo-bg px-4 py-3 text-lg font-black text-duo-ink outline-none ring-duo-green focus:ring-2"
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-extrabold text-duo-ink">当前体重 kg</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    className="mt-1 w-full rounded-2xl border-2 border-duo-surface2 bg-duo-bg px-4 py-3 text-lg font-black text-duo-ink outline-none ring-duo-green focus:ring-2"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                  />
                </label>
                <div className="rounded-2xl border-2 border-duo-surface2 bg-duo-bg/50 p-3">
                  <p className="mb-2 text-xs font-extrabold uppercase tracking-wide text-duo-muted">
                    围度数据
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <label className="block">
                      <span className="text-xs font-bold text-duo-muted">腰围</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-surface px-3 py-2 font-bold text-duo-ink outline-none focus:ring-2 focus:ring-duo-blue"
                        value={waistCm}
                        onChange={(e) => setWaistCm(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-duo-muted">胸围</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-surface px-3 py-2 font-bold text-duo-ink outline-none focus:ring-2 focus:ring-duo-blue"
                        value={chestCm}
                        onChange={(e) => setChestCm(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-duo-muted">臀围</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-surface px-3 py-2 font-bold text-duo-ink outline-none focus:ring-2 focus:ring-duo-blue"
                        value={hipCm}
                        onChange={(e) => setHipCm(e.target.value)}
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-bold text-duo-muted">臂围</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-surface px-3 py-2 font-bold text-duo-ink outline-none focus:ring-2 focus:ring-duo-blue"
                        value={armCm}
                        onChange={(e) => setArmCm(e.target.value)}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <motion.button
                type="button"
                className="mt-5 w-full rounded-2xl border-b-4 border-duo-green-dark bg-duo-green py-4 text-center text-lg font-black text-white shadow-duo active:translate-y-0.5 active:border-b-2"
                whileTap={{ scale: 0.98 }}
                onClick={submit}
              >
                提交更新
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
