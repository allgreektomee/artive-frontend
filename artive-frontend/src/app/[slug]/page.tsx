"use client";

import Image from "next/image";
import { FaInstagram, FaMapMarkerAlt, FaYoutube, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const artworks = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  // thumbnailUrl: `https://source.unsplash.com/300x300/?art,${i}`,
  thumbnailUrl: `https://picsum.photos/300/200`,
}));
// ✅ 1번: 기본 artworks 배열 (더미 데이터)

export default function MainPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  // 현재 URL에서 slug 추출 (예: /jaeyoung -> 'jaeyoung')
  const currentSlug = usePathname()?.split("/")[1];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${backEndUrl}/auth/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!res.ok) throw new Error("로그인 필요");

        const data = await res.json();
        console.log("🔍 유저 정보", data);
        setUser(data);
        setIsOwner(data.slug === currentSlug); // 슬러그 비교
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message);
        }
        setUser(null);
        setIsOwner(false);
      }
    };
    fetchUser();
  }, [currentSlug]);

  const handleProfileClick = () => {
    router.push("/edit-profile");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4  text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">artive.com</h2>
      {/* 작가 소개 */}
      <div className="space-y-2 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold ">JAEYOUNG PARK {user?.name}</h1>
          <div className="flex space-x-3">
            <br></br>

            <a
              href="https://blog.naver.com/example"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="text-gray-700 hover:text-black text-2xl" />
            </a>
            <a
              href="https://instagram.com/example"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="text-gray-700 hover:text-black text-2xl" />
            </a>

            {isOwner && (
              <button onClick={handleProfileClick} title="프로필 편집">
                <FaUser className="text-gray-700 hover:text-black text-2xl" />
              </button>
            )}
          </div>
        </div>

        <p className="text-gray-600">
          Contemporary abstract artist exploring color and form Contemporary
          abstract artist exploring color and form Contemporary abstract artist
          exploring color and form
        </p>
      </div>

      <div className="w-full aspect-video rounded overflow-hidden ">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/7yQ7PBHCUsc?autoplay=1&mute=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>

      {/* 메뉴버튼 */}
      {/* <div className="py-6">
        <div className="flex gap-2 gap-y-2 flex-wrap mb-0">
          <button
            onClick={() => scrollTo("artworks")}
            className="px-2 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Artworks
          </button>
          <button
            onClick={() => scrollTo("about")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            About
          </button>
          <button
            onClick={() => scrollTo("associations")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Associations
          </button>
        </div>
      </div> */}

      {/* 작품 섹션 */}
      <div id="artworks" className="py-8">
        <h2 className="text-2xl font-semibold mb-4">Artworks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {artworks.slice(0, 6).map((art) => (
            // {artworks.map((art) => (
            <Link
              key={art.id}
              href={`/artworks`}
              className="relative aspect-square w-full overflow-hidden rounded block"
            >
              <Image
                src={art.thumbnailUrl}
                alt={`artwork-${art.id}`}
                fill
                className="object-cover"
              />
            </Link>
          ))}
        </div>

        {/* 조건부 렌더링 */}
        {/* {artworks.length > 8 && (
          <div className="mt-4 text-right">
            <Link href="/artworks">
              <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm">
                View All
              </button>
            </Link>
          </div>
        )} */}
      </div>

      {/* About 섹션 */}
      <div id="about" className="space-y-2">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-gray-700">
          Seoyeon Kim is a Korean abstract painter based in Seoul. Her works
          explore vibrant color interactions and intuitive expressions through
          acrylics and mixed media.
        </p>
      </div>

      {/* 협회 소개 */}
      <div id="associations" className="py-8 space-y-4">
        <h2 className="text-2xl font-semibold">Associations</h2>

        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-row items-start gap-4">
            {/* 이미지 */}
            <div className="w-16 h-16 relative rounded-full overflow-hidden border shrink-0">
              <Image
                src="/open-art-society-logo.png"
                alt="Open Art Society Logo"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>

            {/* 텍스트 및 아이콘 */}
            <div className="flex-1 min-w-0">
              {/* 이름 + 아이콘들 */}
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-sm whitespace-nowrap">
                  Open Art Society
                </p>
                <div className="flex space-x-2">
                  <a
                    href="https://blog.naver.com/example"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaMapMarkerAlt className="text-gray-700 hover:text-black text-lg" />
                  </a>
                  <a
                    href="https://instagram.com/example"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-gray-700 hover:text-black text-lg" />
                  </a>
                </div>
              </div>

              {/* 설명 */}
              <p className="text-sm text-gray-600 mt-1">
                An organization dedicated to promoting contemporary art and
                artists.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
