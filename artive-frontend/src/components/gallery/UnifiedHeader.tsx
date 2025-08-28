"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { Plus, Edit, FileText } from "lucide-react";

interface UnifiedHeaderProps {
  currentSlug: string;
  isOwner: boolean;
  galleryUser?: any;
  totalArtworks?: number;
  postCount?: number;
}

export default function UnifiedHeader({
  currentSlug,
  isOwner,
  galleryUser,
  totalArtworks = 0,
  postCount = 0,
}: UnifiedHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [showHeader, setShowHeader] = useState(false);
  const [pageType, setPageType] = useState<
    "gallery" | "blog" | "studio" | "artist"
  >("gallery");
  const [scrollThreshold, setScrollThreshold] = useState(200);

  // 페이지 타입 결정
  useEffect(() => {
    if (pathname?.includes("/blog")) {
      setPageType("blog");
      setScrollThreshold(150);
    } else if (pathname?.includes("/about")) {
      setPageType("artist");
      setScrollThreshold(100);
    } else if (pathname?.includes("/studio")) {
      setPageType("studio");
      setScrollThreshold(100);
    } else {
      setPageType("gallery");
      setScrollThreshold(200);
    }
  }, [pathname]);

  // 스크롤 핸들러
  useEffect(() => {
    const handleScroll = () => {
      setShowHeader(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold]);

  const handleProfileClick = () => {
    router.push("/profile/manage");
  };

  const handleAddContent = () => {
    if (pageType === "gallery") {
      router.push("/artworks/new");
    } else if (pageType === "blog") {
      router.push(`/blog/${currentSlug}/write`);
    }
  };

  const getHeaderTitle = () => {
    switch (pageType) {
      case "gallery":
        return (
          galleryUser?.gallery_title || `${currentSlug?.toUpperCase()} Gallery`
        );
      case "blog":
        return `${currentSlug?.toUpperCase()} 블로그`;
      case "studio":
        return "Art Studio";
      case "artist":
        return "About the Artist";
      default:
        return currentSlug?.toUpperCase();
    }
  };

  const getSubInfo = () => {
    switch (pageType) {
      case "gallery":
        return totalArtworks > 0 ? `${totalArtworks}개의 작품` : "작품 없음";
      case "blog":
        return postCount > 0 ? `${postCount}개의 글` : "글 없음";
      default:
        return null;
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* 왼쪽: 타이틀과 정보 */}
          <div className="flex items-center flex-1">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                {getHeaderTitle()}
              </h1>
              {getSubInfo() && (
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    {pageType === "gallery" ? (
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    ) : (
                      <FileText className="w-3 h-3" />
                    )}
                    {getSubInfo()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 콘텐츠 추가 버튼 (Gallery, Blog) */}
            {isOwner && (pageType === "gallery" || pageType === "blog") && (
              <button
                className="text-gray-600 hover:text-black transition-colors p-1"
                title={pageType === "gallery" ? "새 작품 등록" : "새 글 작성"}
                onClick={handleAddContent}
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* Studio 편집 버튼 */}
            {isOwner && pageType === "studio" && (
              <button
                className="text-gray-600 hover:text-black transition-colors p-1"
                title="Edit Studio"
                onClick={() => router.push(`/blog/${currentSlug}/write`)}
              >
                <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* 프로필 편집 버튼 */}
            {isOwner && (
              <button
                title="Edit Profile"
                className="text-gray-600 hover:text-black transition-colors p-1"
                onClick={handleProfileClick}
              >
                <FaUser className="text-xl sm:text-2xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
