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
  id: string;
  title: string;
  content: string;
  thumbnail?: string;
  post_type: "BLOG" | "NOTICE" | "EXHIBITION" | "AWARD" | "NEWS";
  is_published: boolean;
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  author: {
    id: number;
    name: string;
    slug: string;
    profile_image?: string;
  };
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
  const [isLoading, setIsLoading] = useState(true); // ✅ 추가
  const [error, setError] = useState<string | null>(null); // ✅ 추가
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // ✅ 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0); // ✅ 추가

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const postsPerPage = 10;

  useEffect(() => {
    if (userSlug) {
      fetchUserInfo();
      fetchPosts();
      checkOwnership();
    }
  }, [userSlug, selectedType, currentPage, searchTerm]); // searchTerm 추가

  const fetchUserInfo = async () => {
    // 사용자 정보는 선택사항 - 없어도 계속 진행
    setUser({
      id: 0,
      name: userSlug.toUpperCase(),
      slug: userSlug,
    });
  };

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null); // 에러 초기화

      const params = new URLSearchParams({
        user: userSlug,
        page: currentPage.toString(),
        limit: postsPerPage.toString(),
        is_published: "true", // 발행된 글만
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
    const token = localStorage.getItem("token"); // ✅ token으로 수정
    if (!token) return;

    try {
      const response = await fetch(`${backendUrl}/auth/me`, {
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
    setSearchTerm(searchQuery); // 검색어 설정
    setCurrentPage(1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "NOTICE":
        return <Bell className="w-4 h-4" />;
      case "EXHIBITION":
        return <ImageIcon className="w-4 h-4" />;
      case "AWARD":
        return <Award className="w-4 h-4" />;
      case "NEWS":
        return <Newspaper className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  // HTML 태그 제거
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // 썸네일 추출 (첫 번째 이미지)
  const extractThumbnail = (content: string): string | null => {
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 에러 상태
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
      {/* 헤더 */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/${userSlug}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">
                  {user?.name || userSlug.toUpperCase()} 블로그
                </h1>
                <p className="text-sm text-gray-500">{totalPosts}개의 글</p>
              </div>
            </div>
            {isOwner && (
              <Link
                href={`/blog/${userSlug}/write`}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>새 글 작성</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* 필터 & 검색 */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 타입 필터 */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setSelectedType("ALL");
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
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
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedType === "NEWS"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                뉴스
              </button>
            </div>

            {/* 검색 */}
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="검색..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </form>
          </div>
        </div>

        {/* 포스트 목록 */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">아직 작성된 글이 없습니다.</p>
              {isOwner && (
                <Link
                  href={`/blog/${userSlug}/write`}
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>첫 글 작성하기</span>
                </Link>
              )}
            </div>
          ) : (
            posts.map((post) => {
              const thumbnail =
                post.thumbnail || extractThumbnail(post.content);
              const preview = stripHtml(post.content).substring(0, 150) + "...";

              return (
                <article
                  key={post.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <Link href={`/blog/${userSlug}/${post.id}`}>
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        {/* 썸네일 */}
                        {thumbnail && (
                          <div className="flex-shrink-0">
                            <img
                              src={thumbnail}
                              alt={post.title}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          </div>
                        )}

                        {/* 콘텐츠 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2">
                              {post.is_pinned && (
                                <Pin className="w-4 h-4 text-red-500" />
                              )}
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(
                                  post.post_type
                                )}`}
                              >
                                {getTypeIcon(post.post_type)}
                                {getTypeLabel(post.post_type)}
                              </span>
                            </div>
                            {isOwner && (
                              <Link
                                href={`/blog/${userSlug}/${post.id}/edit`}
                                onClick={(e) => e.stopPropagation()}
                                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                            )}
                          </div>

                          <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                            {post.title}
                          </h2>

                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {preview}
                          </p>

                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ko,
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" />
                              {post.view_count}회
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

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              이전
            </button>
            <span className="px-4 py-2">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
