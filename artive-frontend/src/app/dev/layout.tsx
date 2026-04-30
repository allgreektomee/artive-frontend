import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dev — Artive",
  description: "내부 문서 (개발 호스트 전용)",
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Dev
          </span>
          <p className="text-xs text-zinc-500">
            개발 서브도메인 또는 로컬에서만 열람됩니다.
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">{children}</main>
    </div>
  );
}
