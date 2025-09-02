// components/artwork-detail/HistoryCard.tsx
import React from "react";

interface HistoryCardProps {
  history: {
    id: number;
    title: string;
    content: string;
    media_url?: string | null;
    thumbnail_url?: string | null;
    media_type: string;
    work_date: string;
    created_at: string;
  };
  onImageClick: (imageUrl: string) => void;
  onDelete?: (historyId: number) => void;
  isOwner?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const HistoryCard: React.FC<HistoryCardProps> = ({
  history,
  onImageClick,
  onDelete,
  isOwner = false,
  isFirst = false,
  isLast = false,
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "long",
      day: "numeric",
    });
  };

  const getHistoryIcon = (mediaType: string, index: number) => {
    const iconMap = {
      image: { emoji: "🎨", color: "from-blue-500 to-indigo-600" },
      youtube: { emoji: "📹", color: "from-red-500 to-pink-600" },
      video: { emoji: "🎬", color: "from-purple-500 to-violet-600" },
      text: { emoji: "✍️", color: "from-green-500 to-emerald-600" },
      sketch: { emoji: "✏️", color: "from-orange-500 to-amber-600" },
      color: { emoji: "🎭", color: "from-cyan-500 to-teal-600" },
      detail: { emoji: "🔍", color: "from-rose-500 to-pink-600" },
      final: { emoji: "✨", color: "from-yellow-500 to-orange-600" },
    };

    const iconInfo =
      iconMap[mediaType as keyof typeof iconMap] || iconMap["text"];

    return (
      <div
        className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br ${iconInfo.color} flex items-center justify-center text-white shadow-lg transform transition-all duration-300 group-hover:scale-110`}
      >
        <span className="text-xs sm:text-sm md:text-base">
          {iconInfo.emoji}
        </span>
      </div>
    );
  };

  const extractYouTubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const renderMedia = () => {
    if (!history.media_url) return null;

    if (history.media_type === "youtube") {
      const videoId = extractYouTubeVideoId(history.media_url);
      if (videoId) {
        return (
          <div
            className="relative w-full bg-black rounded-lg overflow-hidden"
            style={{ paddingBottom: "56.25%" }}
          >
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={history.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        );
      }
    }

    return (
      <div
        className="cursor-pointer group/image"
        onClick={(e) => {
          e.stopPropagation();
          onImageClick(history.media_url!);
        }}
      >
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={history.thumbnail_url}
            alt={history.title}
            className="w-full h-auto object-contain transition-transform duration-700"
          />
        </div>
      </div>
    );
  };

  const handleDelete = () => {
    if (
      confirm(
        "이 히스토리를 삭제하시겠습니까?\n수정이 필요한 경우 삭제 후 다시 추가해주세요."
      )
    ) {
      onDelete?.(history.id);
    }
  };

  return (
    <div className="relative flex items-start space-x-3 sm:space-x-4 md:space-x-6 group">
      {/* Timeline Connection */}
      {!isLast && (
        <div className="absolute left-4 sm:left-5 md:left-6 top-8 sm:top-10 md:top-12 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 via-gray-200 to-transparent"></div>
      )}

      {/* Timeline Node */}
      <div className="relative z-10 flex-shrink-0 mt-1">
        {getHistoryIcon(history.media_type, history.id)}
      </div>

      {/* Content Card */}
      <div className="flex-1 min-w-0 mb-6 sm:mb-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 relative">
          {/* Card Header */}
          <div className="p-4 sm:p-5 md:p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 flex-1 pr-3 leading-tight">
                {history.title}
              </h3>

              <div className="flex items-center space-x-2">
                {/* 수정/삭제 버튼 - 소유자일 때만 표시 */}
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="삭제"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                )}

                {/* 날짜 표시 */}
                <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap flex-shrink-0 bg-gray-50 px-2 py-1 rounded-full">
                  {formatDate(history.work_date)}
                </div>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
              {history.content}
            </p>
          </div>

          {/* Media Content */}
          {history.media_url && (
            <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6">
              {renderMedia()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
