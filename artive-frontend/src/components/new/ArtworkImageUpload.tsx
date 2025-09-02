// components/new/ArtworkImageUpload.tsx
import React, { useState, useRef } from "react";
import { FaImage, FaTimes, FaUpload } from "react-icons/fa";

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
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith("image/")) {
      onError("이미지 파일만 업로드 가능합니다.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB 제한 (artwork용)
      onError("파일 크기는 20MB 이하여야 합니다.");
      return;
    }

    try {
      setUploading(true);
      onError(""); // 에러 초기화

      // 1. 먼저 미리보기 표시
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        onImageChange("", result); // 임시 미리보기
      };
      reader.readAsDataURL(file);

      // 2. 토큰 확인 (token으로 통일)
      const token = localStorage.getItem("access_token");
      if (!token) {
        onError("로그인이 필요합니다.");
        onImageChange("", null);
        setUploading(false);
        return;
      }

      // 3. FormData 생성
      const formData = new FormData();
      formData.append("file", file);

      console.log("📤 S3 업로드 시작:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        endpoint: `${backEndUrl}/api/upload/artwork`, // 올바른 경로
      });

      // 4. S3에 업로드 (올바른 엔드포인트 사용)
      const response = await fetch(`${backEndUrl}/api/upload/artwork`, {
        // /api 추가
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("📡 업로드 응답 상태:", response.status);

      if (!response.ok) {
        // 404 에러인 경우 더 자세한 메시지
        if (response.status === 404) {
          console.error(
            "❌ 업로드 API를 찾을 수 없습니다. 백엔드 라우터를 확인하세요."
          );
          throw new Error(
            "이미지 업로드 API가 없습니다. URL을 직접 입력해주세요."
          );
        }

        const errorData = await response
          .json()
          .catch(() => ({ detail: "업로드 실패" }));
        console.error("❌ 업로드 실패:", errorData);
        throw new Error(errorData.detail || "업로드에 실패했습니다.");
      }

      const data = await response.json();
      console.log("✅ S3 업로드 성공:", data);

      // 5. S3 URL로 업데이트 (file_url 사용)
      const uploadedUrl = data.file_url || data.url;

      if (!uploadedUrl || uploadedUrl === "string") {
        throw new Error("유효한 이미지 URL을 받지 못했습니다.");
      }

      onImageChange(uploadedUrl, uploadedUrl);
      console.log("✅ 이미지 URL 설정 완료:", uploadedUrl);
    } catch (error) {
      console.error("❌ 이미지 업로드 오류:", error);
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError("이미지 업로드 중 오류가 발생했습니다.");
      }
      // 실패 시 미리보기 제거
      onImageChange("", null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onImageChange("", null);
    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    console.log("🗑️ 이미지 제거됨");
  };

  // URL 직접 입력 핸들러
  const handleUrlInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onImageChange(url, url);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">대표 이미지</h2>

      <div className="max-w-md mx-auto">
        {/* 이미지가 있을 때 */}
        {imagePreview || imageUrl ? (
          <div className="relative">
            <img
              src={imagePreview || imageUrl}
              alt="대표 이미지 미리보기"
              className="w-full max-h-96 object-contain rounded bg-gray-50 border-2 border-gray-200"
              onError={(e) => {
                console.error("❌ 이미지 미리보기 실패");
                (e.target as HTMLImageElement).src =
                  "https://via.placeholder.com/400x300/f0f0f0/999999?text=Preview+Error";
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              disabled={loading || uploading}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors disabled:opacity-50"
              title="이미지 제거"
            >
              <FaTimes className="text-sm" />
            </button>

            {/* 업로드 중 표시 */}
            {uploading && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                <div className="text-white text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                  <p className="text-sm">업로드 중...</p>
                </div>
              </div>
            )}

            {/* URL 표시 */}
            {imageUrl && !uploading && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-700 break-all">
                ✅ 이미지 URL: {imageUrl.substring(0, 50)}...
              </div>
            )}
          </div>
        ) : (
          /* 이미지가 없을 때 */
          <div className="space-y-4">
            {/* 파일 업로드 영역 */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <FaImage className="mx-auto text-gray-400 text-4xl mb-4" />
              <p className="text-gray-500 mb-4">
                작품의 대표 이미지를 업로드하세요
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="thumbnail-upload"
                disabled={loading || uploading}
              />
              <label
                htmlFor="thumbnail-upload"
                className={`cursor-pointer bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-block ${
                  loading || uploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {uploading ? "업로드 중..." : "이미지 선택"}
              </label>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, GIF, WebP (최대 20MB)
              </p>
            </div>

            {/* 구분선 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">또는</span>
              </div>
            </div>

            {/* URL 직접 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이미지 URL 직접 입력
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={handleUrlInput}
                disabled={loading || uploading}
                placeholder="https://example.com/image.jpg"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                외부 이미지 URL을 직접 입력할 수 있습니다
              </p>
            </div>
          </div>
        )}

        <p className="text-sm text-gray-600 mt-3 text-center">
          💡 작업 과정은 작품 등록 후 상세페이지에서 히스토리로 추가할 수
          있습니다
        </p>
      </div>
    </div>
  );
};

export default ArtworkImageUpload;
