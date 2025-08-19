// components/gallery/GalleryHeader.tsx
import React from "react";
import Link from "next/link";
import { FaUser, FaEdit, FaTh, FaBars } from "react-icons/fa";

interface User {
  gallery_title?: string;
  name?: string;
  total_artworks: number;
  total_views: number;
}

interface GalleryHeaderProps {
  showGalleryHeader: boolean;
  galleryUser: User | null;
  currentSlug?: string;
  artworks: any[];
  isOwner: boolean;
  onProfileClick: () => void;
  mobileGridMode?: "single" | "double";
  onMobileGridChange?: (mode: "single" | "double") => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  showGalleryHeader,
  galleryUser,
  currentSlug,
  artworks,
  isOwner,
  onProfileClick,
  mobileGridMode = "double",
  onMobileGridChange,
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showGalleryHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-lg sm:text-xl font-bold">
              {galleryUser?.gallery_title ||
                galleryUser?.name ||
                currentSlug?.toUpperCase() + " Gallery"}
            </h1>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              <span>
                {galleryUser?.total_artworks || artworks.length} Artworks
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 그리드 토글 버튼 - 모바일에서만 표시 */}
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
                <FaTh className="text-xl" />
              ) : (
                <FaBars className="text-xl" />
              )}
            </button>

            {/* 블로그 아이콘 - 소유자일 때만 표시 */}
            {isOwner && (
              <Link
                href={`/blog/${currentSlug}`}
                className="text-gray-600 hover:text-blue-600 transition-colors p-1"
                title="Blog"
              >
                <FaEdit className="text-xl sm:text-2xl" />
              </Link>
            )}

            {/* 프로필 아이콘 - 소유자일 때만 표시 */}
            {isOwner && (
              <button
                onClick={onProfileClick}
                title="Edit Profile"
                className="text-gray-600 hover:text-black transition-colors p-1"
              >
                <FaUser className="text-xl sm:text-2xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryHeader;
