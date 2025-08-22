"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  artist_interview?: string;
  [key: string]: any;
}

interface ArtistInterviewProps {
  galleryUser: User | null;
  isOwner: boolean;
}

interface InterviewQA {
  question: string;
  answer: string;
}

export default function ArtistInterview({
  galleryUser,
  isOwner,
}: ArtistInterviewProps) {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const hasContent = !!galleryUser?.artist_interview;

  // 게스트인데 컨텐츠가 없으면 표시하지 않음
  if (!hasContent && !isOwner) return null;

  // JSON 형식으로 저장된 인터뷰를 파싱하거나, 텍스트로 표시
  const parseInterview = (interview: string): InterviewQA[] => {
    if (!interview) return [];

    try {
      // JSON 형식인지 확인
      const parsed = JSON.parse(interview);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      // JSON이지만 배열이 아닌 경우
      return [
        {
          question: "",
          answer: interview,
        },
      ];
    } catch {
      // JSON이 아니면 단순 텍스트로 처리
      // Q: 와 A: 패턴 찾기
      const qaPattern = /Q:\s*(.+?)(?:\n|$)A:\s*(.+?)(?=Q:|$)/gs;
      const matches = [...interview.matchAll(qaPattern)];

      if (matches.length > 0) {
        return matches.map((match) => ({
          question: match[1].trim(),
          answer: match[2].trim(),
        }));
      }

      // 패턴이 없으면 전체를 하나의 답변으로 처리
      return [
        {
          question: "",
          answer: interview,
        },
      ];
    }
  };

  const interviews = hasContent
    ? parseInterview(galleryUser.artist_interview)
    : [];

  return (
    <div className="border-t">
      {/* 섹션 헤더 */}
      <div className="py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Artist Interview
            </h2>
            <div className="w-20 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
          </div>

          {hasContent ? (
            <>
              {/* 모바일 레이아웃 - 카드 스타일 */}
              <div className="sm:hidden space-y-4">
                {interviews.map((qa, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden"
                  >
                    {qa.question && (
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-white/80 font-medium text-xs mt-1">
                            Q{index + 1}
                          </span>
                          <p className="text-white font-medium text-sm leading-relaxed">
                            {qa.question}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="p-5">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                        {qa.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 태블릿/데스크탑 레이아웃 - 아코디언 스타일 */}
              <div className="hidden sm:block max-w-4xl mx-auto">
                <div className="space-y-6">
                  {interviews.map((qa, index) => (
                    <div
                      key={index}
                      className="group"
                      onClick={() =>
                        setExpandedIndex(expandedIndex === index ? null : index)
                      }
                    >
                      <div className="cursor-pointer">
                        {qa.question ? (
                          <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0">
                                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                                      <span className="text-white font-bold text-sm">
                                        {index + 1}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                      {qa.question}
                                    </h3>
                                    <div
                                      className={`overflow-hidden transition-all duration-500 ${
                                        expandedIndex === index
                                          ? "max-h-[500px] opacity-100 mt-4"
                                          : "max-h-0 opacity-0"
                                      }`}
                                    >
                                      <div className="border-t pt-4">
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                          {qa.answer}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <svg
                                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                                    expandedIndex === index ? "rotate-180" : ""
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // 질문 없이 답변만 있는 경우 - 에세이 스타일
                          <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100">
                            <div className="prose prose-lg max-w-none">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                                {qa.answer}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 데스크탑 전용 - 사이드 인디케이터 */}
              <div className="hidden lg:block fixed right-8 top-1/2 transform -translate-y-1/2">
                <div className="space-y-3">
                  {interviews.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setExpandedIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        expandedIndex === index
                          ? "bg-indigo-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to question ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            isOwner && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() => router.push("/profile/manage#interview")}
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
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                      인터뷰 내용을 등록해주세요
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      작품 세계에 대한 Q&A를 공유해보세요
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
