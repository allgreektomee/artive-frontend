// app/blog/[slug]/layout.tsx
import { ReactNode, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import BottomNavigation from "@/components/gallery/BottomNavigation";
import BlogHeader from "@/components/gallery/BlogHeader";
import { FaUser } from "react-icons/fa";
import {
  Search,
  Plus,
  Bell,
  FileText,
  Award,
  Newspaper,
  Image as ImageIcon,
} from "lucide-react";
import { FaEdit } from "react-icons/fa";

interface BlogLayoutProps {
  children: ReactNode;
}

interface User {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  profile_image?: string;
}

export default function BlogLayout({ children }: BlogLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;

  const [user, setUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showBlogHeader, setShowBlogHeader] = useState(false);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPosts, setTotalPosts] = useState(0);
  const [hasStudioPost, setHasStudioPost] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

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

  // 초기 데이터 로드
  useEffect(() => {
    if (userSlug) {
      fetchUserInfo();
      checkOwnership();
      checkStudioPost();
    }
  }, [userSlug]);

  const fetchUserInfo = async () => {
    setUser({
      id: 0,
      name: userSlug.toUpperCase(),
      slug: userSlug,
    });
  };

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

  const handleProfileClick = () => {
    router.push("/profile/manage");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // 검색 로직은 children 컴포넌트에서 처리
    const event = new CustomEvent("blogSearch", { detail: searchQuery });
    window.dispatchEvent(event);
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    // 타입 변경 이벤트를 children에게 전달
    const event = new CustomEvent("blogTypeChange", { detail: type });
    window.dispatchEvent(event);
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 스크롤 기반 고정 헤더 */}
      <BlogHeader
        showBlogHeader={showBlogHeader}
        blogUser={user}
        currentSlug={userSlug}
        isOwner={isOwner}
        onProfileClick={handleProfileClick}
        totalPosts={totalPosts}
      />

      {/* 기본 헤더 - 항상 표시 */}
      <header id="blog-info" className="bg-white sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold">
              {user?.name || userSlug.toUpperCase()} 블로그
            </h1>

            <div className="flex items-center space-x-2">
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

        {/* 필터 & 검색 - 헤더에 포함되어 고정 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white border-b">
          <div className="py-3 sm:py-4">
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* 타입 필터 */}
              <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => handleTypeChange("ALL")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedType === "ALL"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  전체
                </button>
                <button
                  onClick={() => handleTypeChange("NOTICE")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedType === "NOTICE"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  공지
                </button>
                <button
                  onClick={() => handleTypeChange("BLOG")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedType === "BLOG"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  블로그
                </button>
                <button
                  onClick={() => handleTypeChange("NEWS")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedType === "NEWS"
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  뉴스
                </button>
                <button
                  onClick={() => handleTypeChange("EXHIBITION")}
                  className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedType === "EXHIBITION"
                      ? "bg-purple-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  전시
                </button>
                <button
                  onClick={() => handleTypeChange("AWARD")}
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
                    onClick={() => handleTypeChange("STUDIO")}
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
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-32">
        {children}
      </main>

      {/* 하단 네비게이션 - 항상 고정 */}
      <BottomNavigation
        currentSlug={userSlug}
        isOwner={isOwner}
        hasStudioPost={hasStudioPost}
      />
    </div>
  );
}
