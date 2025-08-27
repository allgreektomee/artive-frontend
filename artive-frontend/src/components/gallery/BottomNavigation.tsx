"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface BottomNavigationProps {
  currentSlug?: string;
  isOwner?: boolean;
}

export default function BottomNavigation({
  currentSlug,
  isOwner,
}: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("");

  // 현재 경로에 따라 활성 섹션 설정
  useEffect(() => {
    if (pathname?.includes("/blog")) {
      setActiveSection("blog");
    } else if (pathname?.includes("/about")) {
      setActiveSection("artist");
    } else if (pathname?.includes("/studio")) {
      setActiveSection("studio");
    } else {
      setActiveSection("gallery");
    }
  }, [pathname]);
  const [hasStudioPost, setHasStudioPost] = useState(false);

  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  // 현재 경로에 따라 활성 섹션 설정
  useEffect(() => {
    if (pathname?.includes("/blog")) {
      setActiveSection("blog");
    } else if (pathname?.includes("/about")) {
      setActiveSection("artist");
    } else if (pathname?.includes("/studio")) {
      setActiveSection("studio");
    } else {
      setActiveSection("gallery");
    }
  }, [pathname]);

  // 스튜디오 포스트 존재 여부 체크
  useEffect(() => {
    if (currentSlug) {
      checkStudioPost();
    }
  }, [currentSlug]);

  const checkStudioPost = async () => {
    try {
      const params = new URLSearchParams({
        user: currentSlug || "",
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

  const handleNavigation = (section: string) => {
    // setActiveSection(section);

    switch (section) {
      case "gallery":
        router.push(`/${currentSlug}`);
        break;
      case "blog":
        router.push(`/blog/${currentSlug}`);
        break;
      case "artist":
        router.push(`/${currentSlug}/about`);
        break;
      case "studio":
        router.push(`/${currentSlug}/studio`);
        break;
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-14 md:h-16">
          <nav className="flex space-x-1">
            {/* Gallery */}
            <button
              onClick={() => handleNavigation("gallery")}
              className={`group flex items-center justify-center h-9 md:h-10 min-w-[100px] md:min-w-[120px] px-4 md:px-6 rounded-full border-2 transition-colors duration-200 ${
                activeSection === "gallery"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-transparent hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 md:w-5 h-4 md:h-5 mr-1.5 md:mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="text-sm md:text-base font-medium">Gallery</span>
            </button>

            {/* Blog */}
            <button
              onClick={() => handleNavigation("blog")}
              className={`group flex items-center justify-center h-9 md:h-10 min-w-[100px] md:min-w-[120px] px-4 md:px-6 rounded-full border-2 transition-colors duration-200 ${
                activeSection === "blog"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-transparent hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 md:w-5 h-4 md:h-5 mr-1.5 md:mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                />
              </svg>
              <span className="text-sm md:text-base font-medium">Blog</span>
            </button>

            {/* Artist */}
            <button
              onClick={() => handleNavigation("artist")}
              className={`group flex items-center justify-center h-9 md:h-10 min-w-[100px] md:min-w-[120px] px-4 md:px-6 rounded-full border-2 transition-colors duration-200 ${
                activeSection === "artist"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-transparent hover:bg-gray-100"
              }`}
            >
              <svg
                className="w-4 md:w-5 h-4 md:h-5 mr-1.5 md:mr-2 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-sm md:text-base font-medium">Artist</span>
            </button>

            {/* Studio - 스튜디오 포스트가 있을 때만 표시 */}
            {hasStudioPost && (
              <button
                onClick={() => handleNavigation("studio")}
                className={`group flex items-center justify-center h-9 md:h-10 min-w-[100px] md:min-w-[120px] px-4 md:px-6 rounded-full border-2 transition-colors duration-200 ${
                  activeSection === "studio"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-transparent hover:bg-indigo-50"
                }`}
              >
                <svg
                  className={`w-4 md:w-5 h-4 md:h-5 mr-1.5 md:mr-2 flex-shrink-0 ${
                    activeSection === "studio"
                      ? "text-white"
                      : "text-indigo-500"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
                <span className="text-sm md:text-base font-medium">Studio</span>
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
}
