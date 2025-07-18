"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

// ✅ 더미 데이터 (title, subtitle 포함)
const allArtworks = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  thumbnailUrl: `https://picsum.photos/seed/${i}/400/500`,
  title: `Untitled #${i + 1}`,
  subtitle: "Acrylic on canvas",
}));

const PAGE_SIZE = 8;

export default function AllArtworksPage() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleArtworks = allArtworks.slice(0, visibleCount);

  const loadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Artworks</h1>
      {/* 작가 소개 */}
      <div className="space-y-4 py-3">
        <div className="w-full flex justify-start space-x-2">
          <p className="text-xl">JAEYOUNG PARK</p>

          <a
            href="https://instagram.com/example"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="text-gray-700 hover:text-black text-2xl " />
          </a>
          <a
            href="https://blog.naver.com/example"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="text-gray-700 hover:text-black text-2xl" />
          </a>
        </div>

        <p className="text-gray-600">
          Contemporary abstract artist exploring color and form Contemporary
          abstract artist exploring color and form Contemporary abstract artist
          exploring color and form
        </p>
      </div>

      {/* artworks 소개 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 py-4">
        {visibleArtworks.map((art) => (
          <Link
            key={art.id}
            href={`/artworks/${art.id}`}
            className="block group"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded">
              <Image
                src={art.thumbnailUrl}
                alt={art.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="mt-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {art.title}
              </p>
              <p className="text-xs text-gray-500">{art.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {visibleCount < allArtworks.length && (
        <div className="mt-6 text-center">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
