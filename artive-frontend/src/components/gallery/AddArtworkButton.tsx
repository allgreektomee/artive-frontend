const AddArtworkButton: React.FC<AddArtworkButtonProps> = ({
  isOwner,
  onClick,
  isMobileGridMode = "double",
  onMobileGridChange,
}) => {
  const toggleGridMode = () => {
    const newMode = isMobileGridMode === "single" ? "double" : "single";
    onMobileGridChange?.(newMode);
  };

  return (
    <div className="flex items-center justify-end space-x-3 mb-6">
      {/* 모바일 그리드 토글 (모바일에서만 표시) */}
      <div className="lg:hidden">
        <button
          onClick={toggleGridMode}
          className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          title={isMobileGridMode === "single" ? "2열로 보기" : "1열로 보기"}
        >
          {isMobileGridMode === "single" ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 3h18v4H3V3zm0 6h18v4H3V9zm0 6h18v4H3v-4z" />
            </svg>
          )}
        </button>
      </div>

      {/* 작품 추가 버튼 */}
      {isOwner && (
        <button
          onClick={onClick}
          className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <span className="text-sm">+</span>
          <span className="hidden sm:inline">Add Artwork</span>
          <span className="sm:hidden">Add</span>
        </button>
      )}
    </div>
  );
};

export default AddArtworkButton;
