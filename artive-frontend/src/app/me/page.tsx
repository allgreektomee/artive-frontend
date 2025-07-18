"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function MyPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  //   const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/users/me").then((res) => {
      setName(res.data.name);
      setBio(res.data.bio || "");
      //   setPreviewUrl(res.data.thumbnailUrl || null);
    });
  }, []);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("bio", bio);
    if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

    await axios.put("/api/users/me", formData);
    alert("저장 완료!");
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">내 정보 수정</h1>

      {/* {previewUrl && (
        <img
          src={previewUrl}
          alt="thumbnail"
          className="w-32 h-32 rounded-full"
        />
      )} */}
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setThumbnailFile(e.target.files[0]);
            setPreviewUrl(URL.createObjectURL(e.target.files[0]));
          }
        }}
      />

      <input
        type="text"
        placeholder="이름"
        className="border p-2 w-full"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <textarea
        placeholder="소개글"
        className="border p-2 w-full"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-4 py-2 rounded"
      >
        저장
      </button>
    </div>
  );
}
