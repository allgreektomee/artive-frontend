"use client";

// components/gallery/BlogHeader.tsx
import React from "react";
import Link from "next/link";
import { FaUser } from "react-icons/fa";
import { Plus, FileText } from "lucide-react";

interface User {
  name?: string;
  slug?: string;
}

interface BlogHeaderProps {
  showBlogHeader: boolean;
  blogUser: User | null;
  currentSlug?: string;
  isOwner: boolean;
  onProfileClick: () => void;
  totalPosts: number;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  showBlogHeader,
  blogUser,
  currentSlug,
  isOwner,
  onProfileClick,
  totalPosts,
}) => {
  return (
    <div
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-all duration-300 ${
        showBlogHeader
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-1">
            <div>
              <h1 className="text-lg sm:text-xl font-bold">
                {blogUser?.name || currentSlug?.toUpperCase()} 블로그
              </h1>
              <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <FileText className="w-3 h-3" />
                  {totalPosts}개의 글
                </span>
              </div>
            </div>
          </div>

          {/* 우측 아이콘들 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* 새 글 작성 아이콘 - 소유자일 때만 */}
            {isOwner && (
              <>
                <Link
                  href={`/blog/${currentSlug}/write`}
                  className="text-gray-600 hover:text-black transition-colors p-1"
                  title="새 글 작성"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                </Link>
                <button
                  onClick={onProfileClick}
                  title="Edit Profile"
                  className="text-gray-600 hover:text-black transition-colors"
                >
                  <FaUser className="text-lg sm:text-xl md:text-2xl" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogHeader;
