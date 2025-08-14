import React from "react";
import { SectionProps } from "../../../utils/types";

const AboutArtistSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          아티스트 소개글
        </label>
        <textarea
          value={data?.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="작가로서의 배경, 작업 철학, 예술적 여정에 대해 자세히 소개해주세요."
          rows={isMobile ? 6 : 8}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          유튜브 링크 1
        </label>
        <input
          type="url"
          value={data?.youtube_url_1 || ""}
          onChange={(e) => onChange("youtube_url_1", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          작업 과정이나 작가 인터뷰 영상
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          유튜브 링크 2
        </label>
        <input
          type="url"
          value={data?.youtube_url_2 || ""}
          onChange={(e) => onChange("youtube_url_2", e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">추가 영상 (선택사항)</p>
      </div>
    </div>
  );
};

export default AboutArtistSection;
