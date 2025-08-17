// components/gallery/BlogSection.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Bell,
  FileText,
  Pin,
  ChevronDown,
  ChevronUp,
  Calendar,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_pinned?: boolean;
  post_type?: "NOTICE" | "BLOG" | "EXHIBITION" | "AWARD" | "NEWS";
  view_count?: number;
  event_date?: string;
}

interface BlogSectionProps {
  userId: string;
  isOwner: boolean;
}

export default function BlogSection({ userId, isOwner }: BlogSectionProps) {
  const [notices, setNotices] = useState<BlogPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isNoticeExpanded, setIsNoticeExpanded] = useState(false);
  const [isBlogExpanded, setIsBlogExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "notice" | "blog">("all");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, [userId]);

  const fetchPosts = async () => {
    try {
      // 공지사항 가져오기
      const noticeResponse = await fetch(
        `${backendUrl}/api/blog/posts?user=${userId}&post_type=NOTICE&is_published=true&limit=10`
      );
      if (noticeResponse.ok) {
        const noticeData = await noticeResponse.json();
        const sortedNotices = noticeData.sort((a: BlogPost, b: BlogPost) => {
          if (a.is_pinned && !b.is_pinned) return -1;
          if (!a.is_pinned && b.is_pinned) return 1;
          return 0;
        });
        setNotices(sortedNotices);
      }

      // 일반 블로그 글 가져오기
      const blogResponse = await fetch(
        `${backendUrl}/api/blog/posts?user=${userId}&post_type=BLOG&is_published=true&limit=10`
      );
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        setBlogPosts(blogData);
      }
    } catch (error) {
      console.error("포스트 로딩 실패:", error);
    }
  };

  const handlePostClick = (postId: string) => {
    router.push(`/blog/${userId}/${postId}`);
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getPreview = (content: string, length: number = 80) => {
    const text = stripHtml(content);
    return text.length > length ? text.substring(0, length) + "..." : text;
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "EXHIBITION":
        return "전시";
      case "AWARD":
        return "수상";
      case "NEWS":
        return "뉴스";
      case "NOTICE":
        return "공지";
      default:
        return "포스트";
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "EXHIBITION":
        return "text-purple-600 bg-purple-50";
      case "AWARD":
        return "text-yellow-600 bg-yellow-50";
      case "NEWS":
        return "text-blue-600 bg-blue-50";
      case "NOTICE":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const totalCount = notices.length + blogPosts.length;
  if (totalCount === 0) return null;

  return (
    <div className="mb-6">
      {/* 통합 헤더 - 탭 방식 */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === "all"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-500 border-transparent hover:text-gray-700"
              }`}
            >
              전체 ({totalCount})
            </button>
            {notices.length > 0 && (
              <button
                onClick={() => setActiveTab("notice")}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "notice"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                공지 ({notices.length})
              </button>
            )}
            {blogPosts.length > 0 && (
              <button
                onClick={() => setActiveTab("blog")}
                className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "blog"
                    ? "text-blue-600 border-blue-600"
                    : "text-gray-500 border-transparent hover:text-gray-700"
                }`}
              >
                블로그 ({blogPosts.length})
              </button>
            )}
          </div>
          {isOwner && (
            <button
              onClick={() => router.push(`/blog/${userId}/write`)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + 새 글 작성
            </button>
          )}
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-3">
        {/* 공지사항 */}
        {(activeTab === "all" || activeTab === "notice") &&
          notices.length > 0 && (
            <div>
              {activeTab === "all" && (
                <div
                  onClick={() => setIsNoticeExpanded(!isNoticeExpanded)}
                  className="flex items-center gap-2 px-3 py-2 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100 transition-colors mb-2"
                >
                  <Bell className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-700">
                    공지사항
                  </span>
                  <span className="text-xs text-red-600">
                    ({notices.length})
                  </span>
                  <div className="ml-auto">
                    {isNoticeExpanded ? (
                      <ChevronUp className="w-4 h-4 text-red-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-red-400" />
                    )}
                  </div>
                </div>
              )}

              {(activeTab !== "all" || isNoticeExpanded) && (
                <div className="space-y-2">
                  {notices
                    .slice(0, activeTab === "all" ? 3 : undefined)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handlePostClick(post.id)}
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
                      >
                        <div className="flex items-start gap-2">
                          {post.is_pinned && (
                            <Pin className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(
                                  post.post_type
                                )}`}
                              >
                                {getTypeLabel(post.post_type)}
                              </span>
                              <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                {post.title}
                              </h3>
                            </div>
                            <p className="text-xs text-gray-600 line-clamp-2">
                              {getPreview(post.content)}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDistanceToNow(
                                  new Date(post.created_at),
                                  {
                                    addSuffix: true,
                                    locale: ko,
                                  }
                                )}
                              </span>
                              {post.view_count !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {post.view_count}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

        {/* 블로그 글 */}
        {(activeTab === "all" || activeTab === "blog") &&
          blogPosts.length > 0 && (
            <div>
              {activeTab === "all" && (
                <div
                  onClick={() => setIsBlogExpanded(!isBlogExpanded)}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors mb-2"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    블로그
                  </span>
                  <span className="text-xs text-blue-600">
                    ({blogPosts.length})
                  </span>
                  <div className="ml-auto">
                    {isBlogExpanded ? (
                      <ChevronUp className="w-4 h-4 text-blue-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </div>
              )}

              {(activeTab !== "all" || isBlogExpanded) && (
                <div className="space-y-2">
                  {blogPosts
                    .slice(0, activeTab === "all" ? 5 : undefined)
                    .map((post) => (
                      <div
                        key={post.id}
                        onClick={() => handlePostClick(post.id)}
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm cursor-pointer transition-all group"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                            {post.title}
                          </h3>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {getPreview(post.content)}
                          </p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDistanceToNow(new Date(post.created_at), {
                                addSuffix: true,
                                locale: ko,
                              })}
                            </span>
                            {post.view_count !== undefined && (
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {post.view_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
      </div>

      {/* 전체 보기 링크 */}
      {totalCount > 5 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push(`/blog/${userId}`)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            전체 글 보기 →
          </button>
        </div>
      )}
    </div>
  );
}
