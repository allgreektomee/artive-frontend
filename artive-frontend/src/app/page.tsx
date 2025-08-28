"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 */}
      <div className="px-6 pt-16 pb-8">
        <div className="text-center space-y-6">
          {/* 로고/제목 */}
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">
              Artive
            </h1>
            <div className="w-12 h-1 bg-gray-700 mx-auto rounded-full"></div>
          </div>

          {/* 타이틀과 설명 */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-gray-800">
              Welcome to Artive
            </h2>
            <p className="text-base font-semibold text-gray-700">
              선별된 작가들의 프리미엄 포트폴리오
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              창작 여정을 기록하고
              <br />
              작품의 가치를 빛나게 하세요
            </p>
          </div>
        </div>
      </div>

      {/* 안내 카드 */}
      <div className="px-6 pb-8">
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200">
          <div className="text-center space-y-4">
            <div className="text-3xl">🎨</div>
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-lg">
                큐레이션 플랫폼
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Artive는 엄선된 작가들만이 참여할 수 있는
                <br />
                특별한 공간입니다.
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                회원가입은 관리자와의 협의를 통해서만
                <br />
                가능합니다.
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <a
                href="https://instagram.com/artiveforme"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-600 transition-colors"
              >
                <span className="text-base">📸</span>
                Instagram @artiveforme
              </a>

              {/* 로그인 버튼 */}
              <div className="w-full">
                <Link href="/login">
                  <button className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 rounded-2xl font-medium text-base hover:bg-gray-200 active:scale-95 transition-all duration-200">
                    Artive 작가 로그인
                  </button>
                </Link>
              </div>

              {/* 둘러보기 링크 */}
              <div className="pt-1">
                <a
                  href="https://www.artivefor.me/art"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors underline"
                >
                  artiveforme 둘러보기 →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 작품 구경 링크 */}
      <div className="px-6 pb-8">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">👀 작품을 구경하려면</p>
          <a
            href="https://www.artivefor.me/art"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-100 border border-gray-300 px-6 py-3 rounded-full text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all duration-200"
          >
            대표 작가 페이지 →
          </a>
        </div>
      </div>

      {/* 하단 */}
      <div className="px-6 pb-8 text-center">
        <a
          href="https://www.artivefor.me/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-400 underline"
        >
          개인정보처리방침
        </a>
      </div>
    </div>
  );
}
