// components/artwork-detail/ImageModal.tsx
import React, { useEffect } from "react";

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageTitle?: string;
  imageSubtitle?: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  imageTitle,
  imageSubtitle,
  onClose,
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden"; // 스크롤 방지
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset"; // 스크롤 복원
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Modal Content */}
      <div className="relative max-w-full max-h-full flex flex-col items-center">
        {/* Image Container */}
        <div
          className="relative max-w-full max-h-[80vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={imageTitle || "Full size image"}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            style={{ maxHeight: "80vh" }}
          />
        </div>

        {/* Image Info */}
        {(imageTitle || imageSubtitle) && (
          <div className="mt-6 text-center max-w-lg">
            {imageTitle && (
              <h3 className="text-xl font-semibold text-white mb-2">
                {imageTitle}
              </h3>
            )}
            {imageSubtitle && (
              <p className="text-gray-300 text-sm">{imageSubtitle}</p>
            )}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all duration-200 group"
          title="Close (ESC)"
        >
          <svg
            className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default ImageModal;
