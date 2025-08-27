"use client";

// components/gallery/AboutHeader.tsx
import React from "react";
import Link from "next/link";
import { FaUser, FaEdit, FaArrowLeft } from "react-icons/fa";

interface User {
  gallery_title?: string;
  name?: string;
  bio?: string;
}

interface AboutHeaderProps {
  showAboutHeader: boolean;
  galleryUser: User | null;
  currentSlug?: string;
  isOwner: boolean;
  onProfileClick: () => void;
}

const AboutHeader: React.FC<AboutHeaderProps> = ({
  showAboutHeader,
  galleryUser,
  currentSlug,
  isOwner,
  onProfileClick,
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showAboutHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-1">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">Artive for me</h1>

              {galleryUser?.bio && (
                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                  {galleryUser.bio}
                </p>
              )}
            </div>
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
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

export default AboutHeader;
