import React, { useState, useEffect } from "react";
import { SectionProps } from "../../../utils/types";

interface Exhibition {
  id: number;
  title_ko: string;
  venue_ko: string;
  year: string;
  exhibition_type: "solo" | "group" | "fair";
  description_ko: string;
  image_url?: string;
  video_url?: string;
  is_featured: boolean;
}

const ExhibitionsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
  onSave,
  saving,
  hasChanges,
}) => {
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempEditData, setTempEditData] = useState<{
    [key: number]: Exhibition;
  }>({});
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    // data.exhibitions에서 데이터를 가져옴
    if (data?.exhibitions && Array.isArray(data.exhibitions)) {
      setExhibitions(data.exhibitions);
    } else {
      setExhibitions([]);
    }
  }, [data?.exhibitions]); // data.exhibitions 변경 감지

  const handleImageUpload = async (exhibitionId: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploadingImage(exhibitionId);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");
      const response = await fetch(`${backEndUrl}/api/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        updateExhibition(exhibitionId, "image_url", data.url);
      } else {
        alert("이미지 업로드에 실패했습니다.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setUploadingImage(null);
    }
  };

  const extractYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    return match ? match[1] : null;
  };

  const addExhibition = async () => {
    const newExhibition: Exhibition = {
      id: Date.now(), // 임시 ID
      title_ko: "",
      venue_ko: "",
      year: new Date().getFullYear().toString(),
      exhibition_type: "group",
      description_ko: "",
      image_url: "",
      video_url: "",
      is_featured: false,
    };

    // UI에 즉시 반영
    const updatedExhibitions = [...exhibitions, newExhibition];
    setExhibitions(updatedExhibitions);
    setEditingId(newExhibition.id);
    setTempEditData({ [newExhibition.id]: newExhibition });
  };

  const updateExhibition = (
    id: number,
    field: keyof Exhibition,
    value: any
  ) => {
    if (editingId === id) {
      setTempEditData({
        ...tempEditData,
        [id]: {
          ...(tempEditData[id] || exhibitions.find((e) => e.id === id)),
          [field]: value,
        },
      });
    } else {
      const updatedExhibitions = exhibitions.map((exhibition) =>
        exhibition.id === id ? { ...exhibition, [field]: value } : exhibition
      );
      setExhibitions(updatedExhibitions);
      if (onChange) {
        onChange("exhibitions", updatedExhibitions);
      }
    }
  };

  const deleteExhibition = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token");

        // 백엔드에 저장된 전시회인 경우
        if (id < Date.now() - 1000000000) {
          // 실제 ID인 경우
          const response = await fetch(
            `${backEndUrl}/api/profile/exhibitions/${id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error("삭제 실패");
          }
        }

        // UI에서 제거
        const updatedExhibitions = exhibitions.filter(
          (exhibition) => exhibition.id !== id
        );
        setExhibitions(updatedExhibitions);
        if (onChange) {
          onChange("exhibitions", updatedExhibitions);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const finishEditing = async () => {
    if (editingId && tempEditData[editingId]) {
      try {
        const token = localStorage.getItem("token");
        const exhibitionData = tempEditData[editingId];

        // 새로 추가하는 경우 (임시 ID)
        if (exhibitionData.id >= Date.now() - 1000000000) {
          const response = await fetch(
            `${backEndUrl}/api/profile/exhibitions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title_ko: exhibitionData.title_ko,
                venue_ko: exhibitionData.venue_ko,
                year: exhibitionData.year,
                exhibition_type: exhibitionData.exhibition_type,
                description_ko: exhibitionData.description_ko,
                image_url: exhibitionData.image_url || "",
                video_url: exhibitionData.video_url || "",
                is_featured: exhibitionData.is_featured,
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            const newExhibition = result.exhibition;

            // 임시 ID를 실제 ID로 교체
            const updatedExhibitions = exhibitions.map((exhibition) =>
              exhibition.id === editingId ? { ...newExhibition } : exhibition
            );
            setExhibitions(updatedExhibitions);
            if (onChange) {
              onChange("exhibitions", updatedExhibitions);
            }
          } else {
            throw new Error("저장 실패");
          }
        } else {
          // 기존 전시회 수정
          const response = await fetch(
            `${backEndUrl}/api/profile/exhibitions/${exhibitionData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                title_ko: exhibitionData.title_ko,
                venue_ko: exhibitionData.venue_ko,
                year: exhibitionData.year,
                exhibition_type: exhibitionData.exhibition_type,
                description_ko: exhibitionData.description_ko,
                image_url: exhibitionData.image_url || "",
                video_url: exhibitionData.video_url || "",
                is_featured: exhibitionData.is_featured,
              }),
            }
          );

          if (response.ok) {
            const updatedExhibitions = exhibitions.map((exhibition) =>
              exhibition.id === editingId ? tempEditData[editingId] : exhibition
            );
            setExhibitions(updatedExhibitions);
            if (onChange) {
              onChange("exhibitions", updatedExhibitions);
            }
          } else {
            throw new Error("수정 실패");
          }
        }

        setEditingId(null);
        setTempEditData({});
      } catch (error) {
        console.error("Save error:", error);
        alert("저장 중 오류가 발생했습니다.");
      }
    }
  };

  const getCurrentValue = (exhibitionId: number, field: keyof Exhibition) => {
    if (editingId === exhibitionId && tempEditData[exhibitionId]) {
      return tempEditData[exhibitionId][field];
    }
    const exhibition = exhibitions.find((e) => e.id === exhibitionId);
    return exhibition ? exhibition[field] : "";
  };

  return (
    <div className="space-y-6">
      {/* PC에서만 보이는 타이틀과 저장 버튼 - 전시회는 개별 저장이므로 표시하지 않음 */}
      {!isMobile && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">전시회</h2>
          <p className="text-sm text-gray-500 mt-1">
            참여한 전시회 이력을 관리하세요
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">전시회 이력</h3>
          <p className="text-sm text-gray-500">
            개인전, 그룹전, 아트페어 참가 이력을 관리하세요
          </p>
        </div>
        <button
          onClick={addExhibition}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>전시회 추가</span>
        </button>
      </div>

      {exhibitions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">🖼️</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 전시회가 없습니다
          </h3>
          <p className="text-gray-500 mb-4">첫 번째 전시회를 추가해보세요!</p>
          <button
            onClick={addExhibition}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            전시회 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {exhibitions.map((exhibition) => (
            <div
              key={exhibition.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {editingId === exhibition.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전시회명
                      </label>
                      <input
                        type="text"
                        value={
                          getCurrentValue(exhibition.id, "title_ko") as string
                        }
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "title_ko",
                            e.target.value
                          )
                        }
                        placeholder="전시회 이름을 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전시 장소
                      </label>
                      <input
                        type="text"
                        value={
                          getCurrentValue(exhibition.id, "venue_ko") as string
                        }
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "venue_ko",
                            e.target.value
                          )
                        }
                        placeholder="갤러리명, 미술관명 등"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전시 년도
                      </label>
                      <input
                        type="text"
                        value={getCurrentValue(exhibition.id, "year") as string}
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "year",
                            e.target.value
                          )
                        }
                        placeholder="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        전시 유형
                      </label>
                      <select
                        value={
                          getCurrentValue(
                            exhibition.id,
                            "exhibition_type"
                          ) as string
                        }
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "exhibition_type",
                            e.target.value as Exhibition["exhibition_type"]
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="solo">개인전</option>
                        <option value="group">그룹전</option>
                        <option value="fair">아트페어</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전시 설명
                    </label>
                    <textarea
                      value={
                        (getCurrentValue(
                          exhibition.id,
                          "description_ko"
                        ) as string) || ""
                      }
                      onChange={(e) =>
                        updateExhibition(
                          exhibition.id,
                          "description_ko",
                          e.target.value
                        )
                      }
                      placeholder="전시에 대한 간단한 설명을 입력하세요"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전시 포스터/사진
                    </label>
                    {getCurrentValue(exhibition.id, "image_url") ? (
                      <div className="relative group w-full">
                        <img
                          src={
                            getCurrentValue(
                              exhibition.id,
                              "image_url"
                            ) as string
                          }
                          alt="전시 이미지"
                          className="w-full h-auto rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              updateExhibition(exhibition.id, "image_url", "")
                            }
                            className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                          <label
                            htmlFor={`exhibition-image-upload-${exhibition.id}`}
                            className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <svg
                              className="w-4 h-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="block w-full">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 cursor-pointer">
                          {uploadingImage === exhibition.id ? (
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                          ) : (
                            <>
                              <svg
                                className="w-8 h-8 text-gray-400 mx-auto mb-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                              </svg>
                              <p className="text-sm text-gray-600">
                                클릭하여 이미지 업로드
                              </p>
                              <p className="text-xs text-gray-500">
                                JPG, PNG (최대 5MB)
                              </p>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id={`exhibition-image-upload-${exhibition.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(exhibition.id, file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      전시 영상 (YouTube)
                    </label>
                    <input
                      type="url"
                      value={
                        (getCurrentValue(
                          exhibition.id,
                          "video_url"
                        ) as string) || ""
                      }
                      onChange={(e) =>
                        updateExhibition(
                          exhibition.id,
                          "video_url",
                          e.target.value
                        )
                      }
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {getCurrentValue(exhibition.id, "video_url") &&
                      extractYoutubeId(
                        getCurrentValue(exhibition.id, "video_url") as string
                      ) && (
                        <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYoutubeId(
                              getCurrentValue(
                                exhibition.id,
                                "video_url"
                              ) as string
                            )}`}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`featured-${exhibition.id}`}
                      checked={
                        getCurrentValue(exhibition.id, "is_featured") as boolean
                      }
                      onChange={(e) =>
                        updateExhibition(
                          exhibition.id,
                          "is_featured",
                          e.target.checked
                        )
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`featured-${exhibition.id}`}
                      className="text-sm text-gray-700"
                    >
                      주요 전시로 표시
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => deleteExhibition(exhibition.id)}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      삭제
                    </button>
                    <button
                      onClick={finishEditing}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      저장
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {exhibition.title_ko || "제목 없음"}
                      </h4>
                      {exhibition.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          주요 전시
                        </span>
                      )}
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          exhibition.exhibition_type === "solo"
                            ? "bg-purple-100 text-purple-800"
                            : exhibition.exhibition_type === "group"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {exhibition.exhibition_type === "solo"
                          ? "개인전"
                          : exhibition.exhibition_type === "group"
                          ? "그룹전"
                          : "아트페어"}
                      </span>
                    </div>

                    <div className="text-gray-600 space-y-1">
                      {exhibition.venue_ko && (
                        <p className="flex items-center space-x-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span>{exhibition.venue_ko}</span>
                        </p>
                      )}

                      <p className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>{exhibition.year}년</span>
                      </p>

                      {exhibition.description_ko && (
                        <p className="text-gray-700 mt-2">
                          {exhibition.description_ko}
                        </p>
                      )}

                      {/* 이미지 미리보기 - 원본 비율 */}
                      {exhibition.image_url && (
                        <div className="mt-3">
                          <img
                            src={exhibition.image_url}
                            alt="전시 이미지"
                            className="w-full h-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      {exhibition.video_url && (
                        <div className="flex items-center space-x-2 mt-2">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M23 7l-7 5 7 5V7z" />
                            <rect x="1" y="5" width="15" height="14" rx="2" />
                          </svg>
                          <span className="text-sm text-gray-600">
                            영상 포함
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setEditingId(exhibition.id);
                      setTempEditData({ [exhibition.id]: exhibition });
                    }}
                    className="ml-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="w-5 h-5 text-blue-600 mr-2 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 전시회 관리 팁</p>
            <ul className="space-y-1 text-blue-700">
              <li>• 최신 전시회부터 시간순으로 정리하세요</li>
              <li>
                • 주요 전시는 "주요 전시" 옵션을 체크하여 강조할 수 있습니다
              </li>
              <li>
                • 전시 유형을 정확히 선택하면 포트폴리오가 더 전문적으로
                보입니다
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionsSection;
