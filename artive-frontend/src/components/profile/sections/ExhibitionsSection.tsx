import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionProps } from "../../../utils/types";

interface Exhibition {
  id: number;
  title_ko: string;
  venue_ko: string;
  start_date: string;
  end_date: string;
  exhibition_type: "solo" | "group" | "fair";
  blog_post_id?: string;
  blog_post_url?: string;
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
  const router = useRouter();
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempEditData, setTempEditData] = useState<{
    [key: number]: Exhibition;
  }>({});

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const userSlug = data?.slug || "";

  useEffect(() => {
    if (data?.exhibitions && Array.isArray(data.exhibitions)) {
      setExhibitions(data.exhibitions);
    } else {
      setExhibitions([]);
    }
  }, [data?.exhibitions]);

  const addExhibition = () => {
    const today = new Date().toISOString().split("T")[0];
    const newExhibition: Exhibition = {
      id: Date.now(),
      title_ko: "",
      venue_ko: "",
      start_date: today,
      end_date: today,
      exhibition_type: "group",
      is_featured: false,
    };

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
      const currentData =
        tempEditData[id] ||
        exhibitions.find((e) => e.id === id) ||
        ({} as Exhibition);
      setTempEditData((prev) => ({
        ...prev,
        [id]: {
          ...currentData,
          [field]: value,
        },
      }));
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

        if (id < Date.now() - 1000000000) {
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

        // 날짜 검증
        if (
          new Date(exhibitionData.start_date) >
          new Date(exhibitionData.end_date)
        ) {
          alert("시작일이 종료일보다 늦을 수 없습니다.");
          return;
        }

        const requestBody = {
          title_ko: exhibitionData.title_ko || "",
          venue_ko: exhibitionData.venue_ko || "",
          start_date: exhibitionData.start_date,
          end_date: exhibitionData.end_date,
          exhibition_type: exhibitionData.exhibition_type || "group",
          blog_post_url: exhibitionData.blog_post_url || null,
          blog_post_id: exhibitionData.blog_post_id || null,
          is_featured: exhibitionData.is_featured || false,
        };

        // 새로 추가하는 경우
        if (exhibitionData.id >= Date.now() - 1000000000) {
          const response = await fetch(
            `${backEndUrl}/api/profile/exhibitions`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(requestBody),
            }
          );

          if (response.ok) {
            const result = await response.json();
            const newExhibition = result.exhibition || result;

            const updatedExhibitions = exhibitions.map((exhibition) =>
              exhibition.id === editingId ? newExhibition : exhibition
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
              body: JSON.stringify(requestBody),
            }
          );

          if (response.ok) {
            const updatedExhibitions = exhibitions.map((exhibition) =>
              exhibition.id === editingId ? exhibitionData : exhibition
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

  const createExhibitionPost = (exhibition: Exhibition) => {
    const queryParams = new URLSearchParams({
      type: "EXHIBITION",
      title: `[전시] ${exhibition.title_ko}`,
      exhibition_id: exhibition.id.toString(),
      exhibition_name: exhibition.title_ko,
      exhibition_venue: exhibition.venue_ko,
      exhibition_start: exhibition.start_date,
      exhibition_end: exhibition.end_date,
    });

    router.push(`/blog/${userSlug}/new?${queryParams.toString()}`);
  };

  const getCurrentValue = (exhibitionId: number, field: keyof Exhibition) => {
    if (editingId === exhibitionId && tempEditData[exhibitionId]) {
      return tempEditData[exhibitionId][field];
    }
    const exhibition = exhibitions.find((e) => e.id === exhibitionId);
    return exhibition ? exhibition[field] : "";
  };

  const startEditing = (exhibition: Exhibition) => {
    setEditingId(exhibition.id);
    setTempEditData({
      [exhibition.id]: { ...exhibition },
    });
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const getExhibitionTypeLabel = (type: string) => {
    const labels = {
      solo: "개인전",
      group: "그룹전",
      fair: "아트페어",
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
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
            기본 정보만 입력하고, 상세 내용은 블로그로 작성하세요
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
          <span>추가</span>
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
                        시작일
                      </label>
                      <input
                        type="date"
                        value={
                          getCurrentValue(exhibition.id, "start_date") as string
                        }
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "start_date",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        종료일
                      </label>
                      <input
                        type="date"
                        value={
                          getCurrentValue(exhibition.id, "end_date") as string
                        }
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "end_date",
                            e.target.value
                          )
                        }
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        블로그 URL (선택)
                      </label>
                      <input
                        type="url"
                        value={
                          (getCurrentValue(
                            exhibition.id,
                            "blog_post_url"
                          ) as string) || ""
                        }
                        onChange={(e) =>
                          updateExhibition(
                            exhibition.id,
                            "blog_post_url",
                            e.target.value
                          )
                        }
                        placeholder="https://blog.example.com/exhibition-review"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        외부 블로그나 리뷰 페이지 링크
                      </p>
                    </div>
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
                      onClick={() => {
                        setEditingId(null);
                        setTempEditData({});
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      취소
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
                        {getExhibitionTypeLabel(exhibition.exhibition_type)}
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
                        <span>
                          {formatDate(exhibition.start_date)} ~{" "}
                          {formatDate(exhibition.end_date)}
                        </span>
                      </p>

                      {/* 블로그 연동 부분 */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {exhibition.blog_post_url ? (
                          <a
                            href={exhibition.blog_post_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                            <span>전시 상세보기</span>
                          </a>
                        ) : exhibition.blog_post_id ? (
                          <a
                            href={`/blog/${userSlug}/${exhibition.blog_post_id}`}
                            className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                              />
                            </svg>
                            <span>전시 상세보기</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => createExhibitionPost(exhibition)}
                            className="inline-flex items-center space-x-1 text-gray-500 hover:text-blue-600 text-sm"
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
                            <span>상세 리뷰 작성</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => startEditing(exhibition)}
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
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">💡 전시회 관리 팁</p>
            <ul className="space-y-1 text-blue-700">
              <li>• 기본 정보만 간단히 입력하세요</li>
              <li>• 상세한 전시 리뷰는 블로그로 작성할 수 있습니다</li>
              <li>
                • 주요 전시는 "주요 전시" 옵션을 체크하여 강조할 수 있습니다
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExhibitionsSection;
