// components/artwork-detail/ArtworkDetailHeader.tsx
import React, { useState } from "react";

interface ArtworkDetailHeaderProps {
  onBack: () => void;
  artworkTitle?: string;
  showTitle?: boolean;
  isOwner?: boolean; // 소유주 여부
  artworkId?: number; // 삭제할 artwork ID
  onDelete?: () => void; // 삭제 성공 후 콜백
}

const ArtworkDetailHeader: React.FC<ArtworkDetailHeaderProps> = ({
  onBack,
  artworkTitle = "",
  showTitle = false,
  isOwner = false,
  artworkId,
  onDelete,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!artworkId) return;

    setIsDeleting(true);
    try {
      const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const token = localStorage.getItem("token");

      // Artwork와 관련 history 삭제 API 호출
      const response = await fetch(`${backEndUrl}/api/artworks/${artworkId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error("작품 삭제에 실패했습니다");
      }

      // 삭제 성공 시 콜백 실행 (갤러리로 이동 등)
      if (onDelete) {
        onDelete();
      }
    } catch (error) {
      console.error("Error deleting artwork:", error);
      alert("작품 삭제에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side - Back Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors group p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-6 h-6 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </div>
                <span className="font-medium hidden sm:inline">
                  Back to Gallery
                </span>
                <span className="font-medium sm:hidden">Back</span>
              </button>

              {/* Artwork Title (when scrolled) */}
              {showTitle && artworkTitle && (
                <div className="flex items-center space-x-3 border-l border-gray-300 pl-4">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  <h1 className="text-lg font-semibold text-gray-900 truncate max-w-xs lg:max-w-md">
                    {artworkTitle}
                  </h1>
                </div>
              )}
            </div>

            {/* Right Side - Brand & Actions */}
            <div className="flex items-center space-x-4">
              {/* Delete Button (소유주일 때만 표시) */}
              {isOwner && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors group"
                  title="Delete artwork"
                >
                  <svg
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
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

              {/* Share Button */}
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors group">
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>

              {/* Brand */}
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">A</span>
                </div>
                <span className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                  artive.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
            style={{ width: showTitle ? "100%" : "0%" }}
          />
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            {/* Modal Header */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  작품 삭제
                </h3>
                <p className="text-sm text-gray-500">
                  이 작업은 되돌릴 수 없습니다
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="space-y-3 py-2">
              <p className="text-gray-700">
                정말 <span className="font-semibold">"{artworkTitle}"</span>{" "}
                작품을 삭제하시겠습니까?
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  ⚠️ 다음 항목들이 영구적으로 삭제됩니다:
                </p>
                <ul className="text-sm text-red-700 mt-2 space-y-1 ml-4">
                  <li>• 작품 및 모든 상세 정보</li>
                  <li>• 이 작품의 모든 편집 히스토리</li>
                  <li>• 관련된 모든 파일과 이미지</li>
                </ul>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>삭제 중...</span>
                  </>
                ) : (
                  <span>작품 삭제</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkDetailHeader;
