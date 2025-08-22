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
    <div className="flex justify-center my-6 sm:my-8">
      <button
        onClick={onClick}
        className="group relative flex items-center gap-1 sm:gap-1.5 md:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 
        bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 
        hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 
        text-white rounded-full font-medium text-[13px] sm:text-[14px] md:text-[15px] 
        shadow-lg hover:shadow-xl transition-all duration-300 
        overflow-hidden"
      >
        {/* 내부 광택 효과 */}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* 호버 시 슬라이딩 효과 */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

        <svg
          className="w-3.5 sm:w-4 h-3.5 sm:h-4 relative z-10"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <span className="relative z-10">Add New Artwork</span>
      </button>
    </div>
  );
};

export default AddArtworkButton;
