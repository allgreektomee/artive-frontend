"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import BottomNavigation from "@/components/gallery/BottomNavigation";
import { FaUser } from "react-icons/fa";
import { User } from "@/components/gallery/types";
import { Edit } from "lucide-react";

interface StudioPost {
  id: number;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  post_type: string;
  tags: string[] | null;
  is_published: boolean;
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    username: string;
    slug: string;
  };
}

export default function StudioPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const pathname = usePathname();
  const [galleryUser, setGalleryUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [studioPost, setStudioPost] = useState<StudioPost | null>(null);

  const currentSlug = pathname?.split("/")[1];

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await fetch(`${backEndUrl}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setCurrentUser(userData);
          setIsOwner(userData.slug === currentSlug);
        }
      } catch (err) {
        console.error("사용자 정보 조회 실패:", err);
      }
    };

    fetchCurrentUser();
  }, [currentSlug, backEndUrl]);

  // 스튜디오 포스트 가져오기
  useEffect(() => {
    const fetchStudioPost = async () => {
      if (!currentSlug) return;

      setLoading(true);
      setError(null);

      try {
        // 스튜디오 포스트 가져오기
        const params = new URLSearchParams({
          user: currentSlug,
          post_type: "STUDIO",
          is_published: "true",
          limit: "1",
        });

        const response = await fetch(`${backEndUrl}/api/blog/posts?${params}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.posts && data.posts.length > 0) {
            const post = data.posts[0];

            // tags가 문자열인 경우 배열로 변환
            if (typeof post.tags === "string") {
              post.tags = post.tags
                .split(",")
                .map((tag: string) => tag.trim())
                .filter((tag: string) => tag);
            } else if (!Array.isArray(post.tags)) {
              post.tags = [];
            }

            setStudioPost(post);

            // 조회수 증가 (소유자가 아닌 경우)
            if (!isOwner) {
              incrementViewCount(post.id);
            }
          } else {
            setError("스튜디오 포스트를 찾을 수 없습니다.");
          }
        } else {
          setError("스튜디오 포스트를 불러오는데 실패했습니다.");
        }

        // 사용자 정보도 가져오기 (갤러리 정보용)
        const profileRes = await fetch(
          `${backEndUrl}/api/profile/${currentSlug}`,
          {
            method: "GET",
            headers: { Accept: "application/json" },
          }
        );

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setGalleryUser({
            id: profileData?.id || 1,
            name: profileData?.name || currentSlug.toUpperCase(),
            slug: currentSlug,
            bio: profileData?.bio || "",
            gallery_title:
              profileData?.gallery_title ||
              `${currentSlug.toUpperCase()} Gallery`,
            gallery_description: profileData?.gallery_description || "",
          });
        }
      } catch (err) {
        console.error("스튜디오 데이터 조회 실패:", err);
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudioPost();
  }, [currentSlug, backEndUrl, isOwner]);

  // 조회수 증가
  const incrementViewCount = async (postId: number) => {
    try {
      await fetch(`${backEndUrl}/api/blog/posts/${postId}/view`, {
        method: "POST",
      });
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile/manage");
  };

  const handleEdit = () => {
    if (studioPost) {
      router.push(`/${currentSlug}/blog/${studioPost.id}/edit`);
    }
  };

  const handleWriteStudio = () => {
    router.push(`/${currentSlug}/blog/write`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto"
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
          </div>
          <p className="text-gray-600 text-lg mb-4">{error}</p>
          {isOwner && !studioPost && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                아직 스튜디오를 소개하는 포스트를 작성하지 않으셨네요.
              </p>
              <button
                onClick={handleWriteStudio}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                스튜디오 포스트 작성하기
              </button>
            </div>
          )}
          <Link
            href={`/${currentSlug}`}
            className="inline-block mt-4 text-blue-600 hover:underline"
          >
            갤러리로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 메인 콘텐츠 - Layout의 children으로 렌더링 */}
      <div className="">
        <div className="flex justify-center">
          <div
            className="blog-content max-w-none"
            dangerouslySetInnerHTML={{ __html: studioPost?.content || "" }}
          />
        </div>
      </div>
    </>
  );
}
