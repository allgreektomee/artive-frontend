"use client";

import Image from "next/image";
import { FaInstagram, FaMapMarkerAlt, FaYoutube, FaUser } from "react-icons/fa";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// ✅ 명시적 타입 지정 (에러 방지용)
type Artwork = {
  id: number;
  thumbnailUrl: string;
};

const artworks: Artwork[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  thumbnailUrl: `https://picsum.photos/300/200`,
}));

export default function MainPage() {
  const backEndUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<{ name?: string; slug?: string } | null>(
    null
  );
  const [isOwner, setIsOwner] = useState(false);

  const currentSlug = pathname?.split("/")[1]; // e.g., '/jaeyoung'

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
        setIsOwner(data.slug === currentSlug);
      } catch (err: unknown) {
        if (err instanceof Error) console.error(err.message);
        setUser(null);
        setIsOwner(false);
      }
    };
    fetchUser();
  }, [currentSlug, backEndUrl]);

  const handleProfileClick = () => {
    router.push("/edit-profile");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 text-gray-900">
      <h2 className="text-2xl font-semibold mb-4">artive.com</h2>

      {/* 작가 소개 */}
      <div className="space-y-2 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            JAEYOUNG PARK {user?.name && `(${user.name})`}
          </h1>
          <div className="flex space-x-3">
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
          Contemporary abstract artist exploring color and form. Contemporary
          abstract artist exploring color and form.
        </p>
      </div>

      {/* 유튜브 영상 */}
      <div className="w-full aspect-video rounded overflow-hidden">
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

      {/* Artworks */}
      <div id="artworks" className="py-8">
        <h2 className="text-2xl font-semibold mb-4">Artworks</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {artworks.slice(0, 6).map((art) => (
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
      </div>

      {/* About */}
      <div id="about" className="space-y-2">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-gray-700">
          Seoyeon Kim is a Korean abstract painter based in Seoul. Her works
          explore vibrant color interactions and intuitive expressions through
          acrylics and mixed media.
        </p>
      </div>

      {/* 협회 */}
      <div id="associations" className="py-8 space-y-4">
        <h2 className="text-2xl font-semibold">Associations</h2>

        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex flex-row items-start gap-4">
            <div className="w-16 h-16 relative rounded-full overflow-hidden border shrink-0">
              <Image
                src="/open-art-society-logo.png"
                alt="Open Art Society Logo"
                fill
                className="object-cover"
                loading="lazy"
              />
            </div>
            <div className="flex-1 min-w-0">
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
