// components/artwork-detail/AddHistoryModal.tsx
import React, { useState, useEffect } from "react";

interface AddHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (historyData: HistoryFormData) => void;
  loading?: boolean;
  editingHistory?: any; // 수정할 히스토리 데이터
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
  editingHistory = null,
}) => {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [form, setForm] = useState<HistoryFormData>({
    title: "",
    content: "",
    media_type: "text",
    media_url: "",
    work_date: new Date().toISOString().split("T")[0],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [youtubePreview, setYoutubePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // 폼 리셋 및 수정 모드 처리
  useEffect(() => {
    if (isOpen && editingHistory) {
      // 수정 모드: 기존 데이터로 폼 세팅
      setForm({
        title: editingHistory.title || "",
        content: editingHistory.content || "",
        media_type: editingHistory.media_type || "text",
        media_url: editingHistory.media_url || "",
        work_date: editingHistory.work_date
          ? editingHistory.work_date.split("T")[0] // datetime을 date로 변환
          : new Date().toISOString().split("T")[0],
      });

      // 이미지 미리보기 설정
      if (editingHistory.media_type === "image" && editingHistory.media_url) {
        setImagePreview(editingHistory.media_url);
        setUploadedImageUrl(editingHistory.media_url);
      }

      // YouTube 미리보기 설정
      if (editingHistory.media_type === "youtube" && editingHistory.media_url) {
        const videoId = extractYouTubeVideoId(editingHistory.media_url);
        setYoutubePreview(videoId);
      }
    } else if (!isOpen) {
      // 모달 닫힐 때 폼 초기화
      setForm({
        title: "",
        content: "",
        media_type: "text",
        media_url: "",
        work_date: new Date().toISOString().split("T")[0],
      });
      setImagePreview(null);
      setUploadedImageUrl(null);
      setYoutubePreview(null);
      setErrors([]);
      setUploadingImage(false);
    }
  }, [isOpen, editingHistory]);

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
    // 수정 모드에서는 타입 변경 불가
    if (editingHistory) return;

    setForm((prev) => ({
      ...prev,
      media_type: type,
      media_url: type === "text" ? "" : prev.media_url,
    }));
    setImagePreview(null);
    setUploadedImageUrl(null);
    setYoutubePreview(null);
    setErrors([]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploadingImage(true);
    setErrors([]);

    try {
      // 1. 로컬 미리보기 생성
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // 2. S3에 업로드
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${backEndUrl}/api/upload/history`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("이미지 업로드 실패");
      }

      const data = await response.json();

      // S3 URL 저장
      const imageUrl = data.file_url || data.url;
      setUploadedImageUrl(imageUrl);
      setForm((prev) => ({ ...prev, media_url: imageUrl }));

      console.log("✅ 이미지 업로드 성공:", imageUrl);
    } catch (error) {
      console.error("이미지 업로드 오류:", error);
      setErrors(["이미지 업로드에 실패했습니다."]);
      setImagePreview(null);
      setUploadedImageUrl(null);
    } finally {
      setUploadingImage(false);
    }
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

    if (
      form.media_type === "image" &&
      imagePreview &&
      !uploadedImageUrl &&
      !uploadingImage
    ) {
      newErrors.push("이미지 업로드가 완료될 때까지 기다려주세요.");
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

    try {
      // 데이터 정리
      const submitData: HistoryFormData = {
        title: form.title.trim(),
        content: form.content.trim(),
        media_type: form.media_type,
        media_url:
          form.media_type === "text"
            ? undefined
            : form.media_type === "image"
            ? uploadedImageUrl || undefined
            : form.media_url || undefined,
        work_date: form.work_date,
      };

      console.log("📤 전송할 데이터:", submitData);

      onSubmit(submitData);
    } catch (error) {
      console.error("히스토리 추가 실패:", error);
      setErrors(["히스토리 추가에 실패했습니다."]);
    }
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
              {editingHistory ? "Edit Process" : "Add New Process"}
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
              Type{" "}
              {editingHistory && (
                <span className="text-xs text-gray-500">(수정 불가)</span>
              )}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["text", "image", "youtube"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => !editingHistory && handleMediaTypeChange(type)}
                  disabled={editingHistory}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    form.media_type === type
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  } ${
                    editingHistory
                      ? "opacity-60 cursor-not-allowed"
                      : "cursor-pointer"
                  } ${
                    editingHistory && form.media_type !== type
                      ? "opacity-30"
                      : ""
                  }`}
                >
                  <div className="text-2xl mb-2">{getMediaTypeIcon(type)}</div>
                  <div className="text-sm font-medium capitalize">{type}</div>
                </button>
              ))}
            </div>
            {editingHistory && (
              <p className="mt-2 text-xs text-gray-500">
                * 타입을 변경하려면 기존 히스토리를 삭제하고 새로 추가해주세요.
              </p>
            )}
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
                  <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "66.67%" }}
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-contain bg-gray-50"
                      />
                      {uploadingImage && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-white rounded-lg px-4 py-2 flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
                            <span className="text-sm">업로드 중...</span>
                          </div>
                        </div>
                      )}
                      {uploadedImageUrl && !uploadingImage && (
                        <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded text-xs">
                          ✓ 업로드 완료
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setUploadedImageUrl(null);
                      setForm((prev) => ({ ...prev, media_url: "" }));
                    }}
                    disabled={uploadingImage}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full hover:bg-white shadow-lg transition-all disabled:opacity-50"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                  <div className="p-8 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                      disabled={loading || uploadingImage}
                    />

                    <div className="mt-4">
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Choose Image
                      </label>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
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
              disabled={loading || uploadingImage}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !form.title.trim() ||
                !form.content.trim() ||
                uploadingImage
              }
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </div>
              ) : editingHistory ? (
                "Update Process"
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
