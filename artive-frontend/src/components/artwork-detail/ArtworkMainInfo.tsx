// components/artwork-detail/ArtworkMainInfo.tsx
import React from "react";

interface Artist {
  name: string;
  bio: string;
}

interface Artwork {
  id: number;
  title: string;
  artist_name: String;
  description: string;
  medium?: string;
  size?: string;
  year?: string;
  status: "work_in_progress" | "completed" | "archived";
  thumbnail_url: string;
  created_at: string;
  artist: Artist;
}

interface ArtworkMainInfoProps {
  artwork: Artwork;
  onImageClick: () => void;
}

const ArtworkMainInfo: React.FC<ArtworkMainInfoProps> = ({
  artwork,
  onImageClick,
}) => {
  const getStatusBadge = () => {
    const statusConfig = {
      completed: {
        label: "Completed",
        style:
          "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200",
      },
      work_in_progress: {
        label: "In Progress",
        style:
          "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200",
      },
      archived: {
        label: "Archived",
        style:
          "bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200",
      },
    };

    const config = statusConfig[artwork.status];

    return (
      <span
        className={`px-4 py-2 rounded-full text-sm font-medium ${config.style} shadow-sm`}
      >
        {config.label}
      </span>
    );
  };

  const getDetailIcon = (type: "medium" | "size" | "year" | "artist") => {
    const icons = {
      medium: "🎨",
      size: "📏",
      year: "📅",
      artist: "👨‍🎨",
    };

    const colors = {
      medium: "from-blue-500 to-indigo-600",
      size: "from-green-500 to-emerald-600",
      year: "from-purple-500 to-violet-600",
      artist: "from-orange-500 to-amber-600",
    };

    return (
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${colors[type]} flex items-center justify-center text-white shadow-lg`}
      >
        <span className="text-sm sm:text-base">{icons[type]}</span>
      </div>
    );
  };

  return (
    <>
      {/* Main Artwork Info - 2 column layout */}
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-12 lg:mb-16">
        {/* Artwork Image */}
        <div className="space-y-6">
          <div className="relative group cursor-pointer" onClick={onImageClick}>
            <div className="rounded-2xl lg:rounded-3xl overflow-hidden bg-gray-100 shadow-2xl lg:h-[500px] lg:flex lg:items-center lg:justify-center">
              <img
                src={artwork.thumbnail_url}
                alt={artwork.title}
                className="w-full h-auto object-contain lg:max-w-full lg:max-h-full group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>

            {/* Zoom Indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-2xl lg:rounded-3xl flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔍</span>
                  <span className="text-sm font-medium text-gray-900">
                    Click to view full size
                  </span>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-4 left-4 lg:top-6 lg:left-6">
              {getStatusBadge()}
            </div>
          </div>
        </div>

        {/* Artwork Info */}
        <div className="space-y-6 lg:space-y-8">
          {/* Title & Description */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
              {artwork.title}
            </h1>
            <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
              {artwork.description}
            </p>
          </div>

          {/* Artwork Details Grid */}
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {/* Medium */}
            {artwork.medium && (
              <div className="flex items-center space-x-3 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                {getDetailIcon("medium")}
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm text-gray-500 font-medium">
                    Medium
                  </div>
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                    {artwork.medium}
                  </div>
                </div>
              </div>
            )}

            {/* Size */}
            {artwork.size && (
              <div className="flex items-center space-x-3 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                {getDetailIcon("size")}
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm text-gray-500 font-medium">
                    Size
                  </div>
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                    {artwork.size}
                  </div>
                </div>
              </div>
            )}

            {/* Year */}
            {artwork.year && (
              <div className="flex items-center space-x-3 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
                {getDetailIcon("year")}
                <div className="min-w-0">
                  <div className="text-xs lg:text-sm text-gray-500 font-medium">
                    Year
                  </div>
                  <div className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base">
                    {artwork.year}
                  </div>
                </div>
              </div>
            )}

            {/* Artist */}
            <div className="flex items-center space-x-3 p-3 lg:p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              {getDetailIcon("artist")}
              <div className="min-w-0">
                <div className="text-xs lg:text-sm text-gray-500 font-medium">
                  Artist
                </div>
                <div className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                  {artwork.artist?.name ||
                    artwork.artist_name ||
                    "Unknown Artist"}
                </div>
              </div>
            </div>
          </div>

          {/* Creation Date */}
          <div className="text-center py-4">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">
              <span>✨</span>
              <span>
                Created on{" "}
                {new Date(artwork.created_at).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* About the Artist - 작가 정보가 있을 때만 표시 */}
      {(artwork.artist?.bio || artwork.user?.bio) && (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-2xl p-6 lg:p-8 border border-blue-100 shadow-sm mb-12 lg:mb-16">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👨‍🎨</span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">
              About the Artist
            </h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
            {artwork.artist?.bio || artwork.user?.bio}
          </p>
        </div>
      )}
    </>
  );
};

export default ArtworkMainInfo;
