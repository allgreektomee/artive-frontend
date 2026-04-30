import type { Metadata } from "next";

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
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
