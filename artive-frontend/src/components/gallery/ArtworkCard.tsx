// components/gallery/ArtworkCard.tsx
import React from "react";
import Link from "next/link";

interface Artwork {
  id: number;
  title: string;
  thumbnail_url?: string;
  work_in_progress_url?: string;
  status: "work_in_progress" | "completed" | "archived";
  medium?: string;
  year?: string;
  views?: number;
  likes?: number;
}

interface ArtworkCardProps {
  artwork: Artwork;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ artwork }) => {
  // 이미지 URL 결정 로직
  const getDisplayImage = (artwork: Artwork) => {
    // work_in_progress 상태이고 work_in_progress_url이 있으면 그것을 사용
    if (artwork.status === "work_in_progress" && artwork.work_in_progress_url) {
      return artwork.work_in_progress_url;
    }

    // 그 외의 경우 thumbnail_url 사용
    return (
      artwork.thumbnail_url ||
      "https://via.placeholder.com/400x600/f0f0f0/999999?text=No+Image"
    );
  };

  // 상태 배지
  const getStatusBadge = (status: string) => {
    const badges = {
      completed: (
        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Completed
        </span>
      ),
      work_in_progress: (
        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
          In Progress
        </span>
      ),
      archived: (
        <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
          Archived
        </span>
      ),
    };

    return badges[status] || null;
  };

  return (
    <Link href={`/artworks/${artwork.id}`} className="block">
      <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 break-inside-avoid mb-4">
        {/* 이미지 컨테이너 - 동적 비율 */}
        <div className="relative w-full overflow-hidden bg-gray-100">
          <img
            src={getDisplayImage(artwork)}
            alt={artwork.title}
            className="w-full h-auto object-cover transition-transform duration-300"
            onError={(e) => {
              console.error("이미지 로딩 실패:", artwork.title);
              e.currentTarget.src =
                "https://via.placeholder.com/400x600/f0f0f0/999999?text=Image+Not+Found";
            }}
          />
        </div>

        {/* 카드 하단 정보 */}
        <div className="p-3">
          <h3 className="font-medium text-gray-900 line-clamp-1 text-sm">
            {artwork.title}
          </h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">{artwork.medium}</span>
            <div className="flex items-center space-x-2">
              {artwork.year && (
                <span className="text-xs text-gray-400">{artwork.year}</span>
              )}
              {getStatusBadge(artwork.status)}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkCard;
