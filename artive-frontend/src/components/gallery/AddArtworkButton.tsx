// components/gallery/AddArtworkButton.tsx
import React from "react";

interface AddArtworkButtonProps {
  isOwner: boolean;
  onClick: () => void;
  isMobileGridMode?: "single" | "double";
  onMobileGridChange?: (mode: "single" | "double") => void;
}

const AddArtworkButton: React.FC<AddArtworkButtonProps> = ({
  isOwner,
  onClick,
}) => {
  if (!isOwner) return null;

  return (
    <div className="flex justify-end mb-4 sm:mb-6 mt-4">
      {/* 작품 추가 버튼만 유지 */}
      <button
        onClick={onClick}
        className="bg-black text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center space-x-2 text-sm sm:text-base"
      >
        <span className="text-lg sm:text-xl">+</span>
        <span>Add</span>
      </button>
    </div>
  );
};

export default AddArtworkButton;
