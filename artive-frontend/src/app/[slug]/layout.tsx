// app/[slug]/layout.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import GalleryInfo from "@/components/gallery/GalleryInfo";
import BottomNavigation from "@/components/gallery/BottomNavigation";
import { User } from "@/components/gallery/types";

interface GalleryLayoutProps {
  children: ReactNode;
}

export default function GalleryLayout({ children }: GalleryLayoutProps) {
  const params = useParams();
  const router = useRouter();
  const currentSlug = params?.slug as string;

  const [galleryUser, setGalleryUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showGalleryHeader, setShowGalleryHeader] = useState(false);
  const [mobileGridMode, setMobileGridMode] = useState<"single" | "double">(
    "double"
  );
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [totalViews, setTotalViews] = useState(0);

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // 스크롤 기반 헤더 전환
  useEffect(() => {
    const handleScroll = () => {
      const galleryElement = document.getElementById("gallery-info");
      if (galleryElement) {
        const rect = galleryElement.getBoundingClientRect();
        setShowGalleryHeader(rect.bottom <= 80);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 작품 정보 업데이트 리스너
  useEffect(() => {
    const handleArtworksUpdate = (e: CustomEvent) => {
      setTotalArtworks(e.detail.total || 0);
      setTotalViews(e.detail.totalViews || 0);
    };

    window.addEventListener(
      "galleryArtworksUpdate",
      handleArtworksUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "galleryArtworksUpdate",
        handleArtworksUpdate as EventListener
      );
    };
  }, []);

  // 사용자 정보 로드
  useEffect(() => {
    if (currentSlug) {
      fetchGalleryUser();
      checkOwnership();
    }
  }, [currentSlug]);

  const fetchGalleryUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // 프로필 정보 가져오기
      const profileRes = await fetch(
        `${backEndUrl}/api/profile/${currentSlug}`,
        { method: "GET", headers }
      );

      let profileData = null;
      if (profileRes.ok) {
        profileData = await profileRes.json();
      }

      setGalleryUser({
        id: profileData?.id || 1,
        name: profileData?.name || currentSlug.toUpperCase(),
        slug: currentSlug,
        bio: profileData?.bio || "",
        artist_statement: profileData?.artist_statement || "",
        about_text: profileData?.about_text || "",
        about_image: profileData?.about_image || "",
        about_video: profileData?.about_video || "",
        studio_description: profileData?.studio_description || "",
        studio_image: profileData?.studio_image || "",
        process_video: profileData?.process_video || "",
        artist_interview: profileData?.artist_interview || "",
        cv_education: profileData?.cv_education || "",
        cv_exhibitions: profileData?.cv_exhibitions || "",
        cv_awards: profileData?.cv_awards || "",
        gallery_title:
          profileData?.gallery_title || `${currentSlug.toUpperCase()} Gallery`,
        gallery_description: profileData?.gallery_description || "",
        total_artworks: totalArtworks,
        total_views: totalViews,
        is_public_gallery: profileData?.is_public_gallery !== false,
      });
    } catch (error) {
      console.error("갤러리 사용자 정보 로드 실패:", error);
      // 에러 시에도 기본값 설정
      setGalleryUser({
        id: 1,
        name: currentSlug.toUpperCase(),
        slug: currentSlug,
        bio: "",
        gallery_title: `${currentSlug.toUpperCase()} Gallery`,
        gallery_description: "",
        total_artworks: 0,
        total_views: 0,
        is_public_gallery: true,
      } as User);
    }
  };

  const checkOwnership = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${backEndUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        const userData = await res.json();
        setIsOwner(userData.slug === currentSlug);
      }
    } catch (error) {
      console.error("소유권 확인 실패:", error);
    }
  };

  const handleProfileClick = () => {
    router.push("/profile/manage");
  };

  // 작품 데이터를 위한 더미 배열 (헤더 컴포넌트가 요구하는 경우)
  const artworks: any[] = [];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 고정 헤더 */}
      <GalleryHeader
        showGalleryHeader={showGalleryHeader}
        galleryUser={galleryUser}
        currentSlug={currentSlug}
        artworks={artworks}
        isOwner={isOwner}
        onProfileClick={handleProfileClick}
        mobileGridMode={mobileGridMode}
        onMobileGridChange={setMobileGridMode}
      />

      {/* 갤러리 정보 - 스크롤 시 숨겨짐 */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryInfo
            galleryUser={{
              ...galleryUser,
              total_artworks: totalArtworks,
              total_views: totalViews,
            }}
            currentSlug={currentSlug}
            artworks={artworks}
            isOwner={isOwner}
            onProfileClick={handleProfileClick}
            mobileGridMode={mobileGridMode}
            onMobileGridChange={setMobileGridMode}
          />
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {children}
        </div>
      </main>

      {/* 하단 여백 */}
      <div className="h-24"></div>

      {/* 하단 네비게이션 - 항상 고정 */}
      <BottomNavigation currentSlug={currentSlug} isOwner={isOwner} />
    </div>
  );
}
