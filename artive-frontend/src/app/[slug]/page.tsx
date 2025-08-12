"use client";

import Image from "next/image";
import {
  FaInstagram,
  FaYoutube,
  FaUser,
  FaPlus,
  FaEye,
  FaHeart,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// TypeScript 타입 정의
type User = {
  id: number;
  name: string;
  slug: string;
  bio?: string;
  thumbnail_url?: string;
  gallery_title?: string;
  gallery_description?: string;
  total_artworks: number;
  total_views: number;
  instagram_username?: string;
  youtube_channel_id?: string;
  is_public_gallery: boolean;
};

type Artwork = {
  id: number;
  title: string;
  thumbnail_url?: string;
  work_in_progress_url?: string;
  status: "work_in_progress" | "completed" | "archived";
  medium?: string;
  size?: string;
  year?: string;
  view_count: number;
  like_count: number;
  history_count: number;
  created_at: string;
};

export default function GalleryPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const pathname = usePathname();

  const [galleryUser, setGalleryUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false); // 클라이언트 마운트 체크

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 12; // 한 페이지당 12개

  const currentSlug = pathname?.split("/")[1]; // e.g., '/testuser'

  // 클라이언트 마운트 체크
  useEffect(() => {
    setMounted(true);
  }, []);

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const res = await fetch(`${backEndUrl}/auth/me`, {
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
          console.log("Current user:", userData); // 디버깅용
        }
      } catch (err) {
        console.error("현재 사용자 정보 조회 실패:", err);
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
        // 현재 로그인한 사용자의 토큰 가져오기
        const token = localStorage.getItem("access_token");
        const headers: HeadersInit = { Accept: "application/json" };

        // 토큰이 있으면 Authorization 헤더 추가
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("🔍 갤러리 요청:", {
          url: `${backEndUrl}/artworks/user/${currentSlug}`,
          token: token ? "있음" : "없음",
          currentSlug,
        });

        // 갤러리 소유자의 작품 목록 가져오기 (첫 페이지)
        const artworksRes = await fetch(
          `${backEndUrl}/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=1&size=${ITEMS_PER_PAGE}`,
          {
            method: "GET",
            headers,
          }
        );

        console.log("🔍 갤러리 응답:", artworksRes.status);

        if (!artworksRes.ok) {
          console.error(
            "🔍 갤러리 에러:",
            artworksRes.status,
            await artworksRes.text()
          );
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
        setArtworks(artworksData.artworks || []);
        setCurrentPage(artworksData.page || 1);
        setTotalPages(artworksData.pages || 1);
        setHasMore(artworksData.has_next || false);

        // 첫 번째 작품이 있다면 해당 작품의 사용자 정보를 통해 갤러리 소유자 정보 추정
        // 실제로는 별도의 사용자 정보 API가 필요하지만, 임시로 더미 데이터 사용
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
              (sum: number, art: Artwork) => sum + art.view_count,
              0
            ),
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

  // Load More 함수
  const loadMoreArtworks = async () => {
    if (!hasMore || loadingMore || !currentSlug) return;

    setLoadingMore(true);

    try {
      const token = localStorage.getItem("access_token");
      const headers: HeadersInit = { Accept: "application/json" };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const nextPage = currentPage + 1;
      const artworksRes = await fetch(
        `${backEndUrl}/artworks/user/${currentSlug}?sort_by=created_at&sort_order=desc&page=${nextPage}&size=${ITEMS_PER_PAGE}`,
        {
          method: "GET",
          headers,
        }
      );

      if (artworksRes.ok) {
        const artworksData = await artworksRes.json();

        // 기존 작품에 새 작품들 추가
        setArtworks((prev) => [...prev, ...(artworksData.artworks || [])]);
        setCurrentPage(artworksData.page || nextPage);
        setHasMore(artworksData.has_next || false);
      }
    } catch (err) {
      console.error("추가 작품 로딩 실패:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleProfileClick = () => {
    router.push("/edit-profile");
  };

  const handleAddArtwork = () => {
    router.push("/artworks/new");
  };

  const getDisplayImage = (artwork: Artwork) => {
    // 작업 중이면 work_in_progress_url, 완성되면 thumbnail_url
    if (artwork.status === "work_in_progress" && artwork.work_in_progress_url) {
      return artwork.work_in_progress_url;
    }
    return (
      artwork.thumbnail_url ||
      "https://via.placeholder.com/300x200?text=No+Image"
    );
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "work_in_progress":
        return (
          <span className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
            WIP
          </span>
        );
      case "completed":
        return (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
            Done
          </span>
        );
      case "archived":
        return (
          <span className="absolute top-2 left-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
            Archived
          </span>
        );
      default:
        return null;
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <Link
          href="/"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-gray-900">
      {/* 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <Link
          href="/"
          className="text-2xl font-semibold text-gray-800 hover:text-black"
        >
          artive.com
        </Link>
        <div className="flex items-center space-x-4">
          {isOwner && (
            <button
              onClick={handleAddArtwork}
              className="flex items-center space-x-1 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              <FaPlus className="text-sm" />
              <span>Add Artwork</span>
            </button>
          )}
        </div>
      </div>

      {/* 작가 소개 */}
      <div className="space-y-4 py-6 border-b border-gray-200">
        {/* 제목과 설명 */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            {galleryUser?.gallery_title ||
              galleryUser?.name ||
              currentSlug.toUpperCase()}
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {galleryUser?.gallery_description ||
              galleryUser?.bio ||
              "Contemporary abstract artist exploring color and form."}
          </p>
        </div>

        {/* 통계와 소셜미디어를 한 줄에 */}
        <div className="flex justify-between items-center gap-4">
          {/* 통계 정보 - 왼쪽 배치 */}
          <div className="flex items-center gap-4 sm:gap-6 text-sm text-gray-500">
            <span className="font-medium">
              {galleryUser?.total_artworks || artworks.length} Artworks
            </span>
            <span className="font-medium">
              {galleryUser?.total_views || 0} Total Views
            </span>
          </div>

          {/* 소셜미디어 아이콘들 - 오른쪽 배치 */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <a
              href={
                galleryUser?.youtube_channel_id
                  ? `https://youtube.com/channel/${galleryUser.youtube_channel_id}`
                  : "https://youtube.com/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-red-600 transition-colors"
            >
              <FaYoutube className="text-lg sm:text-xl md:text-2xl" />
            </a>
            <a
              href={
                galleryUser?.instagram_username
                  ? `https://instagram.com/${galleryUser.instagram_username}`
                  : "https://instagram.com/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-pink-600 transition-colors"
            >
              <FaInstagram className="text-lg sm:text-xl md:text-2xl" />
            </a>
            {isOwner && (
              <button
                onClick={handleProfileClick}
                title="Edit Profile"
                className="text-gray-600 hover:text-black transition-colors"
              >
                <FaUser className="text-lg sm:text-xl md:text-2xl" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 작품 목록 */}
      <div id="artworks" className="py-6 sm:py-8">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold">Artworks</h2>
          <div className="text-sm text-gray-500">
            {artworks.length} artworks
          </div>
        </div>

        {artworks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No artworks yet.</p>
            {isOwner && (
              <button
                onClick={handleAddArtwork}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Add Your First Artwork
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 sm:gap-4 md:gap-6 space-y-3 sm:space-y-4 md:space-y-6">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artworks/${artwork.id}`}
                  className="group block relative bg-transparent rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 break-inside-avoid mb-3 sm:mb-4 md:mb-6"
                >
                  <div className="relative w-full overflow-hidden bg-gray-100 rounded-lg">
                    <img
                      src={getDisplayImage(artwork)}
                      alt={artwork.title}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300 block"
                      loading="lazy"
                      onError={(e) => {
                        console.error(
                          "이미지 로딩 실패:",
                          artwork.title,
                          getDisplayImage(artwork)
                        );
                        e.currentTarget.src =
                          "https://via.placeholder.com/400x600/f0f0f0/999999?text=Image+Not+Found";
                      }}
                      onLoad={() =>
                        console.log("이미지 로딩 성공:", artwork.title)
                      }
                    />

                    {/* 상태 배지 */}
                    {getStatusBadge(artwork.status)}

                    {/* 호버 오버레이 */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end rounded-lg">
                      <div className="w-full p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex space-x-3">
                            <span className="flex items-center space-x-1">
                              <FaEye className="text-xs" />
                              <span>{artwork.view_count}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <FaHeart className="text-xs" />
                              <span>{artwork.like_count}</span>
                            </span>
                          </div>
                          <span className="text-xs">{artwork.year}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 작품 정보 */}
                  <div className="p-3 bg-white rounded-b-lg">
                    <h3 className="font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                      {artwork.title}
                    </h3>
                    <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                      <span>{artwork.medium}</span>
                      <span>{artwork.size}</span>
                    </div>
                    {artwork.history_count > 0 && (
                      <div className="mt-2 text-xs text-blue-600">
                        {artwork.history_count} Process
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More 버튼 */}
            {hasMore && (
              <div className="text-center mt-8 sm:mt-12">
                <button
                  onClick={loadMoreArtworks}
                  disabled={loadingMore}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                      <span>Loading...</span>
                    </div>
                  ) : (
                    `Load More (${Math.min(
                      ITEMS_PER_PAGE,
                      (galleryUser?.total_artworks || 0) - artworks.length
                    )} more)`
                  )}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Showing {artworks.length} of{" "}
                  {galleryUser?.total_artworks || 0} artworks
                </p>
              </div>
            )}
          </>
        )}
      </div>
      {/* About Section */}
      <div id="about" className="py-12 sm:py-16 border-t border-gray-200">
        {/* Artist Statement */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-semibold mb-6 sm:mb-8">
            About the Artist
          </h2>
          <div className="prose prose-lg max-w-4xl">
            <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
              {galleryUser?.bio ||
                "I am a contemporary abstract artist based in Seoul, exploring the infinite possibilities of color, form, and emotion. My work delves into the intersection of traditional Korean aesthetics and modern artistic expression."}
            </p>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              Through my paintings, I seek to capture the ephemeral moments of
              beauty that surround us daily, transforming them into visual
              narratives that speak to the universal human experience.
            </p>
          </div>
        </div>

        {/* YouTube Video Section */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
            Studio Process
          </h3>
          <div className="w-full max-w-4xl">
            <div className="relative w-full h-0 pb-[56.25%] rounded-lg overflow-hidden bg-gray-100">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=example"
                title="Artist Studio Process"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-2">
              Watch me create art in my Seoul studio
            </p>
          </div>
        </div>

        {/* Q&A Section */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8">
            Artist Interview
          </h3>
          <div className="space-y-6 sm:space-y-8">
            <div className="border-l-4 border-blue-500 pl-4 sm:pl-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Q: 작가님의 예술적 영감은 무엇에서 오나요?
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                서울의 역동적인 에너지와 조용한 성찰의 순간들이 결합되어 영감을
                얻습니다. 하루 종일 변화하는 빛이 만들어내는 다양한 분위기와
                감정들에 매료되어, 이를 제 작품에 담아내려고 노력하고 있어요.
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 sm:pl-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Q: 작가님의 작업 스타일을 어떻게 설명하시겠어요?
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                주로 아크릴과 혼합 매체를 사용하여 동서양의 예술적 전통을 융합한
                추상 작품을 만들고 있습니다. 대담한 색채 선택과 캔버스를
                가로질러 흐르는 듯한 역동적인 형태가 제 스타일의 특징이라고 할
                수 있어요.
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-4 sm:pl-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Q: 작품을 통해 전달하고자 하는 메시지가 있다면?
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                관람자들이 제 작품과 각자만의 감정적 연결고리를 찾았으면
                좋겠어요. 예술은 작가의 내면 세계와 관찰자의 개인적 경험 사이를
                잇는 다리 역할을 해야 한다고 생각합니다. 각각의 그림은 탐험하고,
                느끼고, 발견하라는 초대장이에요.
              </p>
            </div>

            <div className="border-l-4 border-red-500 pl-4 sm:pl-6">
              <h4 className="font-medium text-gray-900 mb-2">
                Q: 작가님의 작품은 어디서 만날 수 있나요?
              </h4>
              <p className="text-gray-700 text-sm sm:text-base">
                서울 전역의 갤러리에서 정기적으로 전시하고 있으며, 여러 개인
                컬렉션의 일부이기도 합니다. 그룹 전시와 아트페어에도 참여하고
                있어요. 다가오는 전시 소식은 소셜미디어를 통해 확인하실 수
                있습니다.
              </p>
            </div>
          </div>
        </div>

        {/* Exhibitions & Recognition */}
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-6 sm:mb-8">
            Exhibitions & Recognition
          </h3>
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
            <div>
              <h4 className="font-medium mb-4 sm:mb-6">Recent Exhibitions</h4>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li>• "Colors of Seoul" - Gallery Modern, 2024</li>
                <li>• "Abstract Emotions" - Art Space K, 2023</li>
                <li>• Group Exhibition - Seoul Arts Center, 2023</li>
                <li>• "New Visions" - Contemporary Gallery, 2022</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4 sm:mb-6">Awards & Recognition</h4>
              <ul className="space-y-3 text-gray-700 text-sm sm:text-base">
                <li>• Emerging Artist Award - Seoul Art Fair, 2024</li>
                <li>• Featured Artist - Korean Art Magazine, 2023</li>
                <li>• Excellence Award - National Art Competition, 2022</li>
                <li>• Rising Star - Contemporary Art Review, 2021</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
