// components/profile/sections/AboutArtistSection.tsx
import React, { useState, useEffect } from "react";
import { SectionProps } from "../../../utils/types";

const AboutArtistSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
  onSave,
  saving,
  hasChanges,
}) => {
  // 로컬 state로 관리 - 필드명 수정
  const [localData, setLocalData] = useState({
    artist_statement: "",
    about_image: "",
    about_video: "",
  });

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // data prop이 변경될 때 로컬 state 업데이트 - 수정
  useEffect(() => {
    if (data) {
      setLocalData({
        artist_statement: data.artist_statement || data.about_text || "",
        about_image: data.about_image || "",
        about_video: data.about_video || "",
      });
      setImagePreview(data.about_image || "");
    }
  }, [
    data?.artist_statement,
    data?.about_text,
    data?.about_image,
    data?.about_video,
  ]);

  // 로컬 변경 처리
  const handleLocalChange = (field: string, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  // blur 이벤트에서 부모 컴포넌트로 전달
  const handleBlur = (field: string) => {
    onChange(field, localData[field as keyof typeof localData]);
  };

  // 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 체크 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 파일 타입 체크
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("access_token");
      const response = await fetch(`${backEndUrl}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImagePreview(data.url);
        handleLocalChange("about_image", data.url);
        onChange("about_image", data.url);
      } else {
        alert("이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  // 이미지 제거
  const handleImageRemove = () => {
    setImagePreview("");
    handleLocalChange("about_image", "");
    onChange("about_image", "");
  };

  // 유튜브 URL에서 ID 추출
  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  return (
    <div className="space-y-6">
      {/* PC에서만 보이는 타이틀과 저장 버튼 */}
      {!isMobile && (
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              아티스트 소개
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              작가로서의 이야기와 작업 철학을 소개하세요
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

      {/* 소개 텍스트 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          소개 글
        </label>
        <textarea
          value={localData.artist_statement}
          onChange={(e) =>
            handleLocalChange("artist_statement", e.target.value)
          }
          onBlur={() => handleBlur("artist_statement")}
          placeholder="작가로서의 배경, 작업 철학, 예술적 여정, 영감의 원천 등을 자세히 소개해주세요."
          rows={isMobile ? 8 : 10}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
        <p className="text-xs text-gray-500 mt-1">
          갤러리 방문자들에게 보여질 소개 글입니다
        </p>
      </div>

      {/* 대표 이미지 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          대표 이미지
        </label>
        <div className="space-y-4">
          {imagePreview ? (
            <div className="relative group w-full">
              <img
                src={imagePreview}
                alt="대표 이미지"
                className="w-full h-auto rounded-lg border border-gray-200"
              />
              <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={handleImageRemove}
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
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
                <label
                  htmlFor="about-image-upload"
                  className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <svg
                    className="w-4 h-4 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </label>
              </div>
            </div>
          ) : (
            <label
              htmlFor="about-image-upload"
              className="relative block w-full h-64 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-600 font-medium">
                  클릭하여 이미지 업로드
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  또는 파일을 드래그하세요
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  JPG, PNG (최대 5MB)
                </p>
              </div>
            </label>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            id="about-image-upload"
          />
        </div>
      </div>

      {/* 유튜브 영상 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          소개 영상
        </label>
        <input
          type="url"
          value={localData.about_video}
          onChange={(e) => handleLocalChange("about_video", e.target.value)}
          onBlur={() => handleBlur("about_video")}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">
          인터뷰나 작업 과정 영상 링크
        </p>

        {/* 유튜브 미리보기 */}
        {localData.about_video && extractYoutubeId(localData.about_video) && (
          <div className="mt-4 aspect-video bg-gray-100 rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${extractYoutubeId(
                localData.about_video
              )}`}
              className="w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
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

export default React.memo(AboutArtistSection);
