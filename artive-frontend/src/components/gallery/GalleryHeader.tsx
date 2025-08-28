// components/gallery/GalleryHeader.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";
import { Plus, Edit, FileText } from "lucide-react";
import { User, Artwork } from "./types";

interface GalleryHeaderProps {
  showGalleryHeader: boolean;
  galleryUser: User | null;
  currentSlug: string;
  artworks: Artwork[];
  isOwner: boolean;
  onProfileClick: () => void;
  mobileGridMode: "single" | "double";
  onMobileGridChange: (mode: "single" | "double") => void;
  postCount?: number;
  studioPostId?: number;
}

export default function GalleryHeader({
  showGalleryHeader,
  galleryUser,
  currentSlug,
  artworks,
  isOwner,
  onProfileClick,
  mobileGridMode,
  onMobileGridChange,
  postCount = 0,
  studioPostId,
}: GalleryHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  // 페이지 타입 결정
  const getPageType = () => {
    if (pathname?.includes("/blog")) return "blog";
    if (pathname?.includes("/about")) return "artist";
    if (pathname?.includes("/studio")) return "studio";
    return "gallery";
  };

  const pageType = getPageType();

  // 페이지별 타이틀 결정
  const getTitle = () => {
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

  // 페이지별 서브 정보
  const getSubInfo = () => {
    switch (pageType) {
      case "gallery":
        return artworks.length > 0 ? (
          <>
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
            {artworks.length}개의 작품
          </>
        ) : null;
      case "blog":
        return postCount > 0 ? (
          <>
            <FileText className="w-3 h-3" />
            {postCount}개의 글
          </>
        ) : null;
      default:
        return null;
    }
  };

  const handleAddContent = () => {
    if (pageType === "gallery") {
      router.push("/artworks/new");
    } else if (pageType === "blog") {
      router.push(`/blog/${currentSlug}/write`);
    }
  };

  const handleEditStudio = () => {
    if (studioPostId) {
      router.push(`/blog/${currentSlug}/${studioPostId}/edit`);
    } else {
      router.push(`/blog/${currentSlug}/write`);
    }
  };

  return (
    <div
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showGalleryHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          {/* 왼쪽: 타이틀과 정보 */}
          <div className="flex items-center flex-1">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">{getTitle()}</h1>
              {getSubInfo() && (
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-0.5">
                  <span className="flex items-center gap-1">
                    {getSubInfo()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 액션 버튼들 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Gallery 페이지: 그리드 모드 전환 버튼 (모바일) */}
            {pageType === "gallery" && (
              <button
                className="md:hidden text-gray-600 hover:text-black transition-colors p-1"
                onClick={() =>
                  onMobileGridChange(
                    mobileGridMode === "single" ? "double" : "single"
                  )
                }
                title="그리드 모드 변경"
              >
                {mobileGridMode === "single" ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            )}

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
                onClick={handleEditStudio}
              >
                <Edit className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            )}

            {/* 프로필 편집 버튼 */}
            {isOwner && (
              <button
                title="Edit Profile"
                className="text-gray-600 hover:text-black transition-colors p-1"
                onClick={onProfileClick}
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
