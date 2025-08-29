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

  // 프로필 정보 가져오기
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentSlug) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
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
