// app/[slug]/layout.tsx
"use client";

import { ReactNode, useState, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import GalleryHeader from "@/components/gallery/GalleryHeader";
import GalleryInfo from "@/components/gallery/GalleryInfo";
import BottomNavigation from "@/components/gallery/BottomNavigation";
import { User } from "@/components/gallery/types";

interface GalleryLayoutProps {
  children: ReactNode;
}

export default function GalleryLayout({ children }: GalleryLayoutProps) {
  const params = useParams();
  const pathname = usePathname();
  const currentSlug = params?.slug as string;

  const [galleryUser, setGalleryUser] = useState<User | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showGalleryHeader, setShowGalleryHeader] = useState(false);
  const [mobileGridMode, setMobileGridMode] = useState<"single" | "double">(
    "double"
  );
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [studioPostId, setStudioPostId] = useState<number | undefined>();

  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Gallery 페이지인지 체크
  const isGalleryPage = pathname === `/${currentSlug}`;

  // 스크롤 기반 헤더 전환 로직
  // 스크롤 기반 헤더 전환 로직
  useEffect(() => {
    const handleScroll = () => {
      // 초기 로딩 상태 해제
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }

      // 페이지별로 다른 스크롤 임계값 설정
      let threshold = 200;
      if (pathname?.includes("/blog")) {
        threshold = 150;
      } else if (
        pathname?.includes("/about") ||
        pathname?.includes("/studio")
      ) {
        threshold = 100;
      }

      // Gallery 페이지는 GalleryInfo 하단 기준
      if (isGalleryPage) {
        const galleryElement = document.getElementById("gallery-info");
        console.log("Gallery element:", galleryElement); // 디버깅
        if (galleryElement) {
          const rect = galleryElement.getBoundingClientRect();
          console.log(
            "Rect bottom:",
            rect.bottom,
            "Should show header:",
            rect.bottom <= 80
          ); // 디버깅
          setShowGalleryHeader(rect.bottom <= 80);
        }
      } else {
        // 다른 페이지는 스크롤 값 기준
        setShowGalleryHeader(window.scrollY > threshold);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // 초기 실행을 지연시켜서 DOM이 완전히 렌더링된 후 실행
    const timer = setTimeout(() => {
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, [isGalleryPage, pathname, isInitialLoad]);

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
      if (pathname?.includes("/blog")) {
        fetchBlogPostCount();
      }
      if (pathname?.includes("/studio")) {
        fetchStudioPost();
      }
    }
  }, [currentSlug, pathname]);

  const fetchGalleryUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

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
        gallery_title:
          profileData?.gallery_title || `${currentSlug.toUpperCase()} Gallery`,
        gallery_description: profileData?.gallery_description || "",
        total_artworks: totalArtworks,
        total_views: totalViews,
        is_public_gallery: profileData?.is_public_gallery !== false,
      } as User);
    } catch (error) {
      console.error("갤러리 사용자 정보 로드 실패:", error);
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

  const fetchBlogPostCount = async () => {
    try {
      const params = new URLSearchParams({
        user: currentSlug,
        is_published: "true",
      });

      const response = await fetch(`${backEndUrl}/api/blog/posts?${params}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPostCount(data.total || 0);
      }
    } catch (error) {
      console.error("블로그 포스트 수 조회 실패:", error);
    }
  };

  const fetchStudioPost = async () => {
    try {
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
          setStudioPostId(data.posts[0].id);
        }
      }
    } catch (error) {
      console.error("스튜디오 포스트 조회 실패:", error);
    }
  };

  const handleProfileClick = () => {
    window.location.href = "/profile/manage";
  };

  // 작품 데이터를 위한 더미 배열 (헤더 컴포넌트가 요구하는 경우)
  const artworks: any[] = [];

  // 1. 상태 추가 (기존 useState들과 함께)
  const [selectedBlogType, setSelectedBlogType] = useState<string>("ALL");

  // 2. useEffect 추가 (다른 useEffect들과 함께)
  useEffect(() => {
    const handleBlogTypeUpdate = (e: CustomEvent) => {
      setSelectedBlogType(e.detail.type);
    };

    window.addEventListener(
      "blogTypeUpdate",
      handleBlogTypeUpdate as EventListener
    );

    return () => {
      window.removeEventListener(
        "blogTypeUpdate",
        handleBlogTypeUpdate as EventListener
      );
    };
  }, []);

  const isDetailPage =
    pathname?.includes("/artworks/") ||
    (pathname?.includes("/blog/") && pathname?.split("/").length > 3);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* GalleryHeader - 스크롤했고 초기 로딩이 끝났을 때만 표시 */}
      {!isDetailPage && (
        <GalleryHeader
          showGalleryHeader={true}
          galleryUser={galleryUser}
          currentSlug={currentSlug}
          artworks={artworks}
          isOwner={isOwner}
          onProfileClick={handleProfileClick}
          mobileGridMode={mobileGridMode}
          onMobileGridChange={setMobileGridMode}
          postCount={postCount}
          studioPostId={studioPostId}
        />
      )}

      {/* GalleryInfo - 스크롤하지 않았을 때만 표시 */}
      {!isDetailPage && (
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
              postCount={postCount}
              selectedBlogType={selectedBlogType}
            />
          </div>
        </div>
      )}

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {children}
        </div>
      </main>

      {/* 하단 여백 */}
      <div className="h-24"></div>

      {/* 하단 네비게이션 */}
      {!isDetailPage && (
        <BottomNavigation currentSlug={currentSlug} isOwner={isOwner} />
      )}
    </div>
  );
}
