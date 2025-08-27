"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// 컴포넌트들 import
import GalleryHeader from "@/components/gallery/GalleryHeader";
import GalleryInfo from "@/components/gallery/GalleryInfo";
import AddArtworkButton from "@/components/gallery/AddArtworkButton";
import ArtworkGrid from "@/components/gallery/ArtworkGrid";
import BottomNavigation from "@/components/gallery/BottomNavigation";

// 타입들 import
import { User, Artwork } from "@/components/gallery/types";

export default function GalleryPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const pathname = usePathname();

  // 상태 관리
  const [galleryUser, setGalleryUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 동적 헤더 상태
  const [showGalleryHeader, setShowGalleryHeader] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const currentSlug = pathname?.split("/")[1];

  const [mobileGridMode, setMobileGridMode] = useState<"single" | "double">(
    "double"
  );

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // 스크롤 기반 헤더 전환 로직
  useEffect(() => {
    const handleScroll = () => {
      const galleryElement = document.getElementById("gallery-info");
      if (galleryElement) {
        const rect = galleryElement.getBoundingClientRect();

        if (rect.bottom <= 80) {
          setShowGalleryHeader(true);
        } else {
          setShowGalleryHeader(false);
        }
      }
    };

    if (mounted) {
      window.addEventListener("scroll", handleScroll);
      handleScroll();
    }

    return () => {
      if (mounted) {
        window.removeEventListener("scroll", handleScroll);
      }
    };
  }, [mounted]);

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

  // 갤러리 소유자 정보와 작품 목록 가져오기
  useEffect(() => {
    const fetchGalleryData = async () => {
      if (!currentSlug) return;

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("token");
        const headers: HeadersInit = { Accept: "application/json" };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // 1. 작품 목록 가져오기
        const artworksRes = await fetch(
          `${backEndUrl}/api/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=1&size=${ITEMS_PER_PAGE}`,
          {
            method: "GET",
            headers,
          }
        );

        if (!artworksRes.ok) {
          if (artworksRes.status === 404) {
            setError("갤러리를 찾을 수 없습니다.");
          } else if (artworksRes.status === 403) {
            setError("비공개 갤러리입니다. 로그인 상태와 권한을 확인해주세요.");
          } else {
            setError("갤러리를 불러오는데 실패했습니다.");
          }
          setLoading(false);
          return;
        }

        const artworksData = await artworksRes.json();

        // 2. 사용자 프로필 정보 가져오기
        const profileRes = await fetch(
          `${backEndUrl}/api/profile/${currentSlug}`,
          {
            method: "GET",
            headers,
          }
        );

        let profileData = null;
        if (profileRes.ok) {
          profileData = await profileRes.json();
        }

        setArtworks(artworksData.artworks || artworksData.items || []);
        setCurrentPage(artworksData.page || 1);
        setTotalPages(
          artworksData.pages ||
            Math.ceil((artworksData.total || 0) / ITEMS_PER_PAGE)
        );
        setHasMore(
          artworksData.has_next || artworksData.page < artworksData.pages
        );

        // 갤러리 사용자 정보 설정
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
            profileData?.gallery_title ||
            `${currentSlug.toUpperCase()} Gallery`,
          gallery_description: profileData?.gallery_description || "",
          total_artworks: artworksData.total || 0,
          total_views:
            artworksData.artworks?.reduce(
              (sum: number, art: Artwork) => sum + (art.view_count || 0),
              0
            ) || 0,
          is_public_gallery: profileData?.is_public_gallery !== false,
        });
      } catch (err) {
        console.error("갤러리 데이터 조회 실패:", err);
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [currentSlug, backEndUrl]);

  // Load More 함수
  const loadMoreArtworks = async () => {
    if (!hasMore || loadingMore || !currentSlug) return;

    setLoadingMore(true);

    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const nextPage = currentPage + 1;
      const artworksRes = await fetch(
        `${backEndUrl}/api/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=${nextPage}&size=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers,
        }
      );

      if (artworksRes.ok) {
        const artworksData = await artworksRes.json();

        // 백엔드에서 받은 데이터 그대로 사용
        setArtworks((prev) => [
          ...prev,
          ...(artworksData.artworks || artworksData.items || []),
        ]);
        setCurrentPage(artworksData.page || nextPage);
        setHasMore(
          artworksData.has_next || artworksData.page < artworksData.pages
        );
      }
    } catch (err) {
      console.error("추가 작품 로딩 실패:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // 이벤트 핸들러들
  const handleProfileClick = () => {
    router.push("/profile/manage");
  };

  const handleAddArtwork = () => {
    router.push("/artworks/new");
  };

  // 로딩 상태 - 통합
  if (!mounted || loading) {
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
        <Link href="/" className="text-blue-600 hover:underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 고정 헤더 컴포넌트 */}
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

      {/* 메인 콘텐츠 */}
      <div className="bg-white ">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {/* 갤러리 정보 컴포넌트 */}
          <GalleryInfo
            galleryUser={galleryUser}
            currentSlug={currentSlug}
            artworks={artworks}
            isOwner={isOwner}
            onProfileClick={handleProfileClick}
            mobileGridMode={mobileGridMode}
            onMobileGridChange={setMobileGridMode}
          />

          {/* 작품 추가 버튼 컴포넌트 */}
          {isOwner && (
            <AddArtworkButton
              isOwner={isOwner}
              onClick={handleAddArtwork}
              isMobileGridMode={mobileGridMode}
              onMobileGridChange={setMobileGridMode}
            />
          )}

          {/* 작품 그리드 컴포넌트 */}
          <ArtworkGrid
            artworks={artworks}
            isOwner={isOwner}
            hasMore={hasMore}
            loadingMore={loadingMore}
            totalArtworks={galleryUser?.total_artworks || 0}
            onAddArtwork={handleAddArtwork}
            onLoadMore={loadMoreArtworks}
            mobileGridMode={mobileGridMode}
          />
        </div>
      </div>

      {/* 하단 네비게이션과의 간격을 위한 빈 영역 */}
      <div className="h-24"></div>

      {/* PC용 하단 네비게이션 */}
      <BottomNavigation currentSlug={currentSlug} isOwner={isOwner} />
    </div>
  );
}
