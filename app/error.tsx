"use client";

import { useEffect } from "react";
import { DuoButton } from "@/components/DuoButton";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GameFit] route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <p className="text-xs font-black uppercase tracking-wider text-duo-muted">Error</p>
      <h1 className="text-2xl font-black text-duo-ink">页面加载出了问题</h1>
      <p className="text-sm text-duo-muted">
        {error.message || "未知错误"} · digest: {error.digest ?? "—"}
      </p>
      <p className="text-xs text-duo-muted">
        若控制台为空，请打开 Network 查看首页是否为 401 / JS 是否 404（常见于预览部署受保护）。
      </p>
      <DuoButton type="button" variant="green" className="min-w-[200px]" onClick={() => reset()}>
        重试
      </DuoButton>
    </div>
  );
}
