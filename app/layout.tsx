import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { Providers } from "@/components/Providers";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "游戏化运动激励工具 · 幻兽进化",
  description:
    "专为大学生打造的多邻国风格健身激励应用——成长体系、社交绑定与成就系统，让坚持更有趣。",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1a1a2e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={nunito.variable}>
      <body className={`${nunito.className} min-h-dvh`}>
        <Script id="fit-boot-marker" strategy="beforeInteractive">
          {`try{console.info("[GameFit] shell loaded");}catch(e){}`}
        </Script>
        <noscript>
          <div
            style={{
              padding: 24,
              fontFamily: "system-ui,sans-serif",
              background: "#1a1a2e",
              color: "#e8e8ef",
              minHeight: "100dvh",
            }}
          >
            需要启用 JavaScript 才能使用本应用。
          </div>
        </noscript>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
