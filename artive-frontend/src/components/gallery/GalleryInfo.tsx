// components/gallery/GalleryInfo.tsx
import React from "react";
import Link from "next/link";
import { FaUser, FaEdit, FaTh, FaBars } from "react-icons/fa";

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
}

const GalleryInfo: React.FC<GalleryInfoProps> = ({
  galleryUser,
  currentSlug,
  artworks,
  isOwner,
  onProfileClick,
  mobileGridMode = "double",
  onMobileGridChange,
}) => {
  return (
    <div id="gallery-info" className="mb-2">
      <p className="text-xl sm:text-2xl mb-8 sm:mb-10">{"ArtiveForMe"}</p>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">
        {galleryUser?.gallery_title ||
          galleryUser?.name ||
          currentSlug?.toUpperCase() + " Gallery"}
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-3 whitespace-pre-wrap">
        {galleryUser?.gallery_description ||
          galleryUser?.bio ||
          "작품을 통해 색채와 형태의 조화를 탐구합니다."}
      </p>

      {/* 통계와 아이콘 */}
      <div className="flex justify-between items-center gap-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-3 sm:gap-6 text-sm text-gray-500">
          <span className="font-medium">
            {galleryUser?.total_artworks || artworks.length} Artworks
          </span>
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
              <FaTh className="text-lg" />
            ) : (
              <FaBars className="text-lg" />
            )}
          </button>

          {/* 블로그 아이콘 - 소유자일 때만 표시 */}
          {isOwner && (
            <Link
              href={`/blog/${currentSlug}`}
              className="text-gray-600 hover:text-blue-600 transition-colors"
              title="Blog"
            >
              <FaEdit className="text-lg sm:text-xl md:text-2xl" />
            </Link>
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
