// app/[slug]/blog/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Pin,
  Calendar,
  Eye,
  Edit,
  Plus,
  FileText,
  Plane,
  Frame,
  Trophy,
  Newspaper,
  Palette,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { authUtils } from "@/utils/auth";

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

export default function BlogListPage() {
  const params = useParams();
  const router = useRouter();
  const userSlug = params?.slug as string;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const postsPerPage = 10;

  // Event listeners from layout - 중복 제거
  useEffect(() => {
    const handleTypeChange = (e: CustomEvent) => {
      setSelectedType(e.detail);
      setCurrentPage(1);
    };

    const handleSearch = (e: CustomEvent) => {
      setSearchTerm(e.detail);
      setCurrentPage(1);
    };

    const handleOpenFilter = () => {
      setShowFilterModal(true);
    };

    window.addEventListener(
      "blogTypeChange",
      handleTypeChange as EventListener
    );
    window.addEventListener("blogSearch", handleSearch as EventListener);
    window.addEventListener(
      "openBlogFilter",
      handleOpenFilter as EventListener
    );

    return () => {
      window.removeEventListener(
        "blogTypeChange",
        handleTypeChange as EventListener
      );
      window.removeEventListener("blogSearch", handleSearch as EventListener);
      window.removeEventListener(
        "openBlogFilter",
        handleOpenFilter as EventListener
      );
    };
  }, []);

  // Update selected type event
  useEffect(() => {
    const event = new CustomEvent("blogTypeUpdate", {
      detail: { type: selectedType },
    });
    window.dispatchEvent(event);
  }, [selectedType]);

  // Initial load and filter changes
  useEffect(() => {
    if (userSlug) {
      checkOwnership();
      fetchPosts();
    }
  }, [userSlug, selectedType, searchTerm]);

  const checkOwnership = async () => {
    const token = authUtils.getToken();
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
      console.error("Failed to check ownership:", error);
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

      const pageToFetch = isLoadMore ? currentPage + 1 : 1;
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

      const response = await fetch(`${backendUrl}/api/blog/posts?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        let filteredPosts = data.posts || [];

        // Exclude studio posts for non-owners
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
          setCurrentPage(1);
        }

        setTotalPages(data.pages || 1);

        // Send total posts count to layout
        const event = new CustomEvent("blogPostsUpdate", {
          detail: { total: data.total || 0 },
        });
        window.dispatchEvent(event);
      } else {
        setError("Failed to load blog posts.");
      }
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      setError("Failed to load blog posts.");
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "ALL":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "TRAVEL":
        return "bg-green-100 text-green-700 border-green-200";
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
      case "ALL":
        return "All";
      case "TRAVEL":
        return "Travel";
      case "EXHIBITION":
        return "Exhibition";
      case "AWARD":
        return "Award";
      case "NEWS":
        return "News";
      case "STUDIO":
        return "Studio";
      default:
        return "Blog";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "ALL":
        return <FileText className="w-4 h-4" />;
      case "TRAVEL":
        return <Plane className="w-4 h-4" />;
      case "EXHIBITION":
        return <Frame className="w-4 h-4" />;
      case "AWARD":
        return <Trophy className="w-4 h-4" />;
      case "NEWS":
        return <Newspaper className="w-4 h-4" />;
      case "STUDIO":
        return <Palette className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
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

  if (error && posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => router.push(`/${userSlug}`)}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Back to Gallery
        </button>
      </div>
    );
  }

  const categoryItems = [
    { value: "ALL", label: "All" },
    { value: "TRAVEL", label: "Travel" },
    { value: "EXHIBITION", label: "Exhibition" },
    { value: "AWARD", label: "Award" },
    { value: "NEWS", label: "News" },
    { value: "STUDIO", label: "Studio" },
  ];

  return (
    <>
      {/* Post List */}
      <div className="space-y-3 sm:space-y-4">
        {isLoading && posts.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-lg p-8 sm:p-12 text-center">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-500">
              {selectedType === "STUDIO" && !isOwner
                ? "Studio posts are only visible to the artist."
                : "No posts yet."}
            </p>
            {isOwner && (
              <Link
                href={`/${userSlug}/blog/write`}
                className="inline-flex items-center gap-2 mt-4 px-3 sm:px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Write First Post</span>
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
                <Link href={`/${userSlug}/blog/${post.id}`}>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {post.featured_image && (
                        <div className="flex-shrink-0">
                          <img
                            src={post.featured_thumbnail || post.featured_image}
                            alt={post.title}
                            className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}

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
                              {getTypeLabel(post.post_type)}
                            </span>
                          </div>
                          {isOwner && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/${userSlug}/blog/${post.id}/edit`
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
                            <span>
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ko,
                              })}
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

      {/* Load More Button */}
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
                <span>Loading...</span>
              </div>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      )}

      {/* Filter Modal with Icons */}
      {showFilterModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowFilterModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-4 max-w-xs w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-semibold text-gray-500 mb-3 px-2">
              Category
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {categoryItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setSelectedType(item.value);
                    setShowFilterModal(false);
                  }}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl transition-all ${
                    selectedType === item.value
                      ? "bg-gray-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {getTypeIcon(item.value)}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
