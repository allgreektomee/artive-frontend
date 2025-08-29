// components/artwork-detail/ArtworkHistoryTimeline.tsx
import React from "react";
import HistoryCard from "./HistoryCard";

interface History {
  id: number;
  title: string;
  content: string;
  media_url?: string | null;
  media_type: string;
  work_date: string;
  created_at: string;
}

interface ArtworkHistoryTimelineProps {
  histories: History[];
  onImageClick: (imageUrl: string) => void;
  onAddHistory: () => void;
  onEditHistory?: (history: History) => void; // 수정 함수 추가
  onDeleteHistory?: (historyId: number) => void; // 삭제 함수 추가
  isOwner?: boolean;
}

const ArtworkHistoryTimeline: React.FC<ArtworkHistoryTimelineProps> = ({
  histories,
  onImageClick,
  onAddHistory,
  onEditHistory,
  onDeleteHistory,
  isOwner = false,
}) => {
  if (histories.length === 0) {
    return (
      <div className="space-y-6 lg:space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Creation Process
          </h2>
          {isOwner && (
            <button
              onClick={onAddHistory}
              className="flex items-center space-x-1 lg:space-x-2 bg-gray-600 text-white px-3 lg:px-4 py-2 rounded-full hover:bg-gray-800 transition-colors group text-sm lg:text-base"
            >
              <span className="text-xs lg:text-sm group-hover:rotate-90 transition-transform">
                +
              </span>
              <span className="hidden md:inline">Add Process</span>
              <span className="md:hidden">Add</span>
            </button>
          )}
        </div>

        {/* Empty State */}
        <div className="text-center py-12 lg:py-16">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
          </div>
          <h3 className="text-lg lg:text-xl font-semibold text-gray-600 mb-2">
            No Process History Yet
          </h3>
          <p className="text-gray-500 mb-6 text-sm lg:text-base">
            Start documenting your creative journey!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Creation Process
        </h2>
      </div>

      <div className="flex items-center justify-end">
        {isOwner && (
          <div className="flex justify-center my-2">
            <button
              onClick={() => onAddHistory()}
              className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-white hover:bg-gray-50 text-gray-600 border border-gray-300 hover:border-gray-400 rounded-full font-medium text-[13px] sm:text-[14px] md:text-[15px] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
              <span>Add New Process </span>
            </button>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Main Timeline Container */}
        <div className="space-y-0">
          {histories.map((history, index) => (
            <HistoryCard
              key={history.id}
              history={history}
              onImageClick={onImageClick}
              onEdit={onEditHistory} // 수정 함수 전달
              onDelete={onDeleteHistory} // 삭제 함수 전달
              isOwner={isOwner} // 소유자 여부 전달
              isFirst={index === 0}
              isLast={index === histories.length - 1}
            />
          ))}
        </div>

        {/* Completion Badge */}
        <div className="flex justify-center mt-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🎉</span>
              <span className="font-medium">Creation Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtworkHistoryTimeline;
