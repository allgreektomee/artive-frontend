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

  // 페이지별 타이틀
  const getTitle = () => {
    switch (pageType) {
      case "gallery":
        return (
          galleryUser?.gallery_title ||
          galleryUser?.name ||
          currentSlug?.toUpperCase() + " Gallery"
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
        return "작가 소개";
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
      case "studio":
        return null;
      case "artist":
        return null;
      default:
        return null;
    }
  };

  return (
    <div id="gallery-info" className="mb-2 -mt-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-1">{getTitle()}</h1>

      {getDescription() && (
        <p className="text-gray-600 text-sm sm:text-base mb-3 whitespace-pre-wrap">
          {getDescription()}
        </p>
      )}

      {/* 통계와 아이콘 */}
      <div className="flex justify-between items-center gap-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-3 sm:gap-6 text-sm text-gray-500">
          {getStats() && <span className="font-medium">{getStats()}</span>}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 그리드 토글 버튼 - Gallery 페이지 모바일에서만 표시 */}
          {pageType === "gallery" && (
            <button
              onClick={() => {
                if (onMobileGridChange) {
                  onMobileGridChange(
                    mobileGridMode === "single" ? "double" : "single"
                  );
                }
              }}
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

          {/* 프로필 아이콘 - 소유자일 때만 표시 */}
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
