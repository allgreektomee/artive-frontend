// src/components/gallery/NoticeSection.tsx
"use client";
import { useState, useEffect } from "react";
import { Bell, Calendar } from "lucide-react";

interface Notice {
  id: number;
  title: string;
  content: string;
  created_at: string;
  is_pinned: boolean;
}

interface NoticeSectionProps {
  userId: string;
}

export default function NoticeSection({ userId }: NoticeSectionProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    fetchNotices();
  }, [userId]);

  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log(
        "🔍 공지사항 요청 시작:",
        `${backendUrl}/api/blog/posts?user=${userId}&post_type=NOTICE&is_published=true&limit=10`
      );

      // 백엔드 서버 상태 먼저 확인
      try {
        const healthResponse = await fetch(`${backendUrl}/health`);
        console.log("🏥 헬스체크 응답:", healthResponse.status);

        if (!healthResponse.ok) {
          throw new Error(`서버 응답 오류: ${healthResponse.status}`);
        }
      } catch (healthError) {
        console.error("❌ 백엔드 서버가 응답하지 않습니다:", healthError);
        setError(
          "백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요."
        );
        return;
      }

      const response = await fetch(
        `${backendUrl}/api/blog/posts?user=${userId}&post_type=NOTICE&is_published=true&limit=10`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 API 응답 상태:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ 응답 데이터:", data);
        setNotices(data.posts || []);
      } else {
        const errorText = await response.text();
        console.error("❌ API 오류:", response.status, errorText);

        if (response.status === 500) {
          setError(
            "서버 내부 오류가 발생했습니다. 백엔드 로그를 확인해주세요."
          );
        } else if (response.status === 404) {
          setError("API 엔드포인트를 찾을 수 없습니다.");
        } else {
          setError(`API 오류: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("❌ 공지사항 가져오기 오류:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError(
          "네트워크 연결 오류 또는 CORS 문제입니다. 백엔드 서버 상태를 확인해주세요."
        );
      } else {
        setError(`네트워크 오류: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold">공지사항</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-red-500" />
          <h2 className="text-lg font-semibold">공지사항</h2>
        </div>
        <div className="text-center py-8 text-gray-500">
          <p>{error}</p>
          <button
            onClick={fetchNotices}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 정상 렌더링
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-5 h-5 text-blue-500" />
        <h2 className="text-lg font-semibold">공지사항</h2>
      </div>

      {notices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <article
              key={notice.id}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <header className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  {notice.is_pinned && (
                    <span
                      className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2"
                      title="고정된 공지"
                    ></span>
                  )}
                  {notice.title}
                </h3>
                <time className="flex items-center text-gray-400 text-xs ml-4">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(notice.created_at).toLocaleDateString("ko-KR")}
                </time>
              </header>
              <p className="text-gray-600 text-sm line-clamp-2">
                {notice.content.length > 100
                  ? notice.content.slice(0, 100) + "..."
                  : notice.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
