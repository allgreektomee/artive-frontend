"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// ✅ dynamic import로 SSR 비활성화
const BlogEditor = dynamic(() => import("@/components/blog/BlogEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">에디터 로딩중...</p>
      </div>
    </div>
  ),
});

import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Pin,
  Hash,
  Image as ImageIcon,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function BlogWritePage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;

  // 기본 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("BLOG");
  const [featuredImage, setFeaturedImage] = useState("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [tagList, setTagList] = useState<string[]>([]); // tags 제거, tagList만 사용

  // 발행 설정
  const [isPublic, setIsPublic] = useState(true);
  const [isPinned, setIsPinned] = useState(false);

  // 로딩 상태
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ✅ 초기 로딩 상태 추가
  const [autoSaveStatus, setAutoSaveStatus] = useState(""); // ✅ 자동저장 상태 추가

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const [hasStudioPost, setHasStudioPost] = useState(false);

  useEffect(() => {
    checkExistingStudioPost();
  }, []);

  const checkExistingStudioPost = async () => {
    try {
      const params = new URLSearchParams({
        user: userSlug,
        post_type: "STUDIO",
        is_published: "true",
        limit: "1",
      });

      const response = await fetch(`${backendUrl}/api/blog/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setHasStudioPost(data.posts && data.posts.length > 0);
      }
    } catch (error) {
      console.error("스튜디오 포스트 확인 실패:", error);
    }
  };

  // ✅ 자동 저장 기능 (5분마다)
  useEffect(() => {
    const autoSave = setInterval(() => {
      if (title && content && !isSaving && !isPublishing) {
        handleAutoSave();
      }
    }, 300000); // 5분

    return () => clearInterval(autoSave);
  }, [title, content]);

  const handleAutoSave = async () => {
    setAutoSaveStatus("저장중...");
    const token = localStorage.getItem("token");

    try {
      // localStorage에 임시 저장
      const draftData = {
        title,
        content,
        postType,
        tags: tagList.join(", "), // tagList를 문자열로 변환
        featuredImage,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(`draft_${userSlug}`, JSON.stringify(draftData));
      setAutoSaveStatus("자동 저장됨");

      setTimeout(() => setAutoSaveStatus(""), 3000);
    } catch (error) {
      console.error("자동 저장 실패:", error);
      setAutoSaveStatus("자동 저장 실패");
    }
  };

  // ✅ 임시 저장된 내용 불러오기
  useEffect(() => {
    const loadDraft = () => {
      const savedDraft = localStorage.getItem(`draft_${userSlug}`);
      if (savedDraft) {
        const draft = JSON.parse(savedDraft);
        const confirmLoad = window.confirm(
          `${new Date(
            draft.savedAt
          ).toLocaleString()}에 자동 저장된 내용이 있습니다. 불러오시겠습니까?`
        );

        if (confirmLoad) {
          setTitle(draft.title || "");
          setContent(draft.content || "");
          // 스튜디오 타입이 이미 작성되어 있으면 BLOG로 변경
          if (draft.postType === "STUDIO" && hasStudioPost) {
            setPostType("BLOG");
            alert(
              "스튜디오 포스트는 이미 작성되어 있어 블로그 타입으로 변경되었습니다."
            );
          } else {
            setPostType(draft.postType || "BLOG");
          }
          if (draft.tags) {
            setTagList(
              draft.tags
                .split(",")
                .map((t: string) => t.trim())
                .filter((t: string) => t)
            );
          }
          setFeaturedImage(draft.featuredImage || "");
        } else {
          localStorage.removeItem(`draft_${userSlug}`);
        }
      }
    };

    if (isLoading) {
      loadDraft();
    }
  }, [userSlug, isLoading, hasStudioPost]);

  // 권한 체크
  useEffect(() => {
    checkPermission();
  }, [userSlug]);

  const checkPermission = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();

        if (userData.slug !== userSlug) {
          alert("권한이 없습니다.");
          router.push(`/blog/${userSlug}`);
        } else {
          setIsLoading(false); // ✅ 권한 확인 완료
        }
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token");
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          router.push("/auth/login");
        } else {
          alert("권한 확인 중 오류가 발생했습니다.");
        }
      }
    } catch (error) {
      console.error("권한 확인 실패:", error);
      alert("네트워크 오류가 발생했습니다.");
    }
  };

  // content에서 이미지 추출
  useEffect(() => {
    const extractImages = () => {
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      const images: string[] = [];
      let match;

      while ((match = imgRegex.exec(content)) !== null) {
        images.push(match[1]);
      }

      setUploadedImages(images);
    };

    extractImages();
  }, [content]);

  // 임시저장
  const handleSaveDraft = async () => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    // 스튜디오 타입 체크
    if (postType === "STUDIO" && hasStudioPost) {
      alert("스튜디오 포스트는 1개만 작성할 수 있습니다.");
      return;
    }

    setIsSaving(true);
    const token = localStorage.getItem("token");

    try {
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      const autoExcerpt =
        plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;

      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: autoExcerpt,
        post_type: postType,
        tags: tagList, // 항상 배열로 (빈 배열 포함)
        featured_image: featuredImage || "", // null 대신 빈 문자열
        is_published: false,
        is_public: false,
        is_pinned: false,
      };

      console.log("임시저장 데이터:", postData); // 디버깅용

      const response = await fetch(`${backendUrl}/api/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
        credentials: "include", // 쿠키 포함
      });

      if (response.ok) {
        const result = await response.json();
        // ✅ 임시저장 성공 시 로컬 draft 삭제
        localStorage.removeItem(`draft_${userSlug}`);
        alert("임시저장이 완료되었습니다.");
        router.push(`/blog/${userSlug}/${result.id}`);
      } else {
        const error = await response.json();
        alert(`임시저장 실패: ${error.detail || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("임시저장 실패:", error);
      alert("임시저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  // 발행하기
  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    // 스튜디오 타입 체크
    if (postType === "STUDIO" && hasStudioPost) {
      alert("스튜디오 포스트는 1개만 작성할 수 있습니다.");
      return;
    }

    setIsPublishing(true);
    const token = localStorage.getItem("token");

    try {
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      const autoExcerpt =
        plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;

      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: autoExcerpt,
        post_type: postType,
        tags: tagList, // 항상 배열로 (빈 배열 포함)
        featured_image: featuredImage || "", // null 대신 빈 문자열
        is_published: true,
        is_public: isPublic,
        is_pinned: isPinned && postType === "NOTICE",
      };

      console.log("발행 데이터:", postData); // 디버깅용
      console.log(
        "태그:",
        postData.tags,
        "타입:",
        typeof postData.tags,
        "길이:",
        postData.tags.length
      ); // 태그 확인

      const response = await fetch(`${backendUrl}/api/blog/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
        credentials: "include", // 쿠키 포함
      });

      if (response.ok) {
        const result = await response.json();
        // ✅ 발행 성공 시 로컬 draft 삭제
        localStorage.removeItem(`draft_${userSlug}`);
        // 스튜디오 포스트 작성 시 상태 업데이트
        if (postType === "STUDIO") {
          setHasStudioPost(true);
        }
        alert("발행이 완료되었습니다!");
        router.push(`/blog/${userSlug}/${result.id}`);
      } else {
        const error = await response.json();
        alert(`발행 실패: ${error.detail || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("발행 실패:", error);
      alert("발행 중 오류가 발생했습니다.");
    } finally {
      setIsPublishing(false);
      setIsPublishModalOpen(false);
    }
  };

  // 포스트 타입별 색상
  const getTypeColor = (type: string) => {
    const colors = {
      BLOG: "bg-blue-100 text-blue-800",
      NOTICE: "bg-red-100 text-red-800",
      NEWS: "bg-green-100 text-green-800",
      EXHIBITION: "bg-purple-100 text-purple-800",
      AWARD: "bg-yellow-100 text-yellow-800",
      STUDIO: "bg-indigo-100 text-indigo-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // 태그 입력 처리
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      // 한글 입력 중복 방지
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tagList.includes(newTag)) {
        setTagList([...tagList, newTag]);
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagList(tagList.filter((tag) => tag !== tagToRemove));
  };

  // ✅ 초기 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">권한 확인중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.back()}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-xl font-bold">새 글 작성</h1>
                <p className="text-xs sm:text-sm text-gray-600">@{userSlug}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {/* 자동저장 상태 표시 - 모바일에서 숨김 */}
              {autoSaveStatus && (
                <span className="hidden sm:inline text-sm text-gray-500 mr-2">
                  {autoSaveStatus}
                </span>
              )}

              <button
                onClick={handleSaveDraft}
                disabled={isSaving || !title}
                className="p-2 sm:px-4 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                title="임시저장"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline ml-2 text-sm">
                  {isSaving ? "저장중..." : "임시저장"}
                </span>
              </button>

              <button
                onClick={() => setIsPublishModalOpen(true)}
                disabled={isPublishing || !title || !content}
                className="p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                title="발행하기"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline ml-2 text-sm">
                  {isPublishing ? "발행중..." : "발행하기"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-4 sm:p-8">
            {/* 제목 */}
            <div className="mb-4 sm:mb-6">
              <input
                type="text"
                placeholder="제목을 입력하세요..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-2xl sm:text-3xl font-bold placeholder-gray-400 border-none outline-none bg-transparent"
                maxLength={200}
              />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs sm:text-sm text-gray-400">
                  {title.length}/200
                </div>
                {!title && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-amber-600">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">제목은 필수입니다</span>
                    <span className="sm:hidden">필수</span>
                  </div>
                )}
              </div>
            </div>

            {/* 본문 - TipTap 에디터 사용 */}
            <div className="mb-6 sm:mb-8">
              <BlogEditor value={content} onChange={setContent} />
              <div className="flex justify-between items-center mt-2">
                <div className="text-xs sm:text-sm text-gray-400">
                  글자 수: {content.replace(/<[^>]*>/g, "").length}
                </div>
                {!content && (
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-amber-600">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">
                      내용을 입력해주세요
                    </span>
                    <span className="sm:hidden">필수</span>
                  </div>
                )}
              </div>
            </div>

            {/* 대표 이미지 선택 */}
            {uploadedImages.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <ImageIcon className="w-4 h-4 inline mr-1" />
                  대표 이미지 선택
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {uploadedImages.map((img, index) => (
                    <div
                      key={index}
                      onClick={() => setFeaturedImage(img)}
                      className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        featuredImage === img
                          ? "border-blue-500"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`이미지 ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      {featuredImage === img && (
                        <div className="absolute top-1 right-1">
                          <Check className="w-5 h-5 text-white bg-blue-500 rounded-full p-1" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {featuredImage && (
                  <button
                    onClick={() => setFeaturedImage("")}
                    className="mt-2 text-sm text-gray-500 hover:text-red-600"
                  >
                    대표 이미지 선택 취소
                  </button>
                )}
              </div>
            )}

            {/* 카테고리 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                카테고리
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "BLOG", label: "블로그", icon: "📝" },
                  { value: "NOTICE", label: "공지사항", icon: "📢" },
                  { value: "NEWS", label: "뉴스", icon: "📰" },
                  { value: "EXHIBITION", label: "전시", icon: "🎨" },
                  { value: "AWARD", label: "수상", icon: "🏆" },
                  {
                    value: "STUDIO",
                    label: "스튜디오",
                    icon: "🎬",
                    disabled: hasStudioPost,
                  },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => {
                      if (type.disabled) {
                        alert("스튜디오 포스트는 1개만 작성할 수 있습니다.");
                        return;
                      }
                      setPostType(type.value);
                    }}
                    disabled={type.disabled}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform ${
                      type.disabled
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        : postType === type.value
                        ? getTypeColor(type.value) +
                          " ring-2 ring-offset-2 ring-blue-500 hover:scale-105"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105"
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                    {type.disabled && " (작성완료)"}
                  </button>
                ))}
              </div>
              {hasStudioPost && (
                <p className="text-xs text-gray-500 mt-2">
                  * 스튜디오 포스트는 사용자당 1개만 작성 가능합니다.
                </p>
              )}
            </div>

            {/* 태그 입력 */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="w-4 h-4 inline mr-1" />
                태그
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tagList.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200 transition-colors"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="태그 입력 후 Enter..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag} // 다시 onKeyDown으로
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                태그는 검색과 분류에 도움이 됩니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 발행 설정 모달 */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">발행 설정</h3>

            {/* 스튜디오 타입 경고 */}
            {postType === "STUDIO" && hasStudioPost && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">
                  스튜디오 포스트는 이미 작성되어 있습니다.
                </p>
              </div>
            )}

            {/* 공개 설정 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <p className="text-sm text-gray-600 ml-7 mt-1">
                  모든 사용자가 볼 수 있습니다
                </p>
              </label>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handlePublish}
                disabled={
                  isPublishing || (postType === "STUDIO" && hasStudioPost)
                }
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                {isPublishing ? "발행중..." : "발행하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
