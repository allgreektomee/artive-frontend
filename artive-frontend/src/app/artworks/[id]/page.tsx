"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ArtworkDetailPage({ params }: { params: any }) {
  const id = (params as { id: string }).id ?? "default";

  const [artwork, setArtwork] = useState(() => getArtworkById(id));
  const [histories, setHistories] = useState(() => getArtworkHistories(id));

  // (선택 사항) 비동기 작업 있다면 useEffect 사용

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Artwork Detail</h1>

      {/* 내비게이션 */}
      <div className="flex gap-2 flex-wrap">
        <Link href="/">
          <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm">
            Home
          </button>
        </Link>
        <Link href="/artworks">
          <button className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-sm">
            All Artworks
          </button>
        </Link>
      </div>

      {/* 대표 이미지 */}
      <div className="relative w-full aspect-video overflow-hidden rounded shadow">
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover"
        />
      </div>

      {/* 타이틀/설명 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{artwork.title}</h2>
        <p className="text-sm text-gray-500">{artwork.subtitle}</p>
        <p className="mt-2 text-gray-700 leading-relaxed">
          {artwork.description}
        </p>
      </div>

      {/* 히스토리 */}
      {histories.length > 0 && (
        <div className="mt-10 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Artwork History
          </h2>
          {histories.map((h) => (
            <div key={h.id} className="space-y-2 border-b pb-6">
              <p className="text-sm text-gray-500">{h.date}</p>

              {h.type === "image" && h.url && (
                <div className="relative w-full aspect-[4/3] rounded overflow-hidden">
                  <Image
                    src={h.url}
                    alt={h.caption ?? "history image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {h.type === "youtube" && h.url && (
                <div className="w-full aspect-video rounded overflow-hidden">
                  <iframe
                    src={h.url}
                    width="100%"
                    height="100%"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`History video ${h.id}`}
                    className="w-full h-full"
                  />
                </div>
              )}

              {h.caption && (
                <p className="text-gray-700 text-base whitespace-pre-line">
                  {h.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// 👇 아래 두 유틸 함수는 바깥에 위치 (동기 로직이므로 문제 없음)
function getArtworkById(id: string) {
  return {
    id,
    title: `Untitled #${id}`,
    subtitle: "Acrylic on canvas 35x23 3호",
    description:
      "This is a sample description of the artwork. It explores abstract color forms and emotional depth using layered acrylics.",
    imageUrl: `https://picsum.photos/seed/${id}/800/600`,
  };
}

function getArtworkHistories(id: string) {
  return [
    {
      id: 1,
      type: "image",
      url: `https://picsum.photos/seed/${id}a/600/400`,
      caption: "Initial sketch layer",
      date: "2024-06-01",
    },
    {
      id: 2,
      type: "youtube",
      url: "https://www.youtube.com/embed/7yQ7PBHCUsc",
      caption: "Interview during painting process",
      date: "2024-06-03",
    },
    {
      id: 3,
      type: "text",
      caption:
        "The piece began intuitively with broad strokes of ultramarine. Layering was spontaneous and emotional, responding to memories of ocean cliffs.",
      date: "2024-06-04",
    },
    {
      id: 4,
      type: "image",
      url: `https://picsum.photos/seed/${id}b/600/400`,
      caption: "Final touch with deep red to enhance contrast",
      date: "2024-06-05",
    },
  ];
}
