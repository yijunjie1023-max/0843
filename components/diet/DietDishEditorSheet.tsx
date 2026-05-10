"use client";

import { useEffect, useMemo, useState } from "react";
import type { DietFoodItem } from "@/lib/dietDay";
import { newFoodItemId } from "@/lib/dietDay";
import { simulateNutritionFromFoodName } from "@/lib/simulateFoodNutrition";

type Props = {
  open: boolean;
  slotLabel: string;
  initial: DietFoodItem | null;
  onClose: () => void;
  onSave: (item: DietFoodItem) => void;
  onDelete?: () => void;
};

export function DietDishEditorSheet({
  open,
  slotLabel,
  initial,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial ? initial.name : "");
  }, [open, initial]);

  const preview = useMemo(
    () => simulateNutritionFromFoodName(name.trim() || "未命名"),
    [name],
  );

  if (!open) return null;

  const submit = () => {
    const label = name.trim() || "未命名";
    const sim = simulateNutritionFromFoodName(label);
    const item: DietFoodItem = {
      id: initial?.id ?? newFoodItemId(),
      name: label,
      ...sim,
    };
    onSave(item);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[55] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-editor-title"
    >
      <button type="button" className="absolute inset-0 cursor-default" aria-label="关闭" onClick={onClose} />
      <div className="relative z-[56] max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border-2 border-duo-surface2 bg-duo-surface p-4 shadow-xl">
        <h2 id="dish-editor-title" className="text-lg font-black text-duo-ink">
          {initial ? "编辑菜品" : "添加菜品"} · {slotLabel}
        </h2>
        <p className="mt-1 text-[11px] font-bold leading-snug text-duo-muted">
          只需填写食物名称；热量与营养素由本地规则模拟生成（演示用）。
        </p>

        <label className="mt-3 block text-[10px] font-bold text-duo-muted">食物名称</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例如：鱼香肉丝、燕麦牛奶"
          className="mt-1 w-full rounded-xl border-2 border-duo-surface2 bg-duo-bg px-3 py-2 text-sm font-bold text-duo-ink outline-none focus:border-duo-green"
        />

        <div className="mt-3 rounded-xl border border-duo-surface2 bg-duo-bg px-3 py-2.5">
          <p className="text-[10px] font-black uppercase tracking-wide text-duo-muted">模拟估算</p>
          <p className="mt-1 text-xs font-bold tabular-nums text-duo-ink">
            {preview.grams} g · {preview.kcal} kcal
          </p>
          <p className="mt-0.5 text-[10px] font-bold tabular-nums text-duo-muted">
            蛋白质 {preview.proteinG} g · 碳水 {preview.carbsG} g · 脂肪 {preview.fatG} g · 纤维{" "}
            {preview.fiberG} g
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-xl bg-duo-green py-2.5 text-sm font-black text-white"
          >
            保存
          </button>
          {initial && onDelete ? (
            <button
              type="button"
              onClick={() => {
                onDelete();
                onClose();
              }}
              className="flex-1 rounded-xl border-2 border-red-300 bg-red-50 py-2.5 text-sm font-black text-red-700"
            >
              删除
            </button>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border-2 border-duo-surface2 bg-duo-bg py-2.5 text-sm font-black text-duo-ink"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
