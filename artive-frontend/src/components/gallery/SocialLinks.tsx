// components/gallery/SocialLinks.tsx
"use client";
import { Youtube, Instagram, User, FileText, Newspaper } from "lucide-react";

interface SocialLinksProps {
  isOwner?: boolean;
  userSlug?: string;
  showLabels?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function SocialLinks({
  isOwner = false,
  userSlug,
  showLabels = false,
  size = "md",
}: SocialLinksProps) {
  const iconSize =
    size === "sm" ? "w-5 h-5" : size === "lg" ? "w-7 h-7" : "w-6 h-6";
  const buttonPadding = size === "sm" ? "p-2" : size === "lg" ? "p-3" : "p-2.5";

  return (
    <div className="flex items-center gap-2">
      {/* 블로그/게시판 아이콘 */}
      <button
        onClick={() => (window.location.href = `/blog/${userSlug || "list"}`)}
        className={`${buttonPadding} text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors group relative`}
        title="블로그"
      >
        <Newspaper className={iconSize} />
        {showLabels && (
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            블로그
          </span>
        )}
      </button>

      {/* 유튜브 */}
      <button
        onClick={() =>
          window.open("https://youtube.com/@" + userSlug, "_blank")
        }
        className={`${buttonPadding} text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors group relative`}
        title="YouTube"
      >
        <Youtube className={iconSize} />
        {showLabels && (
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            YouTube
          </span>
        )}
      </button>

      {/* 인스타그램 */}
      <button
        onClick={() =>
          window.open("https://instagram.com/" + userSlug, "_blank")
        }
        className={`${buttonPadding} text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors group relative`}
        title="Instagram"
      >
        <Instagram className={iconSize} />
        {showLabels && (
          <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Instagram
          </span>
        )}
      </button>

      {/* 프로필 */}
      {isOwner && (
        <button
          onClick={() => (window.location.href = "/me")}
          className={`${buttonPadding} text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group relative`}
          title="프로필"
        >
          <User className={iconSize} />
          {showLabels && (
            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              프로필
            </span>
          )}
        </button>
      )}
    </div>
  );
}
