// app/blog/[slug]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Edit,
  Pin,
  Search,
  Filter,
  Plus,
  FileText,
  Bell,
  Award,
  Newspaper,
  Image as ImageIcon,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null; // 대표 이미지
  post_type: "BLOG" | "NOTICE" | "EXHIBITION" | "AWARD" | "NEWS";
  tags: string[] | null;
  is_published: boolean;
  is_public: boolean;
  is_pinned: boolean;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  published_at: string | null;
  user: {
    id: number;
    username: string;
    slug: string;
    profile_image?: string;
  };
  user_id: number;
}

interface User {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  profile_image?: string;
}

export default function BlogListPage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const postsPerPage = 10;

  useEffect(() => {
    if (userSlug) {
      fetchUserInfo();
      fetchPosts();
      checkOwnership();
    }
  }, [userSlug, selectedType, currentPage, searchTerm]);

  const fetchUserInfo = async () => {
    setUser({
      id: 0,
      name: userSlug.toUpperCase(),
      slug: userSlug,
    });
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        user: userSlug,
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
        is_published: "true",
      });

      if (selectedType !== "ALL") {
        params.append("post_type", selectedType);
      }

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const url = `${backendUrl}/api/blog/posts?${params}`;
      console.log("API 호출:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("응답 상태:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("응답 데이터:", data);

        setPosts(data.posts || []);
        setTotalPages(data.pages || 1);
        setTotalPosts(data.total || 0);
        setError(null);
      } else {
        const errorText = await response.text();
        console.error("API 오류:", response.status, errorText);

        if (response.status === 404) {
          setError("블로그를 찾을 수 없습니다.");
        } else if (response.status >= 500) {
          setError("서버에 문제가 발생했습니다.");
        } else {
          setError(`오류가 발생했습니다: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("블로그 목록 가져오기 실패:", error);
      setError("블로그 목록을 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchQuery);
    setCurrentPage(1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "NOTICE":
        return <Bell className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "EXHIBITION":
        return <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "AWARD":
        return <Award className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "NEWS":
        return <Newspaper className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <FileText className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "NOTICE":
        return "bg-red-100 text-red-700 border-red-200";
      case "EXHIBITION":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "AWARD":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "NEWS":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
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
      default:
        return "블로그";
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // excerpt가 있으면 사용하고, 없으면 content에서 추출
  const getPreview = (post: BlogPost) => {
    if (post.excerpt) {
      return post.excerpt.length > 100
        ? post.excerpt.substring(0, 100) + "..."
        : post.excerpt;
    }
    return stripHtml(post.content).substring(0, 100) + "...";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.push(`/${userSlug}`)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          갤러리로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 - 모바일 최적화 */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={() => router.push(`/${userSlug}`)}
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <div>
                <h1 className="text-base sm:text-xl font-bold">
                  <span className="hidden sm:inline">
                    {user?.name || userSlug.toUpperCase()} 블로그
                  </span>
                  <span className="sm:hidden">블로그</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {totalPosts}개의 글
                </p>
              </div>
            </div>
            {isOwner && (
              <Link
                href={`/blog/${userSlug}/write`}
                className="p-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                title="새 글 작성"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline ml-2 text-sm">
                  새 글 작성
                </span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* 필터 & 검색 - 모바일 최적화 */}
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* 타입 필터 - 모바일에서 스크롤 가능 */}
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => {
                  setSelectedType("ALL");
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "ALL"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                전체
              </button>
              <button
                onClick={() => {
                  setSelectedType("NOTICE");
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "NOTICE"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                공지
              </button>
              <button
                onClick={() => {
                  setSelectedType("BLOG");
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "BLOG"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                블로그
              </button>
              <button
                onClick={() => {
                  setSelectedType("NEWS");
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "NEWS"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                뉴스
              </button>
              <button
                onClick={() => {
                  setSelectedType("EXHIBITION");
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "EXHIBITION"
                    ? "bg-purple-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                전시
              </button>
              <button
                onClick={() => {
                  setSelectedType("AWARD");
                  setCurrentPage(1);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "AWARD"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                수상
              </button>
            </div>

            {/* 검색 */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색..."
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-sm border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>
          </div>
        </div>

        {/* 포스트 목록 - 모바일 최적화 */}
        <div className="space-y-3 sm:space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-500">
                아직 작성된 글이 없습니다.
              </p>
              {isOwner && (
                <Link
                  href={`/blog/${userSlug}/write`}
                  className="inline-flex items-center gap-2 mt-4 px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>첫 글 작성하기</span>
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => {
              const preview = getPreview(post);

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/blog/${userSlug}/${post.id}`}>
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        {/* 대표 이미지 표시 - featured_image 사용 */}
                        {post.featured_image && (
                          <div className="flex-shrink-0">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                              onError={(e) => {
                                // 이미지 로드 실패 시 숨기기
                                (e.target as HTMLElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}

                        {/* 콘텐츠 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 sm:gap-4 mb-2">
                            <div className="flex items-center gap-1 sm:gap-2">
                              {post.is_pinned && (
                                <Pin className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                              )}
                              <span
                                className={`inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium border ${getTypeColor(
                                  post.post_type
                                )}`}
                              >
                                {getTypeIcon(post.post_type)}
                                <span className="hidden sm:inline">
                                  {getTypeLabel(post.post_type)}
                                </span>
                              </span>
                            </div>
                            {isOwner && (
                              <Link
                                href={`/blog/${userSlug}/${post.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </Link>
                            )}
                          </div>

                          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 line-clamp-1">
                            {post.title}
                          </h2>

                          <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                            {preview}
                          </p>

                          <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="hidden sm:inline">
                                {formatDistanceToNow(
                                  new Date(post.created_at),
                                  {
                                    addSuffix: true,
                                    locale: ko,
                                  }
                                )}
                              </span>
                              <span className="sm:hidden">
                                {formatDistanceToNow(
                                  new Date(post.created_at),
                                  {
                                    locale: ko,
                                  }
                                )}
                              </span>
                            </span>
                            <span className="flex items-center gap-0.5 sm:gap-1">
                              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {post.view_count}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              );
            })
          )}
        </div>

        {/* 페이지네이션 - 모바일 최적화 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6 sm:mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
