"use client";

import { useState } from "react";
import Image from "next/image";

interface Artwork {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface HistoryEntry {
  id: number;
  artworkId: number;
  title: string;
  content: string;
  imageUrl?: string;
}

// 💡 가상의 artworks (실제에선 API로 받아와야 함)
const mockArtworks: Artwork[] = [
  {
    id: 1,
    title: "Untitled 1",
    description: "Acrylic on canvas",
    imageUrl: "https://picsum.photos/id/1/400/500",
  },
  {
    id: 2,
    title: "Untitled 2",
    description: "Oil on panel",
    imageUrl: "https://picsum.photos/id/2/400/500",
  },
];

export default function HistoryPage() {
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!selectedArtwork || !title) return alert("모든 필드를 입력하세요");
    const entry: HistoryEntry = {
      id: Date.now(),
      artworkId: selectedArtwork.id,
      title,
      content,
      imageUrl: imageFile ? URL.createObjectURL(imageFile) : undefined,
    };
    console.log("등록된 히스토리:", entry);
    alert("히스토리 등록 완료!");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🕘 히스토리 등록</h1>

      {!selectedArtwork ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {mockArtworks.map((art) => (
            <div
              key={art.id}
              className="cursor-pointer border rounded overflow-hidden"
              onClick={() => setSelectedArtwork(art)}
            >
              <Image
                src={art.imageUrl}
                alt={art.title}
                width={300}
                height={400}
                className="w-full h-auto object-cover"
              />
              <div className="p-2">
                <p className="font-medium text-sm truncate">{art.title}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Image
              src={selectedArtwork.imageUrl}
              alt={selectedArtwork.title}
              width={100}
              height={0}
              className="w-[100px] h-auto object-cover"
            />
            <p className="font-semibold">{selectedArtwork.title}</p>
          </div>

          <input
            type="text"
            placeholder="히스토리 제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-3 py-2 w-full rounded"
          />

          <textarea
            placeholder="히스토리 내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border px-3 py-2 w-full rounded min-h-[150px]"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded"
          >
            히스토리 등록
          </button>
        </div>
      )}
    </div>
  );
}
