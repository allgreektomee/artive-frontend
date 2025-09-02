// app/[slug]/blog/[id]/edit/page.tsx
"use client";
import { useState, useEffect } from "react";
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

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  featured_thumbnail?: string;
  post_type: "BLOG" | "NOTICE" | "EXHIBITION" | "AWARD" | "NEWS" | "STUDIO";
  tags?: string[] | string;
  is_published: boolean;
  is_public: boolean;
  is_pinned: boolean;
}

export default function BlogEditPage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;
  const postId = params?.id as string;

  // 기본 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState("BLOG");
  const [featuredImage, setFeaturedImage] = useState("");
  const [featuredThumbnail, setFeaturedThumbnail] = useState(""); // 썸네일 추가
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [tagList, setTagList] = useState<string[]>([]);

  // 발행 설정
  const [isPublic, setIsPublic] = useState(true);
  const [isPinned, setIsPinned] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // 로딩 상태
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // 기존 포스트 데이터 불러오기
  useEffect(() => {
    if (userSlug && postId) {
      fetchPost();
      checkPermission();
    }
  }, [userSlug, postId]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/blog/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();

        // 데이터 설정
        setTitle(data.title || "");
        setContent(data.content || "");
        setPostType(data.post_type || "BLOG");
        setFeaturedImage(data.featured_image || "");
        setFeaturedThumbnail(data.featured_thumbnail || ""); // 썸네일 로드
        setIsPublic(data.is_public ?? true);
        setIsPinned(data.is_pinned ?? false);
        setIsPublished(data.is_published ?? false);

        // 태그 처리
        if (data.tags) {
          if (typeof data.tags === "string") {
            try {
              const parsedTags = JSON.parse(data.tags);
              setTagList(Array.isArray(parsedTags) ? parsedTags : []);
            } catch {
              // JSON 파싱 실패시 쉼표로 분리
              setTagList(
                data.tags
                  .split(",")
                  .map((t: string) => t.trim())
                  .filter((t: string) => t)
              );
            }
          } else if (Array.isArray(data.tags)) {
            setTagList(data.tags);
          }
        }

        setIsLoading(false);
      } else {
        alert("포스트를 불러올 수 없습니다.");
        router.push(`/${userSlug}/blog`);
      }
    } catch (error) {
      console.error("포스트 불러오기 실패:", error);
      alert("네트워크 오류가 발생했습니다.");
      router.push(`/${userSlug}/blog`);
    }
  };

  const checkPermission = async () => {
    const token = localStorage.getItem("access_token");

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
          router.push(`/${userSlug}/blog/${postId}`);
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

  // 수정 저장
  const handleUpdate = async (publish: boolean = false) => {
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (publish) {
      setIsPublishing(true);
    } else {
      setIsSaving(true);
    }

    const token = localStorage.getItem("access_token");

    try {
      const plainText = content.replace(/<[^>]*>/g, "").trim();
      const autoExcerpt =
        plainText.length > 150 ? plainText.slice(0, 150) + "..." : plainText;

      const postData = {
        title: title.trim(),
        content: content.trim(),
        excerpt: autoExcerpt,
        post_type: postType,
        tags: tagList,
        featured_image: featuredImage || "",
        featured_thumbnail: featuredThumbnail || featuredImage || "", // 썸네일 없으면 원본 사용
        is_published: publish ? true : isPublished,
        is_public: isPublic,
        is_pinned: isPinned && postType === "NOTICE",
      };

      const response = await fetch(`${backendUrl}/api/blog/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
        credentials: "include",
      });

      if (response.ok) {
        alert(publish ? "발행이 완료되었습니다!" : "저장되었습니다.");
        router.push(`/${userSlug}/blog/${postId}`);
      } else {
        const error = await response.json();
        alert(`저장 실패: ${error.detail || "알 수 없는 오류"}`);
      }
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
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

  // 초기 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">포스트 불러오는 중...</p>
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
                <h1 className="text-base sm:text-xl font-bold">글 수정</h1>
                <p className="text-xs sm:text-sm text-gray-600">@{userSlug}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => handleUpdate(false)}
                disabled={isSaving || !title}
                className="p-2 sm:px-4 sm:py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                title="저장"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline ml-2 text-sm">
                  {isSaving ? "저장중..." : "저장"}
                </span>
              </button>

              {!isPublished && (
                <button
                  onClick={() => setIsPublishModalOpen(true)}
                  disabled={isPublishing || !title || !content}
                  className="p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  title="발행하기"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline ml-2 text-sm">
                    발행하기
                  </span>
                </button>
              )}
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
                      onClick={() => {
                        setFeaturedImage(img);
                        // 썸네일 URL 자동 생성
                        const thumbUrl = img
                          .replace("/display/", "/thumb/")
                          .replace("/blog/", "/blog/thumb/");
                        setFeaturedThumbnail(thumbUrl);
                      }}
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
                    onClick={() => {
                      setFeaturedImage("");
                      setFeaturedThumbnail("");
                    }}
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
                  { value: "STUDIO", label: "스튜디오", icon: "🎬" },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setPostType(type.value)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all transform hover:scale-105 ${
                      postType === type.value
                        ? getTypeColor(type.value) +
                          " ring-2 ring-offset-2 ring-blue-500"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <span className="mr-1">{type.icon}</span>
                    {type.label}
                  </button>
                ))}
              </div>
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
                onKeyDown={handleAddTag}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                태그는 검색과 분류에 도움이 됩니다
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 발행 설정 모달 (임시저장된 글만) */}
      {isPublishModalOpen && !isPublished && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">발행 설정</h3>

            {/* 공개 설정 */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <p className="text-sm text-gray-600 ml-1 mt-1">
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
                onClick={() => handleUpdate(true)}
                disabled={isPublishing}
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
