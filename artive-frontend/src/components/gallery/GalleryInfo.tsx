// components/gallery/GalleryInfo.tsx
import React from "react";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaUser, FaEdit } from "react-icons/fa";

interface User {
  gallery_title?: string;
  name?: string;
  gallery_description?: string;
  bio?: string;
  total_artworks: number;
  total_views: number;
  youtube_channel_id?: string;
  instagram_username?: string;
}

interface GalleryInfoProps {
  galleryUser: User | null;
  currentSlug?: string;
  artworks: any[];
  isOwner: boolean;
  onProfileClick: () => void;
}

const GalleryInfo: React.FC<GalleryInfoProps> = ({
  galleryUser,
  currentSlug,
  artworks,
  isOwner,
  onProfileClick,
}) => {
  return (
    <div id="gallery-info" className="mb-2">
      <p className="text-2xl sm:text-2xl mb-10">{"artive.com "}</p>

      <h1 className="text-2xl sm:text-3xl font-bold mb-1">
        {galleryUser?.gallery_title ||
          galleryUser?.name ||
          currentSlug?.toUpperCase() + " Gallery"}
      </h1>
      <p className="text-gray-600 text-sm sm:text-base mb-3">
        {galleryUser?.gallery_description ||
          galleryUser?.bio ||
          "작품을 통해 색채와 형태의 조화를 탐구합니다."}
      </p>

      {/* 통계와 소셜미디어 */}
      <div className="flex justify-between items-center gap-4 py-2 border-b border-gray-200">
        <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-500">
          <span className="font-medium">
            {galleryUser?.total_artworks || artworks.length} Artworks
          </span>
          <span className="font-medium">
            {galleryUser?.total_views || 0} Total Views
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 블로그 아이콘 */}
          <Link
            href={`/blog/${currentSlug}`}
            className="text-gray-600 hover:text-blue-600 transition-colors"
            title="Blog"
          >
            <FaEdit className="text-lg sm:text-xl md:text-2xl" />
          </Link>

          <a
            href={
              galleryUser?.youtube_channel_id
                ? `https://youtube.com/channel/${galleryUser.youtube_channel_id}`
                : "https://youtube.com/"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-red-600 transition-colors"
          >
            <FaYoutube className="text-lg sm:text-xl md:text-2xl" />
          </a>
          <a
            href={
              galleryUser?.instagram_username
                ? `https://instagram.com/${galleryUser.instagram_username}`
                : "https://instagram.com/"
            }
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-pink-600 transition-colors"
          >
            <FaInstagram className="text-lg sm:text-xl md:text-2xl" />
          </a>
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
