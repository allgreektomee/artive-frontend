import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authUtils } from "@/utils/auth";
interface ArtworkDetailHeaderProps {
  onBack: () => void;
  artworkTitle: string;
  showTitle: boolean;
  isOwner: boolean;
  artworkId: number;
  userId?: number;
  artistId?: number;
  onDelete?: () => void;
  onEdit?: () => void;
  galleryName?: string;
}

const ArtworkDetailHeader: React.FC<ArtworkDetailHeaderProps> = ({
  onBack,
  artworkTitle,
  showTitle,
  isOwner,
  artworkId,
  onDelete,
  onEdit,
  galleryName,
}) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/artworks/${artworkId}`;
    const shareTitle = artworkTitle || "Artwork";
    const shareText = `Check out this artwork: ${shareTitle}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);

        const toast = document.createElement("div");
        toast.className =
          "fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-lg z-50";
        toast.textContent = "Link copied!";
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.remove();
        }, 2000);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = authUtils.getToken();
      const response = await fetch(`${backEndUrl}/api/artworks/${artworkId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        if (onDelete) {
          onDelete();
        }
      } else {
        alert("삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  // 제목 truncate 처리 함수
  const getTruncatedTitle = (maxLength: number = 150) => {
    if (!artworkTitle) return "";
    if (artworkTitle.length > maxLength) {
      return artworkTitle.substring(0, maxLength) + "...";
    }
    return artworkTitle;
  };

  return (
    <>
      {/* 통합 헤더 (PC & 모바일 동일) */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between h-14 px-4">
          {/* 왼쪽 영역 */}
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={onBack}
              className="flex items-center flex-shrink-0 text-gray-600 hover:text-gray-900"
            >
              <svg
                className="w-5 h-5 mr-1"
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
              <span className="text-sm">Back</span>
            </button>

            {/* 구분선 - 간격 통일 */}
            <span className="text-gray-300 mx-3 flex-shrink-0">|</span>

            {/* 갤러리명 또는 작품 제목 (더 넓은 공간) */}
            <span className="text-sm text-gray-600 truncate pr-4">
              {showTitle
                ? getTruncatedTitle()
                : galleryName
                ? `${galleryName}'s Gallery`
                : ""}
            </span>
          </div>

          {/* 오른쪽 버튼 영역 */}
          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            {/* PC에서만 편집/삭제 직접 표시 */}
            {isOwner && (
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Edit"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete"
                >
                  <svg
                    className="w-5 h-5"
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
              </div>
            )}

            {/* 모바일에서도 편집/삭제 직접 표시 */}
            {isOwner && (
              <div className="sm:hidden flex items-center space-x-1">
                <button
                  onClick={onEdit}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Edit"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete"
                >
                  <svg
                    className="w-5 h-5"
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
              </div>
            )}

            {/* iOS 스타일 공유 버튼 */}
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Share"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 12L12 8M12 8L16 12M12 8V21M5 4H19"
                />
              </svg>
            </button>

            {/* artive.com */}
            <span className="hidden sm:inline text-sm text-gray-400">
              artive.com
            </span>
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">작품 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 작품을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ArtworkDetailHeader;
