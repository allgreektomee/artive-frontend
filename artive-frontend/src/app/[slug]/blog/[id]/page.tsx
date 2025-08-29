"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Share2,
  Clock,
  Tag,
  Lock,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { ko } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  post_type: "BLOG" | "NOTICE" | "EXHIBITION" | "AWARD" | "NEWS" | "STUDIO";
  tags?: string[];
  is_published: boolean;
  is_public: boolean;
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    id: number;
    name: string;
    slug: string;
    profile_image?: string;
    bio?: string;
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;
  const postId = params?.id as string;

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // useEffect에 이벤트 리스너 추가
  useEffect(() => {
    const handleOpenFilter = () => {
      setShowFilterModal(true);
    };

    window.addEventListener("openBlogFilter", handleOpenFilter);
    return () => {
      window.removeEventListener("openBlogFilter", handleOpenFilter);
    };
  }, []);

  useEffect(() => {
    if (userSlug && postId) {
      fetchPost();
      checkOwnership();
    }
  }, [userSlug, postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${backendUrl}/api/blog/posts/${postId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("포스트 데이터:", data);

        // author 필드가 없으면 user 필드 사용
        if (!data.author && data.user) {
          data.author = data.user;
        } else if (!data.author) {
          data.author = {
            id: 0,
            name: userSlug,
            slug: userSlug,
            profile_image: null,
            bio: null,
          };
        }

        // tags 파싱 (문자열이면 배열로 변환)
        if (data.tags && typeof data.tags === "string") {
          try {
            data.tags = data.tags
              .split(",")
              .map((tag: string) => tag.trim())
              .filter((tag: string) => tag);
          } catch (e) {
            console.error("태그 파싱 실패:", e);
            data.tags = [];
          }
        } else if (!Array.isArray(data.tags)) {
          data.tags = [];
        }

        setPost(data);

        // 조회수 증가
        incrementViewCount();
      } else {
        if (response.status === 404) {
          setError("포스트를 찾을 수 없습니다.");
        } else {
          setError("포스트를 불러올 수 없습니다.");
        }
      }
    } catch (error) {
      console.error("포스트 불러오기 실패:", error);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const incrementViewCount = async () => {
    try {
      await fetch(`${backendUrl}/api/blog/posts/${postId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    }
  };

  const checkOwnership = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setIsOwner(userData.slug === userSlug);
      }
    } catch (error) {
      console.error("소유권 확인 실패:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("정말로 이 포스트를 삭제하시겠습니까?")) return;

    setIsDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${backendUrl}/api/blog/posts/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("포스트가 삭제되었습니다.");
        router.push(`/${userSlug}/blog`);
      } else {
        alert("삭제 실패");
      }
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          url: window.location.href,
        });
      } catch (error) {
        console.log("공유 취소 또는 실패");
      }
    } else {
      // 클립보드에 복사
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다.");
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "bg-red-100 text-red-700";
      case "EXHIBITION":
        return "bg-purple-100 text-purple-700";
      case "AWARD":
        return "bg-yellow-100 text-yellow-700";
      case "NEWS":
        return "bg-blue-100 text-blue-700";
      case "STUDIO":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "공지";
      case "EXHIBITION":
        return "전시";
      case "AWARD":
        return "수상";
      case "NEWS":
        return "뉴스";
      case "STUDIO":
        return "스튜디오";
      default:
        return "블로그";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">
          {error || "포스트를 찾을 수 없습니다."}
        </p>
        <button
          onClick={() => router.push(`/${userSlug}/blog`)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          목록으로 돌아가기
        </button>
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
                onClick={() => router.push(`/${userSlug}/blog`)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-xl font-bold">
                  블로그 포스트
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">@{userSlug}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              {isOwner && (
                <>
                  <Link
                    href={`/${userSlug}/blog/${postId}/edit`}
                    className="p-2 sm:px-4 sm:py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2 text-sm">수정</span>
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="p-2 sm:px-4 sm:py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline ml-2 text-sm">삭제</span>
                  </button>
                </>
              )}
              <button
                onClick={handleShare}
                className="p-2 sm:px-4 sm:py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Share2 className="w-4 h-4" />
                <span className="hidden sm:inline ml-2 text-sm">공유</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {/* 메타 정보 */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(
                  post.post_type
                )}`}
              >
                {getTypeLabel(post.post_type)}
              </span>
              {!post.is_public && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Lock className="w-4 h-4" />
                  비공개
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {post.title}
            </h1>

            {/* 작성 정보 */}
            <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(new Date(post.created_at), "yyyy년 MM월 dd일", {
                  locale: ko,
                })}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                조회 {post.view_count}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {Math.ceil(post.content.length / 500)}분 읽기
              </span>
            </div>
          </div>

          {/* 본문 내용 - 에디터 스타일 적용 */}
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <style jsx>{`
            .blog-content {
              font-size: 1.1rem;
              line-height: 1.8;
              color: #374151;
            }

            .blog-content h1 {
              font-size: 2rem;
              font-weight: bold;
              margin: 2rem 0 1rem;
              color: #111827;
            }

            .blog-content h2 {
              font-size: 1.5rem;
              font-weight: bold;
              margin: 1.5rem 0 0.75rem;
              color: #111827;
            }

            .blog-content h3 {
              font-size: 1.25rem;
              font-weight: bold;
              margin: 1.25rem 0 0.5rem;
              color: #111827;
            }

            .blog-content p {
              margin-bottom: 1rem;
            }

            .blog-content ul,
            .blog-content ol {
              margin: 1rem 0;
              padding-left: 2rem;
            }

            .blog-content ul {
              list-style-type: disc;
            }

            .blog-content ol {
              list-style-type: decimal;
            }

            .blog-content li {
              margin-bottom: 0.5rem;
            }

            .blog-content img {
              width: 100%;
              height: auto;
              border-radius: 0.5rem;
              margin: 1.5rem 0;
              box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
            }

            .blog-content blockquote {
              border-left: 4px solid #d1d5db;
              padding-left: 1rem;
              margin: 1rem 0;
              font-style: italic;
              color: #6b7280;
            }

            .blog-content a {
              color: #2563eb;
              text-decoration: underline;
            }

            .blog-content a:hover {
              color: #1d4ed8;
            }

            .blog-content strong {
              font-weight: 600;
              color: #111827;
            }

            .blog-content code {
              background-color: #f3f4f6;
              padding: 0.125rem 0.25rem;
              border-radius: 0.25rem;
              font-family: monospace;
              font-size: 0.875em;
            }

            .blog-content pre {
              background-color: #1f2937;
              color: #f9fafb;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin: 1rem 0;
            }

            .blog-content pre code {
              background-color: transparent;
              padding: 0;
              color: inherit;
            }

            .blog-content table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
            }

            .blog-content th,
            .blog-content td {
              border: 1px solid #e5e7eb;
              padding: 0.5rem;
              text-align: left;
            }

            .blog-content th {
              background-color: #f9fafb;
              font-weight: 600;
            }
          `}</style>

          {/* 태그 */}
          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-6 border-t mt-8">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* 필터 모달 */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4">카테고리 선택</h3>
            <div className="space-y-2">
              {["ALL", "EXHIBITION", "AWARD", "NEWS", "STUDIO"].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedType(type);
                    setShowFilterModal(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg ${
                    selectedType === type
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {getTypeLabel(type === "ALL" ? "전체" : type)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">포스트 삭제</h3>
            <p className="text-gray-600 mb-6">
              정말로 이 포스트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
