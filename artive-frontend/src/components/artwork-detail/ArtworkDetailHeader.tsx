// components/artwork-detail/ArtworkDetailHeader.tsx
import React from "react";

interface ArtworkDetailHeaderProps {
  onBack: () => void;
  artworkTitle?: string;
  showTitle?: boolean;
}

const ArtworkDetailHeader: React.FC<ArtworkDetailHeaderProps> = ({
  onBack,
  artworkTitle = "",
  showTitle = false,
}) => {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left Side - Back Button */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors group p-2 hover:bg-gray-100 rounded-lg"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </div>
              <span className="font-medium hidden sm:inline">
                Back to Gallery
              </span>
              <span className="font-medium sm:hidden">Back</span>
            </button>

            {/* Artwork Title (when scrolled) */}
            {showTitle && artworkTitle && (
              <div className="flex items-center space-x-3 border-l border-gray-300 pl-4">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs lg:max-w-md">
                  {artworkTitle}
                </h1>
              </div>
            )}
          </div>

          {/* Right Side - Brand & Actions */}
          <div className="flex items-center space-x-4">
            {/* Share Button (optional) */}
            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group">
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
            </button>

            {/* Brand */}
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">A</span>
              </div>
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                artive.com
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar (optional) */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
          style={{ width: showTitle ? "100%" : "0%" }}
        />
      </div>
    </div>
  );
};

export default ArtworkDetailHeader;
