// components/profile/sections/BasicInfoSection.tsx
import React, { useState, useEffect } from "react";
import { SectionProps } from "../../../utils/types";

const BasicInfoSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
  onSave,
  saving,
  hasChanges,
}) => {
  // 로컬 state로 관리
  const [localData, setLocalData] = useState({
    email: data?.email || "",
    name: data?.name || "",
    gallery_title: data?.gallery_title || "",
    bio: data?.bio || "",
    slug: data?.slug || "",
    gallery_description: data?.gallery_description || "",
    instagram_username: data?.instagram_username || "",
    youtube_channel_id: data?.youtube_channel_id || "",
  });

  // data prop이 변경될 때만 로컬 state 업데이트
  useEffect(() => {
    setLocalData({
      email: data?.email || "",
      name: data?.name || "",
      gallery_title: data?.gallery_title || "",
      bio: data?.bio || "",
      slug: data?.slug || "",
      gallery_description: data?.gallery_description || "",
      instagram_username: data?.instagram_username || "",
      youtube_channel_id: data?.youtube_channel_id || "",
    });
  }, [data?.id]); // data.id가 변경될 때만 (새로운 데이터 로드시)

  // 로컬 변경 처리
  const handleLocalChange = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  // blur 이벤트에서 부모 컴포넌트로 전달
  const handleBlur = (field: string) => {
    onChange(field, localData[field as keyof typeof localData]);
  };

  return (
    <div className="space-y-6">
      {/* PC에서만 보이는 타이틀과 저장 버튼 */}
      {!isMobile && (
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">기본 정보</h2>
            <p className="text-sm text-gray-500 mt-1">
              아티스트 기본 정보와 갤러리 주소를 설정하세요
            </p>
          </div>
          <button
            onClick={onSave}
            disabled={!hasChanges || saving}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              hasChanges && !saving
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      )}

      {/* 이메일 - 제일 위에 한 줄로 */}
      <div>
        <label className="block text-sm font-medium mb-2">이메일</label>
        <input
          type="email"
          value={localData.email}
          disabled
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
        />
      </div>

      {/* 이름 / 갤러리 이름 - 두 칸으로 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">이름</label>
          <input
            type="text"
            value={localData.name}
            onChange={(e) => handleLocalChange("name", e.target.value)}
            onBlur={() => handleBlur("name")}
            placeholder="아티스트 이름"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">갤러리 이름</label>
          <input
            type="text"
            value={localData.gallery_title}
            onChange={(e) => handleLocalChange("gallery_title", e.target.value)}
            onBlur={() => handleBlur("gallery_title")}
            placeholder="갤러리명"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 한 줄 소개 */}
      <input
        type="text"
        value={localData.bio} // data.bio → localData.bio
        onChange={(e) => handleLocalChange("bio", e.target.value)}
        onBlur={() => handleBlur("bio")}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="예: 자연과 인간의 관계를 탐구하는 작가"
        maxLength={100}
      />

      {/* 갤러리 주소 */}
      <div>
        <label className="block text-sm font-medium mb-2">갤러리 주소</label>
        <div className="flex">
          <span className="bg-gray-100 border border-r-0 border-gray-300 px-3 py-3 rounded-l-lg text-gray-600 text-sm">
            artivefor.me/
          </span>
          <input
            type="text"
            value={localData.gallery_description} // data.gallery_description → localData.gallery_description
            onChange={(e) =>
              handleLocalChange("gallery_description", e.target.value)
            }
            onBlur={() => handleBlur("gallery_description")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="예: 현대미술과 전통의 조화를 추구하는 갤러리"
            maxLength={150}
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          영문 소문자, 숫자, 하이픈(-)만 사용 가능합니다
        </p>
      </div>

      {/* 갤러리 소개 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          갤러리 한줄소개
          <span className="text-xs text-gray-500 ml-2">
            (갤러리 헤더 메시지)
          </span>
        </label>
        <input
          type="text"
          value={data.gallery_description || ""}
          onChange={(e) => onChange("gallery_description", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="예: 현대미술과 전통의 조화를 추구하는 갤러리"
          maxLength={150}
        />
      </div>

      {/* SNS 링크 */}
      <div className="border-t pt-6">
        <h4 className="text-lg font-medium mb-4">SNS 링크</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              📸 Instagram
            </label>
            <input
              type="text"
              value={localData.instagram_username}
              onChange={(e) =>
                handleLocalChange("instagram_username", e.target.value)
              }
              onBlur={() => handleBlur("instagram_username")}
              placeholder="username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">📺 YouTube</label>
            <input
              type="text"
              value={localData.youtube_channel_id}
              onChange={(e) =>
                handleLocalChange("youtube_channel_id", e.target.value)
              }
              onBlur={() => handleBlur("youtube_channel_id")}
              placeholder="@channel"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 모바일에서만 보이는 하단 저장 버튼 */}
      {isMobile && (
        <div className="pt-6 border-t">
          <button
            onClick={onSave}
            disabled={!hasChanges || saving}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              hasChanges && !saving
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {saving ? "저장 중..." : "저장하기"}
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(BasicInfoSection);
