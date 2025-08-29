"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  slug?: string;
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
  const [studioPost, setStudioPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const userSlug = galleryUser?.slug || "";

  useEffect(() => {
    const fetchStudioPost = async () => {
      if (!userSlug) return;

      try {
        // STUDIO 카테고리 포스트 조회
        const response = await fetch(
          `${backEndUrl}/api/blog/${userSlug}/posts?category=STUDIO`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // STUDIO 카테고리는 1개만 있어야 함
          if (data.posts && data.posts.length > 0) {
            setStudioPost(data.posts[0]);
          }
        }
      } catch (error) {
        console.error("Failed to fetch studio post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudioPost();
  }, [userSlug, backEndUrl]);

  // 게스트인데 컨텐츠가 없으면 표시하지 않음
  if (!studioPost && !isOwner && !loading) return null;

  return (
    <div className="border-t">
      <div className="py-8 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 섹션 헤더 */}

          {loading ? (
            // 로딩 상태
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          ) : studioPost ? (
            // 블로그 컨텐츠 표시
            <div className="prose prose-lg max-w-none">
              {/* 제목 */}
              {studioPost.title && (
                <h1 className="text-3xl font-bold mb-6">{studioPost.title}</h1>
              )}

              {/* 블로그 내용 - HTML로 렌더링 */}
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: studioPost.content }}
              />

              {/* 수정 버튼 (소유자만) */}
              {isOwner && (
                <div className="mt-8 pt-8 border-t">
                  <button
                    onClick={() =>
                      router.push(`/${userSlug}/blog/edit/${studioPost.id}`)
                    }
                    className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  >
                    스튜디오 소개 수정
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 컨텐츠 없음 - 소유자만 표시
            isOwner && (
              <div className="max-w-2xl mx-auto">
                <button
                  onClick={() =>
                    router.push(`/${userSlug}/blog/new?category=STUDIO`)
                  }
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
                      스튜디오 소개 작성하기
                    </p>
                    <p className="text-sm mt-2 text-gray-500">
                      블로그 에디터로 자유롭게 공간을 소개하세요
                    </p>
                    <p className="text-xs mt-2 text-gray-400">
                      이미지, 동영상, 지도 등 다양한 콘텐츠 삽입 가능
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
