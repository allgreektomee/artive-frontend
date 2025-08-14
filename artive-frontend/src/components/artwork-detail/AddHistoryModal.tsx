// components/artwork-detail/AddHistoryModal.tsx
import React, { useState, useEffect } from "react";

interface AddHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (historyData: HistoryFormData) => void;
  loading?: boolean;
}

interface HistoryFormData {
  title: string;
  content: string;
  media_type: "text" | "image" | "youtube";
  media_url?: string;
  work_date: string;
}

const AddHistoryModal: React.FC<AddHistoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [form, setForm] = useState<HistoryFormData>({
    title: "",
    content: "",
    media_type: "text",
    media_url: "",
    work_date: new Date().toISOString().split("T")[0],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, loading]);

  // 폼 리셋
  useEffect(() => {
    if (!isOpen) {
      setForm({
        title: "",
        content: "",
        media_type: "text",
        media_url: "",
        work_date: new Date().toISOString().split("T")[0],
      });
      setImagePreview(null);
      setYoutubePreview(null);
      setErrors([]);
    }
  }, [isOpen]);

  const extractYouTubeVideoId = (url: string): string | null => {
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // 유튜브 URL 미리보기
    if (name === "media_url" && form.media_type === "youtube") {
      const videoId = extractYouTubeVideoId(value);
      setYoutubePreview(videoId);
    }

    // 에러 클리어
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const [selectedEmoji, setSelectedEmoji] = useState("🎨");

  const quickEmojis = [
    "🎨",
    "🖌️",
    "📸",
    "🎬",
    "🚀",
    "✨",
    "📺",
    "😊",
    "🔥",
    "💡",
    "🖼️",
  ];

  const handleMediaTypeChange = (type: "text" | "image" | "youtube") => {
    setForm((prev) => ({
      ...prev,
      media_type: type,
      media_url: type === "text" ? "" : prev.media_url,
    }));
    setImagePreview(null);
    setYoutubePreview(null);
    setErrors([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 검증
    if (!file.type.startsWith("image/")) {
      setErrors(["이미지 파일만 업로드 가능합니다."]);
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors(["파일 크기는 10MB 이하여야 합니다."]);
      return;
    }

    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setForm((prev) => ({ ...prev, media_url: result }));
    };
    reader.readAsDataURL(file);
  };

  const validateForm = (): string[] => {
    const newErrors: string[] = [];

    if (!form.title.trim()) {
      newErrors.push("제목을 입력해주세요.");
    }

    if (!form.content.trim()) {
      newErrors.push("내용을 입력해주세요.");
    }

    if (form.media_type === "youtube" && form.media_url) {
      const videoId = extractYouTubeVideoId(form.media_url);
      if (!videoId) {
        newErrors.push("올바른 유튜브 URL을 입력해주세요.");
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // setLoading(true); // 이 줄 완전 삭제

    try {
      // 히스토리 데이터 직접 전송
      onSubmit({
        title: form.title,
        content: form.content,
        media_type: form.media_type,
        media_url: form.media_url,
        work_date: form.work_date,
      });
    } catch (error) {
      console.error("히스토리 추가 실패:", error);
      setErrors(["히스토리 추가에 실패했습니다."]);
    }
    // setLoading(false); // 이 줄도 완전 삭제
  };

  const getMediaTypeIcon = (type: string) => {
    const icons = {
      text: "📝",
      image: "🖼️",
      youtube: "🎬",
    };
    return icons[type as keyof typeof icons] || "📝";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Add New Process
            </h2>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
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
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="text-red-600 text-sm space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Media Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["text", "image", "youtube"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleMediaTypeChange(type)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    form.media_type === type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-2xl mb-2">{getMediaTypeIcon(type)}</div>
                  <div className="text-sm font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Icon */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Icon</label>
            <div className="flex flex-wrap gap-2">
              {quickEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`w-10 h-10 text-xl rounded-lg transition-colors ${
                    selectedEmoji === emoji
                      ? "bg-blue-100 ring-2 ring-blue-500"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={form.title}
              onChange={handleInputChange}
              disabled={loading}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              placeholder="작업 과정의 제목을 입력하세요"
            />
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <textarea
              id="content"
              name="content"
              value={form.content}
              onChange={handleInputChange}
              disabled={loading}
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 resize-none"
              placeholder="작업 과정에 대한 설명을 입력하세요"
            />
          </div>

          {/* Media Upload */}
          {form.media_type === "image" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image
              </label>
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setForm((prev) => ({ ...prev, media_url: "" }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <svg
                      className="w-4 h-4"
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
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <div className="text-gray-400 mb-2">📷</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={loading}
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors inline-block"
                  >
                    Choose Image
                  </label>
                </div>
              )}
            </div>
          )}

          {form.media_type === "youtube" && (
            <div>
              <label
                htmlFor="media_url"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                YouTube URL
              </label>
              <input
                type="url"
                id="media_url"
                name="media_url"
                value={form.media_url}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              {youtubePreview && (
                <div
                  className="mt-3 relative w-full bg-black rounded-lg overflow-hidden"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubePreview}`}
                    title="YouTube Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          )}

          {/* Work Date */}
          <div>
            <label
              htmlFor="work_date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Work Date
            </label>
            <input
              type="date"
              id="work_date"
              name="work_date"
              value={form.work_date}
              onChange={handleInputChange}
              disabled={loading}
              max={new Date().toISOString().split("T")[0]}
              className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.title.trim() || !form.content.trim()}
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : (
                "Add Process"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHistoryModal;
