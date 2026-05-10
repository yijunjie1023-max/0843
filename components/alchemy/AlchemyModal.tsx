"use client";

import { useCallback, useEffect, useId, useState } from "react";
import { DuoButton } from "@/components/DuoButton";

type Props = {
  open: boolean;
  nodeLabel: string;
  onClose: () => void;
  onSolo: () => void;
  onCoop: () => void;
};

function revokePreview(url: string | null) {
  if (url) URL.revokeObjectURL(url);
}

export function AlchemyModal({
  open,
  nodeLabel,
  onClose,
  onSolo,
  onCoop,
}: Props) {
  const inputId = useId();
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const resetProof = useCallback(() => {
    setProofFile(null);
    setPreviewUrl((prev) => {
      revokePreview(prev);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!open) return;
    resetProof();
  }, [open, resetProof]);

  const onProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f?.type.startsWith("image/")) {
      resetProof();
      return;
    }
    setProofFile(f);
    setPreviewUrl((prev) => {
      revokePreview(prev);
      return URL.createObjectURL(f);
    });
  };

  if (!open) return null;

  const canSubmit = Boolean(proofFile);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/55 p-4 pb-safe sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alchemy-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="关闭"
        onClick={onClose}
      />
      <div className="relative z-[61] max-h-[min(90dvh,36rem)] w-full max-w-md overflow-y-auto rounded-3xl border-2 border-duo-surface2 bg-duo-surface p-5 shadow-xl">
        <h2 id="alchemy-modal-title" className="text-xl font-black text-duo-ink">
          炼金抉择
        </h2>
        <p className="mt-1 text-sm font-bold text-duo-blue">{nodeLabel}</p>
        <p className="mt-3 text-sm leading-relaxed text-duo-muted">
          选择炼金方式：独自完成稳定收益；与好友合力可获得{" "}
          <span className="font-black text-duo-green">+50%</span> 以太精华（演示）。
        </p>

        <div className="mt-4 rounded-2xl border-2 border-duo-green/40 bg-duo-green/5 p-4">
          <p className="text-sm font-black text-duo-ink">训练凭证 · 必填</p>
          <p className="mt-1 text-xs font-bold text-duo-muted">
            须上传一张照片作为打卡凭证，完成后才会记为达标。
          </p>
          <label
            htmlFor={inputId}
            className="mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-duo-surface2 bg-duo-bg px-4 py-6 text-center transition-colors hover:border-duo-green hover:bg-duo-surface"
          >
            <span className="text-2xl" aria-hidden>
              📷
            </span>
            <span className="text-sm font-bold text-duo-blue">点击选择或拍摄照片</span>
            <span className="text-[11px] text-duo-muted">支持相册 / 相机，仅本地校验演示</span>
          </label>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={onProofChange}
          />
          {previewUrl ? (
            <div className="mt-3 overflow-hidden rounded-xl border-2 border-duo-surface2 bg-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element -- preview blob URL */}
              <img
                src={previewUrl}
                alt="打卡凭证预览"
                className="mx-auto max-h-48 w-full object-contain"
              />
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-col gap-3">
          <DuoButton
            variant="green"
            className="w-full py-3.5"
            disabled={!canSubmit}
            onClick={onSolo}
          >
            独自炼金
          </DuoButton>
          <DuoButton
            variant="blue"
            className="w-full py-3.5"
            disabled={!canSubmit}
            onClick={onCoop}
          >
            合力炼金（奖励 +50%）
          </DuoButton>
          <DuoButton variant="ghost" className="w-full py-3" onClick={onClose}>
            稍后再说
          </DuoButton>
        </div>
      </div>
    </div>
  );
}
