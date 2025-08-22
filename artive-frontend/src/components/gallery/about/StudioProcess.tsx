"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  studio_description?: string;
  studio_image?: string;
  process_video?: string;
  name?: string;
  [key: string]: any;
}

interface StudioProcessProps {
  galleryUser: User | null;
  isOwner: boolean;
}

export default function StudioProcess({
  galleryUser,
  isOwner,
}: StudioProcessProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  const hasContent =
    !!galleryUser?.studio_description ||
    !!galleryUser?.studio_image ||
    !!galleryUser?.process_video;

  // 게스트인데 컨텐츠가 없으면 표시하지 않음
  if (!hasContent && !isOwner) return null;

  // 유튜브 URL에서 ID 추출
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const youtubeId = galleryUser?.process_video
    ? extractYoutubeId(galleryUser.process_video)
    : null;

  const hasImage = !!galleryUser?.studio_image;
  const hasVideo = !!youtubeId;
  const hasText = !!galleryUser?.studio_description;

  return (
    <div className="border-t">
      {/* 섹션 헤더 */}
      <div className="py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Studio & Process
            </h2>
            <div className="w-20 sm:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent mx-auto"></div>
          </div>

          {hasContent ? (
            <div className="space-y-12 sm:space-y-16">
              {/* 스튜디오 이미지 + 설명 섹션 */}
              {(hasImage || hasText) && (
                <>
                  {/* 모바일 전용 레이아웃 */}
                  <div className="sm:hidden">
                    {hasImage && (
                      <div className="relative -mx-4">
                        {/* 풀 width 이미지 */}
                        <div className="relative">
                          {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                          )}
                          <img
                            src={galleryUser.studio_image}
                            alt="Studio"
                            className="w-full object-contain"
                            onLoad={() => setImageLoading(false)}
                          />

                          {/* 하단 페이드 그라디언트 */}
                          {hasText && (
                            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/80 to-transparent" />
                          )}
                        </div>

                        {/* 텍스트 오버레이 카드 */}
                        {hasText && (
                          <div className="relative -mt-20 mx-4">
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                                {galleryUser.studio_description}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 이미지 없이 텍스트만 있는 경우 */}
                    {!hasImage && hasText && (
                      <div className="px-4">
                        <div className="bg-gray-50 rounded-2xl p-6">
                          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
                            {galleryUser.studio_description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 태블릿/데스크탑 레이아웃 */}
                  <div className="hidden sm:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* 텍스트 */}
                    {hasText && (
                      <div
                        className={`${
                          hasImage
                            ? "order-2 lg:order-1 lg:pl-8"
                            : "max-w-4xl mx-auto"
                        }`}
                      >
                        <div className="space-y-6">
                          <div>
                            <div className="prose prose-lg max-w-none">
                              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                                {galleryUser.studio_description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 이미지 */}
                    {hasImage && (
                      <div className="relative group overflow-hidden rounded-2xl shadow-2xl order-1 lg:order-2">
                        <div className="bg-gray-100">
                          {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                          )}
                          <img
                            src={galleryUser.studio_image}
                            alt="Studio"
                            className="w-full object-contain transition-transform duration-700 group-hover:scale-105"
                            onLoad={() => setImageLoading(false)}
                          />
                          {/* 데스크탑 호버 그라디언트 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 프로세스 비디오 섹션 - 컴팩트 디자인 */}
              {hasVideo && (
                <div className="max-w-5xl mx-auto">
                  {/* 모바일 */}
                  <div className="sm:hidden px-4">
                    <button
                      onClick={() =>
                        window.open(
                          `https://youtube.com/watch?v=${youtubeId}`,
                          "_blank"
                        )
                      }
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 shadow-lg active:scale-95 transition-transform"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="text-white font-semibold text-sm">
                              Process Video
                            </p>
                            <p className="text-white/80 text-xs">
                              작업 과정 영상 보기
                            </p>
                          </div>
                        </div>
                        <svg
                          className="w-5 h-5 text-white/60"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      </div>
                    </button>
                  </div>

                  {/* 데스크탑 */}
                  <div className="hidden sm:block">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() =>
                          window.open(
                            `https://youtube.com/watch?v=${youtubeId}`,
                            "_blank"
                          )
                        }
                        className="group bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl px-8 py-4 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                            <svg
                              className="w-7 h-7 text-white ml-1"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <p className="text-white font-semibold">
                              Process Video
                            </p>
                            <p className="text-white/80 text-sm">
                              작업 과정을 영상으로 만나보세요
                            </p>
                          </div>
                          <svg
                            className="w-5 h-5 text-white/60 group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            isOwner && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() => router.push("/profile/manage")}
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
                      작업 공간을 소개해주세요
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      당신의 창작 공간과 과정을 공유하세요
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
