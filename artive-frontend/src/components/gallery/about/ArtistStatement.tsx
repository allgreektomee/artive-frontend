"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface User {
  artist_statement?: string;
  about_text?: string;
  about_image?: string;
  about_video?: string;
  name?: string;
  [key: string]: any;
}

interface ArtistStatementProps {
  galleryUser: User | null;
  isOwner: boolean;
}

export default function ArtistStatement({
  galleryUser,
  isOwner,
}: ArtistStatementProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(true);

  // artist_statement 또는 about_text 사용
  const statementText =
    galleryUser?.artist_statement || galleryUser?.about_text;
  const hasContent =
    !!statementText || !!galleryUser?.about_image || !!galleryUser?.about_video;

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

  const youtubeId = galleryUser?.about_video
    ? extractYoutubeId(galleryUser.about_video)
    : null;

  // 레이아웃 타입 결정
  const hasImage = !!galleryUser?.about_image;
  const hasVideo = !!youtubeId;
  const hasText = !!statementText;

  return (
    <div className="border-t">
      {/* 섹션 헤더 */}
      <div className="py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {hasContent ? (
            <div className="space-y-16">
              {/* 이미지 + 텍스트 섹션 */}
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
                            src={galleryUser.about_image}
                            alt={galleryUser.name || "Artist"}
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
                                {statementText}
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
                            {statementText}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 태블릿/데스크탑 레이아웃 */}
                  <div className="hidden sm:grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* 이미지 */}
                    {hasImage && (
                      <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                        <div className="bg-gray-100">
                          {imageLoading && (
                            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                          )}
                          <img
                            src={galleryUser.about_image}
                            alt={galleryUser.name || "Artist"}
                            className="w-full object-contain transition-transform duration-700 group-hover:scale-105"
                            onLoad={() => setImageLoading(false)}
                          />
                          {/* 데스크탑 호버 그라디언트 */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>
                      </div>
                    )}

                    {/* 텍스트 */}
                    {hasText && (
                      <div
                        className={`${
                          hasImage ? "lg:pl-8" : "max-w-4xl mx-auto"
                        }`}
                      >
                        <div className="space-y-6">
                          <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base sm:text-lg">
                              {statementText}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* 이미지만 있고 텍스트가 없는 경우 */}
              {hasImage && !hasText && !hasVideo && (
                <div className="text-center mt-8">
                  <p className="text-gray-500 italic">
                    갤러리를 방문해주셔서 감사합니다
                  </p>
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
                      아티스트 소개를 등록해주세요
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      당신의 예술 세계를 소개해보세요
                    </p>
                  </div>

                  {/* 호버 이펙트 */}
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
