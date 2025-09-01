// components/gallery/GalleryInfo.tsx
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaUser, FaEdit, FaTh, FaBars } from "react-icons/fa";
import { FileText } from "lucide-react";

interface User {
  gallery_title?: string;
  name?: string;
  gallery_description?: string;
  bio?: string;
  total_artworks: number;
  total_views: number;
}

interface GalleryInfoProps {
  galleryUser: User | null;
  currentSlug?: string;
  artworks: any[];
  isOwner: boolean;
  onProfileClick: () => void;
  mobileGridMode?: "single" | "double";
  onMobileGridChange?: (mode: "single" | "double") => void;
  postCount?: number;
  selectedBlogType?: string;
}

const GalleryInfo: React.FC<GalleryInfoProps> = ({
  galleryUser,
  currentSlug,
  artworks,
  isOwner,
  onProfileClick,
  mobileGridMode = "double",
  onMobileGridChange,
  postCount = 0,
  selectedBlogType = "ALL",
}) => {
  const pathname = usePathname();

  // 페이지 타입 결정
  const getPageType = () => {
    if (pathname?.includes("/blog")) return "blog";
    if (pathname?.includes("/about")) return "artist";
    if (pathname?.includes("/studio")) return "studio";
    return "gallery";
  };

  const pageType = getPageType();

  // UI 타입 결정 (Gallery/Blog는 같은 UI, Artist/Studio는 같은 UI)
  const getUIType = () => {
    if (pageType === "gallery" || pageType === "blog") return "with-stats";
    return "simple";
  };

  const uiType = getUIType();

  // 블로그 타입 라벨
  const getTypeLabel = (type: string) => {
    switch (type) {
      case "ALL":
        return "전체";
      case "EXHIBITION":
        return "전시";
      case "AWARD":
        return "수상";
      case "NEWS":
        return "뉴스";
      case "STUDIO":
        return "스튜디오";
      default:
        return "전체";
    }
  };

  // 페이지별 타이틀
  const getTitle = () => {
    switch (pageType) {
      case "gallery":
        return galleryUser?.gallery_title;
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

  // 페이지별 설명
  const getDescription = () => {
    switch (pageType) {
      case "gallery":
        return galleryUser?.gallery_description || galleryUser?.bio;
      case "blog":
        return "전시, 수상, 활동 기록";
      case "studio":
        return "작업 공간과 과정";
      case "artist":
        return (
          galleryUser?.bio || galleryUser?.gallery_description || "작가 소개"
        );
      default:
        return "";
    }
  };

  // 페이지별 통계 정보
  const getStats = () => {
    switch (pageType) {
      case "gallery":
        return `${galleryUser?.total_artworks || artworks.length} Artworks`;
      case "blog":
        return `${postCount} Posts`;
      default:
        return null;
    }
  };

  // 그리드 모드 변경 핸들러
  const handleGridToggle = () => {
    const newMode = mobileGridMode === "single" ? "double" : "single";

    const event = new CustomEvent("mobileGridModeChange", {
      detail: newMode,
    });
    window.dispatchEvent(event);

    if (onMobileGridChange) {
      onMobileGridChange(newMode);
    }
  };

  // Simple UI (Artist, Studio 페이지)
  if (uiType === "simple") {
    return (
      <div id="gallery-info" className="py-3">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">{getTitle()}</h1>
        <div className="flex justify-between items-start pb-2 border-b border-gray-200">
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">
            {getDescription() || ""}
          </p>
          {isOwner && (
            <button
              onClick={onProfileClick}
              title="Edit Profile"
              className="text-gray-600 hover:text-black transition-colors flex-shrink-0"
            >
              <FaUser className="text-lg sm:text-xl md:text-2xl" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // With Stats UI (Gallery, Blog 페이지)
  return (
    <div id="gallery-info" className="py-3">
      <h1 className="text-xl sm:text-2xl font-bold mb-1 line-clamp-1">
        {getTitle()}
      </h1>

      {getDescription() && (
        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
          {getDescription()}
        </p>
      )}

      <div className="flex justify-between items-center gap-4 py-1.5 border-b border-gray-200">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
          {getStats() && <span className="font-medium">{getStats()}</span>}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Blog 페이지 필터 버튼 */}
          {pageType === "blog" && (
            <button
              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-600"
              onClick={() => {
                const event = new CustomEvent("openBlogFilter");
                window.dispatchEvent(event);
              }}
            >
              <span>{getTypeLabel(selectedBlogType)}</span>
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          )}

          {/* Gallery 그리드 토글 버튼 */}
          {pageType === "gallery" && (
            <button
              onClick={handleGridToggle}
              className="sm:hidden text-gray-600 hover:text-black transition-colors p-1"
              title={mobileGridMode === "single" ? "2열 보기" : "1열 보기"}
            >
              {mobileGridMode === "single" ? (
                <FaTh className="text-lg" />
              ) : (
                <FaBars className="text-lg" />
              )}
            </button>
          )}

          {/* 프로필 아이콘 */}
          {isOwner && (
            <button
              onClick={onProfileClick}
              title="Edit Profile"
              className="text-gray-600 hover:text-black transition-colors"
            >
              <FaUser className="text-lg sm:text-xl md:text-2xl" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryInfo;
