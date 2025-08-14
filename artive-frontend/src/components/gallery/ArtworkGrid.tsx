// components/gallery/ArtworkGrid.tsx
import React from "react";
import ArtworkCard from "./ArtworkCard";
import { Artwork } from "./types";

interface ArtworkGridProps {
  artworks: Artwork[];
  isOwner: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  totalArtworks: number;
  onAddArtwork: () => void;
  onLoadMore: () => void;
  mobileGridMode?: "single" | "double";
}

const ArtworkGrid: React.FC<ArtworkGridProps> = ({
  artworks,
  isOwner,
  hasMore,
  loadingMore,
  totalArtworks,
  onAddArtwork,
  onLoadMore,
  mobileGridMode = "double",
}) => {
  // Masonry 레이아웃 with CSS columns
  const masonry =
    mobileGridMode === "single"
      ? "columns-1 lg:columns-3"
      : "columns-2 lg:columns-3";

  if (artworks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🎨</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No Artworks Yet
        </h3>
        <p className="text-gray-500 mb-6">
          Start building your creative portfolio!
        </p>
        {isOwner && (
          <button
            onClick={onAddArtwork}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Add First Artwork
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Masonry 그리드 */}
      <div className={`${masonry} gap-3 sm:gap-4 lg:gap-6`}>
        {artworks.map((artwork) => (
          <div key={artwork.id} className="break-inside-avoid mb-3 sm:mb-4">
            <ArtworkCard artwork={artwork} />
          </div>
        ))}
      </div>

      {/* Load More 버튼 */}
      {hasMore && (
        <div className="text-center py-8">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Loading...</span>
              </div>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* 총 작품 수 표시 */}
      <div className="text-center text-sm text-gray-500 py-4">
        Showing {artworks.length} of {totalArtworks} artworks
      </div>
    </div>
  );
};

export default ArtworkGrid;
