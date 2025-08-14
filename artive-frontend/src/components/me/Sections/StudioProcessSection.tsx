import React from "react";
import { SectionProps } from "../../../utils/types";

const StudioProcessSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작업공간 소개
        </label>
        <textarea
          value={data?.studio_description || ""}
          onChange={(e) => onChange("studio_description", e.target.value)}
          placeholder="작업실 환경, 주로 사용하는 도구와 재료, 작업 과정에 대해 소개해주세요."
          rows={isMobile ? 6 : 8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작업 과정 영상 1
        </label>
        <input
          type="url"
          value={data?.process_video_1 || ""}
          onChange={(e) => onChange("process_video_1", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">작업 과정을 보여주는 영상</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          작업 과정 영상 2
        </label>
        <input
          type="url"
          value={data?.process_video_2 || ""}
          onChange={(e) => onChange("process_video_2", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">추가 작업 영상 (선택사항)</p>
      </div>
    </div>
  );
};

export default StudioProcessSection;
