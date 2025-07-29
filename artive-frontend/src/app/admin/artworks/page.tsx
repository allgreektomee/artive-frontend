"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Artwork,
  fetchArtworks,
  createArtwork,
  deleteArtwork,
} from "@/lib/artworks";

export default function ArtworkPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchArtworks().then(setArtworks).catch(console.error);
  }, []);

  const handleAddArtwork = async () => {
    if (!title || !imageFile) return alert("제목과 이미지를 입력해주세요");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", imageFile);

    try {
      const newArtwork = await createArtwork(formData);
      setArtworks((prev) => [...prev, newArtwork]);
      setTitle("");
      setDescription("");
      setImageFile(null);
    } catch (err) {
      console.error(err);
      alert("작품 등록 실패");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteArtwork(id);
      setArtworks((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("삭제 실패");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">🎨 아트웍스 관리</h1>

      {/* 작품 등록 폼 */}
      <div className="mb-8 space-y-3">
        <input
          type="text"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <textarea
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border px-3 py-2 w-full rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="block"
        />
        <button
          onClick={handleAddArtwork}
          className="px-4 py-2 bg-black text-white rounded"
        >
          작품 추가
        </button>
      </div>

      {/* 등록된 작품 목록 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded overflow-hidden">
            <div className="w-full">
              <Image
                src={art.imageUrl}
                alt={art.title}
                width={400}
                height={0}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="p-2">
              <p className="text-sm font-medium truncate">{art.title}</p>
              <p className="text-xs text-gray-500 truncate">
                {art.description}
              </p>
              <button
                onClick={() => handleDelete(art.id)}
                className="mt-2 text-xs text-red-500 hover:underline"
              >
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
