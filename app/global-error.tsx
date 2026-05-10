"use client";

import { useEffect } from "react";

/** 根布局级错误（例如 Providers 整体崩溃）时展示；需自带 html/body */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GameFit] global error:", error);
  }, [error]);

  return (
    <html lang="zh-CN">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          background: "#1a1a2e",
          color: "#e8e8ef",
          fontFamily: "system-ui, sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.12em", color: "#9b9bb8", fontWeight: 800 }}>
            GLOBAL ERROR
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginTop: 8 }}>应用未能启动</h1>
          <p style={{ fontSize: 13, color: "#9b9bb8", marginTop: 12, lineHeight: 1.5 }}>
            {error.message || "请查看浏览器控制台与 Network（首页状态码、_next/static 脚本是否 401/404）。"}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              marginTop: 20,
              padding: "12px 28px",
              borderRadius: 16,
              border: "none",
              fontWeight: 800,
              cursor: "pointer",
              background: "#58cc02",
              color: "#fff",
              boxShadow: "0 4px 0 0 #358000",
            }}
          >
            重试
          </button>
        </div>
      </body>
    </html>
  );
}
