// components/artworks/new/ArtworkImageUpload.tsx
import React from "react";
import { FaImage, FaTimes } from "react-icons/fa";

interface ArtworkImageUploadProps {
  imageUrl: string;
  imagePreview: string | null;
  onImageChange: (imageUrl: string, preview: string | null) => void;
  onError: (error: string) => void;
  loading?: boolean;
}

const ArtworkImageUpload: React.FC<ArtworkImageUploadProps> = ({
  imageUrl,
  imagePreview,
  onImageChange,
  onError,
  loading = false,
}) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      onError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB 제한
      onError("파일 크기는 10MB 이하여야 합니다.");
      return;
    }

    try {
      // 로딩 상태 시작 (미리보기 먼저 표시)
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onImageChange("", result); // 임시 미리보기
      };
      reader.readAsDataURL(file);

      // S3에 업로드
      const token = localStorage.getItem("access_token");
      if (!token) {
        onError("로그인이 필요합니다.");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      const backEndUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
      const response = await fetch(`${backEndUrl}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "업로드에 실패했습니다.");
      }

      const data = await response.json();

      // S3 URL로 업데이트
      onImageChange(data.url, data.url);
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("이미지 업로드 중 오류가 발생했습니다.");
      }
      // 실패 시 미리보기 제거
      onImageChange("", null);
    }
  };

  const removeImage = () => {
    onImageChange("", null);
    // 파일 입력 초기화
    const fileInput = document.getElementById(
      "thumbnail-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">대표 이미지</h2>

      <div className="max-w-md mx-auto">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          {imagePreview ? (
            <div className="relative">
              <img
                src={imagePreview}
                alt="대표 이미지 미리보기"
                className="w-full max-h-96 object-contain rounded bg-gray-50"
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={loading}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                title="이미지 제거"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          ) : (
            <>
              <FaImage className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500 mb-4">
                작품의 대표 이미지를 업로드하세요
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="thumbnail-upload"
                disabled={loading}
              />
              <label
                htmlFor="thumbnail-upload"
                className={`cursor-pointer bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "업로드 중..." : "이미지 선택"}
              </label>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, GIF (최대 10MB)
              </p>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 mt-3 text-center">
          💡 작업 과정은 작품 등록 후 상세페이지에서 히스토리로 추가할 수
          있습니다
        </p>
      </div>
    </div>
  );
};

export default ArtworkImageUpload;
