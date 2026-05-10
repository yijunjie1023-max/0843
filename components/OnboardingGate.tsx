"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { normalizePath } from "@/lib/normalizePath";
import { useBeastProfile } from "./BeastProfileProvider";

export function OnboardingGate({ children }: { children: ReactNode }) {
  const pathnameFromHook = usePathname() ?? "";
  const router = useRouter();
  const { ready, profile } = useBeastProfile();
  const [clientPath, setClientPath] = useState("");
  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hookNorm = normalizePath(pathnameFromHook);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    setClientPath(normalizePath(window.location.pathname));
  }, [hookNorm, ready]);

  const pathname = hookNorm || clientPath;
  /** usePathname 在首帧偶发为空，等 layout effect 写入真实路径再门禁，避免误判一直停留中转页 */
  const pathReady = !(ready && hookNorm === "" && clientPath === "");

  const firstOnboarding = pathname === "/onboarding";
  const editOnboarding = pathname === "/onboarding/edit";
  const anyOnboarding = firstOnboarding || editOnboarding;

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;

    const clearFallback = () => {
      if (fallbackTimerRef.current !== null) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };

    const done = profile?.onboardingComplete === true;
    const loc = normalizePath(window.location.pathname);

    const armFallbackToOnboarding = () => {
      clearFallback();
      fallbackTimerRef.current = setTimeout(() => {
        fallbackTimerRef.current = null;
        const now = normalizePath(window.location.pathname);
        if (profile?.onboardingComplete !== true && now !== "/onboarding" && now !== "/onboarding/edit") {
          window.location.assign("/onboarding");
        }
      }, 480);
    };

    const armFallbackToHome = () => {
      clearFallback();
      fallbackTimerRef.current = setTimeout(() => {
        fallbackTimerRef.current = null;
        const now = normalizePath(window.location.pathname);
        if (profile?.onboardingComplete === true && now === "/onboarding") {
          window.location.assign("/");
        }
      }, 480);
    };

    if (!done && loc !== "/onboarding" && loc !== "/onboarding/edit") {
      router.replace("/onboarding");
      armFallbackToOnboarding();
      return clearFallback;
    }

    if (done && loc === "/onboarding") {
      router.replace("/");
      armFallbackToHome();
      return clearFallback;
    }

    if (!done && loc === "/onboarding/edit") {
      router.replace("/onboarding");
      armFallbackToOnboarding();
      return clearFallback;
    }

    clearFallback();
    return undefined;
  }, [ready, profile, pathnameFromHook, router]);

  if (!ready || !pathReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-duo-bg text-sm font-bold text-duo-muted">
        唤醒仪式加载中…
      </div>
    );
  }

  const done = profile?.onboardingComplete === true;

  if (!done && !anyOnboarding) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-duo-bg px-6 text-center">
        <p className="text-sm font-bold text-duo-muted">正在前往觉醒仪式…</p>
        <p className="max-w-sm text-xs text-duo-muted">
          若页面长时间不变，请直接点击{" "}
          <a href="/onboarding" className="font-bold text-duo-blue underline">
            进入觉醒表单
          </a>
          。
        </p>
      </div>
    );
  }

  if (done && firstOnboarding) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-duo-bg px-6 text-center">
        <p className="text-sm font-bold text-duo-muted">契约已缔结 · 进入首页…</p>
        <p className="max-w-sm text-xs text-duo-muted">
          未自动跳转？{" "}
          <a href="/" className="font-bold text-duo-blue underline">
            返回首页
          </a>
        </p>
      </div>
    );
  }

  if (!done && editOnboarding) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-duo-bg px-6 text-center">
        <p className="text-sm font-bold text-duo-muted">正在前往觉醒仪式…</p>
        <p className="max-w-sm text-xs text-duo-muted">
          未完成契约前无法修订。{" "}
          <a href="/onboarding" className="font-bold text-duo-blue underline">
            前往觉醒表单
          </a>
        </p>
      </div>
    );
  }

  return children;
}
