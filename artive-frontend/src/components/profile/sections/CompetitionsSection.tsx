import React, { useState, useEffect } from "react";
import { SectionProps } from "../../../utils/types";

interface Award {
  id: number;
  title_ko: string;
  organization_ko: string;
  year: string;
  award_type: string;
  description_ko: string;
  image_url?: string;
  video_url?: string;
  is_featured: boolean;
}

const CompetitionsSection: React.FC<SectionProps> = ({
  data,
  onChange,
  isMobile,
  onSave,
  saving,
  hasChanges,
}) => {
  const [awards, setAwards] = useState<Award[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempEditData, setTempEditData] = useState<{ [key: number]: Award }>(
    {}
  );
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  useEffect(() => {
    if (data?.awards && Array.isArray(data.awards)) {
      console.log("로드된 수상 데이터:", data.awards);
      setAwards(data.awards);
    } else {
      setAwards([]);
    }
  }, [data?.awards]);

  const handleImageUpload = async (awardId: number, file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploadingImage(awardId);

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
        console.log("업로드된 이미지 URL:", data.url);

        // 편집 중인 경우 tempEditData 직접 업데이트
        if (editingId === awardId) {
          setTempEditData((prev) => ({
            ...prev,
            [awardId]: {
              ...(prev[awardId] || awards.find((a) => a.id === awardId)),
              image_url: data.url,
            },
          }));
        } else {
          updateAward(awardId, "image_url", data.url);
        }
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

  const addAward = async () => {
    const newAward: Award = {
      id: Date.now(),
      title_ko: "",
      organization_ko: "",
      year: new Date().getFullYear().toString(),
      award_type: "",
      description_ko: "",
      image_url: "",
      video_url: "",
      is_featured: false,
    };

    const updatedAwards = [...awards, newAward];
    setAwards(updatedAwards);
    setEditingId(newAward.id);
    setTempEditData({ [newAward.id]: newAward });
  };

  const updateAward = (id: number, field: string, value: any) => {
    if (editingId === id) {
      // tempEditData 업데이트 개선
      const currentData =
        tempEditData[id] || awards.find((a) => a.id === id) || ({} as Award);
      setTempEditData((prev) => ({
        ...prev,
        [id]: {
          ...currentData,
          [field]: value,
        },
      }));
    } else {
      const updatedAwards = awards.map((award) =>
        award.id === id ? { ...award, [field]: value } : award
      );
      setAwards(updatedAwards);
      if (onChange) {
        onChange("awards", updatedAwards);
      }
    }
  };

  const deleteAward = async (id: number) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem("token");

        if (id < Date.now() - 1000000000) {
          const response = await fetch(
            `${backEndUrl}/api/profile/awards/${id}`,
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

        const updatedAwards = awards.filter((award) => award.id !== id);
        setAwards(updatedAwards);
        if (onChange) {
          onChange("awards", updatedAwards);
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
        const awardData = tempEditData[editingId];

        console.log("저장할 수상 데이터:", awardData);

        // 새로 추가하는 경우
        if (awardData.id >= Date.now() - 1000000000) {
          const requestBody = {
            title_ko: awardData.title_ko,
            organization_ko: awardData.organization_ko,
            year: awardData.year,
            award_type: awardData.award_type,
            description_ko: awardData.description_ko,
            image_url: awardData.image_url || null, // null 처리
            video_url: awardData.video_url || null, // null 처리
            is_featured: awardData.is_featured,
          };

          console.log("POST 요청 body:", requestBody);

          const response = await fetch(`${backEndUrl}/api/profile/awards`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(requestBody),
          });

          if (response.ok) {
            const result = await response.json();
            console.log("서버 응답:", result);
            const newAward = result.award || result;

            // URL 유지하면서 ID 교체
            const updatedAwards = awards.map((award) =>
              award.id === editingId
                ? {
                    ...newAward,
                    image_url: awardData.image_url || newAward.image_url,
                    video_url: awardData.video_url || newAward.video_url,
                  }
                : award
            );
            setAwards(updatedAwards);
            if (onChange) {
              onChange("awards", updatedAwards);
            }
          } else {
            throw new Error("저장 실패");
          }
        } else {
          // 기존 수상 수정
          const requestBody = {
            title_ko: awardData.title_ko,
            organization_ko: awardData.organization_ko,
            year: awardData.year,
            award_type: awardData.award_type,
            description_ko: awardData.description_ko,
            image_url: awardData.image_url || null,
            video_url: awardData.video_url || null,
            is_featured: awardData.is_featured,
          };

          console.log("PUT 요청 body:", requestBody);

          const response = await fetch(
            `${backEndUrl}/api/profile/awards/${awardData.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (response.ok) {
            const updatedAwards = awards.map((award) =>
              award.id === editingId ? tempEditData[editingId] : award
            );
            setAwards(updatedAwards);
            if (onChange) {
              onChange("awards", updatedAwards);
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

  const getCurrentValue = (awardId: number, field: keyof Award) => {
    if (editingId === awardId && tempEditData[awardId]) {
      return tempEditData[awardId][field];
    }
    const award = awards.find((a) => a.id === awardId);
    return award ? award[field] : "";
  };

  // 편집 시작 시 데이터 복사 개선
  const startEditing = (award: Award) => {
    setEditingId(award.id);
    setTempEditData({
      [award.id]: { ...award },
    });
  };

  // 유형별 배지 색상 결정 함수
  const getTypeBadgeColor = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("대상") || lowerType.includes("최우수")) {
      return "bg-amber-100 text-amber-800";
    } else if (lowerType.includes("우수") || lowerType.includes("금상")) {
      return "bg-blue-100 text-blue-800";
    } else if (lowerType.includes("입상") || lowerType.includes("은상")) {
      return "bg-purple-100 text-purple-800";
    } else if (lowerType.includes("동상") || lowerType.includes("장려")) {
      return "bg-green-100 text-green-800";
    } else if (lowerType.includes("선정") || lowerType.includes("지원")) {
      return "bg-indigo-100 text-indigo-800";
    } else if (lowerType.includes("레지던시")) {
      return "bg-pink-100 text-pink-800";
    } else {
      return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {!isMobile && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">수상/선정</h2>
          <p className="text-sm text-gray-500 mt-1">
            수상 및 선정 이력을 관리하세요
          </p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">수상 및 선정 이력</h3>
          <p className="text-sm text-gray-500">
            수상, 공모전, 레지던시, 지원사업 선정 등을 관리하세요
          </p>
        </div>
        <button
          onClick={addAward}
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
          <span>수상 추가</span>
        </button>
      </div>

      {awards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <span className="text-4xl">🏆</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            아직 수상 이력이 없습니다
          </h3>
          <p className="text-gray-500 mb-4">
            첫 번째 수상 이력을 추가해보세요!
          </p>
          <button
            onClick={addAward}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            수상 이력 추가하기
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {awards.map((award) => (
            <div
              key={award.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              {editingId === award.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        수상명/선정명
                      </label>
                      <input
                        type="text"
                        value={getCurrentValue(award.id, "title_ko") as string}
                        onChange={(e) =>
                          updateAward(award.id, "title_ko", e.target.value)
                        }
                        placeholder="예: 서울문화재단 예술지원사업"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        주관 기관
                      </label>
                      <input
                        type="text"
                        value={
                          getCurrentValue(award.id, "organization_ko") as string
                        }
                        onChange={(e) =>
                          updateAward(
                            award.id,
                            "organization_ko",
                            e.target.value
                          )
                        }
                        placeholder="예: 서울문화재단"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        수상 년도
                      </label>
                      <input
                        type="text"
                        value={getCurrentValue(award.id, "year") as string}
                        onChange={(e) =>
                          updateAward(award.id, "year", e.target.value)
                        }
                        placeholder="2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        유형/수상 등급
                      </label>
                      <input
                        type="text"
                        value={
                          getCurrentValue(award.id, "award_type") as string
                        }
                        onChange={(e) =>
                          updateAward(award.id, "award_type", e.target.value)
                        }
                        placeholder="예: 대상, 최우수상, 우수상, 입상, 선정, 레지던시"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        💡 수상 등급을 자유롭게 입력하세요 (대상, 금상, 은상,
                        동상, 우수상, 장려상, 입상 등)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      설명
                    </label>
                    <textarea
                      value={
                        (getCurrentValue(
                          award.id,
                          "description_ko"
                        ) as string) || ""
                      }
                      onChange={(e) =>
                        updateAward(award.id, "description_ko", e.target.value)
                      }
                      placeholder="수상 내용이나 선정 이유 등을 간단히 설명하세요"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      공모전 포스터 및 증서
                    </label>
                    {getCurrentValue(award.id, "image_url") ? (
                      <div className="relative group w-full">
                        <img
                          src={getCurrentValue(award.id, "image_url") as string}
                          alt="수상 이미지"
                          className="w-full h-auto rounded-lg border border-gray-200"
                        />
                        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              updateAward(award.id, "image_url", "")
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
                            htmlFor={`award-image-upload-${award.id}`}
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
                          {uploadingImage === award.id ? (
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
                          id={`award-image-upload-${award.id}`}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(award.id, file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      관련 영상 (YouTube)
                    </label>
                    <input
                      type="url"
                      value={
                        (getCurrentValue(award.id, "video_url") as string) || ""
                      }
                      onChange={(e) =>
                        updateAward(award.id, "video_url", e.target.value)
                      }
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {getCurrentValue(award.id, "video_url") &&
                      extractYoutubeId(
                        getCurrentValue(award.id, "video_url") as string
                      ) && (
                        <div className="mt-2 aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          <iframe
                            src={`https://www.youtube.com/embed/${extractYoutubeId(
                              getCurrentValue(award.id, "video_url") as string
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
                      id={`featured-${award.id}`}
                      checked={
                        getCurrentValue(award.id, "is_featured") as boolean
                      }
                      onChange={(e) =>
                        updateAward(award.id, "is_featured", e.target.checked)
                      }
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`featured-${award.id}`}
                      className="text-sm text-gray-700"
                    >
                      주요 수상으로 표시
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => deleteAward(award.id)}
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
                        {award.title_ko || "제목 없음"}
                      </h4>
                      {award.is_featured && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          주요 수상
                        </span>
                      )}
                      {award.award_type && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeBadgeColor(
                            award.award_type
                          )}`}
                        >
                          {award.award_type}
                        </span>
                      )}
                    </div>

                    <div className="text-gray-600 space-y-1">
                      {award.organization_ko && (
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
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                          <span>{award.organization_ko}</span>
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
                        <span>{award.year}년</span>
                      </p>

                      {award.description_ko && (
                        <p className="text-gray-700 mt-2">
                          {award.description_ko}
                        </p>
                      )}

                      {award.image_url && (
                        <div className="mt-3">
                          <img
                            src={award.image_url}
                            alt="수상 이미지"
                            className="w-full h-auto rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      {award.video_url && (
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
                    onClick={() => startEditing(award)}
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

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex">
          <svg
            className="w-5 h-5 text-amber-600 mr-2 mt-0.5"
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
          <div className="text-sm text-amber-800">
            <p className="font-medium mb-1">💡 수상 관리 팁</p>
            <ul className="space-y-1 text-amber-700">
              <li>• 최신 수상부터 시간순으로 정리하세요</li>
              <li>
                • 수상 등급을 구체적으로 명시하세요 (대상, 우수상, 입상 등)
              </li>
              <li>• 중요한 수상은 "주요 수상" 옵션을 체크하여 강조하세요</li>
              <li>• 레지던시나 지원사업도 이력에 포함시킬 수 있습니다</li>
              <li>• 수상 내용을 구체적으로 작성하면 신뢰도가 높아집니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionsSection;
