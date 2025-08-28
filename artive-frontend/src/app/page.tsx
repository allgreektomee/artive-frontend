"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-10 text-center text-gray-800">
      <h1 className="text-4xl font-bold">Welcome to Artive</h1>
      <p className="text-lg text-gray-600 leading-relaxed">
        Artive는 선별된 작가들을 위한 프리미엄 포트폴리오 플랫폼입니다.
        <br />
        당신의 창작 여정을 기록하고, 작품의 가치를 더욱 빛나게 하세요.
      </p>

      <div className="flex justify-center gap-4">
        <Link href="/login">
          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors">
            로그인
          </button>
        </Link>
      </div>

      {/* 관리자 협의 안내 */}
      <div className="bg-gray-50 rounded-lg p-6 text-sm text-gray-600">
        <p className="font-medium mb-2">🎨 큐레이션 플랫폼</p>
        <p>
          Artive는 엄선된 작가들만이 참여할 수 있는 특별한 공간입니다.
          <br />
          회원가입은{" "}
          <a
            href="https://instagram.com/artiveforme"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 underline hover:text-pink-700"
          >
            @artiveforme
          </a>
          로 문의하세요.
        </p>
      </div>

      <div className="mt-10 text-sm text-gray-500">
        👀 작품을 구경하려면{" "}
        <a
          href="https://www.artivefor.me/art"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700 transition-colors"
        >
          대표 작가 페이지
        </a>
        로 이동해보세요!
      </div>

      {/* 문의 섹션 */}
      <div className="border-t pt-8 mt-12">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          문의 및 협업
        </h3>
        <div className="flex justify-center">
          <a
            href="https://instagram.com/artiveforme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
          >
            📸 @artiveforme DM
          </a>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          가입 문의, 작가 추천, 협업 제안 등 DM으로 연락주세요
        </p>
      </div>

      {/* 개인정보처리방침 */}
      <div className="text-xs text-gray-400 border-t pt-4">
        <a
          href="https://www.artivefor.me/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600 transition-colors"
        >
          개인정보처리방침
        </a>
      </div>
    </div>
  );
}
