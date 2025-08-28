"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 섹션 */}
      <div className="px-6 pt-10 pb-8">
        <div className="text-center space-y-6">
          {/* 로고/제목 */}
          <div className="space-y-3">
            <h1 className="text-4xl font-black text-gray-800 tracking-tight">
              Artive
            </h1>
            <div className="w-12 h-1 bg-gray-700 mx-auto rounded-full"></div>
          </div>

          {/* 타이틀과 설명 */}
          <p className="text-sm text-gray-600 leading-relaxed">
            창작 여정을 기록하고
            <br />
            작품의 가치를 빛나게 하세요
          </p>
        </div>
      </div>

      {/* 안내 카드 */}
      <div className="px-6 pb-8 flex justify-center">
        <div className="bg-gray-50 rounded-3xl p-6 border border-gray-200 w-full max-w-sm">
          <div className="text-center space-y-4">
            <div className="text-3xl">🎨</div>
            <div className="space-y-3">
              <h3 className="font-bold text-gray-800 text-lg">
                Artive의 특별한 여정이 시작됩니다
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                예술가를 만나는 아름다운 플랫폼
                <br />
                창작의 가치를 발견하는 공간
              </p>
            </div>
            <div className="pt-2 space-y-3">
              <a
                href="https://instagram.com/artiveforme"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <button className="w-full bg-gray-700 text-white py-3 rounded-2xl font-medium text-base hover:bg-gray-600 active:scale-95 transition-all duration-200">
                  <span className="inline-flex items-center gap-2">
                    <p className="text-sm text-gray-200 leading-relaxed">
                      About Membership
                    </p>
                    @artiveforme
                  </span>
                </button>
              </a>

              {/* 로그인 버튼 */}
              <Link href="/login">
                <button className="w-full bg-gray-100 border border-gray-300 text-gray-700 py-3 rounded-2xl font-medium text-base hover:bg-gray-200 active:scale-95 transition-all duration-200">
                  Artive 작가 로그인
                </button>
              </Link>

              {/* 둘러보기 링크 */}
              <div className="pt-3">
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
