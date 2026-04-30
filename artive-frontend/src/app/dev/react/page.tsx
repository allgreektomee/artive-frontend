import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "React — Dev | Artive",
  description: "React 학습 정리 (준비 중)",
};

export default function DevReactPage() {
  return (
    <div className="space-y-4 rounded-xl border border-dashed border-zinc-300 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">React</h1>
      <p className="text-sm leading-relaxed text-zinc-600">
        컴포넌트, 훅, 상태 관리, 라우팅 등 React 정리 문서를 이 탭에 단계적으로
        추가할 예정입니다. 지금은 자바스크립트 탭의 ES6+ 목차만 연결되어 있습니다.
      </p>
    </div>
  );
}
