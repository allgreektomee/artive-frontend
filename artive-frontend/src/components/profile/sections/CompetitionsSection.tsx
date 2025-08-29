import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SectionProps } from "../../../utils/types";

interface Award {
  id: number;
  title_ko: string;
  organization_ko: string;
  year: string;
  award_type: string;
  blog_post_url?: string; // 블로그 URL로 변경
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
  const router = useRouter();
  const [awards, setAwards] = useState<Award[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempEditData, setTempEditData] = useState<{ [key: number]: Award }>(
    {}
  );

  const backEndUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";
  const userSlug = data?.slug || "";

  useEffect(() => {
    if (data?.awards && Array.isArray(data.awards)) {
      setAwards(data.awards);
    } else {
      setAwards([]);
    }
  }, [data?.awards]);

  const addAward = () => {
    const newAward: Award = {
      id: Date.now(),
      title_ko: "",
      organization_ko: "",
      year: new Date().getFullYear().toString(),
      award_type: "",
      blog_post_url: "",
      is_featured: false,
    };

    const updatedAwards = [...awards, newAward];
    setAwards(updatedAwards);
    setEditingId(newAward.id);
    setTempEditData({ [newAward.id]: newAward });
  };

  const updateAward = (id: number, field: string, value: any) => {
    if (editingId === id) {
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

  // finishEditing 함수 수정 부분
  const finishEditing = async () => {
    if (editingId && tempEditData[editingId]) {
      try {
        const token = localStorage.getItem("token");
        const awardData = tempEditData[editingId];

        const requestBody = {
          title_ko: awardData.title_ko,
          organization_ko: awardData.organization_ko,
          year: awardData.year,
          award_type: awardData.award_type,
          blog_post_url: awardData.blog_post_url || null,
          is_featured: awardData.is_featured,
        };

        // 새로 추가하는 경우
        if (awardData.id >= Date.now() - 1000000000) {
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
            const newAward = result.award || result;

            const updatedAwards = awards.map((award) =>
              award.id === editingId ? newAward : award
            );
            setAwards(updatedAwards);
            if (onChange) {
              onChange("awards", updatedAwards);
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || "저장 실패");
          }
        } else {
          // 기존 수상 수정
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
            const result = await response.json();
            const updatedAward = result.award || awardData; // 서버 응답 사용, 없으면 로컬 데이터 사용

            const updatedAwards = awards.map((award) =>
              award.id === editingId ? updatedAward : award
            );
            setAwards(updatedAwards);
            if (onChange) {
              onChange("awards", updatedAwards);
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || "수정 실패");
          }
        }

        setEditingId(null);
        setTempEditData({});
      } catch (error) {
        console.error("Save error:", error);
        alert(`저장 중 오류가 발생했습니다: ${error.message}`);
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

  const startEditing = (award: Award) => {
    setEditingId(award.id);
    setTempEditData({
      [award.id]: { ...award },
    });
  };

  const createAwardPost = (award: Award) => {
    // 수상 정보를 쿼리 파라미터로 전달하여 블로그 새글 페이지로 이동
    const queryParams = new URLSearchParams({
      type: "AWARD",
      title: `[수상] ${award.title_ko}`,
      award_id: award.id.toString(),
      award_name: award.title_ko,
      award_org: award.organization_ko,
      award_year: award.year,
      award_type: award.award_type,
    });

    router.push(`/${userSlug}/blog/new?${queryParams.toString()}`);
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
            기본 정보만 입력하고, 상세 내용은 블로그로 작성하세요
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
          <span>추가</span>
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
                        placeholder="예: 대상, 최우수상, 우수상, 입상, 선정"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        블로그 URL (선택)
                      </label>
                      <input
                        type="url"
                        value={
                          (getCurrentValue(
                            award.id,
                            "blog_post_url"
                          ) as string) || ""
                        }
                        onChange={(e) =>
                          updateAward(award.id, "blog_post_url", e.target.value)
                        }
                        placeholder="https://blog.example.com/award-review"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        수상 소감이나 상세 내용을 작성한 블로그 링크
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => deleteAward(award.id)}
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
                        {award.title_ko || "제목 없음"}
                      </h4>
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

                      {/* 블로그 연동 부분 */}
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {award.blog_post_url ? (
                          <a
                            href={award.blog_post_url}
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
                            <span>수상 상세보기</span>
                          </a>
                        ) : (
                          <button
                            onClick={() => createAwardPost(award)}
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
              <li>• 기본 정보만 간단히 입력하세요</li>
              <li>• 수상 소감이나 상세 내용은 블로그로 작성할 수 있습니다</li>
              <li>• 상세 리뷰(블로그) 작성 후 공유 링크를 추가하세요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionsSection;
