// components/gallery/ArtworkCard.tsx
import React from "react";
import Link from "next/link";
import { FaEye, FaHeart } from "react-icons/fa";

interface Artwork {
  id: number;
  title: string;
  thumbnail_url?: string;
  work_in_progress_url?: string;
  status: "work_in_progress" | "completed" | "archived";
  medium?: string;
  size?: string;
  year?: string;
  view_count: number;
  like_count: number;
  history_count: number;
  created_at: string;
}

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  const getDisplayImage = (artwork: Artwork) => {
    console.log("🖼️ 이미지 URL 디버깅:", {
      title: artwork.title,
      thumbnail_url: artwork.thumbnail_url,
      work_in_progress_url: artwork.work_in_progress_url,
      status: artwork.status,
    });

    let finalUrl;

    // work_in_progress 상태이고 work_in_progress_url이 있으면 그것을 사용
    if (artwork.status === "work_in_progress" && artwork.work_in_progress_url) {
      finalUrl = artwork.work_in_progress_url;
    } else {
      finalUrl =
        artwork.thumbnail_url ||
        "https://via.placeholder.com/300x400?text=No+Image";
    }

    console.log("🎯 최종 반환 URL:", finalUrl);
    return finalUrl;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "work_in_progress":
        return (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
            WIP
          </span>
        );
      case "completed":
        return (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
            Done
          </span>
        );
      case "archived":
        return (
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("이미지 로딩 실패:", artwork.title, getDisplayImage(artwork));

    // 이미 fallback 이미지를 시도했다면 더 이상 시도하지 않음
    if (e.currentTarget.dataset.fallbackAttempted === "true") {
      console.log("Fallback 시도 완료, 더 이상 시도하지 않음");
      return;
    }

    // fallback 시도 표시
    e.currentTarget.dataset.fallbackAttempted = "true";

    // 안전한 placeholder 이미지 사용
    e.currentTarget.src =
      "https://via.placeholder.com/300x400/f0f0f0/999999?text=Image+Not+Found";
  };

  const handleImageLoad = () => {
    console.log("이미지 로딩 성공:", artwork.title);
  };

  return (
    <Link
      href={`/artworks/${artwork.id}`}
      className="group block relative bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 w-full"
    >
      {/* 이미지 영역 */}
      <div className="relative w-full overflow-hidden bg-gray-100 rounded-t-lg">
        <img
          src={getDisplayImage(artwork)}
          alt={artwork.title}
          className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300 block"
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
        />

        {/* 상태 배지 */}
        {getStatusBadge(artwork.status)}

        {/* 호버 오버레이 - 이미지 영역 안에서만 */}
      </div>

      {/* 작품 정보 */}
      <div className="p-4">
        <h3 className="font-semibold text-base text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {artwork.title}
        </h3>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          <span>{artwork.medium}</span>
          <span>{artwork.size}</span>
        </div>
        {artwork.history_count > 0 && (
          <div className="text-xs text-blue-600 font-medium">
            {artwork.history_count} Process
            {artwork.history_count > 1 ? "es" : ""}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ArtworkCard;
