"use client";

import { useState } from "react";
import type { DietFoodItem, DietMealSlot, MealSlotId } from "@/lib/dietDay";
import { foodImageUrl, sumMealKcal } from "@/lib/dietDay";
import { useDietDay } from "@/components/diet/DietDayProvider";
import { DietDishEditorSheet } from "@/components/diet/DietDishEditorSheet";
import { DietMealAnalysisModal } from "@/components/diet/DietMealAnalysisModal";

export function DietMealTimeline() {
  const {
    dietToday,
    setSlotSkipped,
    addFoodItem,
    updateFoodItem,
    removeFoodItem,
  } = useDietDay();

  const [editor, setEditor] = useState<{
    slotId: MealSlotId;
    item: DietFoodItem | null;
  } | null>(null);

  const [analysisSlotId, setAnalysisSlotId] = useState<MealSlotId | null>(null);

  const analysisSlot =
    analysisSlotId === null
      ? null
      : (dietToday.mealSlots.find((s) => s.id === analysisSlotId) ?? null);

  return (
    <>
      <p className="text-[10px] font-bold leading-snug text-duo-muted">
        六餐次竖轴 · 点标题看分析 · 添加/双击或点「编辑」改名称（营养自动模拟）
      </p>

      <div className="relative mt-2 space-y-3 border-l border-duo-blue/25 pl-4 md:pl-5">
        {dietToday.mealSlots.map((slot, idx) => (
          <MealBlock
            key={slot.id}
            slot={slot}
            index={idx}
            onOpenAnalysis={() => setAnalysisSlotId(slot.id)}
            onAddDish={() => setEditor({ slotId: slot.id, item: null })}
            onEditDish={(item) => setEditor({ slotId: slot.id, item })}
            onToggleSkip={() => setSlotSkipped(slot.id, !slot.skipped)}
          />
        ))}
      </div>

      <DietDishEditorSheet
        open={editor !== null}
        slotLabel={dietToday.mealSlots.find((s) => s.id === editor?.slotId)?.label ?? ""}
        initial={editor?.item ?? null}
        onClose={() => setEditor(null)}
        onSave={(item) => {
          if (!editor) return;
          if (editor.item) {
            const { id: _omitId, ...patch } = item;
            void _omitId;
            updateFoodItem(editor.slotId, editor.item.id, patch);
          } else {
            addFoodItem(editor.slotId, item);
          }
        }}
        onDelete={
          editor?.item
            ? () => removeFoodItem(editor.slotId, editor.item!.id)
            : undefined
        }
      />

      <DietMealAnalysisModal
        open={analysisSlotId !== null}
        slot={analysisSlot}
        onClose={() => setAnalysisSlotId(null)}
      />
    </>
  );
}

function MealBlock({
  slot,
  index,
  onOpenAnalysis,
  onAddDish,
  onEditDish,
  onToggleSkip,
}: {
  slot: DietMealSlot;
  index: number;
  onOpenAnalysis: () => void;
  onAddDish: () => void;
  onEditDish: (item: DietFoodItem) => void;
  onToggleSkip: () => void;
}) {
  const total = sumMealKcal(slot);

  return (
    <section className="relative">
      <span
        className="absolute -left-[26px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-duo-blue bg-duo-bg text-[9px] font-black text-duo-blue md:-left-[29px]"
        aria-hidden
      >
        {index + 1}
      </span>

      <div className="rounded-xl border border-duo-surface2 bg-duo-bg p-2 md:p-2.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <button
            type="button"
            onClick={onOpenAnalysis}
            className="min-w-0 flex-1 rounded-lg text-left ring-duo-blue/0 transition hover:bg-duo-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duo-blue"
          >
            <p className="text-[10px] font-black uppercase tracking-wide text-duo-blue">{slot.label}</p>
            <p className="mt-0.5 text-sm font-black tabular-nums text-duo-ink">
              {slot.skipped ? (
                <span className="text-duo-muted">本顿未吃</span>
              ) : (
                <>
                  约 {total} <span className="text-[11px] font-bold text-duo-muted">千卡</span>
                </>
              )}
            </p>
            <p className="mt-0.5 text-[9px] font-bold text-duo-muted">点此处 · 分析建议</p>
          </button>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleSkip();
              }}
              className={`rounded-lg border px-2 py-1 text-[10px] font-black transition ${
                slot.skipped
                  ? "border-duo-green bg-duo-green/15 text-duo-ink"
                  : "border-duo-surface2 bg-duo-surface text-duo-muted"
              }`}
            >
              {slot.skipped ? "恢复" : "未吃"}
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (!slot.skipped) onAddDish();
              }}
              disabled={slot.skipped}
              className="rounded-lg border border-duo-green bg-duo-green px-2 py-1 text-[10px] font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              + 菜品
            </button>
          </div>
        </div>

        {!slot.skipped ? (
          <div className="mt-2">
            {slot.items.length === 0 ? (
              <button
                type="button"
                onClick={onAddDish}
                className="flex w-full items-center justify-center rounded-xl border border-dashed border-duo-surface2 py-3 text-[11px] font-bold text-duo-muted transition hover:border-duo-green hover:text-duo-ink"
              >
                暂无菜品 — 点击添加
              </button>
            ) : (
              <div className="-mx-0.5 flex gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                {slot.items.map((item) => (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    title="双击改名称；右上角编辑"
                    onDoubleClick={() => onEditDish(item)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onEditDish(item);
                      }
                    }}
                    className="group relative h-[108px] w-[88px] shrink-0 overflow-hidden rounded-xl border border-duo-surface2 text-left shadow-sm ring-duo-green/0 transition hover:ring-2 hover:ring-duo-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-duo-green"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${foodImageUrl(item.id + item.name)})`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/40 to-black/10" />
                    <button
                      type="button"
                      className="absolute right-0.5 top-0.5 z-10 rounded-full bg-black/60 px-1.5 py-0.5 text-[8px] font-black text-white backdrop-blur-sm"
                      aria-label={`编辑 ${item.name}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDish(item);
                      }}
                    >
                      改
                    </button>
                    <div className="relative flex h-full flex-col justify-between p-1.5 text-white">
                      <p className="pr-5 text-[9px] font-black leading-tight line-clamp-3 drop-shadow">
                        {item.name}
                      </p>
                      <div>
                        <p className="text-[8px] font-bold tabular-nums opacity-95">
                          {item.grams}g {item.kcal}卡
                        </p>
                        <p className="text-[7px] font-bold tabular-nums opacity-85">
                          P{item.proteinG}·C{item.carbsG}·F{item.fatG}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}
