import type { Metadata } from "next";
import { DevTabNav } from "@/components/dev/DevTabNav";

export const metadata: Metadata = {
  title: "학습 정리 — Artive",
  description: "JavaScript·React·Spring 학습 목차 및 정리",
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 pt-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2 pb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              /dev
            </span>
            <p className="text-xs text-zinc-500">
              메인 서비스와 분리된 학습·목차 페이지입니다.
            </p>
          </div>
          <DevTabNav />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
