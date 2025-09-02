import React, { useState, useEffect } from "react";

interface AddHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (historyData: HistoryFormData) => void;
  loading?: boolean;
  editingHistory?: any;
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
      setForm({
        title: editingHistory.title || "",
        content: editingHistory.content || "",
        media_type: editingHistory.media_type || "text",
        media_url: editingHistory.media_url || "",
        work_date: editingHistory.work_date
          ? editingHistory.work_date.split("T")[0]
          : new Date().toISOString().split("T")[0],
      });

      if (editingHistory.media_type === "image" && editingHistory.media_url) {
        setImagePreview(editingHistory.media_url);
        setUploadedImageUrl(editingHistory.media_url);
      }

      if (editingHistory.media_type === "youtube" && editingHistory.media_url) {
        const videoId = extractYouTubeVideoId(editingHistory.media_url);
        setYoutubePreview(videoId);
      }
    } else if (!isOpen) {
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

    if (name === "media_url" && form.media_type === "youtube") {
      const videoId = extractYouTubeVideoId(value);
      setYoutubePreview(videoId);
    }

    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleMediaTypeChange = (type: "text" | "image" | "youtube") => {
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
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

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

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
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
    <div className="fixed inset-0 bg-white z-50 flex flex-col h-screen">
      {/* Header with action buttons */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="닫기 (ESC)"
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
            <h2 className="text-xl font-bold text-gray-900">
              {editingHistory ? "프로세스 수정" : "새 프로세스 추가"}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading || uploadingImage}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 font-medium"
            >
              취소
            </button>
            <button
              onClick={() => handleSubmit()}
              disabled={
                loading ||
                !form.title.trim() ||
                !form.content.trim() ||
                uploadingImage
              }
              className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>저장 중...</span>
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>{editingHistory ? "수정 완료" : "저장"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-4xl mx-auto p-6">
          <div className="space-y-6">
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
                미디어 타입
                {editingHistory && (
                  <span className="text-xs text-gray-500 ml-2">
                    (수정 불가)
                  </span>
                )}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(["text", "image", "youtube"] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      !editingHistory && handleMediaTypeChange(type)
                    }
                    disabled={editingHistory}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      form.media_type === type
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    } ${
                      editingHistory
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <div className="text-2xl mb-1">
                      {getMediaTypeIcon(type)}
                    </div>
                    <div className="text-sm capitalize font-medium">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목 *
              </label>
              <input
                type="text"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                설명 *
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleInputChange}
                disabled={loading}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100 resize-none"
                placeholder="작업 과정에 대한 설명을 입력하세요"
              />
            </div>

            {/* Image Upload */}
            {form.media_type === "image" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이미지
                </label>
                {imagePreview ? (
                  <div className="relative">
                    <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setUploadedImageUrl(null);
                        setForm((prev) => ({ ...prev, media_url: "" }));
                      }}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-red-500 p-2 rounded-full hover:bg-white shadow-lg"
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
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                          <span className="mt-2 text-sm text-gray-600">
                            업로드 중...
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                    <label className="cursor-pointer block p-8">
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
                      <p className="mt-2 text-sm text-gray-600 text-center">
                        클릭하여 이미지 업로드
                      </p>
                      <p className="mt-1 text-xs text-gray-500 text-center">
                        PNG, JPG, GIF (최대 10MB)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImage}
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* YouTube URL */}
            {form.media_type === "youtube" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube URL
                </label>
                <input
                  type="url"
                  name="media_url"
                  value={form.media_url}
                  onChange={handleInputChange}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500"
                />
                {youtubePreview && (
                  <div className="mt-4 rounded-lg overflow-hidden bg-black">
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "56.25%" }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${youtubePreview}`}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Work Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                작업 날짜
              </label>
              <input
                type="date"
                name="work_date"
                value={form.work_date}
                onChange={handleInputChange}
                disabled={loading}
                max={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHistoryModal;
