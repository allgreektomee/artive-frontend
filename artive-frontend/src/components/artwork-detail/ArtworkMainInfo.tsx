// components/artwork-detail/ArtworkMainInfo.tsx
import React, { useState } from "react";
import LinkCard from "./LinkCard";
import YouTubeCard from "./YouTubeCard";

interface Artist {
  name: string;
  bio: string;
}

interface Artwork {
  id: number;
  title: string;
  artist_name: String;
  description: string;
  description_format?: string; // 추가: html 또는 markdown
  medium?: string;
  size?: string;
  year?: string;
  status: "work_in_progress" | "completed" | "archived";
  thumbnail_url: string;
  created_at: string;
  artist: Artist;
  links?: Array<{ title: string; url: string }>; // 추가: 링크
  youtube_urls?: string[]; // 추가: 유튜브
}

interface ArtworkMainInfoProps {
  artwork: Artwork;
  onImageClick: () => void;
}

const ArtworkMainInfo: React.FC<ArtworkMainInfoProps> = ({
  artwork,
  onImageClick,
}) => {
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);
  const getYouTubeId = (url: string): string => {
    const regex =
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };

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
      {/* Main Artwork Info */}
      <div className="space-y-12 lg:space-y-16 mb-12 lg:mb-16">
        {/* PC: Title 먼저 표시 - 센터 정렬 */}
        <div className="hidden lg:block text-center pt-8 lg:pt-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 lg:mb-6 leading-tight">
            {artwork.title}
          </h1>

          {/* PC: 메타 정보를 한 줄로 표시 - 센터 정렬 */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-gray-600 mb-12 lg:mb-16">
            {artwork.medium && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Medium</span>
                <span className="font-medium text-gray-700">
                  {artwork.medium}
                </span>
              </div>
            )}

            {artwork.medium && artwork.size && (
              <span className="text-gray-300">•</span>
            )}

            {artwork.size && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Size</span>
                <span className="font-medium text-gray-700">
                  {artwork.size}
                </span>
              </div>
            )}

            {artwork.size && artwork.year && (
              <span className="text-gray-300">•</span>
            )}

            {artwork.year && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Year</span>
                <span className="font-medium text-gray-700">
                  {artwork.year}
                </span>
              </div>
            )}

            {artwork.year && artwork.artist_name && (
              <span className="text-gray-300">•</span>
            )}

            {artwork.artist_name && (
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400">Artist</span>
                <span className="font-medium text-gray-700">
                  {artwork.artist?.name ||
                    artwork.artist_name ||
                    "Unknown Artist"}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Artwork Image - 센터 정렬, 깔끔한 디자인 */}
        <div className="flex justify-center">
          <div
            className="relative group cursor-pointer max-w-4xl w-full"
            onClick={onImageClick}
          >
            <div className=" overflow-hidden bg-gray-50 shadow-lg">
              <img
                src={artwork.thumbnail_url || undefined}
                alt={artwork.title}
                className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
              />
            </div>

            {/* Zoom Indicator */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm px-4 py-3 rounded-full shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🔍</span>
                  <span className="text-sm font-medium text-gray-900">
                    Click to view full size
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 모바일: Title과 카드 형태 메타정보 */}
        {/* 첫째 줄: Medium, Year */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Medium */}
          {artwork.medium && (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              {getDetailIcon("medium")}
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium">Medium</div>
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {artwork.medium}
                </div>
              </div>
            </div>
          )}

          {/* Year */}
          {artwork.year && (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              {getDetailIcon("year")}
              <div className="min-w-0">
                <div className="text-xs text-gray-500 font-medium">Year</div>
                <div className="font-semibold text-gray-900 text-sm">
                  {artwork.year}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 둘째, 셋째 줄: Size, Artist */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          {/* Size */}
          {artwork.size && (
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
              {getDetailIcon("size")}
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900 text-sm">
                  <span className="text-gray-500">Size</span> • {artwork.size}
                </div>
              </div>
            </div>
          )}

          {/* Artist */}
          <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-300">
            {getDetailIcon("artist")}
            <div className="min-w-0 flex-1">
              <div className="font-semibold text-gray-900 text-sm">
                <span className="text-gray-500">Artist</span> •{" "}
                {artwork.artist?.name ||
                  artwork.artist_name ||
                  "Unknown Artist"}
              </div>
            </div>
          </div>
        </div>

        {/* Description - HTML 렌더링 수정 */}
        <div className="prose prose-lg max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: artwork.description }}
            className="text-gray-600 leading-relaxed prose prose-gray max-w-none
              [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:text-gray-900
              [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:text-gray-900
              [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:text-gray-900
              [&>p]:mb-4 [&>p]:leading-relaxed
              [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4
              [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4
              [&>li]:mb-1
              [&>blockquote]:border-l-4 [&>blockquote]:border-gray-300 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-gray-700 [&>blockquote]:my-4
              [&>code]:bg-gray-100 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>code]:font-mono
              [&>pre]:bg-gray-100 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:my-4
              [&>a]:text-blue-600 [&>a]:underline [&>a]:hover:text-blue-800
              [&>strong]:font-bold [&>strong]:text-gray-900
              [&>em]:italic"
            style={{
              wordBreak: "keep-all",
              overflowWrap: "break-word",
              hyphens: "none",
            }}
          />
        </div>

        {/* 관련 링크 & 영상 - PC에서 좌우 배치 */}
        {((artwork?.links && artwork.links.length > 0) ||
          (artwork?.youtube_urls && artwork.youtube_urls.length > 0)) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* 왼쪽: 관련 링크 */}
            {artwork?.links && artwork.links.length > 0 && (
              <div className="space-y-3">
                {artwork.links.map((link: any, index: number) => (
                  <LinkCard
                    key={index}
                    title={link.title}
                    url={link.url}
                    description={link.description}
                  />
                ))}
              </div>
            )}

            {/* 오른쪽: 관련 영상 */}
            {artwork?.youtube_urls && artwork.youtube_urls.length > 0 && (
              <div className="space-y-3">
                {artwork.youtube_urls.map((url: string, index: number) => (
                  <YouTubeCard
                    key={index}
                    url={url}
                    title={`관련 영상 ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Creation Date */}
        <div className="pt-6 border-t border-gray-200">
          {/* PC: 간단한 인라인 표시 */}
          <div className="hidden lg:inline-flex items-center space-x-2 text-sm text-gray-500">
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

          {/* 모바일: 중앙 정렬 배지 스타일 */}
          <div className="text-center lg:hidden">
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
