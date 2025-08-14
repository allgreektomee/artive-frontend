// components/gallery/GalleryHeader.tsx
import React from "react";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaUser } from "react-icons/fa";

interface User {
  gallery_title?: string;
  name?: string;
  total_artworks: number;
  total_views: number;
  youtube_channel_id?: string;
  instagram_username?: string;
}

interface GalleryHeaderProps {
  showGalleryHeader: boolean;
  galleryUser: User | null;
  currentSlug?: string;
  artworks: any[];
  isOwner: boolean;
  onProfileClick: () => void;
}

const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  showGalleryHeader,
  galleryUser,
  currentSlug,
  artworks,
  isOwner,
  onProfileClick,
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showGalleryHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              {galleryUser?.gallery_title ||
                galleryUser?.name ||
                currentSlug?.toUpperCase() + " Gallery"}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
              <span>
                {galleryUser?.total_artworks || artworks.length} Artworks
              </span>
              <span>{galleryUser?.total_views || 0} Total Views</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
              <FaYoutube className="text-2xl" />
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
              <FaInstagram className="text-2xl" />
            </a>
            {isOwner && (
              <button
                onClick={onProfileClick}
                title="Edit Profile"
                className="text-gray-600 hover:text-black transition-colors"
              >
                <FaUser className="text-2xl" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryHeader;
