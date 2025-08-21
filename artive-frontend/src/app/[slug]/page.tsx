"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// 컴포넌트들 import
import GalleryHeader from "@/components/gallery/GalleryHeader";
import GalleryInfo from "@/components/gallery/GalleryInfo";
import AddArtworkButton from "@/components/gallery/AddArtworkButton";
import ArtworkGrid from "@/components/gallery/ArtworkGrid";
import AboutSection from "@/components/gallery/AboutSection";
import NoticeSection from "@/components/gallery/NoticeSection";

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
  const ITEMS_PER_PAGE = 12;

  const currentSlug = pathname?.split("/")[1];

  const [noticesCount, setNoticesCount] = useState<number | null>(null);

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
        console.log("🔍 토큰:", token ? "있음" : "없음");

        if (!token) {
          console.log("🚨 토큰 없음");
          return;
        }

        console.log("🔍 API 호출 시작:", `${backEndUrl}/api/auth/me`);

        const res = await fetch(`${backEndUrl}/api/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        console.log("🔍 응답 상태:", res.status);
        console.log("🔍 응답 OK:", res.ok);

        if (res.ok) {
          const userData = await res.json();
          console.log("🎯 받은 사용자 데이터:", userData);
          setCurrentUser(userData);
          setIsOwner(userData.slug === currentSlug);
        } else {
          const errorText = await res.text();
          console.error("🚨 API 에러:", res.status, errorText);
        }
      } catch (err) {
        console.error("🚨 네트워크 에러:", err);
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
        const token = localStorage.getItem("token"); // access_token → token으로 통일
        const headers: HeadersInit = { Accept: "application/json" };

        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("🔍 갤러리 요청:", {
          url: `${backEndUrl}/api/artworks/user/${currentSlug}`, // 올바른 API 경로
          token: token ? "있음" : "없음",
          currentSlug,
        });

        // 올바른 API 엔드포인트: /artworks/user/{user_slug}
        const artworksRes = await fetch(
          `${backEndUrl}/api/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=1&limit=${ITEMS_PER_PAGE}`,
          {
            method: "GET",
            headers,
          }
        );

        console.log("🔍 갤러리 응답:", artworksRes.status);

        if (!artworksRes.ok) {
          const errorText = await artworksRes.text();
          console.error("🔍 갤러리 에러:", artworksRes.status, errorText);

          if (artworksRes.status === 404) {
            setError("갤러리를 찾을 수 없습니다.");
          } else if (artworksRes.status === 403) {
            setError("비공개 갤러리입니다. 로그인 상태와 권한을 확인해주세요.");
          } else {
            setError("갤러리를 불러오는데 실패했습니다.");
          }
          return;
        }

        const artworksData = await artworksRes.json();
        console.log("🔍 작품 데이터:", artworksData);

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
        if (artworksData.artworks && artworksData.artworks.length > 0) {
          setGalleryUser({
            id: 1,
            name: currentSlug.toUpperCase(),
            slug: currentSlug,
            bio: "Contemporary abstract artist exploring color and form.",
            gallery_title: `${currentSlug.toUpperCase()} Gallery`,
            gallery_description: "작품을 통해 색채와 형태의 조화를 탐구합니다.",
            total_artworks: artworksData.total || 0,
            total_views: artworksData.artworks.reduce(
              (sum: number, art: Artwork) => sum + (art.view_count || 0),
              0
            ),
            is_public_gallery: true,
          });
        } else {
          // 작품이 없어도 기본 갤러리 정보 설정
          setGalleryUser({
            id: 1,
            name: currentSlug.toUpperCase(),
            slug: currentSlug,
            bio: "Contemporary abstract artist",
            gallery_title: `${currentSlug.toUpperCase()} Gallery`,
            gallery_description: "Welcome to my gallery",
            total_artworks: 0,
            total_views: 0,
            is_public_gallery: true,
          });
        }
      } catch (err) {
        console.error("갤러리 데이터 조회 실패:", err);
        setError("네트워크 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, [currentSlug, backEndUrl]);

  // 기존 useEffect들 다음에 추가
  useEffect(() => {
    const checkNoticesCount = async () => {
      try {
        const response = await fetch(
          `${backEndUrl}/api/blog/posts?user=${currentSlug}&post_type=NOTICE&is_published=true&limit=1`
        );

        if (response.ok) {
          const data = await response.json();
          setNoticesCount(data.total || 0);
        } else {
          setNoticesCount(0);
        }
      } catch (error) {
        console.log("공지사항 개수 확인 실패:", error);
        setNoticesCount(0);
      }
    };

    checkNoticesCount();
  }, [currentSlug, backEndUrl]);

  // Load More 함수
  const loadMoreArtworks = async () => {
    if (!hasMore || loadingMore || !currentSlug) return;

    setLoadingMore(true);

    try {
      const token = localStorage.getItem("token"); // access_token → token으로 통일
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const nextPage = currentPage + 1;
      // 올바른 API 엔드포인트
      const artworksRes = await fetch(
        `${backEndUrl}/api/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=${nextPage}&limit=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers,
        }
      );

      if (artworksRes.ok) {
        const artworksData = await artworksRes.json();
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

  // 로딩 상태
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        {/* 갤러리 정보 컴포넌트 */}
        <GalleryInfo
          galleryUser={galleryUser}
          currentSlug={currentSlug}
          artworks={artworks}
          isOwner={isOwner}
          onProfileClick={handleProfileClick}
          mobileGridMode={mobileGridMode} // 소유자 여부와 관계없이 전달
          onMobileGridChange={setMobileGridMode} // 소유자 여부와 관계없이 전달
        />

        {/* 작품 추가 버튼 컴포넌트 */}
        {/* AddArtworkButton에 props 추가 */}
        {isOwner && (
          <AddArtworkButton
            isOwner={isOwner}
            onClick={handleAddArtwork}
            isMobileGridMode={mobileGridMode}
            onMobileGridChange={setMobileGridMode}
          />
        )}

        {noticesCount !== null && noticesCount > 0 && (
          <NoticeSection userId={currentSlug} />
        )}

        {/* 작품 그리드 컴포넌트 */}
        <div
          style={{
            height: "2px",
            background: "white",
            marginTop: "-1px",
            marginBottom: "-1px",
            position: "relative",
            zIndex: 10,
          }}
        />
        <ArtworkGrid
          artworks={artworks}
          isOwner={isOwner}
          hasMore={hasMore}
          loadingMore={loadingMore}
          totalArtworks={galleryUser?.total_artworks || 0}
          onAddArtwork={handleAddArtwork}
          onLoadMore={loadMoreArtworks}
          mobileGridMode={mobileGridMode} // 소유자 여부와 관계없이 전달
        />
        {/* About Section 컴포넌트 */}
        <AboutSection galleryUser={galleryUser} />
      </div>
    </div>
  );
}
