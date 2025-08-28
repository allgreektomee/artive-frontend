// app/blog/[slug]/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BottomNavigation from "@/components/gallery/BottomNavigation";
import BlogHeader from "@/components/gallery/BlogHeader";
import { FaUser, FaEdit } from "react-icons/fa";
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
  featured_image: string | null;
  post_type: "BLOG" | "NOTICE" | "EXHIBITION" | "AWARD" | "NEWS" | "STUDIO";
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [showBlogHeader, setShowBlogHeader] = useState(false);
  const [hasStudioPost, setHasStudioPost] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const postsPerPage = 10;

  // 스크롤 기반 헤더 전환 로직
  useEffect(() => {
    const handleScroll = () => {
      const headerElement = document.getElementById("blog-info");
      if (headerElement) {
        const rect = headerElement.getBoundingClientRect();
        if (rect.bottom <= 80) {
          setShowBlogHeader(true);
        } else {
          setShowBlogHeader(false);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (userSlug) {
      fetchUserInfo();
      fetchPosts();
      checkOwnership();
      checkStudioPost();
    }
  }, [userSlug, selectedType, searchTerm]);

  const fetchUserInfo = async () => {
    setUser({
      id: 0,
      name: userSlug.toUpperCase(),
      slug: userSlug,
    });
  };

  // 스튜디오 포스트가 있는지 확인하는 함수
  const checkStudioPost = async () => {
    try {
      const params = new URLSearchParams({
        user: userSlug,
        post_type: "STUDIO",
        is_published: "true",
        limit: "1",
      });

      const response = await fetch(`${backendUrl}/api/blog/posts?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHasStudioPost(data.posts && data.posts.length > 0);
      }
    } catch (error) {
      console.error("스튜디오 포스트 확인 실패:", error);
    }
  };

  const fetchPosts = async (isLoadMore = false) => {
    try {
      if (!isLoadMore) {
        setIsLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const pageToFetch = isLoadMore ? currentPage + 1 : currentPage;
      const params = new URLSearchParams({
        user: userSlug,
        page: pageToFetch.toString(),
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

        let filteredPosts = data.posts || [];

        // 비소유자일 경우 스튜디오 포스트 제외
        if (!isOwner) {
          filteredPosts = filteredPosts.filter(
            (post: BlogPost) => post.post_type !== "STUDIO"
          );
        }

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...filteredPosts]);
          setCurrentPage(pageToFetch);
        } else {
          setPosts(filteredPosts);
        }

        // 수정된 부분
        setTotalPages(data.pages || 1); // 이 줄이 누락되어 있었음

        // 단순하게 data.total 사용 (백엔드에서 이미 필터링된 결과)
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
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    if (!loadingMore && currentPage < totalPages) {
      fetchPosts(true);
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

  const handleProfileClick = () => {
    router.push("/profile/manage");
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
      case "STUDIO":
        return <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />;
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
      case "STUDIO":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
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
      case "STUDIO":
        return "스튜디오";
      default:
        return "블로그";
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

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
    <div className="min-h-screen bg-white">
      {/* 스크롤 기반 고정 헤더 */}
      <BlogHeader
        showBlogHeader={showBlogHeader}
        blogUser={user}
        currentSlug={userSlug}
        isOwner={isOwner}
        onProfileClick={handleProfileClick}
        totalPosts={totalPosts}
      />

      {/* 기본 헤더 */}
      <header id="blog-info" className="bg-white -mt-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-0">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user?.name || userSlug.toUpperCase()} 블로그
            </h1>

            <div className="flex items-center space-x-2">
              {/* 새 글 작성 아이콘 - 소유자일 때만 */}
              {isOwner && (
                <>
                  <Link
                    href={`/blog/${userSlug}/write`}
                    className="text-gray-600 hover:text-black transition-colors p-1"
                    title="새 글 작성"
                  >
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </Link>
                  <button
                    onClick={handleProfileClick}
                    className="text-gray-600 hover:text-black transition-colors"
                    title="Edit Profile"
                  >
                    <FaUser className="text-lg sm:text-xl md:text-2xl" />
                  </button>
                </>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-2">
            {totalPosts}개의 글이 작성되었습니다.
          </p>

          <div className="py-2 border-b border-gray-200"></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-4 sm:py-6 pb-32 ">
        {/* 필터 & 검색 - 모바일 최적화 */}
        <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* 타입 필터 - 모바일에서 스크롤 가능 */}
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => {
                  setSelectedType("ALL");
                  setCurrentPage(1);
                  setPosts([]);
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
                  setPosts([]);
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
                  setPosts([]);
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
                  setPosts([]);
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
                  setPosts([]);
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
                  setPosts([]);
                }}
                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedType === "AWARD"
                    ? "bg-yellow-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                수상
              </button>
              {isOwner && (
                <button
                  onClick={() => {
                    setSelectedType("STUDIO");
                    setCurrentPage(1);
                    setPosts([]);
                  }}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedType === "STUDIO"
                      ? "bg-indigo-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  스튜디오
                </button>
              )}
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
        <div className="space-y-3 sm:space-y-4 ">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
              <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-sm sm:text-base text-gray-500">
                {selectedType === "STUDIO" && !isOwner
                  ? "스튜디오 포스트는 작가 본인만 조회할 수 있습니다."
                  : "아직 작성된 글이 없습니다."}
              </p>
              {isOwner && (
                <>
                  {selectedType === "STUDIO" && !hasStudioPost && (
                    <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg text-left max-w-md mx-auto">
                      <h3 className="font-semibold text-indigo-900 mb-2">
                        🎬 스튜디오 포스트 만들기
                      </h3>
                      <ul className="text-xs text-indigo-700 space-y-1 mb-3">
                        <li>• 작업 공간, 도구, 창작 과정을 소개해보세요</li>
                        <li>• 작품 제작 비하인드 스토리를 공유해보세요</li>
                        <li>• 예술 철학과 영감의 원천을 들려주세요</li>
                        <li className="font-semibold">
                          • 작성 완료 시 하단 메뉴에 Studio 탭이 생성됩니다!
                        </li>
                      </ul>
                    </div>
                  )}
                  <Link
                    href={`/blog/${userSlug}/write`}
                    className="inline-flex items-center gap-2 mt-4 px-3 sm:px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>
                      {selectedType === "STUDIO"
                        ? "스튜디오 포스트 작성하기"
                        : "첫 글 작성하기"}
                    </span>
                  </Link>
                </>
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
                        {/* 대표 이미지 표시 */}
                        {post.featured_image && (
                          <div className="flex-shrink-0">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLElement).style.display =
                                  "none";
                              }}
                            />
                          </div>
                        )}

                        {/* 콘텐츠 */}
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
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  router.push(
                                    `/blog/${userSlug}/${post.id}/edit`
                                  );
                                }}
                                className="p-1 sm:p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
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

        {/* Load More 버튼 */}
        {currentPage < totalPages && (
          <div className="flex justify-center mt-8">
            <button
              onClick={loadMorePosts}
              disabled={loadingMore}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>로딩 중...</span>
                </div>
              ) : (
                "Load More"
              )}
            </button>
          </div>
        )}
      </div>
      <div className="h-24"></div>
      {/* 하단 네비게이션 */}
      <BottomNavigation currentSlug={userSlug} isOwner={isOwner} />
    </div>
  );
}
