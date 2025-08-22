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
  size?: string;
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
          <h3 className="font-medium text-gray-900 line-clamp-1 text-base mb-2">
            {artwork.title}
          </h3>

          <div className="space-y-1 text-xs">
            {/* 첫 줄: 미디엄과 사이즈 */}
            {artwork.medium && (
              <div className="text-gray-600">
                {artwork.medium}
                {artwork.size && ` · ${artwork.size}`}
              </div>
            )}

            {/* 둘째 줄: 연도 (오른쪽 정렬) */}
            {artwork.year && (
              <div className="flex justify-end">
                <span className="px-1.5 py-0.5 border border-gray-200 rounded text-gray-500 text-xs">
                  {artwork.year}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArtworkCard;
