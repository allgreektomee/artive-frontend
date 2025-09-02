// app/[slug]/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import AddArtworkButton from "@/components/gallery/AddArtworkButton";
import ArtworkGrid from "@/components/gallery/ArtworkGrid";
import { Artwork } from "@/components/gallery/types";
import { authUtils } from "@/utils/auth";

export default function GalleryPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const params = useParams();
  const currentSlug = params?.slug as string;

  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArtworks, setTotalArtworks] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const [mobileGridMode, setMobileGridMode] = useState<"single" | "double">(
    "double"
  );

  // 초기 데이터 로드
  useEffect(() => {
    if (currentSlug) {
      checkOwnership();
      fetchArtworks();
    }
  }, [currentSlug]);

  // 모바일 그리드 모드 변경 리스너
  useEffect(() => {
    const handleGridModeChange = (e: CustomEvent) => {
      setMobileGridMode(e.detail);
    };

    window.addEventListener(
      "mobileGridModeChange",
      handleGridModeChange as EventListener
    );
    return () => {
      window.removeEventListener(
        "mobileGridModeChange",
        handleGridModeChange as EventListener
      );
    };
  }, []);

  const checkOwnership = async () => {
    try {
      const token = authUtils.getToken();
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
        setIsOwner(userData.slug === currentSlug);
      }
    } catch (err) {
      console.error("사용자 정보 조회 실패:", err);
    }
  };

  const fetchArtworks = async (isLoadMore = false) => {
    if (!currentSlug) return;

    try {
      if (!isLoadMore) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const token = authUtils.getToken();
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const pageToFetch = isLoadMore ? currentPage + 1 : 1;
      const artworksRes = await fetch(
        `${backEndUrl}/api/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=${pageToFetch}&size=${ITEMS_PER_PAGE}`,
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
      const newArtworks = artworksData.artworks || artworksData.items || [];

      if (isLoadMore) {
        setArtworks((prev) => [...prev, ...newArtworks]);
        setCurrentPage(pageToFetch);
      } else {
        setArtworks(newArtworks);
        setCurrentPage(1);
      }

      setTotalPages(
        artworksData.pages ||
          Math.ceil((artworksData.total || 0) / ITEMS_PER_PAGE)
      );
      setTotalArtworks(artworksData.total || 0);
      setHasMore(
        artworksData.has_next || artworksData.page < artworksData.pages
      );

      // 레이아웃에 작품 정보 업데이트 알림
      const totalViews = newArtworks.reduce(
        (sum: number, art: Artwork) => sum + (art.view_count || 0),
        0
      );

      const event = new CustomEvent("galleryArtworksUpdate", {
        detail: {
          total: artworksData.total || 0,
          totalViews: totalViews,
        },
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error("갤러리 데이터 조회 실패:", err);
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMoreArtworks = async () => {
    if (!hasMore || loadingMore) return;
    await fetchArtworks(true);
  };

  const handleAddArtwork = () => {
    router.push("/artworks/new");
  };

  // 초기 로딩
  if (loading && artworks.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <>
      {/* 작품 추가 버튼 */}
      {isOwner && (
        <AddArtworkButton
          isOwner={isOwner}
          onClick={handleAddArtwork}
          isMobileGridMode={mobileGridMode}
          onMobileGridChange={setMobileGridMode}
        />
      )}

      {/* 작품 그리드 */}
      <ArtworkGrid
        artworks={artworks}
        isOwner={isOwner}
        hasMore={hasMore}
        loadingMore={loadingMore}
        totalArtworks={totalArtworks}
        onAddArtwork={handleAddArtwork}
        onLoadMore={loadMoreArtworks}
        mobileGridMode={mobileGridMode}
      />
    </>
  );
}
