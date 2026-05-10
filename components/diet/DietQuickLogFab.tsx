"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { MealSlotId } from "@/lib/dietDay";
import { useDietDay } from "@/components/diet/DietDayProvider";
import { simulateNutritionFromFoodName } from "@/lib/simulateFoodNutrition";

const DEMO_RECOGNIZED_NAME = "识别：日式便当（演示）";

export function DietQuickLogFab() {
  const { dietToday, addFoodItem } = useDietDay();
  const [open, setOpen] = useState(false);
  const [slotId, setSlotId] = useState<MealSlotId>("lunch");
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [recognizing, setRecognizing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const simPreview = useMemo(
    () => simulateNutritionFromFoodName(name.trim() || "未命名"),
    [name],
  );

  useEffect(() => {
    if (!open) return;
    const first = dietToday.mealSlots[0]?.id;
    if (!dietToday.mealSlots.some((s) => s.id === slotId) && first) {
      setSlotId(first);
    }
  }, [open, dietToday.mealSlots, slotId]);

  const resetForm = () => {
    setName("");
    setPreview(null);
    setRecognizing(false);
  };

  const close = () => {
    setOpen(false);
    resetForm();
  };

  const applyDemoRecognition = () => {
    setRecognizing(true);
    window.setTimeout(() => {
      setName(DEMO_RECOGNIZED_NAME);
      setRecognizing(false);
    }, 850);
  };

  const onPickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file?.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(typeof reader.result === "string" ? reader.result : null);
      applyDemoRecognition();
    };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    const label = name.trim() || "手动录入";
    const sim = simulateNutritionFromFoodName(label);
    addFoodItem(slotId, {
      name: label,
      ...sim,
    });
    close();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-5 z-[40] flex h-14 w-14 items-center justify-center rounded-full bg-duo-green text-3xl font-light leading-none text-white shadow-[0_6px_24px_rgba(88,204,2,0.45)] ring-4 ring-duo-green/25 transition-transform active:scale-95 md:right-8 md:h-16 md:w-16"
        style={{
          bottom: "calc(5.25rem + env(safe-area-inset-bottom, 0px))",
        }}
        aria-label="手动录入饮食"
      >
        +
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onPickPhoto}
      />

      {open ? (
        <div
          className="fixed inset-0 z-[50] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="diet-quick-log-title"
        >
          <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={close} />
          <div className="relative z-[51] max-h-[92vh] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-duo-surface2 bg-duo-surface p-4 shadow-xl">
            <h2 id="diet-quick-log-title" className="text-lg font-black text-duo-ink">
              手动录入 · Quick Log
            </h2>
            <p className="mt-1 text-[11px] font-bold leading-snug text-duo-muted">
              只需填写食物名称，热量与营养自动模拟。数据存本机；拍照仅演示识别文案，不上传。
            </p>

            <label className="mt-3 block text-[10px] font-bold text-duo-muted">记入哪一餐</label>
            <select
              value={slotId}
              onChange={(e) => setSlotId(e.target.value as MealSlotId)}
              className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-3 py-2 text-sm font-black text-duo-ink outline-none focus:border-duo-green"
            >
              {dietToday.mealSlots.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                  {s.skipped ? "（已跳过）" : ""}
                </option>
              ))}
            </select>

            <div className="mt-3 rounded-xl border border-duo-surface2 bg-duo-bg p-2.5">
              <p className="text-[10px] font-black text-duo-muted">拍照识别（演示）</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={recognizing}
                  className="rounded-lg bg-duo-blue px-3 py-1.5 text-[11px] font-black text-white disabled:opacity-50"
                >
                  {recognizing ? "识别中…" : "选择照片 / 拍照"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreview(null);
                    applyDemoRecognition();
                  }}
                  disabled={recognizing}
                  className="rounded-lg border-2 border-duo-surface2 px-3 py-1.5 text-[11px] font-black text-duo-ink disabled:opacity-50"
                >
                  模拟识别
                </button>
              </div>
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element -- data URL preview
                <img
                  src={preview}
                  alt="预览"
                  className="mt-2 max-h-32 w-full rounded-lg object-cover"
                />
              ) : null}
            </div>

            <label className="mt-3 block text-[10px] font-bold text-duo-muted">食物名称</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：蓝莓酸奶杯"
              disabled={recognizing}
              className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-3 py-2 text-sm font-bold text-duo-ink outline-none focus:border-duo-green disabled:opacity-60"
            />

            <div className="mt-2 rounded-xl border border-duo-surface2 bg-duo-bg px-3 py-2">
              <p className="text-[10px] font-black text-duo-muted">将保存的模拟值</p>
              <p className="mt-0.5 text-[11px] font-bold tabular-nums text-duo-ink">
                {simPreview.grams} g · {simPreview.kcal} kcal · P{simPreview.proteinG} C{simPreview.carbsG}{" "}
                F{simPreview.fatG}
              </p>
            </div>

            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={submit}
                disabled={recognizing}
                className="flex-1 rounded-xl bg-duo-green py-2.5 text-sm font-black text-white disabled:opacity-50"
              >
                保存到所选餐次
              </button>
              <button
                type="button"
                onClick={close}
                className="flex-1 rounded-xl border-2 border-duo-surface2 bg-duo-bg py-2.5 text-sm font-black text-duo-ink"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
