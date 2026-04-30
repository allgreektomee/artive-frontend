import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spring — Dev | Artive",
  description: "Spring 학습 정리 (준비 중)",
};

export default function DevSpringPage() {
  return (
    <div className="space-y-4 rounded-xl border border-dashed border-zinc-300 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Spring</h1>
      <p className="text-sm leading-relaxed text-zinc-600">
        Spring Boot, 웹 MVC, JPA 등 백엔드 정리 문서를 이 탭에 추가할 예정입니다.
        Markdown 파일을 두는 방식은 JavaScript 탭과 동일하게 맞출 수 있습니다.
      </p>
    </div>
  );
}
