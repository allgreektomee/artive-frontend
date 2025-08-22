"use client";

import { useRouter } from "next/navigation";

interface User {
  cv_education?: string;
  cv_exhibitions?: string;
  cv_awards?: string;
  [key: string]: any;
}

interface ExhibitionsRecognitionProps {
  galleryUser: User | null;
  isOwner: boolean;
}

export default function ExhibitionsRecognition({
  galleryUser,
  isOwner,
}: ExhibitionsRecognitionProps) {
  const router = useRouter();
  const hasContent = !!(
    galleryUser?.cv_education ||
    galleryUser?.cv_exhibitions ||
    galleryUser?.cv_awards
  );

  // 게스트인데 컨텐츠가 없으면 표시하지 않음
  if (!hasContent && !isOwner) return null;

  // 리스트 형식 텍스트를 파싱하는 함수
  const parseListText = (text: string): string[] => {
    if (!text) return [];

    // 줄바꿈으로 분리하고 빈 줄 제거
    return text.split("\n").filter((line) => line.trim());
  };

  // 연도 추출 함수 (정렬용)
  const extractYear = (text: string): number => {
    const yearMatch = text.match(/\b(19|20)\d{2}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : 0;
  };

  // 최신순 정렬
  const sortByYear = (items: string[]): string[] => {
    return [...items].sort((a, b) => extractYear(b) - extractYear(a));
  };

  return (
    <div className="border-t">
      {/* 섹션 헤더 */}
      <div className="py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Exhibitions & Recognition
            </h2>
            <div className="w-20 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
          </div>

          {hasContent ? (
            <>
              {/* 모바일 레이아웃 */}
              <div className="sm:hidden space-y-6">
                {/* Education 카드 */}
                {galleryUser.cv_education && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3">
                      <h3 className="text-white font-semibold text-sm">
                        Education
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {parseListText(galleryUser.cv_education).map(
                        (item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {item}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Exhibitions 카드 */}
                {galleryUser.cv_exhibitions && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3">
                      <h3 className="text-white font-semibold text-sm">
                        Exhibitions
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {sortByYear(
                        parseListText(galleryUser.cv_exhibitions)
                      ).map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Awards 카드 */}
                {galleryUser.cv_awards && (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-4 py-3">
                      <h3 className="text-white font-semibold text-sm">
                        Awards & Recognition
                      </h3>
                    </div>
                    <div className="p-4 space-y-3">
                      {sortByYear(parseListText(galleryUser.cv_awards)).map(
                        (item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-gray-700 text-sm leading-relaxed">
                              {item}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 데스크탑 레이아웃 */}
              <div className="hidden sm:block max-w-6xl mx-auto">
                <div className="space-y-12">
                  {/* Education - 단독 섹션 */}
                  {galleryUser.cv_education && (
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l9-5-9-5-9 5 9 5z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          Education
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {parseListText(galleryUser.cv_education).map(
                          (item, index) => (
                            <div key={index} className="flex items-start group">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:bg-gray-600 transition-colors"></div>
                              <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                {item}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {/* Exhibitions와 Awards를 그리드로 배치 */}
                  {(galleryUser.cv_exhibitions || galleryUser.cv_awards) && (
                    <div className="grid lg:grid-cols-2 gap-8">
                      {/* Exhibitions */}
                      {galleryUser.cv_exhibitions && (
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              Exhibitions
                            </h3>
                          </div>
                          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {sortByYear(
                              parseListText(galleryUser.cv_exhibitions)
                            ).map((item, index) => (
                              <div
                                key={index}
                                className="flex items-start group"
                              >
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:bg-gray-600 transition-colors"></div>
                                <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Awards & Recognition */}
                      {galleryUser.cv_awards && (
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-xl border border-gray-100">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                />
                              </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              Awards & Recognition
                            </h3>
                          </div>
                          <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                            {sortByYear(
                              parseListText(galleryUser.cv_awards)
                            ).map((item, index) => (
                              <div
                                key={index}
                                className="flex items-start group"
                              >
                                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:bg-gray-600 transition-colors"></div>
                                <span className="text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Scrollbar 스타일 */}
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: #f1f1f1;
                  border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background: #888;
                  border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                  background: #666;
                }
              `}</style>
            </>
          ) : (
            isOwner && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() => router.push("/profile/manage#exhibitions")}
                  className="w-full group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-400 hover:border-gray-500 transition-all duration-300"
                >
                  <div className="py-20 px-6 bg-gradient-to-br from-gray-50 to-gray-100 group-hover:from-gray-100 group-hover:to-gray-150 transition-all duration-300">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <svg
                          className="w-8 h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      전시 및 수상 경력을 등록해주세요
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      학력, 전시, 수상 이력을 공유해보세요
                    </p>
                  </div>

                  {/* 호버 이펙트 - 은은한 그레이 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-600/0 via-gray-600/5 to-gray-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
