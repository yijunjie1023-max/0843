"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { computeBmi } from "@/lib/beastProfile";
import type { BodyPhotoSnapshot } from "@/lib/mirrorPhoto";
import {
  appendBodyPhotoSnapshot,
  formatSnapshotDateTime,
  loadBodyPhotoSnapshots,
  MAX_BODY_PHOTO_SNAPSHOTS,
  removeBodyPhotoSnapshot,
} from "@/lib/mirrorPhoto";

function compressImageFile(file: File): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const maxW = 520;
        const maxH = 780;
        let w = img.width;
        let h = img.height;
        const scale = Math.min(1, maxW / w, maxH / h);
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          resolve(null);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        let quality = 0.82;
        let dataUrl = canvas.toDataURL("image/jpeg", quality);
        while (dataUrl.length > 1_100_000 && quality > 0.42) {
          quality -= 0.06;
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        URL.revokeObjectURL(url);
        resolve(dataUrl.length > 1_450_000 ? null : dataUrl);
      } catch {
        URL.revokeObjectURL(url);
        resolve(null);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(null);
    };
    img.src = url;
  });
}

function CompareStrip({ morphKey, previous, latest }: { morphKey: number; previous: BodyPhotoSnapshot; latest: BodyPhotoSnapshot }) {
  const slot = (label: string, snap: BodyPhotoSnapshot) => (
    <motion.figure
      key={`${label}-${snap.id}`}
      className="min-w-0 space-y-1.5"
      initial={{ opacity: 0.85, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 28, delay: label === "最新" ? 0.04 : 0 }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border-2 border-duo-blue/35 bg-duo-bg">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={snap.dataUrl}
          alt=""
          className="h-full w-full object-cover object-center"
          draggable={false}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-duo-bg/40 via-transparent to-transparent"
          aria-hidden
        />
      </div>
      <figcaption className="text-center text-[10px] font-extrabold uppercase tracking-wide text-duo-muted">
        {label}
      </figcaption>
      <p className="text-center font-mono text-[11px] font-black leading-tight text-duo-ink">
        {formatSnapshotDateTime(snap.createdAt)}
      </p>
    </motion.figure>
  );

  return (
    <motion.div
      key={morphKey}
      className="space-y-2 rounded-2xl border-2 border-duo-blue/25 bg-duo-blue/5 p-3"
      initial={{ opacity: 0.92, scale: 0.99 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
    >
      <p className="text-center text-[11px] font-bold text-duo-muted">
        并排对比 · 上一张与最新（非镜像，方便直观看变化）
      </p>
      <div className="grid grid-cols-2 gap-3">{slot("上一张", previous)}{slot("最新", latest)}</div>
    </motion.div>
  );
}

function InsightsPanel({
  snapshotCount,
  heightCm,
  weightKg,
  waistCm,
  chestCm,
}: {
  snapshotCount: number;
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
}) {
  const bmi = computeBmi(heightCm, weightKg);
  const metricsHint =
    waistCm != null && chestCm != null
      ? `档案围度已记录（胸 ${chestCm} · 腰 ${waistCm} cm），可与快照时间线对照。`
      : waistCm != null
        ? `已记录腰围 ${waistCm} cm；补全胸围等数据后，对比维度会更完整。`
        : "建议在右下角「+」里补全体重与围度，产品和算法才能把变化量化。";

  return (
    <div className="rounded-2xl border-2 border-duo-green/35 bg-duo-green/10 p-4">
      <p className="text-xs font-extrabold uppercase tracking-wide text-duo-green">
        变化分析 · 下一步方向
      </p>
      <p className="mt-2 text-sm font-bold text-duo-ink">
        {snapshotCount === 0
          ? "添加第一张快照后，时间轴会与档案数据一起参与演示分析"
          : snapshotCount === 1
            ? "已有 1 条快照 · 再拍一张即可解锁「上一张 vs 最新」并排对比"
            : `已有 ${snapshotCount} 条时间戳快照 · 可按时间回看体态变化（演示文案）`}
      </p>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed text-duo-muted">
        <li className="flex gap-2">
          <span className="font-black text-duo-green">→</span>
          <span>
            <span className="font-bold text-duo-ink">档案快照：</span>
            BMI {bmi.toFixed(1)} · {weightKg} kg / {heightCm} cm。{metricsHint}
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-black text-duo-green">→</span>
          <span>
            <span className="font-bold text-duo-ink">变化追踪：</span>
            {snapshotCount >= 2
              ? "列表按时间倒序；上方并排区固定对比「倒数第二张 vs 最后一张」。正式上线可对齐关键点并输出差异热区。"
              : "尽量固定站位、光线与取景，时间戳才有可比性。"}
          </span>
        </li>
        <li className="flex gap-2">
          <span className="font-black text-duo-green">→</span>
          <span>
            <span className="font-bold text-duo-ink">建议优先：</span>
            每 1～2 周追加一张快照；若目标是腰线，把有氧节奏稳住并在雷达「耐力」侧观察反馈（演示）。
          </span>
        </li>
      </ul>
      <p className="mt-3 text-[10px] font-bold text-duo-muted/90">
        快照仅存本机；接入服务端后可同步多设备与模型分析。
      </p>
    </div>
  );
}

export function ProfileDualMirrors({
  morphKey,
  heightCm,
  weightKg,
  waistCm,
  chestCm,
  onPhotoRefresh,
  onSilhouetteRefresh,
}: {
  morphKey: number;
  heightCm: number;
  weightKg: number;
  waistCm?: number;
  chestCm?: number;
  onPhotoRefresh?: () => void;
  onSilhouetteRefresh?: () => void;
}) {
  const refresh = onPhotoRefresh ?? onSilhouetteRefresh;
  const fileRef = useRef<HTMLInputElement>(null);
  const [snapshots, setSnapshots] = useState<BodyPhotoSnapshot[]>([]);
  const [photoHint, setPhotoHint] = useState<string | null>(null);

  const reload = useCallback(() => {
    setSnapshots(loadBodyPhotoSnapshots());
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const sortedAsc = useMemo(
    () => [...snapshots].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [snapshots],
  );

  const sortedDesc = useMemo(
    () => [...snapshots].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [snapshots],
  );

  const comparePair =
    sortedAsc.length >= 2
      ? { previous: sortedAsc[sortedAsc.length - 2]!, latest: sortedAsc[sortedAsc.length - 1]! }
      : null;

  const onPickFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = "";
      if (!file || !file.type.startsWith("image/")) return;
      const dataUrl = await compressImageFile(file);
      if (!dataUrl) {
        setPhotoHint("图片过大或无法读取，请换一张较小的照片");
        return;
      }
      const { ok, snapshots: next, error } = appendBodyPhotoSnapshot(dataUrl);
      if (!ok) {
        setPhotoHint(error ?? "保存失败");
        return;
      }
      setSnapshots(next);
      setPhotoHint(null);
      refresh?.();
    },
    [refresh],
  );

  const removeOne = useCallback(
    (id: string) => {
      removeBodyPhotoSnapshot(id);
      reload();
      refresh?.();
    },
    [reload, refresh],
  );

  return (
    <div className="space-y-4">
      <p className="text-center text-xs font-bold text-duo-muted">体态快照 · 时间轴对比</p>

      {comparePair ? (
        <CompareStrip morphKey={morphKey} previous={comparePair.previous} latest={comparePair.latest} />
      ) : snapshots.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-duo-surface2 bg-duo-bg/40 py-10 px-4 text-center">
          <span className="text-3xl opacity-40" aria-hidden>
            📷
          </span>
          <p className="text-[12px] font-bold leading-relaxed text-duo-muted">
            还没有快照。点击下方添加第一条，
            <br />
            每条都会打上拍摄时间戳。
          </p>
        </div>
      ) : (
        <p className="text-center text-[11px] font-bold text-duo-muted">
          再添加一张快照即可解锁「上一张 vs 最新」并排对比
        </p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-2">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPickFile}
        />
        <button
          type="button"
          className="rounded-xl border-2 border-duo-blue/50 bg-duo-blue px-5 py-2.5 text-xs font-extrabold text-white shadow-duo-sm hover:brightness-105"
          onClick={() => fileRef.current?.click()}
        >
          添加体态快照
        </button>
      </div>
      <p className="text-center text-[10px] leading-snug text-duo-muted">
        每条快照独立保存并带时间戳；最多保留 {MAX_BODY_PHOTO_SNAPSHOTS}{" "}
        条（最早会自动移除）。数据仅存本机浏览器。
      </p>
      {photoHint ? (
        <p className="text-center text-[11px] font-bold text-duo-warning">{photoHint}</p>
      ) : null}

      {sortedDesc.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs font-extrabold text-duo-muted">历史快照列表（新 → 旧）</p>
          <ul className="space-y-2">
            {sortedDesc.map((s, index) => (
              <li
                key={s.id}
                className="flex gap-3 rounded-2xl border-2 border-duo-surface2 bg-duo-bg/30 p-2 pr-3"
              >
                <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-duo-surface2 bg-duo-bg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s.dataUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                    draggable={false}
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-duo-surface2 px-2 py-0.5 text-[10px] font-black text-duo-muted">
                      #{sortedDesc.length - index}
                    </span>
                    {index === 0 ? (
                      <span className="rounded-full bg-duo-green/25 px-2 py-0.5 text-[10px] font-black text-duo-green">
                        最新
                      </span>
                    ) : null}
                  </div>
                  <p className="break-all font-mono text-[12px] font-black text-duo-ink">
                    {formatSnapshotDateTime(s.createdAt)}
                  </p>
                  <p className="break-all text-[10px] font-bold text-duo-muted/90">{s.createdAt}</p>
                  <button
                    type="button"
                    className="mt-1 self-start rounded-lg border border-duo-surface2 px-2 py-1 text-[10px] font-bold text-duo-muted hover:border-duo-warning hover:text-duo-warning"
                    onClick={() => removeOne(s.id)}
                  >
                    删除此条
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <InsightsPanel
        snapshotCount={snapshots.length}
        heightCm={heightCm}
        weightKg={weightKg}
        waistCm={waistCm}
        chestCm={chestCm}
      />
    </div>
  );
}
