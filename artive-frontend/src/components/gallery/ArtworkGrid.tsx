import React from "react";
import Masonry from "react-masonry-css";
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
  // 반응형 컬럼 수 설정
  const breakpointColumnsObj =
    mobileGridMode === "single"
      ? {
          default: 3,
          1024: 3,
          768: 1,
          640: 1,
        }
      : {
          default: 3,
          1024: 3,
          768: 2,
          640: 2,
        };

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
    <div>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid flex -ml-3 sm:-ml-4 lg:-ml-6 w-auto"
        columnClassName="my-masonry-grid_column pl-3 sm:pl-4 lg:pl-6 bg-clip-padding"
      >
        {artworks.map((artwork) => (
          <div key={artwork.id} className="mb-3 sm:mb-4">
            <ArtworkCard artwork={artwork} />
          </div>
        ))}
      </Masonry>

      {/* Load More 버튼 */}
      {hasMore && (
        <div className="text-center py-8 mt-6">
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
      <div className="text-center text-sm text-gray-500 py-4 mt-6">
        Showing {artworks.length} of {totalArtworks} artworks
      </div>
    </div>
  );
};

export default ArtworkGrid;
