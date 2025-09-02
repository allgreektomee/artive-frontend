"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// About 섹션 컴포넌트들 import
import ArtistStatement from "@/components/gallery/about/ArtistStatement";
import ArtistInterview from "@/components/gallery/about/ArtistInterview";
import ExhibitionsRecognition from "@/components/gallery/about/ExhibitionsRecognition";
import StudioProcess from "@/components/gallery/about/StudioProcess";
import BottomNavigation from "@/components/gallery/BottomNavigation";
import { FaUser } from "react-icons/fa";
// 타입 import
import { User } from "@/components/gallery/types";

export default function AboutArtistPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const pathname = usePathname();

  // 상태 관리
  const [galleryUser, setGalleryUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSlug = pathname?.split("/")[1];

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
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

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentSlug) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = { Accept: "application/json" };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // 프로필 정보 가져오기
        const profileRes = await fetch(
          `${backEndUrl}/api/profile/${currentSlug}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!profileRes.ok) {
          if (profileRes.status === 404) {
            setError("프로필을 찾을 수 없습니다.");
          } else {
            setError("프로필을 불러오는데 실패했습니다.");
          }
          return;
        }

        const profileData = await profileRes.json();

        setGalleryUser({
          id: profileData?.id || 1,
          name: profileData?.name || currentSlug.toUpperCase(),
          slug: currentSlug,
          bio: profileData?.bio || "",

          // About the Artist 관련
          artist_statement:
            profileData?.artist_statement || profileData?.about_text || "",
          about_text: profileData?.about_text || "",
          about_image: profileData?.about_image || "",
          about_video: profileData?.about_video || "",

          // Studio Process 관련
          studio_description: profileData?.studio_description || "",
          studio_image: profileData?.studio_image || "",
          process_video: profileData?.process_video || "",

          // Artist Interview
          artist_interview: profileData?.artist_interview || "",

          // Exhibitions & Recognition
          cv_education: profileData?.cv_education || "",
          cv_exhibitions: profileData?.cv_exhibitions || "",
          cv_awards: profileData?.cv_awards || "",

          // 갤러리 정보
          gallery_title:
            profileData?.gallery_title ||
            `${currentSlug.toUpperCase()} Gallery`,
          gallery_description: profileData?.gallery_description || "",
        });
      } catch (err) {
        console.error("프로필 데이터 조회 실패:", err);
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentSlug, backEndUrl]);

  // 이벤트 핸들러
  const handleProfileClick = () => {
    router.push("/profile/manage");
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <Link
          href={`/${currentSlug}`}
          className="text-blue-600 hover:underline"
        >
          갤러리로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 콘텐츠 */}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
        {/* About 섹션들 */}
        <div className="">
          {/* Artist Statement - 맨 위로 이동 */}
          <div id="artist-statement" className="artist-statement-section">
            <ArtistStatement galleryUser={galleryUser} isOwner={isOwner} />

            {/* SNS 링크 섹션 추가 */}
            {(galleryUser?.instagram_username ||
              galleryUser?.youtube_channel_id) && (
              <div className="flex justify-center space-x-4 mt-6 pt-6 border-t border-gray-200">
                {galleryUser.instagram_username && (
                  <a // <- 여기 <a 태그 추가
                    href={`https://instagram.com/${galleryUser.instagram_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z" />
                    </svg>
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                )}

                {galleryUser.youtube_channel_id && (
                  <a // <- 여기 <a 태그 추가
                    href={`https://youtube.com/channel/${galleryUser.youtube_channel_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span className="text-sm font-medium">YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Exhibitions & Recognition */}
          <div id="exhibitions" className="exhibitions-section">
            <ExhibitionsRecognition
              galleryUser={galleryUser}
              isOwner={isOwner}
            />
          </div>
          {/* 안내 문구 - 구분선 포함 */}
          <div className="text-center">
            <p className="text-gray-700 font-normal mb-2">
              {galleryUser?.name || currentSlug?.toUpperCase()}'s Major
              Activities
            </p>
            <p className="text-sm text-gray-500">
              전체 이력은{" "}
              <Link
                href={`/blog/${currentSlug}`}
                className="text-blue-600 hover:text-blue-700"
              >
                Blog
              </Link>{" "}
              섹션을 확인하세요.
            </p>
          </div>
          {/* Artist Interview - 숨김 처리 가능 */}
          <div id="artist-interview" className="artist-interview-section">
            <ArtistInterview galleryUser={galleryUser} isOwner={isOwner} />
          </div>
        </div>
      </div>

      {/* 하단 여백 추가 */}
      <div className="h-24"></div>

      {/* 하단 네비게이션 */}
      <BottomNavigation currentSlug={currentSlug} isOwner={isOwner} />
    </div>
  );
}
