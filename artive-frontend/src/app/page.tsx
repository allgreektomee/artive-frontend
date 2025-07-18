"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10 text-center text-gray-800">
      <h1 className="text-4xl font-bold">Welcome to Artive</h1>
      <p className="text-lg text-gray-600">
        Artive는 작가를 위한 포트폴리오 플랫폼입니다.
        <br />
        작품을 등록하고, 히스토리를 남기고, 이력을 관리하세요.
      </p>

      <div className="flex justify-center gap-4">
        <Link href="/auth/login">
          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800">
            로그인
          </button>
        </Link>
        <Link href="/auth/signup">
          <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            회원가입
          </button>
        </Link>
      </div>

      <div className="mt-10 text-sm text-gray-500">
        👀 작품을 구경하려면{" "}
        <Link href="/jaeyoung" className="underline">
          대표 작가 페이지
        </Link>
        로 이동해보세요!
      </div>
    </div>
  );
}
