import React from "react";
import { SectionProps } from "../../../utils/types";

const BasicInfoSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">이름</label>
          <input
            type="text"
            value={data?.name || ""}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="아티스트 이름"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">이메일</label>
          <input
            type="email"
            value={data?.email || ""}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">갤러리 주소</label>
        <div className="flex">
          <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm">
            artivefor.me/
          </span>
          <input
            type="text"
            value={data?.slug || ""}
            onChange={(e) => onChange("slug", e.target.value)}
            placeholder="gallery-name"
            className="flex-1 border border-gray-300 px-4 py-3 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">자기소개</label>
        <textarea
          value={data?.bio || ""}
          onChange={(e) => onChange("bio", e.target.value)}
          placeholder="아티스트로서의 간단한 소개를 적어주세요"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      <div className="border-t pt-6">
        <h4 className="text-lg font-medium mb-4">SNS 링크</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              📸 Instagram
            </label>
            <input
              type="url"
              value={data?.instagram_url || ""}
              onChange={(e) => onChange("instagram_url", e.target.value)}
              placeholder="https://instagram.com/username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📺 YouTube</label>
            <input
              type="url"
              value={data?.youtube_url || ""}
              onChange={(e) => onChange("youtube_url", e.target.value)}
              placeholder="https://youtube.com/@username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
